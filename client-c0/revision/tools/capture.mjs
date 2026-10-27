import {setup} from './browser.mjs';
import {mkdir} from 'node:fs/promises';
const app=await setup();await mkdir('../../docs/design/client-c0/r2-screenshots',{recursive:true});
try{for(const [name,width,height] of [['desktop',1366,768],['landscape-emulated',844,390]]){const context=await app.browser.newContext({viewport:{width,height},hasTouch:height===390});const page=await context.newPage();page.on('pageerror',e=>console.error(e));await page.goto(app.url);await page.waitForFunction(()=>window.__c0?.state.hits.length>0);await page.screenshot({path:`../../docs/design/client-c0/r2-screenshots/${name}.png`});console.log(name,await page.evaluate(()=>({hits:__c0.state.hits.length,backs:__c0.state.backs,renderer:__c0.state.renderer})));await context.close();}}finally{await app.close();}
