import {strict as assert} from 'node:assert';
// C4-5b/D8: CSS target size, independent of viewport clipping and sheet rotation.
// Called at the existing real-screen checkpoints; no selector or prior check replaced.
export async function checkTouchControls(page,screen){
 if(page.viewportSize()?.width!==844||page.viewportSize()?.height!==390||screen.includes('failure'))return null;
 const result=await page.evaluate(()=>{
  const root=document.querySelector('.overlay .sheet')??document.querySelector('dialog[open]')??document.querySelector('.sheet')??document.querySelector('main');
  if(!root)return {controls:[],exceptions:[],problems:[]};
  const controls=[],exceptions=[],problems=[];
  for(const e of root.querySelectorAll('button,a[href],input,select,summary,[role=button]')){
   const s=getComputedStyle(e),r=e.getBoundingClientRect();if(!r.width||!r.height||s.visibility==='hidden'||s.display==='none')continue;
   let width=e.offsetWidth,height=e.offsetHeight;
   // Existing C4-2 targets: the visible (i) and short line have an actual ::before area.
   if(e.matches('.info,.toast')){const p=getComputedStyle(e,'::before');width=Math.max(width,parseFloat(p.width)||0);height=Math.max(height,parseFloat(p.height)||0);}
   const c={selector:e.dataset.testid??e.dataset.hit??e.className,label:(e.getAttribute('aria-label')??e.textContent??'').trim().slice(0,100),width,height,disabled:!!e.disabled};
   if(e.matches('.semantic[data-hit^="status-"]')){exceptions.push({...c,reason:'D8: same full content in character inspection [data-testid=inspect-chip]; VerifyLayout exercises that route'});continue;}
   controls.push(c);if(width<44||height<44)problems.push(c);
  }return {controls,exceptions,problems};
 });result.screen=screen;return result;
}
export function requireTouchControls(result){if(result)assert.deepEqual(result.problems,[],`C4-5b touch targets: ${result.screen}`);}
