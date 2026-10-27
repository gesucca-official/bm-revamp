import type {Account, Card, ResumeState, View, CharacterCard, Presence} from './contracts.ts';
import type {Connector, Link} from './net/link.ts';
import {Model} from './model.ts';

export type Phase = 'login' | 'connecting' | 'hub' | 'queue' | 'game' | 'lost';
export type Mode = 'quick/1vCom' | 'quick/1v1';
export type Trace = {at: number; channel: string; body: string};
export type Timers = {set(fn: () => void, ms: number): number; clear(id: number): void};
const browserTimers: Timers = {set: (fn, ms) => globalThis.setTimeout(fn, ms) as unknown as number, clear: id => globalThis.clearTimeout(id)};
const PROFILE_TIMEOUT = 10000, VIEW_TIMEOUT = 5000, ACK_TIMEOUT = 5000;

/**
 * Application flow over the server protocol: login, hub, quick queues (1vCom, 1v1), game, outcome, rejoin.
 * Authoritative state comes only from private views; the topics update/move are just a signal
 * to request the private view again. Nothing is ever resent automatically after a drop.
 */
export class Session {
  phase: Phase = 'login';
  user = '';
  account: Account | null = null;
  model: Model | null = null;
  gameId: string | null = null;
  error = '';
  notice = '';
  receipt: ResumeState | null = null;
  /** Queue being waited on, or null; `mode` is the last one joined ("new game" repeats it, D11). */
  queued: Mode | null = null;
  mode: Mode | null = null;
  leavingQueue = false;
  presence: Presence[] = [];
  readonly trace: Trace[] = [];
  private password = '';
  private link: Link | null = null;
  private generation = 0;
  private gameSubs: (() => void)[] = [];
  private queueSubs: (() => void)[] = [];
  private queueToken = 0;
  private joined = false;
  private viewInFlight = 0;
  private viewAgain = false;
  private leaving = false;
  private listeners = new Set<() => void>();
  private readonly connector: Connector;
  private readonly timers: Timers;
  constructor(connector: Connector, timers: Timers = browserTimers) { this.connector = connector; this.timers = timers; }

  subscribe(fn: () => void) { this.listeners.add(fn); return () => { this.listeners.delete(fn); }; }
  private emit() { this.listeners.forEach(fn => fn()); }
  private log(channel: string, body: string) { this.trace.push({at: Date.now(), channel, body}); if (this.trace.length > 200) this.trace.shift(); }
  get catalog(): Card[] { return this.account?.collection?.cards ?? []; }
  // Starting resources per character binding: the reference of the resource indicators (O4).
  get characters(): CharacterCard[] { return this.account?.collection?.characters ?? []; }
  get connected() { return !!this.link; }

  async login(user: string, password: string) {
    if (this.phase !== 'login' && this.phase !== 'lost') return;
    this.error = ''; this.notice = ''; this.phase = 'connecting'; this.emit();
    let valid = false;
    try { valid = await this.connector.validate(user, password); }
    catch { return this.fail('Server non raggiungibile. Riprova tra poco.'); }
    if (!valid) return this.fail('Credenziali errate, oppure l’account è già collegato altrove.');
    this.user = user; this.password = password;
    await this.open();
  }

  /** Explicit rejoin after a drop: same account, subscribe then resume; the old choice is never resent. */
  async rejoin() {
    if (this.phase !== 'lost' || !this.user) return;
    this.error = ''; this.phase = 'connecting'; this.emit();
    let valid = false;
    try { valid = await this.connector.validate(this.user, this.password); } catch { valid = false; }
    if (!valid) { this.phase = 'lost'; this.error = 'Rientro non riuscito. Riprova: il termine di 30 secondi non si sposta.'; this.emit(); return; }
    await this.open();
  }

  private fail(message: string) { this.phase = this.user && this.model ? 'lost' : 'login'; this.error = message; this.emit(); }

