// C4-5a, owner decision of 4 November 2026: mode S of background/layers/NOTA.md.
// Reference centres and nominal heights are estimates from H1, not gameplay geometry.
export const BACKGROUND={w:2006,h:784} as const;
export const PROPS=[
 {id:'sottobicchiere',x:306,y:694,height:164,shadow:{w:175.62,h:9.02,dx:0,dy:29.52,alpha:.18,sigma:3}},
 {id:'negroni',x:1880.5,y:251,height:286,shadow:{w:198.36,h:22.88,dx:0,dy:122.98,alpha:.23,sigma:3}},
 {id:'posacenere',x:130,y:300,height:298,shadow:{w:274.84,h:23.84,dx:0,dy:128.14,alpha:.23,sigma:3}},
] as const;
export type PropId=typeof PROPS[number]['id'];
type Size={w:number;h:number};
export type BackgroundSizes={table:Size}&Record<PropId,Size>;
/** Pure, absolute geometry from intrinsic texture sizes: previous transforms never enter a resize. */
export function backgroundGeometry(w:number,h:number,sizes:BackgroundSizes){
 const sx=w/BACKGROUND.w,sy=h/BACKGROUND.h,s=Math.sqrt(sx*sy);
 return {table:{x:0,y:0,sx:w/sizes.table.w,sy:h/sizes.table.h,w,h},scale:s,deformation:sy/sx-1,
  props:PROPS.map(p=>{const texture=sizes[p.id],scale=p.height/texture.h*s;
   return {id:p.id,x:p.x*sx,y:p.y*sy,scale,w:texture.w*scale,h:texture.h*scale,
    shadow:{x:p.x*sx+p.shadow.dx*s,y:p.y*sy+p.shadow.dy*s,w:p.shadow.w*s,h:p.shadow.h*s,alpha:p.shadow.alpha,sigma:Math.max(.3,p.shadow.sigma*s)}};})};
}
// Small renderer adapter, shared with the consecutive-resize test. Always set absolute transforms.
type Node={position:{set:(x:number,y:number)=>unknown};scale:{set:(x:number,y?:number)=>unknown}};
export function placeBackground(table:Node,props:Record<PropId,Node>,g:ReturnType<typeof backgroundGeometry>){
 table.position.set(g.table.x,g.table.y);table.scale.set(g.table.sx,g.table.sy);
 for(const p of g.props){props[p.id].position.set(p.x,p.y);props[p.id].scale.set(p.scale,p.scale);}
}
