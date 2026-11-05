# C4-5b — Censimento di tinte e caratteri

5 novembre 2026, sorgenti dopo la sola riformattazione (`11bc95e`). Nessun token applicato. [Dati con ogni occorrenza](censimento.json). Conteggio lessicale per dichiarazione: anche i colori nelle ombre e le varianti alfa sono distinti; le ripetizioni in una dichiarazione si contano. Non conta quanti elementi DOM o pixel usano una tinta. `transparent` e `currentColor` sono esplicitati.

## Tinte in style.css

| Valore | Occorrenze | Dove (selettore, proprietà, riga) |
|---|---:|---|
| `#742e33` | 17 | `.status-tip.bad` border-color [164](../../../../client-web/src/style.css#L164); `.sheet h1` color [382](../../../../client-web/src/style.css#L382); `.problem` color [412](../../../../client-web/src/style.css#L412); `.outcome` border [480](../../../../client-web/src/style.css#L480); `.outcome h2` color [489](../../../../client-web/src/style.css#L489); `.report h3` color [517](../../../../client-web/src/style.css#L517); `.presence h2` color [708](../../../../client-web/src/style.css#L708); `.collection h3` color [835](../../../../client-web/src/style.css#L835); `.decks .confirm span` color [1041](../../../../client-web/src/style.css#L1041); `.missing` color [1063](../../../../client-web/src/style.css#L1063); `.sheet.public h2` color [1157](../../../../client-web/src/style.css#L1157); `.field-error` color [1206](../../../../client-web/src/style.css#L1206); `.sheet input[aria-invalid=true]` border-color [1210](../../../../client-web/src/style.css#L1210); `.rules-text h1` color [1234](../../../../client-web/src/style.css#L1234); `.rules-text h2` color [1239](../../../../client-web/src/style.css#L1239); `.admin h2` color [1327](../../../../client-web/src/style.css#L1327); `.admin-log .confirm span` color [1349](../../../../client-web/src/style.css#L1349) |
| `#30231e` | 11 | `:root` color [3](../../../../client-web/src/style.css#L3); `button` color [22](../../../../client-web/src/style.css#L22); `.status-tip` color [149](../../../../client-web/src/style.css#L149); `dialog` color [190](../../../../client-web/src/style.css#L190); `.sheet input` color [403](../../../../client-web/src/style.css#L403); `button.info` border [629](../../../../client-web/src/style.css#L629); `.tab` color [677](../../../../client-web/src/style.css#L677); `.presence button.link` color [730](../../../../client-web/src/style.css#L730); `.dmg-pill` color [915](../../../../client-web/src/style.css#L915); `.coin` background [948](../../../../client-web/src/style.css#L948); `.gain` color [975](../../../../client-web/src/style.css#L975) |
| `#f6ecd8` | 9 | `.sheet input` background [402](../../../../client-web/src/style.css#L402); `.notice` background [417](../../../../client-web/src/style.css#L417); `.report .note` background [520](../../../../client-web/src/style.css#L520); `button.info` color [632](../../../../client-web/src/style.css#L632); `.tab` background [673](../../../../client-web/src/style.css#L673); `.cc` background [850](../../../../client-web/src/style.css#L850); `.decks li` background [1026](../../../../client-web/src/style.css#L1026); `.rules-text code` background [1256](../../../../client-web/src/style.css#L1256); `.admin-log` background [1335](../../../../client-web/src/style.css#L1335) |
| `#38616a` | 8 | `.notice` border-left [418](../../../../client-web/src/style.css#L418); `.report .note` border-left [521](../../../../client-web/src/style.css#L521); `button.info` background [630](../../../../client-web/src/style.css#L630); `.mode.on` outline [700](../../../../client-web/src/style.css#L700); `button.pick:hover .cc` border-color [1005](../../../../client-web/src/style.css#L1005); `button.pick.on .cc` border-color [1008](../../../../client-web/src/style.css#L1008); `button.pick.on .cc` outline [1010](../../../../client-web/src/style.css#L1010); `.pool .on,.deck-choice .on` outline [1107](../../../../client-web/src/style.css#L1107) |
| `#5a4232` | 7 | `.sheet .tagline,.sheet .small` color [388](../../../../client-web/src/style.css#L388); `.report .small` color [527](../../../../client-web/src/style.css#L527); `.server-text` color [556](../../../../client-web/src/style.css#L556); `.cc-text small` color [890](../../../../client-web/src/style.css#L890); `.decks small` color [1037](../../../../client-web/src/style.css#L1037); `.editor-head input[readonly]` color [1058](../../../../client-web/src/style.css#L1058); `.slot summary b` color [1083](../../../../client-web/src/style.css#L1083) |
| `#e8d7b4` | 6 | `button` background [21](../../../../client-web/src/style.css#L21); `.brand` color [91](../../../../client-web/src/style.css#L91); `.loading,.error` background [172](../../../../client-web/src/style.css#L172); `dialog` background [185](../../../../client-web/src/style.css#L185); `.sheet` background [369](../../../../client-web/src/style.css#L369); `.outcome` background [479](../../../../client-web/src/style.css#L479) |
| `#20160c88` | 5 | `.status-tip` box-shadow [152](../../../../client-web/src/style.css#L152); `.sheet` box-shadow [373](../../../../client-web/src/style.css#L373); `.outcome` box-shadow [483](../../../../client-web/src/style.css#L483); `button.info` box-shadow [634](../../../../client-web/src/style.css#L634); `.confirmation .mark` box-shadow [1428](../../../../client-web/src/style.css#L1428) |
| `#2c6262` | 5 | `.status-tip.good` border-color [167](../../../../client-web/src/style.css#L167); `.ffa-queue li.bot` color [787](../../../../client-web/src/style.css#L787); `.copies` color [898](../../../../client-web/src/style.css#L898); `.public button.link` color [1151](../../../../client-web/src/style.css#L1151); `.links a` color [1193](../../../../client-web/src/style.css#L1193) |
| `#b99772` | 5 | `.full-text` border-top [260](../../../../client-web/src/style.css#L260); `.server-text` border-top [554](../../../../client-web/src/style.css#L554); `.about` border-top [1181](../../../../client-web/src/style.css#L1181); `.rules-index` border-bottom [1221](../../../../client-web/src/style.css#L1221); `.rules-text th,.rules-text td` border [1274](../../../../client-web/src/style.css#L1274) |
| `#9b7652` | 5 | `.sheet input` border [400](../../../../client-web/src/style.css#L400); `.tabs` border-bottom [661](../../../../client-web/src/style.css#L661); `.tab` border [674](../../../../client-web/src/style.css#L674); `.slot` border [1067](../../../../client-web/src/style.css#L1067); `.admin` border-top [1317](../../../../client-web/src/style.css#L1317) |
| `#6eafaf` | 4 | `.hint.ask` border-color [126](../../../../client-web/src/style.css#L126); `.sheet input:focus-visible` outline [407](../../../../client-web/src/style.css#L407); `.links a:focus-visible` outline [1199](../../../../client-web/src/style.css#L1199); `.table-scroll:focus-visible` outline [1265](../../../../client-web/src/style.css#L1265) |
| `#9ec5bd` | 4 | `button.primary` background [422](../../../../client-web/src/style.css#L422); `.mode.on` background [699](../../../../client-web/src/style.css#L699); `.tab.on` background [825](../../../../client-web/src/style.css#L825); `.pool .on,.deck-choice .on` background [1106](../../../../client-web/src/style.css#L1106) |
| `#9b765288` | 4 | `.cc` border [851](../../../../client-web/src/style.css#L851); `.decks li` border [1027](../../../../client-web/src/style.css#L1027); `.admin-log` border [1336](../../../../client-web/src/style.css#L1336); `.open-games th,.open-games td` border [1363](../../../../client-web/src/style.css#L1363) |
| `#4d3628` | 3 | `button` border [19](../../../../client-web/src/style.css#L19); `.status-tip` border [150](../../../../client-web/src/style.css#L150); `.toast` border [453](../../../../client-web/src/style.css#L453) |
| `#fff6e2` | 3 | `.hint.ask` color [127](../../../../client-web/src/style.css#L127); `.coin` color [949](../../../../client-web/src/style.css#L949); `.confirmation button` color [1400](../../../../client-web/src/style.css#L1400) |
| `#f6efd9` | 3 | `.dmg-pill` background [913](../../../../client-web/src/style.css#L913); `.coin .disc` background [960](../../../../client-web/src/style.css#L960); `.gain` background [973](../../../../client-web/src/style.css#L973) |
| `#38271f` | 2 | `:root` background [4](../../../../client-web/src/style.css#L4); `.backdrop` background [362](../../../../client-web/src/style.css#L362) |
| `transparent` | 2 | `.semantic` background [66](../../../../client-web/src/style.css#L66); `.round-link` background [1465](../../../../client-web/src/style.css#L1465) |
| `#f1e3c7` | 2 | `.clock` color [107](../../../../client-web/src/style.css#L107); `.turn` color [437](../../../../client-web/src/style.css#L437) |
| `#20130e` | 2 | `.clock` text-shadow [108](../../../../client-web/src/style.css#L108); `.turn` text-shadow [438](../../../../client-web/src/style.css#L438) |
| `#6e4b34` | 2 | `dialog` border [186](../../../../client-web/src/style.css#L186); `.sheet` border [370](../../../../client-web/src/style.css#L370) |
| `#ffe7b0` | 2 | `.hint.sending,.hint.uncertain` color [441](../../../../client-web/src/style.css#L441); `.clock.away` color [506](../../../../client-web/src/style.css#L506) |
| `#efe0c2` | 2 | `.slot` background [1069](../../../../client-web/src/style.css#L1069); `.rules-text th` background [1279](../../../../client-web/src/style.css#L1279) |
| `#f6ecd8b3` | 2 | `.confirmation button+button` border-top [1404](../../../../client-web/src/style.css#L1404); `.confirmation button:disabled .mark` color [1420](../../../../client-web/src/style.css#L1420) |
| `#20160c66` | 1 | `button` box-shadow [24](../../../../client-web/src/style.css#L24) |
| `#f4e7cd` | 1 | `button:hover` background [27](../../../../client-web/src/style.css#L27) |
| `#8cdbdd` | 1 | `button:focus-visible` outline [30](../../../../client-web/src/style.css#L30) |
| `#c0ffff` | 1 | `.semantic:focus-visible` outline [81](../../../../client-web/src/style.css#L81) |
| `#7dbaba22` | 1 | `.semantic:focus-visible` background [82](../../../../client-web/src/style.css#L82) |
| `#2e1e14` | 1 | `.brand` text-shadow [93](../../../../client-web/src/style.css#L93) |
| `#1d140fd9` | 1 | `.hint` background [118](../../../../client-web/src/style.css#L118) |
| `#b18c60` | 1 | `.hint` border [119](../../../../client-web/src/style.css#L119) |
| `#f4e8d1` | 1 | `.hint` color [120](../../../../client-web/src/style.css#L120) |
| `#6eafaf00` | 1 | `@keyframes ask → 0%,100%` box-shadow [132](../../../../client-web/src/style.css#L132) |
| `#6eafafaa` | 1 | `@keyframes ask → 50%` box-shadow [135](../../../../client-web/src/style.css#L135) |
| `#6eafaf99` | 1 | `@media (prefers-reduced-motion:reduce) → .hint.ask` box-shadow [141](../../../../client-web/src/style.css#L141) |
| `#f1e4c4` | 1 | `.status-tip` background [148](../../../../client-web/src/style.css#L148) |
| `#0009` | 1 | `dialog` box-shadow [188](../../../../client-web/src/style.css#L188) |
| `#140c08a0` | 1 | `dialog::backdrop` background [193](../../../../client-web/src/style.css#L193) |
| `#30231e55` | 1 | `.large-card` box-shadow [223](../../../../client-web/src/style.css#L223) |
| `#38271ff5` | 1 | `@media (orientation:portrait) → .portrait` background [327](../../../../client-web/src/style.css#L327) |
| `#ead8b4` | 1 | `@media (orientation:portrait) → .portrait` color [328](../../../../client-web/src/style.css#L328) |
| `#e8d7b440` | 1 | `.sheet` box-shadow [373](../../../../client-web/src/style.css#L373) |
| `#140c08a8` | 1 | `.overlay` background [431](../../../../client-web/src/style.css#L431) |
| `#bfe6df` | 1 | `.hint.pending` color [444](../../../../client-web/src/style.css#L444) |
| `#e8d7b4f2` | 1 | `.toast` background [452](../../../../client-web/src/style.css#L452) |
| `#3e2e24` | 1 | `.report .facts li span` color [550](../../../../client-web/src/style.css#L550) |
| `#f3e8d5` | 1 | `.tools pre` background [582](../../../../client-web/src/style.css#L582) |
| `#4d7d86` | 1 | `button.info:hover` background [645](../../../../client-web/src/style.css#L645) |
| `#9b765255` | 1 | `.presence th,.presence td` border-bottom [718](../../../../client-web/src/style.css#L718) |
| `#8a6f58` | 1 | `.ffa-queue li.free` color [790](../../../../client-web/src/style.css#L790) |
| `#c9b48c` | 1 | `.cc .thumb` background [863](../../../../client-web/src/style.css#L863) |
| `#a3313d` | 1 | `.dmg-pill` border [914](../../../../client-web/src/style.css#L914) |
| `#4d6070` | 1 | `.dmg-pill[data-damage=CUT]` border-color [920](../../../../client-web/src/style.css#L920) |
| `#5f8a1f` | 1 | `.dmg-pill[data-damage=POISON]` border-color [923](../../../../client-web/src/style.css#L923) |
| `#cfe3dd` | 1 | `button.pick.on .cc` background [1009](../../../../client-web/src/style.css#L1009) |
| `#d9a3a0` | 1 | `button.danger` background [1045](../../../../client-web/src/style.css#L1045) |
| `#e3d3b2` | 1 | `.editor-head input[readonly]` background [1057](../../../../client-web/src/style.css#L1057) |
| `#1d140f26` | 1 | `.confirmation` background [1379](../../../../client-web/src/style.css#L1379) |
| `#2c62621f` | 1 | `.confirmation button` background [1399](../../../../client-web/src/style.css#L1399) |
| `#742e331f` | 1 | `.confirmation button+button` background [1403](../../../../client-web/src/style.css#L1403) |
| `#2c626240` | 1 | `.confirmation button:hover` background [1407](../../../../client-web/src/style.css#L1407) |
| `#742e3340` | 1 | `.confirmation button+button:hover` background [1410](../../../../client-web/src/style.css#L1410) |
| `#5d5247b3` | 1 | `.confirmation button:disabled .mark` background [1419](../../../../client-web/src/style.css#L1419) |
| `#2c6262e6` | 1 | `.confirmation .mark` background [1427](../../../../client-web/src/style.css#L1427) |
| `#742e33e6` | 1 | `.confirmation button+button .mark` background [1431](../../../../client-web/src/style.css#L1431) |
| `#f6ecd814` | 1 | `.round-link:hover` background [1468](../../../../client-web/src/style.css#L1468) |

## Caratteri in style.css

Ogni `font` e `font-family`, con il corpo presente nella dichiarazione: i corpi ereditati non sono nuove occorrenze. Le famiglie effettive sono **Arial** e **Impact**, più il ripiego esistente **Arial Narrow** e il ripiego generico `sans-serif`. D4 chiede Impact e Arial: la proposta rimuove Arial Narrow a favore di Arial, senza font nuovi. Questo cambio non è ancora applicato.

| Dichiarazione | Occorrenze | Dove |
|---|---:|---|
| `Arial,sans-serif` | 1 | `:root` r.2 |
| `700 15px Arial,sans-serif` | 1 | `button` r.15 |
| `Impact,'Arial Narrow',sans-serif` | 2 | `.brand` r.88; `dialog h2` r.202 |
| `16px Impact,'Arial Narrow',sans-serif` | 1 | `.status-tip strong` r.160 |
| `30px Impact,sans-serif` | 1 | `@media (orientation:portrait) → .portrait strong` r.335 |
| `normal 38px/0.95 Impact,'Arial Narrow',sans-serif` | 1 | `.sheet h1` r.380 |
| `16px Arial,sans-serif` | 1 | `.sheet input` r.398 |
| `20px Impact,'Arial Narrow',sans-serif` | 1 | `.turn` r.436 |
| `normal 44px/1 Impact,'Arial Narrow',sans-serif` | 1 | `.outcome h2` r.488 |
| `12px Arial,sans-serif` | 1 | `.tools pre` r.581 |
| `italic 700 17px/1 Arial,sans-serif` | 1 | `button.info` r.633 |
| `bold 14px Arial,sans-serif` | 3 | `.tab` r.671; `.presence button.link` r.729; `.public button.link` r.1150 |
| `normal 30px/1 Impact,'Arial Narrow',sans-serif` | 1 | `.rules-text h1` r.1233 |
| `13px Arial,sans-serif` | 1 | `.rules-text code` r.1255 |
| `22px Impact,'Arial Narrow',sans-serif` | 1 | `.admin h2` r.1325 |

## TSX

Scansionati: `client-web/src/collection.tsx`, `client-web/src/hub.tsx`, `client-web/src/main.tsx`, `client-web/src/profile.tsx`, `client-web/src/public.tsx`, `client-web/src/table.tsx`, `client-web/src/ui.tsx`. **Nessun colore esadecimale/rgb/hsl letterale né famiglia font inline.** I colori SVG generati non sono nuovi token CSS: `ui.tsx` converte in CSS le costanti condivise di risorsa/danno e `symbols.ts`, e usa le cornici di `frames.ts`. Queste dipendenze vanno conservate e ammesse esplicitamente nel futuro controllo sorgente; copiarle in una palette CSS romperebbe la fonte unica C4-3/C4-4. `currentColor` dei segni segue il testo.

| Punto | Uso |
|---|---|
| client-web/src/ui.tsx:5 | `import {frameSvg,type FrameKind} from './frames.ts';` |
| client-web/src/ui.tsx:6 | `import {MARK_LAYERS,SYMBOL_LAYERS,svgParts,symbolColors,type Layer,type MarkKind,type SymbolKind} from './symbols.ts';` |
| client-web/src/ui.tsx:18 | `<svg className="card-frame" viewBox={${-w/2-1} ${-h/2-1} ${w+2} ${h+2}} aria-hidden="true">{frameSvg(kind,w,h).map((p,i)=>React.createElement(p.tag,{key:i,...p.attrs}))}</svg>;` |
| client-web/src/ui.tsx:25 | `<SvgMark layers={SYMBOL_LAYERS[kind]} colors={colors??symbolColors(kind)} className={className} px={px}/>;` |
| client-web/src/ui.tsx:27 | `export const Mark=({kind,className}:{kind:MarkKind;className?:string})=><SvgMark layers={MARK_LAYERS[kind]} colors={{main:'currentColor'}} className={mark${className? ${className}:''}} px={20}/>;` |
| client-web/src/ui.tsx:29 | `export const DamageMark=({type}:{type:DamageType})=><SvgMark layers={SYMBOL_LAYERS[type]} colors={{main:hex(DAMAGE_COLOR[type]),accent:hex(DAMAGE_ACCENT[type])}} className="dmg-mark" data={{'data-damage':type}}/>;` |
| client-web/src/ui.tsx:40 | `return <span className="gains" data-testid="gains">{gains.map(g=><span key={g.resource} className="gain" role="img" aria-label={+${g.amount??'x'} ${resourceNames[g.resource].toLowerCase()}} style={{borderColor:hex(RES_COLOR[g.resource])}}>+{g.amount??'x'}<SymbolMark kind={g.resource} className="res-mark"/></span>)}</span>;` |

## Perimetro e metodo

PostCSS 8.5.32 analizza ogni dichiarazione, comprese media query e keyframe. L’elenco JSON conserva selettore completo, proprietà, valore e riga di ciascuna occorrenza. I TSX sono censiti sul sorgente (incluse chiamate ai colori generati). Nessuna scansione o modifica di tinte interne a `scene.ts`/Pixi; le costanti condivise sono riferite come eccezioni motivate, senza cambiare `readability.ts`, `symbols.ts` o `frames.ts`. File temporaneo del censimento in TEMP, fuori repository.

## Costanti condivise consumate dai TSX

Eccezioni grafiche già esistenti, non nuove tinte di produzione né token da fondere. Conteggio delle definizioni letterali (non del numero di primitive SVG generate); i richiami sono nelle righe TSX sopra. Nessuna tinta interna esclusiva della scena è censita.

| Colore | Definizioni | Nome e posizione |
|---|---:|---|
| `#a3313d` | 2 | `HIT` in `client-web/src/readability.ts` r.498; `HEALTH` in `client-web/src/readability.ts` r.500 |
| `#4d6070` | 1 | `CUT` in `client-web/src/readability.ts` r.498 |
| `#5f8a1f` | 1 | `POISON` in `client-web/src/readability.ts` r.498 |
| `#2f8189` | 1 | `ALERTNESS` in `client-web/src/readability.ts` r.500 |
| `#c0582c` | 1 | `VIOLENCE` in `client-web/src/readability.ts` r.500 |
| `#78962c` | 1 | `TOXICITY` in `client-web/src/readability.ts` r.500 |
| `#c98d1f` | 1 | `ALCOHOL` in `client-web/src/readability.ts` r.500 |
| `#742e33` | 2 | `DAMAGE` in `client-web/src/readability.ts` r.501; `WINE` in `client-web/src/frames.ts` r.20 |
| `#2c6262` | 2 | `DEFENSE` in `client-web/src/readability.ts` r.501; `PETROL` in `client-web/src/frames.ts` r.20 |
| `#4b6a2d` | 1 | `RESOURCES` in `client-web/src/readability.ts` r.501 |
| `#343f6b` | 1 | `COUNTER` in `client-web/src/readability.ts` r.501 |
| `#5c3a6a` | 1 | `DISRUPT` in `client-web/src/readability.ts` r.501 |
| `#86561b` | 2 | `ITEMS` in `client-web/src/readability.ts` r.501; `OCHRE` in `client-web/src/frames.ts` r.20 |
| `#5d5247` | 1 | `OTHER` in `client-web/src/readability.ts` r.501 |
| `#f2c84b` | 1 | `HIT` in `client-web/src/readability.ts` r.503 |
| `#bfe5f6` | 1 | `CUT` in `client-web/src/readability.ts` r.503 |
| `#b4e06a` | 1 | `POISON` in `client-web/src/readability.ts` r.503 |
| `#f3ead2` | 1 | `LIGHT` in `client-web/src/symbols.ts` r.24 |
| `#e8d7b4` | 1 | `FRAME_PAPER` in `client-web/src/frames.ts` r.17 |
| `#30231e` | 1 | `FRAME_INK` in `client-web/src/frames.ts` r.18 |
| `#8a8378` | 1 | `FRAME_GREY` in `client-web/src/frames.ts` r.19 |
| `#9b7652` | 1 | `LINE` in `client-web/src/frames.ts` r.20 |
| `#120c08` | 1 | `BLACK` in `client-web/src/frames.ts` r.20 |
| `#b4501f` | 1 | `RUST` in `client-web/src/frames.ts` r.20 |
| `#b88f3a` | 1 | `GOLD` in `client-web/src/frames.ts` r.20 |
