// Probe 6: placeholders, disabled states, links, form controls (non-text contrast), accent colours of native controls.
import {startServer,stopServer,launch,login,saveJson,URL_} from './lib.mjs';
await startServer();
const {browser,page}=await launch({width:1366,height:768});
const timer=setTimeout(()=>process.exit(2),200000);
const fn=()=>{
 const lin=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);};
 const parse=s=>{const m=s.match(/rgba?\(([^)]+)\)/);if(!m)return null;const p=m[1].split(/[ ,\/]+/).filter(Boolean).map(Number);return [p[0],p[1],p[2],p[3]??1];};
 const L=c=>.2126*lin(c[0])+.7152*lin(c[1])+.0722*lin(c[2]);const ratio=(a,b)=>(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
 const bgOf=el=>{let e=el,layers=[];while(e){const c=parse(getComputedStyle(e).backgroundColor);if(c&&c[3]>0){layers.push(c);if(c[3]>=1)break;}e=e.parentElement;}let base=[255,255,255];for(const c of layers.reverse())base=[0,1,2].map(i=>c[i]*c[3]+base[i]*(1-c[3]));return base;};
 const out=[];
 for(const el of document.querySelectorAll('input,select,textarea,button')){const cs=getComputedStyle(el);if(cs.display==='none')continue;const r=el.getBoundingClientRect();if(!r.width)continue;
  const bg=bgOf(el),item={tag:el.tagName,type:el.type,label:(el.getAttribute('aria-label')||el.textContent||el.placeholder||'').trim().slice(0,24),dis:el.disabled,border:cs.borderTopStyle+' '+cs.borderTopWidth+' '+cs.borderTopColor,color:cs.color,bg:bg.map(Math.round).join(',')};
  const page_bg=bgOf(el.parentElement);
  const fg=parse(cs.color);if(fg)item.textRatio=+ratio(L(fg),L(bg)).toFixed(2);
  const bc=parse(cs.borderTopColor);if(bc&&cs.borderTopStyle!=='none'&&parseFloat(cs.borderTopWidth)>0)item.borderRatioVsParent=+ratio(L(bc),L(page_bg)).toFixed(2);
  if(el.placeholder){const ph=parse(getComputedStyle(el,'::placeholder').color);item.placeholder=getComputedStyle(el,'::placeholder').color;if(ph)item.placeholderRatio=+ratio(L(ph),L(bg)).toFixed(2);}
  if(el.type==='range')item.accent=cs.accentColor;
  out.push(item);}
 for(const a of document.querySelectorAll('a')){const cs=getComputedStyle(a);const bg=bgOf(a),fg=parse(cs.color);out.push({tag:'A',label:a.textContent.trim().slice(0,24),color:cs.color,deco:cs.textDecorationLine,textRatio:fg?+ratio(L(fg),L(bg)).toFixed(2):null});}
 return out;};
const all={};
try{
 for(const [n,h] of [['home','#/'],['accedi','#/accedi'],['registrati','#/registrati'],['regole','#/regole']]){await page.goto(`${URL_}${h}`);await page.waitForTimeout(400);all[n]=await page.evaluate(fn);}
 await login(page);all.hub=await page.evaluate(fn);
 await page.getByTestId('tab-collection').click();await page.waitForTimeout(400);all.collezione=await page.evaluate(fn);
 const nd=page.getByRole('button',{name:/Nuovo mazzo/i});if(await nd.count()){await nd.first().click();await page.waitForTimeout(400);all.editor=await page.evaluate(fn);}
 await saveJson('controls',all);
 for(const [k,v] of Object.entries(all))for(const it of v){const flags=[];if(it.placeholderRatio&&it.placeholderRatio<4.5)flags.push('PLACEHOLDER');if(it.textRatio&&it.textRatio<4.5&&!it.dis)flags.push('TEXT');if(it.borderRatioVsParent&&it.borderRatioVsParent<3)flags.push('BORDER');if(it.dis)flags.push('disabled');if(flags.length)console.log(k,it.tag,it.type||'',JSON.stringify(it.label),flags.join('+'),'text',it.textRatio,'border',it.borderRatioVsParent,'ph',it.placeholderRatio);}
}catch(e){console.error('ERR',e);}
finally{clearTimeout(timer);await browser.close();await stopServer();process.exit(0);}
