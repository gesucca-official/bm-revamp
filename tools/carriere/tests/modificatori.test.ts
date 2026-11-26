// CA-0e: il catalogo dei modificatori di incontro (docs/carriere/modificatori.md), la risoluzione dei nomi di [Modificatori: …], gli errori
// nuovi del formato 0.2 (F12) e i modificatori nei pacchetti (F13). Tutto in memoria, salvo il catalogo e le storie vere.
import test from 'node:test';
import assert from 'node:assert/strict';
import {carriera, cast, catalogo, mdCatalogo, mdPrincipale, mdProva} from './aiuto.ts';
import {converti} from '../src/converti.ts';
import {controllaGrafo} from '../src/grafo.ts';
import {controllaModificatori, leggiCatalogo, modificatoriUsati, PRIMITIVE, type Catalogo} from '../src/modificatori.ts';
import {improntaModificatori, serializza, costruisciPacchetto, type Pacchetto} from '../src/pacchetto.ts';
import {esaminaPacchetti, type Fonti} from '../src/pacchetti.ts';

const riga = (id: string, nome: string, primitiva: string, parametri: string, testo = 'Un testo.') =>
  `| \`${id}\` | ${nome} | ${testo} | ${primitiva} | \`${parametri}\` |`;
const mdCatalogoDi = (...righe: string[]) =>
  `# Catalogo di prova\n\nVersione **0.9 — 26 novembre 2026**.\n\n| Id | Nome | Testo | Primitiva | Parametri |\n|---|---|---|---|---|\n${righe.join('\n')}\n\n## Dopo\n`;
const leggi = (...righe: string[]) => leggiCatalogo(mdCatalogoDi(...righe), cast);
const errCatalogo = (...righe: string[]) => leggi(...righe).errori.join('\n');
const PESCA = riga('pesca-doppia', 'Pesca doppia', 'Pesca', 'chi: spazienzio; volte: 2');

/** La prova con dei modificatori dopo una partita: 1 è Mara contro Spazienzio (duello), 3 è Piera contro {alleato} (mara o spazienzio). */
const conModificatori = (partita: 1 | 3, nomi: string) => {
  const riga = partita === 1 ? '→ Partita 1: Mara (giocatore) contro Spazienzio\n' : '→ Partita 3: Piera (giocatore) contro {alleato}\n';
  assert.ok(mdProva.includes(riga));
  return mdProva.replace(riga, `${riga}\n[Modificatori: ${nomi}]\n`);
};
const statici = (md: string, cat: Catalogo) => controllaModificatori(carriera(md), cat);
const delGrafo = (md: string, cat: Catalogo) => controllaGrafo(carriera(md), undefined, cat).errori;

test('il catalogo vero ha i sei modificatori della principale, con le primitive di R08a e senza errori', () => {
  const r = leggiCatalogo(mdCatalogo, cast);
  assert.deepEqual(r.errori, []);
  assert.equal(r.catalogo.versione, '0.1');
  assert.deepEqual(Object.keys(r.catalogo.voci), ['ce-l-hanno-tutti-con-te', 'il-cane-difende-le-sue-cose', 'la-cantina-e-buia',
    'ha-letto-i-tuoi-messaggi', 'ha-comprato-il-mazzo', 'societa-apri-e-chiudi']);
  assert.deepEqual(PRIMITIVE, ['Vista', 'Pesca', 'Recupero', 'Bersagli', 'Protezione'], 'cinque primitive, senza Mazzo (DC5 (5))');
  const v = r.catalogo.voci;
  assert.deepEqual([v['societa-apri-e-chiudi'].primitiva, v['societa-apri-e-chiudi'].parametri], ['Recupero', {chi: ['sergio'], ogni: ['3']}], 'DC5 (3)');
  assert.deepEqual([v['la-cantina-e-buia'].primitiva, v['il-cane-difende-le-sue-cose'].primitiva], ['Vista', 'Protezione'], 'S1, lettura (a) (DC5 (2))');
});

test('la principale risolve ogni [Modificatori: …] nel catalogo e passa i controlli nuovi', () => {
  const c = carriera(mdPrincipale);
  assert.deepEqual(controllaModificatori(c, catalogo), []);
  assert.deepEqual(controllaGrafo(c, undefined, catalogo).errori, []);
  assert.equal(Object.keys(modificatoriUsati(c, catalogo)).length, 6);
});

