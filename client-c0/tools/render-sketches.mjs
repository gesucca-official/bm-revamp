import {chromium} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
  for(const name of ['duel','ffa-five','card']) {
    const page=await browser.newPage({viewport:name==='card'?{width:760,height:970}:{width:1366,height:1000},deviceScaleFactor:1});
    const svg=await readFile(`../docs/design/client-c0/${name}.svg`,'utf8');
    await page.setContent('<html><body style="margin:0">'+svg+'</body></html>');
    await page.screenshot({path:`../docs/design/client-c0/${name}.png`,fullPage:true}); await page.close();
  }
} finally {await browser.close();}
