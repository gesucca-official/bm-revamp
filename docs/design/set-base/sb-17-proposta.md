# SB-17 — Proposta per Sergio Sommerso (Fase A)

**Versione 0.1 — 16 novembre 2026.** Proposta di [SB-17](../../set-base-plan.md#sb-17-sb-18--personaggi-da-booster), passo con proposta ([D105](../../set-base-decisioni.md#decisioni-del-proprietario)). Riferimenti: bozza 1.6b ([bozza di riferimento](bozza-di-riferimento.md)), [regole d50](regole-playground.md) 1.1, [scheda](schede-personaggi.md#6-sergio-sommerso-cesira-la-malalingua--booster-concept-nuovo), righe `CES-*` della [griglia](griglia.md). Non è attuazione: nessuna misura e nessun codice. I numeri sono **stime dal listino** (1 A ≈ 0,6 HIT; unità ≈ 7 HIT), da misurare in Fase B.

## 1. In breve

- **Sergio non annuncia (Q11).** Niente coppia caricamento-colpo con ricerca: Sergio è quello che **punisce gli annunci** degli altri. Con le regole d50 la carta trovata e il gettone sono pubblici (RP-14, RP-18): la «lettura» di Sergio diventa un'informazione vera, non un tiro a indovinare.
- **Quattro carte cambiano**, due per le regole nuove e due per dare a Sergio un danno proprio; le altre reggono. Tre effetti nuovi richiedono Java e il lavoro dei bot.
- **Salute 90 → 75** (stima): la scheda era sulla scala di SB-9; gli starter della 1.6b stanno fra 70 e 80, e un personaggio di controllo con poco danno e tanta salute sfora i 12 turni di D95.
- Mazzo di prova da 20/2 con le sole generiche già nella bozza; Fase B entro **2.000 s**, al più 3 giri (Q5).

## 2. Le carte alla luce di d50 e della 1.6b

Che cosa cambia nelle regole per un personaggio di contromosse:

- **Annullare un caricamento** (priorità 2 contro 0–1: tutti tranne Slalom e Ti stringo la curva) toglie ricerca, premio e gettone, e la mossa pesca normalmente; ma i caricamenti sono in mano coperta: è una scommessa.
- **Annullare il colpo annunciato** è una lettura: carta mostrata e gettone dicono che cosa arriva. Oggi però il colpo annullato **soddisfa il gettone** (RP-15): chi ha caricato perde il colpo ma anche la vulnerabilità.
- **Gioca d'anticipo** vale anche se la mossa del bersaglio è annullata dopo (regola 4), non se è annullata la propria (5). Sorpasso di Mara (priorità 2, A 40) arriva prima di ogni contromossa di Sergio; Sgommata e Cinghiata (priorità 1) si annullano e perdono l'anticipo.
- **Rincara** conta anche le giocate annullate: annullare la last resort altrui la fa crescere comunque.
- **WhatchaDoin** esegue l'effetto della carta rubata con Sergio come autore: col gettone dell'avversario un Impatto rubato fa 34 × 1,5 = **51 HIT** per 15 A, e le carte che contano le risorse dell'autore (O-Ahio, Estasi, Rutto, Cinghiata, Lavoro fatto bene) le leggono su Sergio. Così non regge.
- **Stesso gruppo di velocità.** `getPendingMoveOfTargetIfMovesAfterPlayer` segue l'ordine della lista, non i gruppi di RP-1: a pari priorità e A dopo i costi l'annullamento riesce secondo l'ordine dei personaggi. Vale anche per FAI BASTA e Riflessi; non lo tocco (cambierebbe gli starter), lo dichiaro.

| Slot | Oggi (griglia) | Proposta 1.6b | Perché | Forma |
|---|---|---|---|---|
| PG-CES | H 90, A 30, V 10, cap. 2 | **H 75**, A 30, V 10, cap. 2 | scala degli starter; durata | dati |
| CES-BA | +5 A, poi consuma | invariata, «Lo metto in conto» | regge, come le basic degli starter | consume |
| CES-BO1 | +8 A | invariata, «Mi informo» | 4 unità, al tetto D36 | dati |
| CES-BO2 | 3 HIT | invariata, «Battutina» | al tetto D36 | dati |
| CES-BO3 | 2 HIT, priorità 2 | invariata, «Frecciatina al volo» | terza bound per la scelta D2 | dati |
| LR | LR-STR | invariata (Banzai, Rincara 5 (2)) | la scheda esclude una last resort propria | dati |
| CES-AR1 C ×2 | 5 A, pr. 2: −10 A, 4 HIT | invariata, «Oh, guarda là» | rende più lento l'avversario al turno dopo: le contromosse a pari priorità arrivano prima | dati |
| CES-AR2 NC ×2 | 15 A, pr. 2: annulla ed esegue l'effetto | **«Ricatto»**: 15 A, pr. 2. Annulla la mossa del bersaglio se arriva dopo. Se era un colpo, gli infliggi metà del suo danno base, dello stesso tipo | il cuore resta (rubare il colpo) senza i 51 HIT e senza le risorse lette su Sergio | Java nuova (piccola) |
| CES-AR3 NC ×2 | 10 A, pr. 2: annulla le mosse dirette a lei (Riflessi) | **«Lo sapevo»**: 10 A, pr. 2. Annulla la mossa del bersaglio se arriva dopo. Se annulli il colpo che ha annunciato, il suo gettone resta | era un doppione di Riflessi di Celestina; ora è la punizione dell'annuncio: deroga scritta sulla carta a RP-15 (R00) | Java nuova |
| CES-AR4 NC ×2 | 5 V + 5 A, pr. 2: 5 HIT, −5 A | **«Conto salato»**: 5 A, pr. 1. 8 HIT; se il bersaglio ha un gettone di vulnerabilità, 16 HIT | Sergio non ha un colpo: questo incassa la lettura (16 × 1,5 = 24 contro chi ha caricato) | Java nuova o condizione nuova nei dati |
| CES-AR5 C ×2 | 5 A, pr. 2: CUT ×0,5, HIT ×0,75 | **«Fare il vago»**: stessi fattori, **+5 A a sé** | nessuna parata pura (D52 (1)); più debole di Tra due paraurti | dati |
| CES-AR6 R ×1 | 10 A: −A pari a metà della propria A residua; 5 HIT | «Malelingue»: 10 A, pr. 1. Il bersaglio perde A pari a metà della tua A residua; HIT pari a **5 + metà della tua A residua** | com'era valeva quanto Oh, guarda là al doppio del costo; ora è il picco con A alta (A 30: −10 A e 15 HIT) | dati (`of`) |

Rarità come nella griglia (C 2 titoli, NC 3, R 1). Nessuna bound annulla o toglie A; nessuna last resort propria (scheda).

**Stime dal listino.** Ricatto contro un colpo da 25 col gettone: annulla circa 37 e ne infligge 19, per circa 9 HIT di costo; a vuoto nulla. Riuscito una volta su due vale circa una F2 (18–20); i bot sottostimano le contromosse (D33), il giro lo darà più debole del vero. Conto salato: 8 a vuoto, 24 sul gettone. Lo sapevo e poi Conto salato è la combinazione da guardare nella prova umana.

**Frustrazione (rischio della scheda).** Contromosse pagate (10–15 A), limitate alla mossa successiva, sprecate se l'avversario arriva prima o gioca su sé stesso. Chi ha caricato può non giocare subito il colpo e lasciare che Sergio annulli una parata.

## 3. Q11 — la coppia standard

**Proposta: Sergio non ha la coppia di D52 (3) né carte con «Annuncia».** Motivi: lo schema è identico nei cinque starter (consulto A3, A9) e D8 chiede di non consumare l'idea forte su tutti; chi punisce gli annunci dà una ragione in più per decidere quando caricare (A2: oggi la lettura va in una direzione sola); d50 rende già pubblico ciò che Sergio deve leggere.

**Revisione di D52 (3)** (testo proposto, D61 resta per gli starter): «Una coppia caricamento-colpo con ricerca per ogni personaggio degli starter (D61). I personaggi da booster possono averne una forma diversa o nessuna, purché abbiano una risposta propria al ritmo caricare-colpire-parare (D52 (2)).» Sergio la risolve con la punizione dell'annuncio; per Duccio si decide in SB-18.

**Cosa comporta.** Sergio non ha ricerche, quindi né ricerche fallite né gettoni propri: il suo prezzo è la lettura sbagliata. Le sue tre carte nuove sono «anti-starter» per costruzione: contro un mazzo senza caricamenti Lo sapevo e Conto salato valgono meno; è il triangolo voluto. Nella partita viva nulla cambia fino a SB-28.

## 4. Mazzo di prova (20 carte, 2 copie, D94)

Basic Lo metto in conto; bound **Mi informo** e **Battutina** (Frecciatina al volo resta nella collezione); last resort Banzai.

| Copie | Carta | Ruolo |
|---:|---|---|
| 2 | Oh, guarda là | toglie A, prepara la parità |
| 2 | Ricatto | contromossa che ruba |
| 2 | Lo sapevo | contromossa che punisce l'annuncio |
| 2 | Conto salato | incasso sul gettone |
| 2 | Fare il vago | difesa |
| 1 | Malelingue | picco raro |
| 2 | Spintone (GEN-18) | danno gratuito, mai morto |
| 2 | Sputo da posacenere (GEN-17) | 5 A: 12 POISON, aggira le parate |
| 1 | GABBIANO DUNQUE VOLIAMOTI (GEN-05) | spende la V 10 iniziale: 18 HIT, 27 sul gettone |
| 1 | Tartaruga sul marciapiede (GEN-13) | seconda difesa |
| 2 | Espresso del distributore (OGG-06) | +15 A, il carburante |
| 1 | Panino del kebab dimenticato (OGG-07) | cura |

11 d'archetipo, 6 generiche, 3 oggetti. **Scelta presa:** solo generiche già nella bozza, invece di quelle «di preferenza fuori dagli starter» della griglia (StunningBlow, Sgambetto, ShuffleFeet, Acqua in faccia, Santino), che non sono in `bozza.json` e due sono Java: aggiungerle allarga il pool (lavoro di SB-19) e confonde l'attribuzione del giro. Danno: circa 8 HIT a turno più i colpi annullati (stima), al limite dei 12 turni contro 70–80 di salute; per questo la salute 75.

## 5. Fase B

**Codice (solo playground, deroga dei due package più motore e bot).**

- Carte: `Ricatto` (riflesso con fattore sul danno base stampato, mai sulle risorse dell'autore), `Lo sapevo` (la mossa annullata non soddisfa il gettone), condizione «se il bersaglio ha un gettone» per Conto salato. Il resto è dati. Personaggio, carte e mazzo `prova-sergio` in `bozza.json`, starter invariati.
- `PrintedEffects`: un tipo per il riflesso e il segno «il gettone resta» sulle contromosse; la condizione sul danno. Senza testo stampato `ViewTable` non legge le carte Java (limite noto di SB-16i).
- Bot: `TurnForecast` e `ViewTable` conoscono `COUNTER_TARGET` e `COUNTER_ALL`, e gli stili premiano la contromossa quando l'avversario ha caricato (`StyleSupport.rhythm`); l'aggressivo la premia anche alla cieca, nessuno conosce il riflesso. Da aggiungere, con regola unica per stili e Normale: valore del riflesso (metà del danno nominale della carta mostrata, col gettone), Lo sapevo preferito contro una carta mostrata, danno condizionato di Conto salato, gettone che resta nella previsione.
- Client: testi dai campi `gui`; se il profilo `bozza` non offre il mazzo di prova, un passo piccolo a parte (da verificare all'inizio).

**Verifiche** ([tabella delle aree](../../aree-protette.md)): «Sempre»; passo 0 d'identità sulla 1.6b col codice nuovo; identità viva (motore e bot cambiano); `TestServerContext` e manifest; fedeltà di `TurnForecast` e `ViewTable` sui tre effetti; conformità (contromossa contro caricamento, colpo annunciato, anticipo, last resort; gettone che resta con e senza altre copie; a terra); 3–8 mutazioni.

**Giro.** Sergio contro i cinque starter e lo specchio: 6 incontri × 144 celle × 300 semi = **259.200 partite**, circa **340 s** (stima dai 854,7 s per 648.000 di SB-16i). Criteri: soglia D95 su ogni incontro con gli starter (35–65% sui bot euristici, patte ≤ 10%, ≤ 12 turni fuori dallo specchio); invarianti e bound a zero; le carte di Sergio né quasi sempre né quasi mai giocate; ricerca per mutazione (SB-7) del mazzo più forte non oltre il 70% contro ciascuno starter. Correzioni solo sulle carte di Sergio, con riserve scritte prima: troppo forte → Ricatto un terzo invece di metà, poi Lo sapevo 15 A; troppo debole → salute 85, poi Conto salato 20 sul gettone.

**Budget, fissato ora.** Passo 0 e fattibilità 150 s; giri al più 3 × 400 s; ricerca per mutazione 450 s; riserva 200 s: **2.000 s di orologio**, mai insieme ad altre misure.

## 6. Domande al proprietario

1. **Q11:** Sergio senza coppia e senza «Annuncia», con la revisione di D52 (3) della sezione 3?
2. **Ricatto:** metà del danno base del colpo rubato, invece dell'effetto intero di WhatchaDoin?
3. **Lo sapevo:** «se annulli il colpo annunciato, il gettone resta», come deroga scritta sulla carta? In alternativa resta una copia di Riflessi (Java esistente, nessuna punizione dell'annuncio).
4. **Mazzo di prova** con le sole generiche già nella bozza e **salute 75**?
5. **Fase B:** budget di 2.000 s con le riserve e i criteri della sezione 5; un eventuale passo del client per giocare il mazzo di prova a parte, dopo il giro?
