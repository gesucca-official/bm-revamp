"""C4-11 B1: mutations on copies of client-web/src, tests and index.html outside the repository (%TEMP%). Each mutation is one
exact text replacement (it must exist once); the chosen tests run with the client's Node 24; a mutation counts only if tests fail."""
import json, os, re, shutil, subprocess, sys, datetime
REPO = r'C:\_simone\claude\bm-revamp-on-laptop'
WEB = os.path.join(REPO, 'client-web')
NODE = os.path.join(REPO, '.tools', 'client-c0', 'node-v24.13.0-win-x64', 'node.exe')
ROOT = os.path.join(os.environ['TEMP'], 'bm-c4-11-mut')
TESTS = ['tests/space.test.ts', 'tests/sound.test.ts', 'tests/readability.test.ts', 'tests/own-items.test.ts']

M = [
 ('baseline', None, None, None),
 ('b1 off: no growth on large screens', 'src/readability.ts', "export const growth=(w:number,h:number,compact:boolean)=>compact?1:Math.max(1,GROW.damp*Math.min(h/GROW.height,w/GROW.width));", "export const growth=(w:number,h:number,compact:boolean)=>1;"),
 ('b1 not softened (prototype x1.35)', 'src/readability.ts', "export const GROW={height:800,width:800*16/9,damp:.9};", "export const GROW={height:800,width:800*16/9,damp:1};"),
 ('b1 height only (prototype formula)', 'src/readability.ts', "Math.max(1,GROW.damp*Math.min(h/GROW.height,w/GROW.width))", "Math.max(1,GROW.damp*h/GROW.height)"),
 ('b1 hand cap not grown', 'src/readability.ts', "const hw=compact?120:Math.min(214*big,h*.28)", "const hw=compact?120:Math.min(214,h*.28)"),
 ('a1 props not faded', 'src/readability.ts', "h<550?{props:LIGHT_FRAME.props,emptyDiscard:false}", "h<550?{props:1,emptyDiscard:false}"),
 ('a1 empty discard drawn again', 'src/scene.ts', "else if(tableFrame(this.height).emptyDiscard)empty(s);", "else empty(s);"),
 ('a1 title back on the compact table', 'src/style.css', "  .brand {\n    display: none;\n  }", "  .brand {\n    font-size: 19px;\n  }"),
 ('a2 off: cascade on the compact table', 'src/readability.ts', " if(!compact){L.played=cascade();return L;}", " if(compact||!compact){L.played=cascade();return L;}"),
 ('a2 pile ignores the summary strips (prototype)', 'src/readability.ts', "if(strips(P).every((c,i)=>c>=room[i])){L.played=P;break;}", "{L.played=P;break;}"),
 ('a2 no mark on the count', 'src/readability.ts', "voidBelow:moves.slice(0,top).some(m=>!!m.void)", "voidBelow:false"),
 ('a2 count counts every move, not the cards shown', 'src/readability.ts', "const n=Math.min(shown,moves.length);if(n<1)return null;", "const n=moves.length;if(shown<1)return null;"),
 ('a2 scene count always ink', 'src/scene.ts', "fill({color:p.voidBelow?WINE:INK})", "fill({color:INK})"),
 ('shadow as today (4x6, 60%, hard edge)', 'src/frames.ts', "export const CARD_SHADOW={color:0x160e09,dx:5,dy:7.5,alpha:.66,soft:3,steps:4,radius:5} as const;", "export const CARD_SHADOW={color:0x160e09,dx:4,dy:6,alpha:.6,soft:0,steps:1,radius:5} as const;"),
 ('shadow as c1 (halo in four directions)', 'src/frames.ts', "export const CARD_SHADOW={color:0x160e09,dx:5,dy:7.5,alpha:.66,soft:3,steps:4,radius:5} as const;", "export const CARD_SHADOW={color:0x160e09,dx:3,dy:5,alpha:.7,soft:24,steps:4,radius:5} as const;"),
 ('shadow not used by the scene', 'src/scene.ts', "for(const l of cardShadow(w,h))shadow.roundRect(l.x,l.y,l.w,l.h,l.r).fill({color:CARD_SHADOW.color,alpha:l.alpha});", "shadow.roundRect(-w/2+4,-h/2+6,w,h,5).fill({color:CARD_SHADOW.color,alpha:.6});"),
 ('d: table not moved into the safe width', 'src/scene.ts', "const L=sl||sr?shiftLayout(tableLayout(w-sl-sr,h,ids,me,counts),sl):tableLayout(w,h,ids,me,counts);", "const L=tableLayout(w,h,ids,me,counts);"),
 ('d: no viewport-fit=cover', 'index.html', 'content="width=device-width,initial-scale=1,viewport-fit=cover"', 'content="width=device-width,initial-scale=1"'),
 ('d: hint outside the safe area', 'src/style.css', "  left: calc(14px + var(--safe-l));", "  left: 14px;"),
 ('d: shift forgets the text of the move', 'src/readability.ts', "left=(l.inset??0)+(l.compact?10:14)", "left=(l.compact?10:14)"),
 ('v1 off: only the tip facing the card', 'src/readability.ts', "tips:Pt[]=[to0,...(avoid.length?", "tips:Pt[]=[to0,...(false?"),
 ('v1 other sides tried before the facing tip', 'src/readability.ts', "const B=t.box,tips:Pt[]=[to0,...(avoid.length?[{x:B.x-B.w/2-gap,y:B.y},{x:B.x+B.w/2+gap,y:B.y},{x:B.x,y:B.y-B.h/2-gap},{x:B.x,y:B.y+B.h/2+gap}].sort((p,q)=>Math.hypot(p.x-source.x,p.y-source.y)-Math.hypot(q.x-source.x,q.y-source.y)):[])];", "const B=t.box,tips:Pt[]=[...(avoid.length?[{x:B.x-B.w/2-gap,y:B.y},{x:B.x+B.w/2+gap,y:B.y},{x:B.x,y:B.y-B.h/2-gap},{x:B.x,y:B.y+B.h/2+gap}].sort((p,q)=>Math.hypot(p.x-source.x,p.y-source.y)-Math.hypot(q.x-source.x,q.y-source.y)):[]),to0];"),
 ('J2 off in the scene: interrupt stops everything', 'src/scene.ts', "if(sequence){this.sounds?.interruptRound();this.finish(reason,false);}", "if(sequence){this.sounds?.stopAll();this.finish(reason,false);}"),
 ('J2 off in sound: interruptRound stops everything', 'src/sound.ts', "interruptRound(){if(this.activeRound)this.seen.add(this.activeRound);this.activeRound=null;this.stopRound();}", "interruptRound(){if(this.activeRound)this.seen.add(this.activeRound);this.activeRound=null;this.stopAll();}"),
 ('J2 hits not consumed', 'src/sound.ts', "interruptRound(){if(this.activeRound)this.seen.add(this.activeRound);this.activeRound=null;this.stopRound();}", "interruptRound(){this.stopRound();}"),
 ('J2 end of an interrupted sequence stops everything', 'src/sound.ts', "reason==='skip'?'all':'round';", "'all';"),
]

