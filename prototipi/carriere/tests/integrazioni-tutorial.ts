// CA-0a, Fase A: le righe che la proposta aggiunge a docs/design/carriere/tutorial-dialoghi.md, applicate in memoria.
// Il file del proprietario non si tocca in Fase A: in Fase B, se approvate, le righe entrano nel file e questo elenco si cancella.
// Ogni «trova» deve comparire esattamente una volta, così un cambio del testo originale si nota subito.

export const INTEGRAZIONI: {trova: string; metti: string; perche: string}[] = [
  {perche: 'carriera e sblocchi obbligatori',
    trova: '## Scena 0 — Davanti al bar',
    metti: '[Carriera: tutorial; obbligatori: starter-mara, starter-spazienzio, carriera-principale]\n\n## Scena 0 — Davanti al bar'},
  {perche: 'insegna che sfarfalla, combriccola sulla porta',
    trova: 'la combriccola, in ombra, esita sulla porta.]',
    metti: 'la combriccola, in ombra, esita sulla porta.]\n\n[Sfarfallio: insegna-spenta] [Entra: combriccola davanti alla porta]'},
  {perche: 'arrivo di Mara',
    trova: '[Regia: frenata; Mara entra in bici e inchioda a un palmo dai piedi del giocatore.]',
    metti: '[Regia: frenata; Mara entra in bici e inchioda a un palmo dai piedi del giocatore.]\n\n[Suono: frenata] [Entra: bici-mara] [Scossa]'},
  {perche: 'la combriccola scappa',
    trova: '[Regia: la combriccola se la dà a gambe e lascia indietro il giocatore.]',
    metti: '[Regia: la combriccola se la dà a gambe e lascia indietro il giocatore.]\n\n[Esce: combriccola in fuga]'},
  {perche: 'il tavolino rovesciato',
    trova: 'Spazienzio rovescia un tavolino; lo schermo trema.]',
    metti: 'Spazienzio rovescia un tavolino; lo schermo trema.]\n\n[Scossa]'},
  {perche: 'starter di Mara alla vittoria della partita 1 (D18)',
    trova: '**Spazienzio** (fumante): ANCORA VOI? ANNICHILIAMOVI.',
    metti: '**Spazienzio** (fumante): ANCORA VOI? ANNICHILIAMOVI.\n\n[Sblocca: starter-mara]'},
  {perche: 'Grappino entra',
    trova: 'Piera si gira dal bancone, molto lentamente, con Grappino accanto.]',
    metti: 'Piera si gira dal bancone, molto lentamente, con Grappino accanto.]\n\n[Entra: grappino seduto]'},
  {perche: 'la regia delle frasi di Piera, scena 2',
    trova: 'Spazienzio interrompe prima che la frase finisca.]',
    metti: 'Spazienzio interrompe prima che la frase finisca.]\n\n[Stacchi: Mara neutra, Spazienzio quasi calmo] [Interrotta]'},
  {perche: 'Grappino ringhia',
    trova: '[Regia: ringhio; Grappino punta la caviglia del giocatore.]',
    metti: '[Regia: ringhio; Grappino punta la caviglia del giocatore.]\n\n[Sprite: grappino ringhia]'},
  {perche: 'starter di Spazienzio alla vittoria della partita 2 (D18)',
    trova: '**Piera** (brilla): Ancora te... che mi fai... venire sete...',
    metti: '**Piera** (brilla): Ancora te... che mi fai... venire sete...\n\n[Sblocca: starter-spazienzio]'},
  {perche: 'la regia delle frasi di Piera, scena 3',
    trova: '[Regia: stessa lentezza e stessi stacchi su chi ascolta. Mara interrompe.]',
    metti: '[Regia: stessa lentezza e stessi stacchi su chi ascolta. Mara interrompe.]\n\n[Stacchi: Mara neutra, Spazienzio quasi calmo] [Interrotta]'},
  {perche: 'il segno lasciato dalla scelta muta',
    trova: '→ Scelta muta: con Mara · con Spazienzio',
    metti: '→ Scelta muta: con Mara [Segno: tutorial_con = mara] · con Spazienzio [Segno: tutorial_con = spazienzio]'},
  {perche: 'la partita a tre col personaggio scelto',
    trova: '→ Partita 3: tutti contro tutti a tre, col personaggio scelto',
    metti: '→ Partita 3: {tutorial_con} (giocatore) contro gli altri fra Mara, Spazienzio e Piera'},
  {perche: 'Grappino russa',
    trova: '[Sfondo: S2 con il disordine. Regia: silenzio; Grappino russa.]',
    metti: '[Sfondo: S2 con il disordine. Regia: silenzio; Grappino russa.]\n\n[Sprite: grappino russa]'},
  {perche: 'Mara interrompe Piera',
    trova: '[Regia: Grappino abbaia. Mara interrompe.]',
    metti: '[Regia: Grappino abbaia. Mara interrompe.]\n\n[Interrotta]'},
  {perche: 'chi scrive sul telefono',
    trova: '[Regia: notifica sul telefono del giocatore, dalla combriccola.]',
    metti: '[Regia: notifica sul telefono del giocatore, dalla combriccola.]\n\n[Telefono: combriccola]'},
  {perche: 'destinazione della prima risposta',
    trova: '→ il giocatore raggiunge gli amici: **il tutorial finisce e fallisce**.',
    metti: '→ Epilogo del fallimento — il giocatore raggiunge gli amici: **il tutorial finisce e fallisce**.'},
  {perche: 'destinazione della seconda risposta e sblocco della principale',
    trova: '→ il giocatore resta nel bar: **il tutorial si completa** e si sblocca',
    metti: '→ Fine: completata [Sblocca: carriera-principale] — il giocatore resta nel bar: **il tutorial si completa** e si sblocca'},
  {perche: 'achievement nascosto dell\'epilogo (D19), ritorno alla scelta e definizione con gli indizi (testi segnaposto della regia)',
    trova: '## Note per la revisione',
    metti: '[Achievement: Amici del Dimmi Di Sì]\n\n→ Torna a: Scena 4, scelta\n\n## Achievement\n\n### Amici del Dimmi Di Sì\n\n[Nascosto]\n\n' +
      'Hai preferito un Virgin Cuba Libre a sedici euro.\n\n- Indizio: Certi amici scrivono sempre al momento sbagliato.\n' +
      '- Indizio, se esplorato Scena 4: E se alla combriccola rispondessi come vorrebbe lei?\n\n## Note per la revisione'},
];

export function applicaIntegrazioni(md: string): string {
  for (const {trova, metti} of INTEGRAZIONI) {
    const n = md.split(trova).length - 1;
    if (n !== 1) throw new Error(`integrazione: «${trova}» compare ${n} volte invece di una`);
    md = md.replace(trova, () => metti);
  }
  return md;
}
