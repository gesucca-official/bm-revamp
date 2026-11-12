// CA-0a, Fase K: il filo che non resta sospeso e i nodi affrontabili che si leggono, provati su molte partite giocate a caso con il motore.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {caso, catenaria, componi, type Composizione} from '../src/bacheca.ts';
import {entra, nuovoAccount, nuovoGiro, perdi, ritenta, salta, scegli, vinci, vista, type Stato} from '../src/motore.ts';
import {statiMappa} from '../src/mappa.ts';
import {filiDaRiprendere, filoPenzolante, scoperti, tempiFilo, TEMPI, TEMPI_FILO} from '../src/movimentiBacheca.ts';
import type {Carriera} from '../src/formato.ts';
import {prova, tutorial} from './aiuto.ts';

/** Una bacheca vista: lo stato, la composizione e il «sei qui» dell'apertura prima (da dove parte la puntina rossa). */
type Vista = {s: Stato; comp: Composizione; ultimo: string | null; prima: {ultimo: string | null; comp: Composizione} | null};

/** Gioca a caso tre giri per seme e restituisce ogni bacheca vista, come la vede il giocatore tornando alla mappa. */
function bachecheACaso(c: Carriera, semi = 40): Vista[] {
  const out: Vista[] = [];
  for (let k = 0; k < semi; k++) {
    const r = caso(`${c.id}:passeggiata:${k}`);
    let s = nuovoGiro(c, nuovoAccount());
    let prima: Vista['prima'] = null;
    for (let giro = 0; giro < 3; giro++) {
      for (let passi = 0; passi < 200; passi++) {
        const v = vista(c, s);
        if (v.tipo === 'fine') break;
        if (v.tipo === 'mappa') {
          const ultimo = s.giro.nodo ?? s.giro.visti.at(-1) ?? null;
          const comp = componi(c, s, ultimo, c.titolo);
          out.push({s, comp, ultimo, prima});
          prima = {ultimo, comp};
          const disponibili = comp.punti.filter(n => n.stato === 'disponibile' && n.tipo === 'nodo');
          if (!disponibili.length) break;
          s = entra(c, s, disponibili[Math.floor(r() * disponibili.length)].id).stato;
        } else if (v.tipo === 'scelta') s = scegli(c, s, v.opzioni[Math.floor(r() * v.opzioni.length)].indice).stato;
        else if (v.tipo === 'partita') s = (r() < 0.6 ? vinci : perdi)(c, s).stato;
        else if (v.tipo === 'ritento') s = ritenta(c, s).stato;
        else s = salta(c, s).stato;
      }
      s = nuovoGiro(c, s.account, s.giro);
    }
  }
  return out;
}

const carriere = [prova(), tutorial()].map(c => ({c, viste: bachecheACaso(c)}));
const viste = carriere.flatMap(x => x.viste);

test('le partite a caso arrivano dappertutto: tutti i nodi delle due carriere, il segreto compreso', () => {
  for (const {c, viste} of carriere) {
    const visti = new Set(viste.flatMap(v => v.s.account.esplorati));
    assert.deepEqual(c.nodi.map(n => n.id).filter(id => !visti.has(id)), [], c.id);
  }
});

test('i nodi affrontabili si leggono (Fase K): niente post-it, il «???» solo sui più lontani', () => {
  let affrontabiliMaiVisti = 0, lontani = 0;
  for (const {s, comp} of viste) {
    for (const n of comp.punti) {
      const noto = n.tipo === 'nodo' ? s.account.esplorati.includes(n.id) : s.account.finali.some(f => n.id.endsWith(f));
      if (n.stato === 'disponibile') { assert.equal(n.postit, false, `${n.id}: affrontabile, con il nome`); if (!noto) affrontabiliMaiVisti++; }
      else if (n.stato === 'corrente') assert.equal(n.postit, false);
      else { assert.equal(n.postit, !noto, `${n.id} (${n.stato}): il post-it solo se non lo si è mai visto`); if (!noto) lontani++; }
    }
  }
  assert.ok(affrontabiliMaiVisti > 20 && lontani > 20, `casi veri: ${affrontabiliMaiVisti} affrontabili mai visti, ${lontani} lontani`);
});

