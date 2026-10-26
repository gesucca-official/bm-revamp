import {strict as assert} from 'assert';
import {of, throwError} from 'rxjs';
import Swal from 'sweetalert2';
import {SignInComponent} from '../src/app/connection/sign-in/sign-in.component';

export const tests = [false, true, 'offline'].map(result => ({
  name: 'login handles credential result ' + result,
  run: async () => {
    const original = Swal.fire;
    let dialogs = 0;
    let connections = 0;
    (Swal as any).fire = () => { dialogs++; return Promise.resolve({}); };
    const game: any = {};
    const ws: any = {connect: (username, password, done) => { connections++; done(); }};
    const http: any = {post: () => result === 'offline' ? throwError(new Error('offline')) : of(result)};
    const component = new SignInComponent(ws, game, http, {info: () => {}} as any);
    component.playerId = 'synthetic';
    component.password = 'synthetic';
    try {
      await component.logIn();
      assert.equal(component.isLoading, false);
      assert.equal(connections, result === true ? 1 : 0);
      assert.equal(dialogs, result === true ? 0 : 1);
      assert.equal(game.playerId, result === true ? 'synthetic' : undefined);
    } finally { Swal.fire = original; }
  }
}));
