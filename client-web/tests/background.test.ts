import {test} from 'node:test';
import assert from 'node:assert/strict';
import {backgroundGeometry,placeBackground,type BackgroundSizes} from '../src/background.ts';
const sizes:BackgroundSizes={table:{w:2006,h:784},sottobicchiere:{w:937,h:630},negroni:{w:834,h:962},posacenere:{w:973,h:844}};
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
// Independently calculated from the H1 centres/heights in NOTA.md. Bounds are the owner's declared
// mode-S plate distortion, rounded upward; no former gameplay expectation is changed.
const cases=[
 {w:1366,h:768,s:.8167374390565953,max:.4386,points:[[208.3728813559322,679.8367346938776,133.94494000528164],[1280.5398803589233,245.87755102040816,233.58690757018627],[88.52442671984049,293.87755102040813,243.3877568388654]]},
 {w:844,h:390,s:.4574883415343342,max:.1824,points:[[128.74576271186442,345.2295918367347,75.02808801163081],[791.19740777667,124.85969387755102,130.8416656788196],[54.69591226321037,149.23469387755102,136.3315257772316]]},
 {w:750,h:292,s:.37316298784905966,max:.0039,points:[[114.40677966101694,258.4795918367347,61.198730007245786],[703.0782652043869,93.48469387755102,106.72461452483107],[48.60418743768694,111.73469387755102,111.20257037901978]]},
];
for(const c of cases)test(`C4-5a mode S: full plate, proportional centres, uniform props at ${c.w}x${c.h}`,()=>{
 const g=backgroundGeometry(c.w,c.h,sizes);near(g.scale,c.s);
 assert.deepEqual([g.table.x,g.table.y],[0,0]);near(sizes.table.w*g.table.sx,c.w);near(sizes.table.h*g.table.sy,c.h);
 assert.ok(Math.abs(g.deformation)<=c.max,`plate deformation ${g.deformation} > ${c.max}`);
 g.props.forEach((p,i)=>{const [x,y,h]=c.points[i];near(p.x,x);near(p.y,y);near(p.h,h);near(p.w/p.h,sizes[p.id].w/sizes[p.id].h);near(p.w/sizes[p.id].w,p.h/sizes[p.id].h);});
 const a=g.props[0].shadow;near(a.x,g.props[0].x);near(a.y-g.props[0].y,29.52*c.s);near(a.w,175.62*c.s);near(a.h,9.02*c.s);near(a.sigma,3*c.s);assert.equal(a.alpha,.18);
 for(const [i,w,h,dy] of [[1,198.36,22.88,122.98],[2,274.84,23.84,128.14]]){const a=g.props[i].shadow;near(a.w,w*c.s);near(a.h,h*c.s);near(a.y-g.props[i].y,dy*c.s);assert.equal(a.alpha,.23);}
});
test('C4-5a: consecutive renderer resizes use intrinsic sizes and absolute transforms, with no accumulation',()=>{
 // Mutable stand-ins for the same Pixi transform API used by scene.ts.
 function fake(){const n={x:7,y:9,sx:2,sy:3,position:{set(x:number,y:number){n.x=x;n.y=y;}},scale:{set(x:number,y=x){n.sx=x;n.sy=y;}}};return n;}
 const table=fake(),props={sottobicchiere:fake(),negroni:fake(),posacenere:fake()};
 for(const c of [...cases,...cases.toReversed(),cases[0],cases[1],cases[0]]){const g=backgroundGeometry(c.w,c.h,sizes);placeBackground(table,props,g);
  near(table.sx*sizes.table.w,c.w);near(table.sy*sizes.table.h,c.h);assert.deepEqual([table.x,table.y],[0,0]);
  g.props.forEach((p,i)=>{const n=props[p.id];near(n.x,c.points[i][0]);near(n.y,c.points[i][1]);near(n.sx,n.sy);near(n.sy*sizes[p.id].h,c.points[i][2]);});}
});
test('C4-5a: normalization reads intrinsic texture dimensions, not an assumed export resolution',()=>{
 const half=Object.fromEntries(Object.entries(sizes).map(([k,v])=>[k,{w:v.w/2,h:v.h/2}])) as BackgroundSizes;
 const a=backgroundGeometry(1366,768,sizes),b=backgroundGeometry(1366,768,half);
 a.props.forEach((p,i)=>{near(p.w,b.props[i].w);near(p.h,b.props[i].h);near(p.scale*2,b.props[i].scale);});near(a.table.sx*2,b.table.sx);
});