test('il post-it si stacca quando il nodo diventa affrontabile, non quando ci si arriva', () => {
  let staccati = 0;
  for (const {comp, prima} of viste) {
    if (!prima) continue;
    const via = scoperti(prima.comp.punti.filter(n => n.postit).map(n => n.id), comp.punti);
    for (const id of via) {
      const n = comp.punti.find(x => x.id === id)!;
      assert.ok(n.stato !== 'corrente' || prima.comp.punti.find(x => x.id === id)?.stato !== 'disponibile', `${id}: non quando ci si arriva`);
      staccati++;
    }
    // Chi è affrontabile adesso e prima aveva il post-it lo perde ora.
    for (const n of comp.punti.filter(x => x.stato === 'disponibile')) {
      if (prima.comp.punti.find(x => x.id === n.id)?.postit) assert.ok(via.includes(n.id), `${n.id}: il post-it si stacca adesso`);
    }
  }
  assert.ok(staccati > 20, `${staccati} post-it staccati`);
});

test('un segreto non trovato non si vede; quando è affrontabile si vede, con il nome, come gli altri', () => {
  let segretiAffrontabili = 0;
  for (const {c, viste} of carriere) for (const {s, comp} of viste) {
    const stati = statiMappa(c, s);
    for (const n of c.nodi.filter(x => x.segreto)) {
      const p = comp.punti.find(x => x.id === n.id);
      if (stati[n.id].stato === 'nascosto') assert.equal(p, undefined, 'nascosto: niente, nemmeno il post-it');
      if (p?.stato === 'disponibile') { assert.equal(p.postit, false); segretiAffrontabili++; }
    }
    for (const f of comp.fili) assert.ok(comp.punti.some(p => p.id === f.da) && comp.punti.some(p => p.id === f.a), 'nessun filo verso un nodo che non si vede');
  }
  assert.ok(segretiAffrontabili > 0, 'il vicolo affrontabile capita');
});

test('nessun filo legato al nulla: ogni capo ha la sua puntina, e quando la si toglie la cordicella si riprende', () => {
  let riprese = 0;
  for (const {comp, ultimo, prima} of viste) {
    // Ogni cordicella va da una puntina a un'altra: tutti i suoi capi sono punti disegnati, con il loro spillo.
    for (const f of comp.fili) for (const id of [f.da, f.a]) assert.ok(comp.punti.find(p => p.id === id)?.spillo, `${f.da}>${f.a}: ${id} ha la puntina`);
    if (!prima || !ultimo || !prima.ultimo || prima.ultimo === ultimo) continue;
    // La «sei qui» viaggia da prima.ultimo a ultimo: la puntina di ultimo si toglie. Ogni cordicella legata lì è nuova (la tira la rossa in
    // volo) o è fra quelle da riprendere; nessun'altra.
    const r = filiDaRiprendere(comp.fili, ultimo, prima.ultimo);
    for (const f of comp.fili.filter(x => x.da === ultimo || x.a === ultimo)) {
      const nuova = f.da === prima.ultimo && f.a === ultimo;
      const arrotolataAltrove = f.tipo === 'arrotolata' && f.da !== ultimo;  // la spira sta attorno all'altra puntina
      assert.ok(nuova || arrotolataAltrove || r.some(x => x.filo === f), `${f.da}>${f.a}: si riprende`);
    }
    for (const x of r) {
      assert.ok(x.filo.da === ultimo || x.filo.a === ultimo);
      assert.ok(!(x.filo.da === prima.ultimo && x.filo.a === ultimo), 'la cordicella nuova la tira la rossa in volo: non cade');
      if (x.fisso) assert.notEqual(x.filo[x.fisso], ultimo, 'il capo fisso è l\'altro');
      else assert.ok(x.filo.tipo === 'arrotolata' && x.filo.da === ultimo, 'cade intera solo la spira attorno alla puntina tolta');
      riprese++;
    }
  }
  assert.ok(riprese > 10, `${riprese} cordicelle riprese`);
});

