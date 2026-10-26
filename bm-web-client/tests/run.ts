// Headless class-level tests, using the project's existing ts-node and Node assert.
// This deliberately does not bootstrap Angular, a browser, STOMP or external services.
import {readdirSync} from 'fs';
import {join} from 'path';
import {TestCase} from './test-case';

async function main(): Promise<void> {
  const files = readdirSync(__dirname).filter(file => file.endsWith('.spec.ts')).sort();
  let total = 0;
  let failures = 0;
  for (const file of files) {
    const cases: TestCase[] = require(join(__dirname, file)).tests;
    if (!Array.isArray(cases) || cases.length === 0) {
      throw new Error('No test cases exported by ' + file);
    }
    for (const test of cases) {
      total++;
      try {
        await test.run();
        console.log('PASS ' + test.name);
      } catch (error) {
        failures++;
        console.error('FAIL ' + test.name);
        console.error(error);
      }
    }
  }
  if (total === 0) { throw new Error('No client tests discovered'); }
  console.log(`Tests: ${total}, passed: ${total - failures}, failed: ${failures}`);
  if (failures > 0) { process.exitCode = 1; }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
