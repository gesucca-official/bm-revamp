import {Injectable} from '@angular/core';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import {Move} from '../model/move';
import {SessionService} from './session.service';
import {Deck} from '../model/deck';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor(protected sessionService: SessionService) {
    this.subscriptions = new Map<string, any>();
    this.connected = false;
  }

  private stompClient: any; // dunno which type this is

  private connected: boolean;
  private socket: any;
  private stopping = false;
  private generation = 0;

  private subscriptions: Map<string, any[]>;

  private static inferJoinGameEndpoint(gameType: string, playerId: string): string {
    if (gameType.includes('Com') || gameType === 'quick/1v1' || gameType === 'quick/ffa') {
      return '/user/queue/game/' + gameType + '/ready';
    } else {
      return '/topic/game/' + gameType + '/ready';
    }
  }

  public connect(username: string, password: string, callback: () => void, failed: () => void = () => {}): void {
    const generation = ++this.generation;
    this.stopping = false;
    const socket = new SockJS('/ws');
    this.socket = socket;
    this.stompClient = Stomp.over(socket);
    // STOMP debug output includes the CONNECT frame and its credentials.
    this.stompClient.debug = () => {};
    let settled = false;
    let profileLoaded = false;
    const fail = () => {
      if (generation !== this.generation || this.stopping || (settled && !this.connected)) { return; }
      settled = true;
      clearTimeout(connectionTimer);
      this.connected = false;
      this.stopping = true;
      this.sessionService.reset();
      this.subscriptions.clear();
      this.sessionService.connectionMessage = 'Connessione interrotta. Accedi di nuovo entro 30 secondi per rientrare nella stessa partita. Il clock mossa multiplayer continua.';
      socket.close();
      if (!profileLoaded) { failed(); }
    };
    const connectionTimer = setTimeout(fail, 10000);
    this.stompClient.connect({
      login: username,
      passcode: password
    }, () => {
      if (generation !== this.generation || settled || this.stopping) { return; }
      settled = true;
      this.connected = true;
      this.sessionService.connectionMessage = '';
      this.stompClient.subscribe('/user/queue/session/resume', event => {
        if (generation !== this.generation || this.stopping) { return; }
        const state = JSON.parse(event.body);
        this.sessionService.resumeState = state;
        this.sessionService.resumeEvents.next(state);
      });
      this.stompClient.send('/app/session/resume', {});
      this.stompClient.subscribe('/user/queue/game/error', event => {
        if (generation !== this.generation || this.stopping) { return; }
        (this.subscriptions.get('queue') || []).forEach(sub => sub.unsubscribe()); this.subscriptions.delete('queue');
        this.sessionService.queued = false; this.sessionService.queuedFor = null;
        this.sessionService.isLoadingGame = false; this.sessionService.gameJoinError = event.body;
      });

      this.stompClient.subscribe('/topic/connections/users',
        (sdkEvent) => { if (generation === this.generation && !this.stopping) { this.sessionService.usersConnected = JSON.parse(sdkEvent.body); } });
      this.stompClient.send('/app/connections/users/tell/me', {});

      this.sessionService.isWaitingForUserAccountData = true;
      this.stompClient.subscribe('/user/queue/account/error', event => {
        if (!profileLoaded) { fail(); return; }
        if (generation !== this.generation || this.stopping) { return; }
        this.sessionService.isWaitingForUserAccountData = false;
        this.sessionService.accountError = event.body;
      });
      this.stompClient.subscribe('/user/queue/account/data', (sdkEvent) => {
        if (generation !== this.generation || this.stopping || !this.connected) { return; }
        clearTimeout(connectionTimer);
        profileLoaded = true;
        this.sessionService.accountError = '';
        this.sessionService.isWaitingForUserAccountData = false;
        this.sessionService.userAccountData = JSON.parse(sdkEvent.body);
        callback();
      });
      this.stompClient.send('/app/user/' + username + '/account', {});

    }, fail);
  }

  public disconnect(): Promise<void> {
    const generation = ++this.generation;
    const socket = this.socket;
    const client = this.stompClient;
    this.stopping = true;
    this.connected = false;
    return new Promise(resolve => {
      let done = false;
      const finish = () => {
        if (done) { return; }
        done = true;
        clearTimeout(timer);
        if (socket) { socket.close(); }
        if (generation === this.generation) {
          this.subscriptions.clear();
          this.sessionService.reset();
        }
        resolve();
      };
      const timer = setTimeout(finish, 1500);
      try {
        if (client && client.connected) {
          const ack = client.subscribe('/user/queue/session/logout', () => { client.disconnect(finish); });
          client.send('/app/session/logout', {});
          // Transport fallback is bounded; the server still enforces the reconnect deadline if no ack arrives.
        }
        else { finish(); }
      } catch (_) { finish(); }
    });
  }

  get connectionMessage(): string { return this.sessionService.connectionMessage; }

  public isConnected(): boolean {
    return this.connected;
  }

  public dropConnection(): void { if (this.socket) { this.socket.close(); } }

  // these deck methods maybe have to go somewhere else
  public saveDeck(username: string, deck: Deck): void {
    this.sessionService.isWaitingForUserAccountData = true;
    this.stompClient.send('/app/user/' + username + '/deck', {}, JSON.stringify(deck));
  }

  public deleteDeck(username: string, deck: Deck): void {
    this.sessionService.isWaitingForUserAccountData = true;
    this.stompClient.send('/app/user/' + username + '/deck/delete', {}, JSON.stringify(deck));
  }

  public joinGame(playerId: string, gameType: string, callback: (sdkEvent) => void, deck?: Deck): void {
    if (this.sessionService.queued) { return; }
    const generation = this.generation;
    this.sessionService.gameJoinError = '';
    const queueSubs: any[] = [];
    this.sessionService.queued = true;
    this.sessionService.queuedFor = gameType.split('/')[1]; // TODO come on this is nowhere near being safe
    if (gameType.includes('ffa'))
      // TODO this never gets unsubscribed from
    {
      this.sessionService.isLoadingGame = false; // people should be able to see what's going on while waiting for now
      queueSubs.push(this.stompClient.subscribe('/topic/game/' + gameType + '/joined',
        (sdkEvent) => {
          if (generation === this.generation && !this.stopping) { this.sessionService.usersInCurrentQueue = JSON.parse(sdkEvent.body); }
        }));
    }

    let errorSubscription: any;
    if (gameType === 'open/1vCom') {
      errorSubscription = this.stompClient.subscribe('/user/queue/game/open/1vCom/error', event => {
        if (generation !== this.generation || this.stopping) { return; }
        subscription.unsubscribe();
        errorSubscription.unsubscribe();
        this.subscriptions.delete('queue');
        this.sessionService.queued = false;
        this.sessionService.queuedFor = null;
        this.sessionService.isLoadingGame = false;
        this.sessionService.gameJoinError = event.body;
      });
    }
    // Both private subscriptions are consumed by ready or rejection.
    const subscription = this.stompClient.subscribe(WebsocketService.inferJoinGameEndpoint(gameType, playerId), (sdkEvent) => {
      if (generation !== this.generation || this.stopping) { return; }
      subscription.unsubscribe();
      if (errorSubscription) { errorSubscription.unsubscribe(); }
      queueSubs.filter(sub => sub !== subscription && sub !== errorSubscription).forEach(sub => sub.unsubscribe());
      this.subscriptions.delete('queue');
      this.sessionService.queued = false;
      this.sessionService.queuedFor = null;
      callback(sdkEvent);
    });
    queueSubs.push(subscription);
    if (errorSubscription) { queueSubs.push(errorSubscription); }
    this.subscriptions.set('queue', queueSubs);
    this.stompClient.send('/app/game/' + gameType + '/join' +
      (gameType.includes('open') ? '/' + playerId + '/' + deck.deckId : '')
      , {}, playerId);
  }

  public addComToGame(): void {
    // no subs here cause user is already joined and subbed
    this.stompClient.send('/app/game/quick/ffa/join/com', {});
  }

  public forceStartFfaGame(): void {
    // as above
    this.stompClient.send('/app/game/quick/ffa/start', {});
  }

  public subToGame(gameId: string,
                   playerId: string,
                   movesCallback: (sdkEvent) => void,
                   illegalMoveCallback: (sdkEvent) => void,
                   gameViewCallback: (sdkEvent) => void
  ): void {
    const generation = this.generation;
    const guarded = callback => event => {
      if (generation === this.generation && !this.stopping && this.subscriptions.get(gameId) === gameSubs) { callback(event); }
    };
    const gameSubs = new Array<any>();

    // when there's an update about the game get your updated view view
    gameSubs.push(
      this.stompClient.subscribe('/topic/game/' + gameId + '/update', guarded(() => {
          this.requestGameView(gameId, playerId);
        })
      ));
    // alert about other players moves
    gameSubs.push(
      this.stompClient.subscribe('/topic/game/' + gameId + '/move', guarded(event => { movesCallback(event); this.requestGameView(gameId, playerId); }))
    );
    // alert player when he select an illegal move
    gameSubs.push(
      this.stompClient.subscribe('/user/queue/illegalMove', guarded(illegalMoveCallback))
    );
    // update game when receiving a new view
    gameSubs.push(
      this.stompClient.subscribe('/user/queue/game/' + gameId + '/view', guarded(gameViewCallback))
    );

    // save everything to unsubscribe later
    this.subscriptions.set(gameId, gameSubs);
  }

  public requestGameView(gameId: string, playerId: string): void {
    this.stompClient.send('/app/game/' + gameId + '/' + playerId + '/view', {});
  }

  // don't know if coupling Move class with this service is good
  public submitMove(move: Move): void {
    this.stompClient.send('/app/game/' + move.gameId + '/move', {}, JSON.stringify(move));
  }

  public unsubToGame(gameId: string, playerId: string, finished: () => void = () => {}): void {
    const generation = this.generation;
    const ack = this.stompClient.subscribe('/user/queue/game/' + gameId + '/leave', () => {
      ack.unsubscribe(); if (generation === this.generation && !this.stopping) { finished(); }
    });
    this.stompClient.send('/app/game/' + gameId + '/' + playerId + '/leave', {});
    (this.subscriptions.get(gameId) || []).forEach(sub => sub.unsubscribe());
    this.subscriptions.delete(gameId);
  }

  public leaveQueue(): void {
    const generation = this.generation;
    const ack = this.stompClient.subscribe('/user/queue/session/queue/leave', () => {
      ack.unsubscribe();
      if (generation !== this.generation || this.stopping) { return; }
      const queued = this.subscriptions.get('queue') || [];
      queued.forEach(sub => sub.unsubscribe()); this.subscriptions.delete('queue');
      this.sessionService.queued = false; this.sessionService.queuedFor = null;
      this.sessionService.usersInCurrentQueue = []; this.sessionService.isLoadingGame = false;
    });
    this.stompClient.send('/app/session/queue/leave', {});
  }
}