test('righe del catalogo non valide: primitiva, parametri mancanti, in più, fuori dai limiti, posti sconosciuti, id', () => {
  assert.deepEqual(leggi(PESCA, riga('pesca-tripla', 'Pesca tripla', 'Pesca', 'chi: giocatore; volte: 3'),
    riga('ogni-due', 'Ogni due', 'Recupero', 'chi: computer; ogni: 2'), riga('ogni-cinque', 'Ogni cinque', 'Recupero', 'chi: sergio; ogni: 5')).errori, [], 'i limiti sono compresi');
  assert.match(errCatalogo(riga('mazzo-corto', 'Mazzo corto', 'Mazzo', 'chi: sergio; carte: 12')), /primitiva sconosciuta «Mazzo»/);
  assert.match(errCatalogo(riga('pesca', 'Pesca', 'Pesca', 'chi: sergio; volte: 4')), /volte fuori dai limiti \(da 2 a 3\)/);
  assert.match(errCatalogo(riga('pesca', 'Pesca', 'Pesca', 'chi: sergio; volte: 1')), /volte fuori dai limiti/);
  assert.match(errCatalogo(riga('ogni', 'Ogni', 'Recupero', 'chi: sergio; ogni: 6')), /ogni fuori dai limiti \(da 2 a 5\)/);
  assert.match(errCatalogo(riga('ogni', 'Ogni', 'Recupero', 'chi: sergio; ogni: 1')), /ogni fuori dai limiti/);
  assert.match(errCatalogo(riga('pesca', 'Pesca', 'Pesca', 'chi: sergio')), /manca il parametro volte/);
  assert.match(errCatalogo(riga('scudo', 'Scudo', 'Protezione', 'chi: piera; volte: 2')), /parametro volte in più per Protezione/);
  assert.match(errCatalogo(riga('scudo', 'Scudo', 'Protezione', 'chi: gigi')), /posto sconosciuto gigi/);
  assert.match(errCatalogo(riga('scudo', 'Scudo', 'Protezione', 'chi: piera, mara')), /chi vuole un posto solo/);
  assert.match(errCatalogo(riga('scudo-rotto', 'Scudo', 'Protezione', 'chi: piera')), /l'id scudo-rotto non è il nome ridotto \(scudo\)/);
  assert.match(errCatalogo(PESCA, PESCA), /id doppio pesca-doppia/);
  assert.match(errCatalogo(riga('occhio', 'Occhio', 'Vista', 'chi: sergio; di: sergio; cosa: mano')), /chi e di sono lo stesso posto/);
  assert.match(errCatalogo(riga('occhio', 'Occhio', 'Vista', 'chi: sergio; di: giocatore; cosa: tutto')), /cosa vale mano o tavolo/);
  assert.match(errCatalogo(riga('mira', 'Mira', 'Bersagli', 'chi: giocatore; verso: sergio')), /mai il giocatore/);
  assert.match(leggiCatalogo('# Vuoto\n\nVersione **0.1 — oggi**.\n', cast).errori.join('\n'), /manca la tabella/);
});

test('un nome di [Modificatori: …] che non è nel catalogo è un errore', () => {
  const cat = leggi(PESCA).catalogo;
  assert.deepEqual(statici(conModificatori(1, 'pesca doppia'), cat), [], 'il nome si riduce come ogni identificativo');
  assert.match(statici(conModificatori(1, 'pesca doppia, non esiste'), cat).join('\n'), /partita al nodo nodo-b: modificatore sconosciuto non-esiste/);
});

test('Bersagli in un duello è un errore, in tutti contro tutti no', () => {
  const cat = leggi(riga('tutti-su-di-te', 'Tutti su di te', 'Bersagli', 'chi: spazienzio; verso: giocatore')).catalogo;
  assert.match(statici(conModificatori(1, 'tutti su di te'), cat).join('\n'), /tutti-su-di-te è Bersagli, che vale solo in tutti contro tutti/);
  // La FFA di III3b della principale ha Bersagli e passa (prova sopra); qui la stessa riga su una FFA della principale.
  const md = mdPrincipale.replace('[Modificatori: ce l\'hanno tutti con te]', '[Modificatori: tutti su di te]');
  const ffa = leggi(riga('tutti-su-di-te', 'Tutti su di te', 'Bersagli', 'chi: computer; verso: giocatore')).catalogo;
  assert.deepEqual(controllaModificatori(carriera(md), {...ffa, voci: {...catalogo.voci, ...ffa.voci}}), []);
});

test('due modificatori sullo stesso punto per lo stesso posto sono un errore; «computer» comprende ogni avversario', () => {
  const cat = leggi(PESCA, riga('pesca-ancora', 'Pesca ancora', 'Pesca', 'chi: spazienzio; volte: 3'),
    riga('pesca-di-tutti', 'Pesca di tutti', 'Pesca', 'chi: computer; volte: 2'), riga('pesca-mia', 'Pesca mia', 'Pesca', 'chi: giocatore; volte: 2'),
    riga('torna', 'Torna', 'Recupero', 'chi: spazienzio; ogni: 3'),
    riga('occhio', 'Occhio', 'Vista', 'chi: spazienzio; di: giocatore; cosa: mano'), riga('buio', 'Buio', 'Vista', 'chi: giocatore; di: spazienzio; cosa: tavolo'),
    riga('buio-su-piera', 'Buio su Piera', 'Vista', 'chi: giocatore; di: piera; cosa: tavolo'),
    riga('occhio-di-tutti', 'Occhio di tutti', 'Vista', 'chi: computer; di: giocatore; cosa: mano')).catalogo;
  const err = (nomi: string) => statici(conModificatori(1, nomi), cat).join('\n');
  assert.match(err('pesca doppia, pesca ancora'), /pesca-doppia e pesca-ancora derogano allo stesso punto \(Pesca\)/);
  assert.match(err('pesca doppia, pesca doppia'), /derogano allo stesso punto/);
  assert.match(err('pesca di tutti, pesca doppia'), /pesca-di-tutti e pesca-doppia derogano allo stesso punto/);
  assert.match(err('occhio, occhio di tutti'), /occhio e occhio-di-tutti derogano allo stesso punto \(Vista\)/);
  assert.equal(err('pesca doppia, torna'), '', 'primitive diverse');
  assert.equal(err('pesca mia, pesca di tutti'), '', 'il giocatore non è un computer');
  assert.equal(err('occhio, buio'), '', 'Vista: coppie chi e di diverse');
  assert.equal(err('buio, buio su piera'), '', 'Vista: stesso chi, di diversi');
});

test('un avversario nominato da un modificatore che non siede al tavolo su qualche percorso è un errore', () => {
  const cat = leggi(riga('cuccia-di-mara', 'Cuccia di Mara', 'Protezione', 'chi: mara'), riga('cuccia-di-piera', 'Cuccia di Piera', 'Protezione', 'chi: piera'),
    riga('cuccia-di-tutti', 'Cuccia di tutti', 'Protezione', 'chi: computer'), riga('occhio', 'Occhio', 'Vista', 'chi: giocatore; di: spazienzio; cosa: tavolo')).catalogo;
  // Partita 3: Piera contro {alleato}, cioè Mara o Spazienzio a seconda della strada.
  assert.ok(delGrafo(conModificatori(3, 'cuccia di mara'), cat).includes('partita al nodo nodo-d: il modificatore cuccia-di-mara nomina mara, che non siede al tavolo come avversario su qualche percorso'));
  assert.ok(delGrafo(conModificatori(3, 'cuccia di piera'), cat).some(e => /nomina piera, che non siede al tavolo/.test(e)), 'chi gioca non è un avversario');
  assert.deepEqual(delGrafo(conModificatori(3, 'cuccia di tutti'), cat), [], '«computer» c\'è sempre');
  assert.ok(delGrafo(conModificatori(1, 'cuccia di piera'), cat).some(e => /nodo-b: il modificatore cuccia-di-piera nomina piera/.test(e)));
  assert.deepEqual(delGrafo(conModificatori(1, 'occhio'), cat), [], 'Spazienzio è l\'avversario di Mara');
  assert.deepEqual(controllaGrafo(carriera(conModificatori(3, 'cuccia di mara'))).errori, [], 'senza catalogo il grafo non guarda i modificatori');
});

test('il pacchetto porta i modificatori risolti e la loro impronta; cambiarne uno usato chiede di alzare la versione', () => {
  const md = conModificatori(1, 'pesca doppia');
  const cat1 = mdCatalogoDi(PESCA);
  const fonti = (catalogoMd: string, versione: number, committati: Record<string, string>, storia = md): Fonti =>
    ({manifest: {prova: {storia: 'prova.md', versione}}, cast, catalogo: catalogoMd, storia: () => storia,
      pacchetto: id => committati[id], pacchetti: () => Object.keys(committati)});
  const pacchetto = (catalogoMd: string, versione = 1, storia = md) =>
    costruisciPacchetto(storia, converti(storia, cast, 'prova.md').carriera, cast, versione, leggiCatalogo(catalogoMd, cast).catalogo);
  const p = pacchetto(cat1);
  assert.deepEqual(Object.keys(p.modificatori), ['pesca-doppia']);
  assert.deepEqual(p.modificatori['pesca-doppia'], {id: 'pesca-doppia', nome: 'Pesca doppia', testo: 'Un testo.', primitiva: 'Pesca', parametri: {chi: ['spazienzio'], volte: ['2']}});
  assert.equal(p.impronte.modificatori, improntaModificatori(p.modificatori));
  assert.notEqual(p.impronte.modificatori, improntaModificatori({}));
  const committati = {prova: serializza(p)};
  assert.deepEqual(esaminaPacchetti(fonti(cat1, 1, committati)).errori, []);

  // Il testo del modificatore usato cambia: senza alzare la versione è un errore, alzandola no.
  const cat2 = mdCatalogoDi(riga('pesca-doppia', 'Pesca doppia', 'Pesca', 'chi: spazienzio; volte: 2', 'Un altro testo.'));
  assert.match(esaminaPacchetti(fonti(cat2, 1, committati)).errori.join('\n'), /prova: cambiato i modificatori che usa senza alzare la versione/);
  assert.deepEqual(esaminaPacchetti(fonti(cat2, 2, committati), false).errori, []);
  // Un modificatore che la carriera non usa: l'impronta non cambia.
  const cat3 = mdCatalogoDi(PESCA, riga('scudo', 'Scudo', 'Protezione', 'chi: piera'));
  assert.deepEqual(esaminaPacchetti(fonti(cat3, 1, committati)).errori, []);
  // Un catalogo non valido ferma tutto, senza scrivere niente.
  const rotto = esaminaPacchetti(fonti(mdCatalogoDi(riga('pesca-doppia', 'Pesca doppia', 'Pesca', 'chi: spazienzio; volte: 9')), 1, committati), false);
  assert.match(rotto.errori.join('\n'), /catalogo dei modificatori non valido, nessun pacchetto: .*volte fuori dai limiti/);
  assert.deepEqual(rotto.scritture, {});
  // Un nome sconosciuto ferma il pacchetto di quella carriera.
  assert.match(esaminaPacchetti(fonti(mdCatalogoDi(riga('scudo', 'Scudo', 'Protezione', 'chi: piera')), 1, committati)).errori.join('\n'), /modificatore sconosciuto pesca-doppia/);
});

test('un pacchetto della forma 1, senza impronta dei modificatori: si rigenera, e la versione si alza solo se la carriera ne usa', () => {
  const vecchio = (p: Pacchetto) => {
    const v = JSON.parse(serializza(p)) as Record<string, unknown> & {impronte: Record<string, string>};
    delete v.modificatori; delete v.impronte.modificatori; v.pacchetto = 1;
    return {prova: JSON.stringify(v, null, 1) + '\n'};
  };
  const fonti = (storia: string, committati: Record<string, string>): Fonti =>
    ({manifest: {prova: {storia: 'prova.md', versione: 1}}, cast, catalogo: mdCatalogo, storia: () => storia,
      pacchetto: id => committati[id], pacchetti: () => Object.keys(committati)});
  const pacchetto = (storia: string, cat = catalogo) => costruisciPacchetto(storia, converti(storia, cast, 'prova.md').carriera, cast, 1, cat);
  assert.deepEqual(esaminaPacchetti(fonti(mdProva, vecchio(pacchetto(mdProva)))).errori, ['prova: il pacchetto non è quello che si genera oggi, eseguire -Task Package']);
  // La stessa storia con un modificatore (il catalogo vero, con Spazienzio al posto di Sergio): il pacchetto vecchio non lo risolveva.
  const con = conModificatori(1, 'ha comprato il mazzo');
  const mdSpazienzio = mdCatalogo.replace('`chi: sergio; volte: 2`', '`chi: spazienzio; volte: 2`');
  const cat = leggiCatalogo(mdSpazienzio, cast);
  assert.deepEqual(cat.errori, []);
  const f = {...fonti(con, vecchio(pacchetto(con, cat.catalogo))), catalogo: mdSpazienzio};
  assert.deepEqual(esaminaPacchetti(f).errori, ['prova: cambiato i modificatori che usa senza alzare la versione (1): alzarla in carriere.json (F13)']);
});
