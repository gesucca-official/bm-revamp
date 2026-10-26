import {strict as assert} from 'assert';
import {DebugClientComponent} from '../src/app/client-debug/debug-client.component';
export const tests = [{name: 'private move rejection is shown by debug snackbar', run: () => {
  let reject: (message: any) => void;
  const shown: string[] = [];
  const ws: any = {joinGame: (_p, _g, ready) => ready({body: 'fixture'}),
    subToGame: (_g, _p, _ok, error) => reject = error, requestGameView: () => {}};
  const game: any = {playerId: 'alice'};
  const component = new DebugClientComponent(ws, game, {} as any, {} as any,
    {open: message => shown.push(message)} as any);
  component.joinGame({game: 'quick/1vCom'});
  reject({body: 'already submitted a move'});
  assert.deepEqual(shown, ['already submitted a move']);
}}];
