// CA-0a, Fase A: abbozzo del formato dei dati di una carriera (proposta in docs/design/carriere/prototipo-fase-a.md).
// Questi tipi sono lo schema leggibile; in Fase B diventano anche un controllo di validità con messaggi per percorso.
// Tutti i nomi sono in italiano come i documenti delle carriere; gli identificativi sono minuscoli con trattini.

/** Una carriera convertita: un grafo di nodi (le tappe della mappa) con achievement e sblocchi obbligatori. */
export type Carriera = {
  formato: 1;
  id: string;
  titolo: string;
  fonte: string;               // file markdown da cui viene
  inizio: string;              // id del primo nodo
  obbligatori: string[];       // sblocchi che ogni percorso fino a una fine «completata» deve dare
  nodi: Nodo[];
  achievement: Achievement[];
};

/** Un nodo è una tappa della mappa: una sequenza di passi senza rami, che finisce con un'uscita. */
export type Nodo = {
  id: string;
  etichetta: string;           // «Scena 1», «B»: come lo chiama l'autore
  titolo: string;              // come appare sulla mappa
  segreto?: true;              // non disegnato sulla mappa finché non lo si è visto in un giro
  condizione?: Condizione;     // per entrarci (oltre all'arco che ci porta)
  passi: Passo[];
  uscita: Uscita;
  riga: number;
};

/** Dove porta la fine di un nodo, un'opzione di una scelta o una sconfitta. */
export type Destinazione =
  | {nodo: string; da?: 'scelta'}  // da: 'scelta' rientra nel nodo saltando fino alla sua scelta (ritorno alla scelta)
  | {fine: Esito};

export type Esito = 'completata' | 'fallita';

/** Uscita dal nodo dopo l'ultimo passo. Se l'ultimo passo è una scelta con destinazioni, l'uscita è 'scelta'. */
export type Uscita = {verso: Destinazione} | {scelta: true};

export type Passo =
  | Battuta
  | {tipo: 'narrazione'; testo: string; se?: Condizione; riga: number}
  | {tipo: 'messaggio'; da?: string; testo: string; se?: Condizione; riga: number}
  | {tipo: 'regia'; nota: string; riga: number}                       // testo libero dell'autore: non si legge, non fa nulla
  | {tipo: 'sfondo'; sfondo: string; variante?: string; riga: number}
  | {tipo: 'sprite'; sprite: string; posa?: string; azione: 'entra' | 'esce' | 'posa'; riga: number}
  | {tipo: 'effetto'; effetto: 'scossa' | 'sfarfallio'; variante?: string; riga: number}
  | {tipo: 'suono'; suono: string; riga: number}                      // fuori dal prototipo: tenuto per CA-0
  | {tipo: 'segno'; segno: string; valore: string; riga: number}
  | {tipo: 'sblocco'; sblocco: string; riga: number}
  | {tipo: 'achievement'; achievement: string; riga: number}
  | Partita
  | Scelta;

export type Battuta = {
  tipo: 'battuta';
  chi: string;                 // id del personaggio o della figura in ombra (cast.json)
  nome?: string;               // nome mostrato, se l'autore usa un alias («Un amico»)
  espressione?: string;        // assente per le figure in ombra
  fuoriCampo?: true;           // nome senza ritratto
  testo: string;               // con {giocatore} ancora da sostituire
  se?: Condizione;
  stacchi?: {chi: string; espressione: string}[];  // la battuta arriva a pezzi, con stacchi su chi ascolta
  interrotta?: true;           // la battuta dopo entra prima che questa finisca
  riga: number;
};

/** Al posto della partita, nel prototipo: «vinci» e «perdi». Dopo la vittoria i passi del nodo continuano. */
export type Partita = {
  tipo: 'partita';
  id: string;                  // «partita-1»
  modo: 'duello' | 'ffa';
  giocatore: Rif;              // chi prende le parti del giocatore (D14)
  avversari: Rif[] | {altriFra: string[]};  // {altriFra}: tutti al tavolo tranne il giocatore
  modificatori?: string[];     // modificatori di incontro dichiarati (nel prototipo solo mostrati)
  ritento?: Battuta[];         // battute prima di ritentare, sempre saltabili
  sconfitta?: Destinazione;    // assente: si ritenta; presente: la sconfitta apre un ramo
  riga: number;
};

/** Un personaggio fisso o quello scritto in un segno (per esempio il personaggio scelto). */
export type Rif = {personaggio: string} | {segno: string};

export type Scelta = {
  tipo: 'scelta';
  modo: 'muta' | 'messaggio';  // muta: con chi andare (D14, D16); messaggio: risposta scritta sul telefono
  domanda?: string;
  opzioni: Opzione[];          // o tutte con destinazione (la scelta chiude il nodo) o nessuna (lascia solo segni)
  riga: number;
};

export type Opzione = {
  etichetta: string;
  chi?: string;                // per la scelta muta: il personaggio che si offre
  se?: Condizione;             // opzione visibile solo se...
  segni?: Record<string, string>;
  sblocchi?: string[];
  verso?: Destinazione;
};

/** Condizioni senza linguaggio di scripting: segni, nodi visti, esiti, più «e», «o» e «non». */
export type Condizione =
  | {segno: string; uguale?: string}   // senza uguale: il segno ha un valore qualsiasi
  | {visto: string}                    // in questo giro
  | {vinto: string}                    // partita vinta in questo giro (id del nodo)
  | {perso: string}                    // partita persa almeno una volta in questo giro
  | {esplorato: string}                // in un giro qualsiasi (dato dell'account)
  | {achievement: string}
  | {giri: number}                     // giri completati sull'account, almeno n
  | {non: Condizione}
  | {tutti: Condizione[]}
  | {uno: Condizione[]};

export type Achievement = {
  id: string;
  titolo: string;
  descrizione: string;
  nascosto?: true;             // «???» finché non arriva un indizio
  quando?: Condizione;         // altrimenti lo dà un passo [Achievement: …]
  indizi: {testo: string; se?: Condizione}[];  // progressivi: si mostra l'ultimo la cui condizione vale
};

/** Cast condiviso fra le carriere (dati/cast.json), scritto dalla regia: nomi, espressioni, velocità, asset. */
export type Cast = {
  radiceAsset: string;
  personaggi: Record<string, {nome: string; alias?: string[]; ombra?: true; espressioni?: string[];
    velocita?: number; ritratto?: string; sprite?: string}>;
  // insegna: la scritta che il client sovrappone (gli sfondi non hanno scritte), in frazioni dello sfondo; spenta nelle varianti elencate.
  sfondi: Record<string, {file: string; varianti?: Record<string, string>;
    insegna?: {testo: string; x: number; y: number; larghezza: number; spentaIn?: string[]}}>;
  // Dove il lettore posa lo sprite, in frazioni della scena: x del centro, y dei piedi, altezza (la specifica lascia la scala al client).
  sprite: Record<string, {pose: Record<string, string>; x: number; piedi: number; altezza: number}>;
};

export type Problema = {riga: number; livello: 'errore' | 'avviso'; messaggio: string};