test('il capo libero: cade, penzola dall\'altro capo, la corda non si allunga, e torna alla puntina rossa', () => {
  const fisso = {x: 400, y: 300};
  const casi = [{x: 600, y: 270}, {x: 200, y: 260}, {x: 380, y: 520}, {x: 420, y: 80}];
  const tf = tempiFilo(TEMPI.viaggio), ripresa = tf.riprendi - tf.togli;
  const lunghezza = (q: {x: number; y: number}[]) => q.reduce((s, p, i) => (i ? s + Math.hypot(p.x - q[i - 1].x, p.y - q[i - 1].y) : 0), 0);
  for (const libero of casi) for (const tipo of ['tesa', 'lenta'] as const) {
    const cat = catenaria(fisso, libero, tipo);
    const l = lunghezza(cat.punti);
    assert.deepEqual(filoPenzolante(fisso, libero, tipo, -0.1, ripresa), cat, 'prima: la cordicella ferma');
    assert.deepEqual(filoPenzolante(fisso, libero, tipo, 0, ripresa), cat);
    const fine = filoPenzolante(fisso, libero, tipo, ripresa + TEMPI_FILO.ripresa + 0.01, ripresa);
    fine.punti.forEach((p, i) => { assert.ok(Math.abs(p.x - cat.punti[i].x) < 1e-6 && Math.abs(p.y - cat.punti[i].y) < 1e-6, 'dopo: di nuovo ferma, uguale'); });
    let prec = cat.punti.at(-1)!, lontano = 0, dilato = 0;
    const sotto = Math.abs(Math.atan2(libero.x - fisso.x, libero.y - fisso.y)) < 0.3;
    for (let t = 0.01; t < ripresa + TEMPI_FILO.ripresa; t += 0.01) {
      const q = filoPenzolante(fisso, libero, tipo, t, ripresa);
      const capo = q.punti.at(-1)!;
      assert.deepEqual(q.punti[0], fisso, 'il capo fisso non si muove');
      assert.ok(lunghezza(q.punti) <= l * 1.02 + 1, `${t.toFixed(2)}: la corda non si allunga`);
      assert.ok(Math.hypot(capo.x - prec.x, capo.y - prec.y) < 30, `${t.toFixed(2)}: senza salti`);
      prec = capo;
      // Penzola: a metà dell'attesa il capo libero è sotto il capo fisso e, se la puntina non era proprio sotto, lontano da dove era.
      if (t > 0.7 && t < ripresa) {
        assert.ok(capo.y > fisso.y + l * 0.3, `${t.toFixed(2)}: appeso sotto il capo fisso`);
        if (!sotto) assert.ok(Math.hypot(capo.x - libero.x, capo.y - libero.y) > 20, 'non legato al nulla dove era la puntina');
        lontano = Math.max(lontano, Math.hypot(capo.x - libero.x, capo.y - libero.y));
        dilato = Math.max(dilato, Math.abs(capo.x - fisso.x));
      }
    }
    // Se la puntina era proprio sotto il capo fisso, il capo libero ci penzola vicino: ma dondola, e si vede che non è legato.
    assert.ok(lontano > 25, `dondola (${lontano.toFixed(1)} px)`);
    if (sotto) assert.ok(dilato > 20, `la spinta della puntina tolta lo fa dondolare di lato (${dilato.toFixed(1)} px)`);
  }
});

test('i tempi del filo: la vecchia puntina si toglie prima che parta la rossa, i capi tornano su solo quando è arrivata', () => {
  for (const inizio of [TEMPI.viaggio, TEMPI.viaggio + TEMPI.staccoPostit - TEMPI.postit]) {
    const tf = tempiFilo(inizio);
    assert.ok(tf.togli + TEMPI_FILO.sfila <= inizio, 'tolta prima della partenza');
    assert.ok(tf.togli > 0.3, 'la bacheca si vede, poi si toglie');
    assert.equal(tf.riprendi, inizio + TEMPI.durataViaggio, 'ripresa all\'arrivo della rossa');
  }
});

test('un nodo raggiunto ma bloccato dalla sua condizione, mai visto, tiene il post-it: non è affrontabile', () => {
  const c = prova();
  c.nodi.find(n => n.id === 'nodo-b')!.condizione = {visto: 'nodo-h'};
  let s = nuovoGiro(c, nuovoAccount());
  s = entra(c, s, 'nodo-a').stato;
  while (vista(c, s).tipo !== 'scelta') s = salta(c, s).stato;
  s = scegli(c, s, 0).stato;
  const comp = componi(c, s, 'nodo-a', c.titolo);
  const b = comp.punti.find(n => n.id === 'nodo-b')!;
  assert.equal(b.stato, 'bloccato');
  assert.equal(b.postit, true);
});
