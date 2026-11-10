// C4-11 d (O28, owner, 10 November 2026: «d non fa molto, ma non rompe niente quindi teniamolo»). index.html asks Safari for viewport-fit=cover,
// so on an iPhone in landscape the page reaches under the safe areas: the canvas (background) covers the whole screen, the table is laid out in
// the safe width (scene.ts, shiftLayout) and the shell keeps inside it (style.css, --safe-l and --safe-r). Elsewhere the insets are 0: nothing changes.
export type Insets={l:number;r:number};
const px=(v:unknown)=>{const n=typeof v==='number'?v:parseFloat(String(v??''));return Number.isFinite(n)&&n>0?n:0;};
/** Left and right safe-area insets in CSS px. Only iOS gives env(safe-area-inset-*); a verification may stand in for it with
 * `window.__bmSafe={l,r}` (set before the page loads), never stored. */
export function safeInsets():Insets{
 try{const fake=(globalThis as unknown as {__bmSafe?:{l?:unknown;r?:unknown}}).__bmSafe;if(fake)return {l:px(fake.l),r:px(fake.r)};}catch{}
 if(typeof document==='undefined'||!document.body)return {l:0,r:0};
 try{const probe=document.createElement('div');probe.style.cssText='position:fixed;visibility:hidden;pointer-events:none;padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)';
  document.body.appendChild(probe);const s=getComputedStyle(probe),out={l:px(s.paddingLeft),r:px(s.paddingRight)};probe.remove();return out;}catch{return {l:0,r:0};}}
/** The shell (menu, clock, hint, title) reads the same insets as the table. */
export function applySafeInsets(root:{style:{setProperty:(k:string,v:string)=>void}},i:Insets=safeInsets()){root.style.setProperty('--safe-l',`${i.l}px`);root.style.setProperty('--safe-r',`${i.r}px`);return i;}
