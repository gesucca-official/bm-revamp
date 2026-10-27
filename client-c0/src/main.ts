import {Component, signal, computed, OnDestroy} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {Card, Command, View, Player, Resource} from './contracts';
import {fixtures} from './fixtures';

@Component({
  selector: 'bm-c0', standalone: true, imports: [CommonModule],
  templateUrl: './table.html'
})
class Table implements OnDestroy {
  readonly me = 'Ada';
  readonly view = signal<View>(structuredClone(fixtures.before));
  readonly selected = signal<number | null>(null);
  readonly target = signal('');
  readonly item = signal('');
  readonly discard = signal('');
  readonly phase = signal('Scegli una carta');
  readonly sent = signal<Command | null>(null);
  readonly reduced = signal(matchMedia('(prefers-reduced-motion: reduce)').matches);
  readonly motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  readonly preferenceChanged = (event: MediaQueryListEvent) => { this.reduced.set(event.matches); this.cancel(); };
  readonly now = signal(1893456000000);
  readonly hand = computed(() => this.view().players[this.me].cardsInHand as Card[]);
  readonly card = computed(() => this.selected() === null ? null : this.hand()[this.selected()!]);
  readonly players = computed(() => Object.values(this.view().players));
  readonly discards = computed(() => this.hand().filter(c => !c.basicAction && !c.characterBound && !c.lastResort));
  readonly command = computed<Command | null>(() => {
    const c = this.card();
    if (!c || !this.target() || (c.characterBound && !this.discard()) || (this.needsItem(c) && !this.item())) return null;
    return {playedCardName:c.name, playerId:this.me, targetId:this.target(), gameId:this.view().gameId,
      choices:c.characterBound ? {DISCARD_ONE:this.discard()} : this.needsItem(c) ? {TARGET_ITEM:this.item()} : null};
  });
  readonly locked = computed(() => !!this.view().pendingMove || this.phase().startsWith('Invio') ||
    this.phase().startsWith('Esito incerto') || this.view().over || !!this.view().forfeits[this.me]);
  readonly canConfirm = computed(() => !!this.command() && !this.locked());
  private animations: Animation[] = [];
  private generation = 0;
  private shown = new Set<string>();
  private timer: ReturnType<typeof setInterval>;
  private readonly started = performance.now();
  private readonly visibility = () => { if (document.hidden) this.cancel(); };
  readonly stats = {sequences:0, cancelled:0, sequenceMs:[] as number[], feedbackMs:[] as number[], lastCommand:null as Command | null};
  constructor() {
    this.timer = setInterval(() => this.now.set(1893456000000 + performance.now() - this.started), 250);
    document.addEventListener('visibilitychange', this.visibility);
    this.motionPreference.addEventListener('change', this.preferenceChanged);
    // Strumentazione di sola osservazione del laboratorio; nessun servizio globale di gioco.
    Object.defineProperty(window, '__c0', {configurable:true, value: {stats:this.stats}});
  }
  ngOnDestroy() {
    clearInterval(this.timer); this.cancel();
    document.removeEventListener('visibilitychange', this.visibility);
    this.motionPreference.removeEventListener('change', this.preferenceChanged);
    delete (window as unknown as {__c0?:unknown}).__c0;
  }
  count(p: Player) { return Array.isArray(p.cardsInHand) ? p.cardsInHand.length : p.cardsInHand; }
  kind(c: Card) { return c.item ? 'Oggetto' : c.basicAction ? 'Azione base · persiste' : c.characterBound ? 'Azione bound · persiste' : c.lastResort ? 'Ultima risorsa' : 'Azione regolare · scarto'; }
  needsItem(c: Card) { return c.canTarget.includes('NEAR_ITEM') || c.canTarget.includes('FAR_ITEM'); }
  resources = [{key:'HEALTH',label:'♥ H'}, {key:'ALERTNESS',label:'◉ A'}, {key:'VIOLENCE',label:'✦ V'}, {key:'TOXICITY',label:'◇ T'}, {key:'ALCOHOL',label:'△ L'}] as {key:Resource;label:string}[];
  allowed(p: Player, isItem = false) {
    const c = this.card();
    if (!c || p.character.dead || this.view().forfeits[p.playerId]) return false;
    return c.canTarget.includes(p.playerId === this.me ? (isItem ? 'NEAR_ITEM' : 'SELF') : (isItem ? 'FAR_ITEM' : 'OPPONENT'));
  }
  clock(p: Player) {
    const deadline = this.view().moveDeadlines[p.playerId];
    return deadline ? Math.max(0, Math.ceil((deadline - this.now()) / 1000)) + ' s circa' : '—';
  }
  select(index: number, event: Event) {
    const t = event.timeStamp;
    this.cancel(); this.selected.set(index); this.target.set(''); this.item.set(''); this.discard.set('');
    if (!this.locked()) this.phase.set('Scegli bersaglio e opzioni');
    requestAnimationFrame(() => this.stats.feedbackMs.push(performance.now() - t));
  }
  choose(p: Player, item?: Card) {
    if (!this.allowed(p, !!item) || this.locked()) return;
    this.target.set(p.playerId === this.me ? 'SELF' : p.playerId); this.item.set(item?.name || '');
  }
  clear() {
    this.cancel(); this.selected.set(null); this.target.set(''); this.item.set(''); this.discard.set('');
    if (!this.locked()) this.phase.set('Scegli una carta');
  }
  confirm() {
    if (!this.canConfirm()) return;
    this.sent.set(this.command()); this.stats.lastCommand = this.command();
    this.phase.set('Invio in corso · anteprima locale, nessun SEND');
  }
  reject() { this.cancel(); this.phase.set('Rifiuto sintetico · correggi la scelta'); }
  drop() { this.cancel(); this.phase.set('Esito incerto · riprendi e rileggi, nessun reinvio automatico'); }
  toggleMotion() { this.reduced.update(v => !v); this.cancel(); }
  reset() {
    this.shown.clear(); this.sent.set(null); this.phase.set('Scegli una carta');
    this.apply('before'); this.clear();
  }
  apply(name: keyof typeof fixtures) {
    const old = this.view(); const next = structuredClone(fixtures[name]) as View;
    this.cancel(); this.view.set(next);
    if (next.pendingMove) this.phase.set('Mossa ricevuta · pending propria nella fixture');
    else if (old.turn !== next.turn || this.phase().startsWith('Esito incerto') || old.pendingMove) this.phase.set('Scegli una carta');
    // Gli indici sono solo chiavi grafiche locali; nessuna identità wire di istanza.
    if (this.selected() !== null && old.turn !== next.turn) this.clear();
    if (this.target()) {
      const p = next.players[this.target() === 'SELF' ? this.me : this.target()];
      if (!p || p.character.dead || next.forfeits[p.playerId] ||
          (this.item() && !p.character.items.some(i => i.name === this.item()))) { this.target.set(''); this.item.set(''); }
    }
    const key = next.gameId + ':' + next.turn;
    // Nessuna ricostruzione di round saltati o replay alla ripresa.
    if (name === 'after' && old.turn + 1 === next.turn && !this.shown.has(key)) {
      this.shown.add(key); this.stats.sequences++;
      requestAnimationFrame(() => { if (this.view() === next) void this.sequence(); });
    }
  }
  cancel() {
    this.generation++;
    if (this.animations.length) this.stats.cancelled++;
    this.animations.forEach(a => a.cancel()); this.animations = [];
    document.querySelectorAll('.fx').forEach(el => el.remove());
  }
  private async sequence() {
    const generation = this.generation;
    const started = performance.now();
    const layers = [
      {from:'Bice',to:'Ada',text:'Peroni da 66, calda · trasferimento',kind:'transfer'},
      {from:'Ciro',to:'Ada',text:'BAM!',kind:'impact'},
      {from:'Ada',to:'Ada',text:'H 120 → 80 · Δ aggregato −40',kind:'delta'}
    ];
    for (const layer of layers) {
      if (generation !== this.generation || document.hidden) return;
      if (this.reduced()) return; // I valori finali e il riepilogo sono già leggibili nel DOM.
      const from = document.getElementById('seat-' + layer.from)!.getBoundingClientRect();
      const to = document.getElementById('seat-' + layer.to)!.getBoundingClientRect();
      const el = document.createElement('div'); el.className = 'fx ' + layer.kind;
      el.textContent = layer.text; el.setAttribute('aria-hidden','true');
      el.style.left = to.left + 'px'; el.style.top = to.top + 'px'; document.body.appendChild(el);
      const frames = layer.kind === 'transfer' ? [
        {transform:`translate(${from.left-to.left}px, ${from.top-to.top}px)`,opacity:0},
        {transform:'translate(0,0)',opacity:1}
      ] : [{transform:'scale(.9)',opacity:0},{transform:'scale(1)',opacity:1}];
      const animation = el.animate(frames, {duration:layer.kind === 'transfer' ? 300 : 250, easing:'ease-out'});
      this.animations.push(animation);
      try { await animation.finished; } catch { return; }
      el.remove(); this.animations = this.animations.filter(a => a !== animation);
    }
    this.stats.sequenceMs.push(performance.now() - started);
  }
  readonly resized = () => this.cancel();
  // Il template chiama questo al resize: l'effetto decorativo non deve inseguire il layout.
}
bootstrapApplication(Table).catch(console.error);
