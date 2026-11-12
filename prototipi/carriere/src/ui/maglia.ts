// CA-0a, Fase E e F: il ritratto disegnato con WebGL. L'immagine è una griglia di triangoli con le coordinate di tessitura ferme; a ogni
// fotogramma si spostano i vertici (deforma, in ../animazione.ts) e la scheda grafica piega l'immagine senza cuciture. Senza punti di
// controllo la griglia resta ferma (il modo «movimento», dove si muove l'immagine intera con CSS). Fase F: due tessiture, il ritratto e
// la sua versione con la bocca nell'altra posizione, scambiate al ritmo del testo.
import {deforma, type Controlli} from '../animazione.ts';

const COLONNE = 14, RIGHE = 21;  // pochi vertici: abbastanza per piegare il collo senza spigoli

const VERTICE = `attribute vec2 dove; attribute vec2 tessitura; varying vec2 t;
void main() { t = tessitura; gl_Position = vec4(dove.x * 2.0 - 1.0, 1.0 - dove.y * 2.0, 0.0, 1.0); }`;
const FRAMMENTO = `precision mediump float; varying vec2 t; uniform sampler2D immagine;
void main() { gl_FragColor = texture2D(immagine, t); }`;

export type Sorgente = HTMLImageElement | HTMLCanvasElement;

export class Maglia {
  private gl: WebGLRenderingContext;
  private dove: WebGLBuffer;
  private posizioni = new Float32Array(COLONNE * RIGHE * 2);
  private quanti: number;
  private tessiture: [WebGLTexture | null, WebGLTexture | null] = [null, null];

  /** null se WebGL non c'è: il lettore resta all'immagine. Una per tela; le immagini si cambiano con `imposta`. */
  static crea(tela: HTMLCanvasElement): Maglia | null {
    const gl = tela.getContext('webgl', {premultipliedAlpha: true, alpha: true, antialias: true});
    return gl ? new Maglia(gl) : null;
  }

  private constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    const shader = (tipo: number, testo: string) => { const s = gl.createShader(tipo)!; gl.shaderSource(s, testo); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERTICE));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAMMENTO));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    // Coordinate di tessitura: la griglia regolare dell'immagine.
    const tess = new Float32Array(COLONNE * RIGHE * 2);
    for (let j = 0; j < RIGHE; j++) for (let i = 0; i < COLONNE; i++) { tess[(j * COLONNE + i) * 2] = i / (COLONNE - 1); tess[(j * COLONNE + i) * 2 + 1] = j / (RIGHE - 1); }
    const bTess = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, bTess); gl.bufferData(gl.ARRAY_BUFFER, tess, gl.STATIC_DRAW);
    const aTess = gl.getAttribLocation(prog, 'tessitura');
    gl.enableVertexAttribArray(aTess); gl.vertexAttribPointer(aTess, 2, gl.FLOAT, false, 0, 0);
    this.dove = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.dove); gl.bufferData(gl.ARRAY_BUFFER, this.posizioni, gl.DYNAMIC_DRAW);
    const aDove = gl.getAttribLocation(prog, 'dove');
    gl.enableVertexAttribArray(aDove); gl.vertexAttribPointer(aDove, 2, gl.FLOAT, false, 0, 0);
    const indici: number[] = [];
    for (let j = 0; j < RIGHE - 1; j++) for (let i = 0; i < COLONNE - 1; i++) {
      const a = j * COLONNE + i, b = a + 1, d = a + COLONNE, e = d + 1;
      indici.push(a, b, d, b, e, d);
    }
    this.quanti = indici.length;
    const bInd = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bInd); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indici), gl.STATIC_DRAW);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  }

  /** Le immagini da disegnare: il ritratto e, se c'è, la versione con la bocca nell'altra posizione. */
  imposta(base: Sorgente, bocca: Sorgente | null) {
    const gl = this.gl;
    for (const t of this.tessiture) if (t) gl.deleteTexture(t);
    const tessitura = (img: Sorgente) => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return tex;
    };
    this.tessiture = [tessitura(base), bocca ? tessitura(bocca) : null];
  }

  /** Disegna al tempo t: piegata se ci sono i punti di controllo, ferma se no; con la bocca nell'altra posizione se `altra`. */
  disegna(t: number, parlando: boolean, daParola: number | null, c: Controlli | null, altra: boolean) {
    const gl = this.gl;
    if (!this.tessiture[0]) return;
    for (let j = 0; j < RIGHE; j++) for (let i = 0; i < COLONNE; i++) {
      const u = i / (COLONNE - 1), v = j / (RIGHE - 1);
      const q = c ? deforma(u, v, t, parlando, daParola, c) : {u, v};
      this.posizioni[(j * COLONNE + i) * 2] = q.u; this.posizioni[(j * COLONNE + i) * 2 + 1] = q.v;
    }
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindTexture(gl.TEXTURE_2D, altra && this.tessiture[1] ? this.tessiture[1] : this.tessiture[0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.dove); gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.posizioni);
    gl.drawElements(gl.TRIANGLES, this.quanti, gl.UNSIGNED_SHORT, 0);
  }

  /** Libera il contesto (i browser ne tengono pochi aperti). */
  chiudi() { this.gl.getExtension('WEBGL_lose_context')?.loseContext(); }
}

