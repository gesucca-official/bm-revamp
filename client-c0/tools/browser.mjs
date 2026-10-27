import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
export async function setup() {
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser = await chromium.launch({channel:'msedge',headless:process.env.C0_HEADED !== '1'});
  return {browser,url:`http://127.0.0.1:${server.address().port}`,close:async()=>{await browser.close();await new Promise(resolve=>server.close(resolve));}};
}