  private async open() {
    const generation = ++this.generation;
    let link: Link;
    try { link = await this.connector.connect(this.user, this.password, () => this.dropped(generation)); }
    catch { if (generation === this.generation) this.fail('Connessione non riuscita.'); return; }
    if (generation !== this.generation) { link.close(); return; }
    this.link = link;
    const guard = (fn: (body: string) => void, channel: string) => (body: string) => { if (generation === this.generation) { this.log(channel, body); fn(body); } };
    // The login resume is applied once: a later account/data (deck save, refresh) only updates the profile.
    let resume: ResumeState | undefined, profile = false, applied = false;
    const settle = () => { if (applied || resume === undefined || !profile) return; applied = true; this.timers.clear(timer); this.applyResume(resume); };
    const timer = this.timers.set(() => { if (generation === this.generation && !(profile && resume)) this.close('Profilo non disponibile: accesso annullato.'); }, PROFILE_TIMEOUT);
    try {
      await Promise.all([
        link.subscribe('/user/queue/session/resume', guard(body => { resume = JSON.parse(body); settle(); }, 'resume')),
        link.subscribe('/user/queue/game/error', guard(body => this.queueFailed(body), 'game/error')),
        link.subscribe('/user/queue/account/error', guard(body => { if (!profile) this.close('Profilo non disponibile. Riprova.'); else { this.error = body; this.emit(); } }, 'account/error')),
        link.subscribe('/user/queue/account/data', guard(body => { this.account = JSON.parse(body); profile = true; settle(); if (applied) this.emit(); }, 'account/data')),
        link.subscribe('/topic/connections/users', guard(body => { this.presence = JSON.parse(body); this.emit(); }, 'users'))
      ]);
    } catch { if (generation === this.generation) this.close('Il server non ha confermato le sottoscrizioni.'); return; }
    if (generation !== this.generation) return;
    link.send('/app/session/resume');
    link.send(`/app/user/${this.user}/account`);
    link.send('/app/connections/users/tell/me');
  }

  private applyResume(state: ResumeState) {
    if (state.status !== 'none' && state.archived && state.outcome && !state.view) {
      // Restart receipt: no view, no subscription or command on the old gameId.
      this.dropGame(); this.receipt = state; this.phase = 'hub'; this.emit(); return;
    }
    if (state.status === 'none' || !state.gameId || !state.view) {
      if (this.model) this.notice = 'La partita precedente non è più attiva sul server.';
      this.dropGame(); this.phase = 'hub'; this.emit(); return;
    }
    if (this.model && this.model.view.gameId === state.gameId) {
      this.model.receive(state.view, this.model.generation, false, true);
      this.notice = state.view.pendingMove ? 'Rientro riuscito. La mossa già inviata resta in attesa.' : 'Rientro riuscito.';
    } else { this.model = new Model(state.view, this.user); this.notice = 'Rientro nella partita in corso.'; }
    this.gameId = state.gameId; this.phase = 'game'; this.emit();
    if (state.status === 'resumed' && !state.view.over) void this.attach(state.gameId, false);
  }

  join(mode: Mode) {
    if (this.phase !== 'hub' || !this.link) return;
    const link = this.link, generation = this.generation, token = ++this.queueToken;
    const stale = () => generation !== this.generation || token !== this.queueToken;
    this.error = ''; this.notice = ''; this.receipt = null; this.phase = 'queue'; this.queued = mode; this.mode = mode; this.joined = false; this.leavingQueue = false; this.emit();
    void link.subscribe(`/user/queue/game/${mode}/ready`, body => {
      if (stale() || this.phase !== 'queue') return;
      this.log(`${mode}/ready`, body); this.clearQueue(); this.queued = null; this.leavingQueue = false; void this.attach(body, true);
    }).then(unsub => {
      if (stale()) { unsub(); return; }
      this.queueSubs.push(unsub); this.joined = true;
      link.send(`/app/game/${mode}/join`, this.user);
    }, () => { if (!stale()) this.close('Il server non ha confermato la coda.'); });
  }