const misure = (s: Sorgente) => s instanceof HTMLImageElement ? {w: s.naturalWidth, h: s.naturalHeight} : {w: s.width, h: s.height};

/**
 * La versione con la bocca da usare: il ritratto con, dentro un'ellisse sfumata attorno alla zona dove le due versioni differiscono,
 * il colore della versione «-bocca». Fuori dalla bocca resta sempre il ritratto approvato, anche se la seconda versione cambia altrove.
 * Fase G (prova del proprietario): la trasparenza è sempre quella del ritratto approvato (si disegna «sopra» le sue sole parti piene),
 * perché molte versioni «-bocca» hanno un velo scuro al posto del fondo trasparente. `zona` la trova il chiamante (zonaBocca, sulla
 * differenza delle due immagini).
 */
export function componiBocca(base: Sorgente, bocca: Sorgente, zona: {u: number; v: number; ru: number; rv: number}): HTMLCanvasElement {
  const {w, h} = misure(base);
  const tela = Object.assign(document.createElement('canvas'), {width: w, height: h});
  const g = tela.getContext('2d')!;
  // La maschera: un'ellisse piena al centro e sfumata sul bordo, riempita con la versione «-bocca».
  const maschera = Object.assign(document.createElement('canvas'), {width: w, height: h});
  const m = maschera.getContext('2d')!;
  m.translate(zona.u * w, zona.v * h);
  m.scale(zona.ru * w, zona.rv * h);
  const sfuma = m.createRadialGradient(0, 0, 0, 0, 0, 1);
  sfuma.addColorStop(0, 'rgba(0,0,0,1)'); sfuma.addColorStop(0.7, 'rgba(0,0,0,1)'); sfuma.addColorStop(1, 'rgba(0,0,0,0)');
  m.fillStyle = sfuma;
  m.beginPath(); m.arc(0, 0, 1, 0, Math.PI * 2); m.fill();
  m.setTransform(1, 0, 0, 1, 0, 0);
  m.globalCompositeOperation = 'source-in';
  m.drawImage(bocca, 0, 0, w, h);
  g.drawImage(base, 0, 0, w, h);
  g.globalCompositeOperation = 'source-atop';  // solo dove il ritratto approvato è pieno: la sua trasparenza resta
  g.drawImage(maschera, 0, 0);
  return tela;
}

/**
 * Un ritratto con la trasparenza presa da un altro dello stesso personaggio, con la stessa sagoma (il cast lo dice: «alfa»). Per le
 * espressioni consegnate con un velo scuro al posto del fondo trasparente (mara-esasperata), finché non si rifà lo scontorno.
 */
export function conAlfaDi(img: Sorgente, sagoma: Sorgente): HTMLCanvasElement {
  const {w, h} = misure(img);
  const tela = Object.assign(document.createElement('canvas'), {width: w, height: h});
  const g = tela.getContext('2d')!;
  g.drawImage(img, 0, 0, w, h);
  g.globalCompositeOperation = 'destination-in';
  g.drawImage(sagoma, 0, 0, w, h);
  return tela;
}

/**
 * La differenza fra due immagini su una griglia piccola (w×h), 0–255: serve a trovare dove cambia la bocca. Conta solo dentro la sagoma
 * del ritratto approvato e solo il colore: un fondo sporco nella seconda versione non deve allargare la zona della bocca.
 */
export function differenza(a: Sorgente, b: Sorgente, w = 128, h = 192): Uint8Array {
  const leggi = (img: Sorgente) => {
    const c = Object.assign(document.createElement('canvas'), {width: w, height: h});
    const g = c.getContext('2d', {willReadFrequently: true})!;
    g.drawImage(img, 0, 0, w, h);
    return g.getImageData(0, 0, w, h).data;
  };
  const da = leggi(a), db = leggi(b), out = new Uint8Array(w * h);
  for (let k = 0; k < w * h; k++) {
    if (da[k * 4 + 3] < 250) continue;
    out[k] = Math.max(Math.abs(da[k * 4] - db[k * 4]), Math.abs(da[k * 4 + 1] - db[k * 4 + 1]), Math.abs(da[k * 4 + 2] - db[k * 4 + 2]));
  }
  return out;
}