def run(name, path, a, b):
    top = os.path.join(ROOT, re.sub(r'[^a-z0-9]+', '-', name.lower())[:48]); d = os.path.join(top, 'client-web')
    shutil.rmtree(top, ignore_errors=True)
    # Read-only documents the tests read next to client-web (rules, set, annex), copied so the copy needs nothing from the repository.
    for doc in ['docs/game-rules.md', 'docs/sets/base.md', 'docs/rules-catalog.json']:
        os.makedirs(os.path.dirname(os.path.join(top, doc)), exist_ok=True); shutil.copy(os.path.join(REPO, doc), os.path.join(top, doc))
    shutil.copytree(os.path.join(WEB, 'src'), os.path.join(d, 'src'))
    shutil.copytree(os.path.join(WEB, 'tests'), os.path.join(d, 'tests'))
    shutil.copy(os.path.join(WEB, 'index.html'), d)
    if path:
        f = os.path.join(d, path); s = open(f, encoding='utf-8').read()
        assert s.count(a) == 1, (name, s.count(a)); open(f, 'w', encoding='utf-8', newline='').write(s.replace(a, b))
    env = dict(os.environ, NODE_PATH=os.path.join(WEB, 'node_modules'))
    p = subprocess.run([NODE, '--experimental-strip-types', '--no-warnings', '--test', *TESTS], cwd=d, env=env, capture_output=True, text=True, encoding='utf-8')
    out = p.stdout + p.stderr
    num = lambda k: int(re.search(rf'^ℹ {k} (\d+)', out, re.M).group(1))
    failed = sorted(set(re.findall(r'^✖ (.+?) \(\d', out, re.M)) - {'failing tests:'})
    shutil.rmtree(top, ignore_errors=True)
    return {'mutation': name, 'file': path, 'tests': num('tests'), 'pass': num('pass'), 'fail': num('fail'), 'failed': failed}

rows = []
for m in M:
    r = run(*m); rows.append(r); print(f"{r['fail']:>3} failed / {r['tests']}  {r['mutation']}", flush=True)
json.dump({'date': datetime.date.today().isoformat(), 'where': 'copies of client-web/src, tests and index.html outside the repository (%TEMP%), node --test ' + ' '.join(TESTS), 'rows': rows}, open(sys.argv[1], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