  /** Leave the queue: acknowledged by the server, then subscriptions close. Without ACK the user stays in the queue. */
  leaveQueue() {
    const link = this.link;
    if (this.phase !== 'queue' || !this.queued || !link || this.leavingQueue) return;
    const generation = this.generation, token = this.queueToken;
    // The join was never sent (subscription not confirmed yet): cancelling is local.
    if (!this.joined) { this.queueToken++; this.endQueue(); this.emit(); return; }
    this.leavingQueue = true; this.error = ''; this.emit();
    let done = false;
    const finish = (acknowledged: boolean) => {
      if (done || generation !== this.generation || token !== this.queueToken) return; done = true; this.timers.clear(timer); unsubscribe.then(unsub => unsub(), () => {});
      this.leavingQueue = false;
      if (!this.queued) return; // the game was ready first: the leave no longer applies
      if (acknowledged) { this.queueToken++; this.endQueue(); }
      else this.error = 'Il server non ha confermato l’uscita dalla coda. Riprova.';
      this.emit();
    };
    const timer = this.timers.set(() => finish(false), ACK_TIMEOUT);
    const unsubscribe = link.subscribe('/user/queue/session/queue/leave', body => { this.log('queue/leave', body); finish(true); });
    unsubscribe.then(() => { if (!done) link.send('/app/session/queue/leave'); }, () => finish(false));
  }

  private endQueue() { this.clearQueue(); this.queued = null; this.joined = false; this.leavingQueue = false; this.phase = 'hub'; }
  private queueFailed(body: string) { if (this.phase !== 'queue') return; this.queueToken++; this.endQueue(); this.error = body; this.emit(); }
  private clearQueue() { this.queueSubs.splice(0).forEach(unsub => unsub()); }

  private async attach(gameId: string, fresh: boolean) {
    const link = this.link!, generation = this.generation;
    this.gameId = gameId; this.unsubscribeGame();
    if (fresh) { this.model = null; this.phase = 'queue'; }
    const guard = (fn: (body: string) => void, channel: string) => (body: string) => { if (generation === this.generation && this.gameId === gameId) { this.log(channel, body); fn(body); } };
    try {
      this.gameSubs = await Promise.all([
        link.subscribe(`/user/queue/game/${gameId}/view`, guard(body => this.onView(JSON.parse(body)), 'view')),
        link.subscribe('/user/queue/illegalMove', guard(body => { this.model?.reject(`Rifiutata: ${body}`); this.requestView(); }, 'illegalMove')),
        // Participant topics carry only gameId/text: a signal to reread the private view.
        link.subscribe(`/topic/game/${gameId}/update`, guard(() => this.requestView(), 'update')),
        link.subscribe(`/topic/game/${gameId}/move`, guard(() => this.requestView(), 'move'))
      ]);
    } catch { if (generation === this.generation) this.close('Il server non ha confermato le sottoscrizioni della partita.'); return; }
    if (generation !== this.generation || this.gameId !== gameId) return;
    this.requestView();
  }

  private onView(view: View) {
    this.timers.clear(this.viewInFlight); this.viewInFlight = 0;
    if (view.gameId !== this.gameId) return;
    if (!this.model) { this.model = new Model(view, this.user); this.phase = 'game'; this.emit(); }
    else this.model.receive(view);
    if (this.viewAgain) { this.viewAgain = false; this.requestView(); }
    this.emit();
  }

  /** At most one view request in flight; notifications during it collapse into one more request. */
  requestView() {
    if (!this.link || !this.gameId || this.leaving) return;
    if (this.viewInFlight) { this.viewAgain = true; return; }
    this.viewInFlight = this.timers.set(() => { this.viewInFlight = 0; if (this.viewAgain) { this.viewAgain = false; this.requestView(); } }, VIEW_TIMEOUT);
    this.link.send(`/app/game/${this.gameId}/${this.user}/view`);
  }

