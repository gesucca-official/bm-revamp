import {strict as assert} from 'assert';
import {Subject, throwError} from 'rxjs';
import {ClientErrorHandler} from '../src/app/service/client-error-handler';

export const tests = [{
  name: 'failed error reporting does not recurse or replace console.error',
  run: () => {
    const saved = console.error;
    let reports = 0;
    console.error = () => {};
    const localConsole = console.error;
    try {
      const handler = new ClientErrorHandler({post: () => {
        reports++;
        return throwError(new Error('backend offline'));
      }} as any);
      handler.handleError(new Error('first'));
      assert.equal(reports, 1);
      assert.equal(console.error, localConsole);
      handler.handleError(new Error('second'));
      assert.equal(reports, 2);
    } finally { console.error = saved; }
  }
}, {
  name: 'only one error report remains in flight and reporting resumes after completion',
  run: () => {
    const saved = console.error;
    console.error = () => {};
    const pending = new Subject<void>();
    let reports = 0;
    try {
      const handler = new ClientErrorHandler({post: () => { reports++; return pending; }} as any);
      handler.handleError('first');
      handler.handleError('second');
      assert.equal(reports, 1);
      pending.complete();
      handler.handleError('third');
      assert.equal(reports, 2);
    } finally { console.error = saved; }
  }
}];
