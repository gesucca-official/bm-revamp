import {strict as assert} from 'assert';
import {DebugClientComponent} from '../src/app/client-debug/debug-client.component';
import {GameService} from '../src/app/service/game.service';
import {SessionService} from '../src/app/service/session.service';
import {WebsocketService} from '../src/app/service/websocket.service';

export const tests = [{name: 'restart receipt shows draw and reason once, Continue leaves hub without game subscriptions', run: () => {
  let subscriptions = 0;
  const ws: any = {subToGame: () => subscriptions++,
    unsubToGame: () => {throw Error('archived leave');}, submitMove: () => {throw Error('archived move');}};
  const game = new GameService(ws); game.playerId = 'alice';
  const session = new SessionService(); const titles: string[] = []; let close: () => void;
  session.resumeState = {status: 'finished', archived: true, gameId: 'old',
    outcome: {over: true, result: 'draw', winner: null, reason: 'riavvio server'}};
  const component = new DebugClientComponent(ws, game, session,
    {closeAll: () => {}, open: (_type, options) => {titles.push(options.data.title);
      assert(options.data.html.includes('draw')); return {afterClosed: () => ({subscribe: cb => close = cb})};}} as any,
    {open: () => {}} as any);
  component.ngOnInit(); session.resumeEvents.next(session.resumeState);
  assert.deepEqual(titles, ['Pareggio — riavvio server']); assert.equal(game.gameId, null);assert.equal(game.gameState, null);
  assert.equal(subscriptions, 0);
  const receipt = session.resumeState;
  close(); assert.equal(session.resumeState, null);
  (component as any).attachGame('new'); game.gameState = {gameId: 'new', over: false} as any;
  session.resumeEvents.next(receipt);
  assert.equal(game.gameId, 'new'); assert.equal(game.gameState.gameId, 'new');
  assert.equal(subscriptions, 1);assert.equal(titles.length, 1);component.ngOnDestroy();
}}, {name: 'debug resume keeps match and pending move; no new join or resubmit', run: () => {
  let joined = 0, subscribed = 0, sent = 0;
  const ws: any = {subToGame: () => subscribed++, joinGame: () => joined++, submitMove: () => sent++};
  const game = new GameService(ws); game.playerId = 'alice';
  const session = new SessionService();
  session.resumeState = {status: 'resumed', gameId: 'same', view: {
    gameId: 'same', turn: 0, players: {alice: {cardsInHand: [], character: {}}, bob: {character: {dead: false}}},
    pendingMove: {playerId: 'alice'}, resolvedMoves: [], timeBasedEffects: {}, over: false, forfeits: {}}};
  const notices: string[] = [];
  const component = new DebugClientComponent(ws, game, session,
    {closeAll: () => {}, open: () => ({afterClosed: () => ({subscribe: () => {}})})} as any,
    {open: text => notices.push(text)} as any);
  component.ngOnInit();
  assert.equal(game.gameId, 'same'); assert.equal(game.gameState.pendingMove.playerId, 'alice');
  assert.equal(joined, 0); assert.equal(subscribed, 1); assert(notices[0].includes('stessa partita'));
  component.playCard({} as any); assert.equal(sent, 0);
  assert.equal(game.isPlayable({} as any, {} as any), false);
  assert(component.clockMessage.includes('Mossa ricevuta'));
  component.ngOnDestroy();
}}, {name: 'debug timeout draw presents one outcome and Continue restores hub with no opponents', run: () => {
  const ws: any = {unsubToGame: () => {}};
  const game = new GameService(ws); game.playerId = 'alice'; game.gameId = 'draw';
  const session = new SessionService(); let close: () => void; const titles: string[] = []; let closed = 0;
  const component = new DebugClientComponent(ws, game, session,
    {closeAll: () => closed++, open: (_type, options) => { titles.push(options.data.title); return {afterClosed: () => ({subscribe: cb => close = cb})}; }} as any,
    {open: () => {}} as any);
  const state = JSON.stringify({gameId:'draw',turn:0,players:{alice:{cardsInHand:[],character:{dead:false}},bob:{character:{dead:false}}},
    resolvedMoves:[],timeBasedEffects:{},over:true,winner:'NONE',outcomeReason:'timeout',forfeits:{alice:'move timeout',bob:'move timeout'}});
  component.onGameUpdate(state); component.onGameUpdate(state);
  assert.deepEqual(titles,['WINNER: NONE — timeout']); assert.equal(closed, 1); assert(component.clockMessage.includes('Partita conclusa')); close();
  assert.equal(titles.length, 1);
  assert.equal(game.gameState,null); assert.equal(game.gameId,null); assert.equal(session.resumeState,null);
}}, {name: 'old game callbacks cannot mutate a new connection generation', run: () => {
  const ws = new WebsocketService(new SessionService()); const callbacks: any = {};
  (ws as any).stompClient = {subscribe: (path, callback) => {callbacks[path]=callback; return {unsubscribe: () => {}};}, send: () => {throw Error('stale request');}};
  let views = 0; ws.subToGame('old','alice',() => {},() => {},() => views++);
  (ws as any).generation++;
  callbacks['/user/queue/game/old/view']({body:'old'}); callbacks['/topic/game/old/update']({});
  assert.equal(views,0);
}}, {name: 'old leave acknowledgement cannot clear the game or queue after a new login', run: () => {
  const session = new SessionService(); const ws = new WebsocketService(session); const callbacks: any = {};
  (ws as any).stompClient = {subscribe: (path, callback) => { callbacks[path]=callback; return {unsubscribe: () => {}}; }, send: () => {}};
  let cleared = 0; ws.unsubToGame('old','alice',() => cleared++); ws.leaveQueue();
  (ws as any).generation++; session.queued = true; session.queuedFor = 'ffa';
  callbacks['/user/queue/game/old/leave']({}); callbacks['/user/queue/session/queue/leave']({});
  assert.equal(cleared,0); assert.equal(session.queued,true); assert.equal(session.queuedFor,'ffa');
}}];