  submit() {
    const model = this.model;
    if (!model || !this.link || !this.gameId) return;
    const command = model.confirm();
    if (!command) return;
    this.link.send(`/app/game/${this.gameId}/move`, JSON.stringify(command));
    this.emit();
  }

  /** Leave after the outcome (acknowledgement) or as an explicit forfeit; then back to the hub. */
  leave(then: 'hub' | 'again' = 'hub') {
    const link = this.link, gameId = this.gameId, generation = this.generation;
    if (this.leaving) return;
    const again = this.mode ?? this.modeOf(this.model?.view);
    if (!link || !gameId) { this.dropGame(); this.phase = this.link ? 'hub' : 'login'; this.emit(); return; }
    // The leave itself publishes an update; a view request after it would hit a closed game, which the
    // server denies by closing the connection. Stop listening to the game before leaving it.
    this.leaving = true; this.unsubscribeGame(); this.timers.clear(this.viewInFlight); this.viewInFlight = 0; this.viewAgain = false;
    let done = false;
    const finish = (acknowledged: boolean) => {
      if (done || generation !== this.generation) return; done = true; this.timers.clear(timer); unsubscribe.then(unsub => unsub(), () => {});
      this.dropGame(); this.phase = 'hub';
      if (!acknowledged) this.notice = 'Il server non ha confermato l’uscita: se rientri nella stessa partita, lasciala di nuovo.';
      this.emit();
      if (acknowledged && then === 'again') this.join(again);
    };
    const timer = this.timers.set(() => finish(false), ACK_TIMEOUT);
    const unsubscribe = link.subscribe(`/user/queue/game/${gameId}/leave`, body => { this.log('leave', body); finish(true); });
    unsubscribe.then(() => { if (!done) link.send(`/app/game/${gameId}/${this.user}/leave`); }, () => finish(false));
  }

  // After a rejoin the queue is unknown: a computer opponent means 1vCom, otherwise 1v1.
  private modeOf(view?: View): Mode { return !view || Object.keys(view.players).some(id => id.startsWith('ComPlayer_')) ? 'quick/1vCom' : 'quick/1v1'; }

  private dropGame() { this.leaving = false; this.unsubscribeGame(); this.model = null; this.gameId = null; this.timers.clear(this.viewInFlight); this.viewInFlight = 0; this.viewAgain = false; }
  private unsubscribeGame() { this.gameSubs.splice(0).forEach(unsub => unsub()); }

  private dropped(generation: number) {
    if (generation !== this.generation) return;
    this.generation++; this.link = null; this.gameSubs = []; this.queueSubs = []; this.queued = null; this.leavingQueue = false; this.presence = [];
    this.timers.clear(this.viewInFlight); this.viewInFlight = 0; this.viewAgain = false;
    this.model?.disconnect();
    this.phase = 'lost';
    this.error = this.model ? 'Connessione interrotta. Rientra entro 30 secondi: la partita e il clock proseguono sul server.' : 'Connessione interrotta.';
    this.emit();
  }

  private close(message: string) {
    this.generation++; this.link?.close(); this.link = null; this.dropGame(); this.clearQueue(); this.queued = null; this.leavingQueue = false; this.presence = [];
    this.phase = 'login'; this.error = message; this.password = ''; this.emit();
  }

  async logout() {
    const link = this.link;
    this.generation++;
    if (link) {
      await new Promise<void>(resolve => {
        const timer = this.timers.set(resolve, 1500);
        link.subscribe('/user/queue/session/logout', () => { this.timers.clear(timer); resolve(); })
          .then(() => link.send('/app/session/logout'), () => resolve());
      });
      link.close();
    }
    this.link = null; this.dropGame(); this.clearQueue(); this.queued = null; this.mode = null; this.leavingQueue = false; this.presence = []; this.account = null; this.receipt = null;
    this.user = ''; this.password = ''; this.error = ''; this.notice = ''; this.phase = 'login'; this.emit();
  }

  /** Diagnostic only, like the debug dropConnection(): closes the socket without notifying the server. */
  dropConnection() { this.link?.drop(); }
}
