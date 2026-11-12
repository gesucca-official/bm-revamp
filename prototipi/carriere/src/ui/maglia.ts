// CA-0a, Fase E e F: il ritratto disegnato con WebGL. L'immagine è una griglia di triangoli con le coordinate di tessitura ferme; a ogni
// fotogramma si spostano i vertici (deforma, in ../animazione.ts) e la scheda grafica piega l'immagine senza cuciture. Senza punti di
// controllo la griglia resta ferma (il modo «movimento», dove si muove l'immagine intera con CSS). Fase F: due tessiture, il ritratto e
// la sua versione con la bocca nell'altra posizione, scambiate al ritmo del testo.
import {deforma, type Controlli} from '../animazione.ts';

const COLONNE = 14, RIGHE = 21;  // pochi vertici: abbastanza per piegare il collo senza spigoli

const VERTICE = `attribute vec2 dove; attribute vec2 tessitura; varying vec2 t;
void main() { t = tessitura; gl_Position = vec4(dove.x * 2.0 - 1.0, 1.0 - dove.y * 2.0, 0.0, 1.0); }`;
const FRAMMENTO = `precision mediump float; varying vec2 t; uniform sampler2D immagine; uniform float opacita;
void main() { gl_FragColor = texture2D(immagine, t) * opacita; }`;
/** Fase H: quanto dura il passaggio dissolto da un'espressione all'altra, in millisecondi (prima lo scambio era secco). */
export const DISSOLVENZA = 180;

export type Sorgente = HTMLImageElement | HTMLCanvasElement;

/** Un'immagine rimpicciolita all'altezza data (non la ingrandisce), con l'interpolazione migliore del browser. */
export function rimpicciolisci(img: Sorgente, altezza: number): Sorgente {
  const w0 = img instanceof HTMLImageElement ? img.naturalWidth : img.width, h0 = img instanceof HTMLImageElement ? img.naturalHeight : img.height;
  if (!altezza || altezza >= h0) return img;
  const c = Object.assign(document.createElement('canvas'), {width: Math.round(w0 * altezza / h0), height: Math.round(altezza)});
  const g = c.getContext('2d')!;
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
  g.drawImage(img, 0, 0, c.width, c.height);
  return c;
}

export class Maglia {
  private gl: WebGLRenderingContext;
  private dove: WebGLBuffer;
  private posizioni = new Float32Array(COLONNE * RIGHE * 2);
  private quanti: number;
  private tessiture: [WebGLTexture | null, WebGLTexture | null] = [null, null];
  private prima: [WebGLTexture | null, WebGLTexture | null] = [null, null];  // le tessiture di prima, durante la dissolvenza
  private cambio = -Infinity;
  private opacita: WebGLUniformLocation | null = null;
  private altezza: number;

  /** null se WebGL non c'è: il lettore resta all'immagine. Una per tela; le immagini si cambiano con `imposta`. */
  static crea(tela: HTMLCanvasElement): Maglia | null {
    const gl = tela.getContext('webgl', {premultipliedAlpha: true, alpha: true, antialias: true});
    return gl ? new Maglia(gl, tela.height) : null;
  }

  private constructor(gl: WebGLRenderingContext, altezza: number) {
    this.gl = gl;
    this.altezza = altezza;
    const shader = (tipo: number, testo: string) => { const s = gl.createShader(tipo)!; gl.shaderSource(s, testo); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERTICE));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAMMENTO));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    this.opacita = gl.getUniformLocation(prog, 'opacita');
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

  /**
   * Le immagini da disegnare: il ritratto e, se c'è, la versione con la bocca nell'altra posizione. Fase H: se c'erano già delle immagini,
   * per un attimo si disegnano tutte e due (dissolvenza), così il cambio di espressione non lampeggia; e le immagini si rimpiccioliscono
   * prima alla misura della tela, con un filtro buono: rimpicciolite dalla scheda grafica senza mipmap le linee sottili tremolavano.
   */
  imposta(base: Sorgente, bocca: Sorgente | null, ora = performance.now()) {
    const gl = this.gl;
    for (const t of this.prima) if (t) gl.deleteTexture(t);
    this.prima = this.tessiture[0] ? this.tessiture : [null, null];
    this.cambio = this.tessiture[0] ? ora : -Infinity;
    const tessitura = (img: Sorgente) => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rimpicciolisci(img, this.altezza));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return tex;
    };
    this.tessiture = [tessitura(base), bocca ? tessitura(bocca) : null];
  }

  /** Disegna al tempo t: piegata se ci sono i punti di controllo, ferma se no; con la bocca nell'altra posizione se `altra`. */
  disegna(t: number, parlando: boolean, daParola: number | null, c: Controlli | null, altra: boolean, ora = performance.now(), larga = false) {
    const gl = this.gl;
    if (!this.tessiture[0]) return;
    const f = Math.min(1, (ora - this.cambio) / DISSOLVENZA);
    for (let j = 0; j < RIGHE; j++) for (let i = 0; i < COLONNE; i++) {
      const u = i / (COLONNE - 1), v = j / (RIGHE - 1);
      const q = c ? deforma(u, v, t, parlando, daParola, c, larga) : {u, v};
      this.posizioni[(j * COLONNE + i) * 2] = q.u; this.posizioni[(j * COLONNE + i) * 2 + 1] = q.v;
    }
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.dove); gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.posizioni);
    // Durante la dissolvenza, sotto l'immagine di prima (con la bocca chiusa) e sopra la nuova che compare.
    if (f < 1 && this.prima[0]) {
      gl.uniform1f(this.opacita, 1);
      gl.bindTexture(gl.TEXTURE_2D, this.prima[0]);
      gl.drawElements(gl.TRIANGLES, this.quanti, gl.UNSIGNED_SHORT, 0);
    }
    gl.uniform1f(this.opacita, f < 1 && this.prima[0] ? f : 1);
    gl.bindTexture(gl.TEXTURE_2D, altra && this.tessiture[1] ? this.tessiture[1] : this.tessiture[0]);
    gl.drawElements(gl.TRIANGLES, this.quanti, gl.UNSIGNED_SHORT, 0);
  }

  /** Libera il contesto (i browser ne tengono pochi aperti). */
  chiudi() { this.gl.getExtension('WEBGL_lose_context')?.loseContext(); }
}

const misure = (s: Sorgente) => s instanceof HTMLImageElement ? {w: s.naturalWidth, h: s.naturalHeight} : {w: s.width, h: s.height};

/** I pixel di un'immagine, alla misura data (RGBA non premoltiplicato). */
function pixel(s: Sorgente, w: number, h: number): Uint8ClampedArray {
  const c = Object.assign(document.createElement('canvas'), {width: w, height: h});
  const g = c.getContext('2d', {willReadFrequently: true})!;
  g.drawImage(s, 0, 0, w, h);
  return g.getImageData(0, 0, w, h).data;
}
/** Un'immagine dai suoi pixel. */
function tela(dati: Uint8ClampedArray, w: number, h: number): HTMLCanvasElement {
  const c = Object.assign(document.createElement('canvas'), {width: w, height: h});
  c.getContext('2d')!.putImageData(new ImageData(dati as Uint8ClampedArray<ArrayBuffer>, w, h), 0, 0);
  return c;
}

/** Quanto pesa la versione «-bocca» in ogni pixel: l'ellisse sfumata della zona (piena fino al 70% del raggio). */
export function pesoEllisse(u: number, v: number, zona: {u: number; v: number; ru: number; rv: number}): number {
  const r = Math.sqrt(((u - zona.u) / zona.ru) ** 2 + ((v - zona.v) / zona.rv) ** 2);
  return r <= 0.7 ? 1 : r >= 1 ? 0 : (1 - r) / 0.3;
}

/** Erosione di una maschera 0/1 di `raggio` pixel (minimo su un quadrato), in due passate. */
export function erodi(m: Uint8Array, w: number, h: number, raggio: number): Uint8Array {
  const a = new Uint8Array(m.length), b = new Uint8Array(m.length);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let v = 1;
    for (let d = -raggio; d <= raggio && v; d++) { const xx = x + d; v = xx >= 0 && xx < w ? m[y * w + xx] : 0; }
    a[y * w + x] = v;
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let v = 1;
    for (let d = -raggio; d <= raggio && v; d++) { const yy = y + d; v = yy >= 0 && yy < h ? a[yy * w + x] : 0; }
    b[y * w + x] = v;
  }
  return b;
}

/**
 * La versione con la bocca da usare: il ritratto approvato con, dentro un'ellisse sfumata attorno alla zona dove le due versioni
 * differiscono, il colore della versione «-bocca». Fuori dalla bocca resta sempre il ritratto approvato.
 * Fase G: la trasparenza è sempre quella del ritratto approvato, perché molte versioni «-bocca» hanno un velo scuro al posto del fondo.
 * Fase H (banco della fluidità): il colore della versione «-bocca» si prende solo dove tutte e due le immagini sono piene, con due pixel di
 * margine dal bordo: sul bordo sfumato della sagoma il velo dava un pezzo di contorno scuro che compariva e spariva con la bocca.
 */
export function componiBocca(base: Sorgente, bocca: Sorgente, zona: {u: number; v: number; ru: number; rv: number}): HTMLCanvasElement {
  const {w, h} = misure(base);
  return tela(componiPixel(pixel(base, w, h), pixel(bocca, w, h), w, h, zona), w, h);
}
/** Il calcolo di componiBocca sui pixel (RGBA non premoltiplicato), senza tela: si prova da solo. */
export function componiPixel(a: Uint8ClampedArray, b: Uint8ClampedArray, w: number, h: number, zona: {u: number; v: number; ru: number; rv: number}): Uint8ClampedArray {
  const piena = new Uint8Array(w * h);
  for (let k = 0; k < w * h; k++) piena[k] = a[k * 4 + 3] >= 250 && b[k * 4 + 3] >= 250 ? 1 : 0;
  const dentro = erodi(piena, w, h, 2);
  const out = new Uint8ClampedArray(a);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const k = y * w + x;
    if (!dentro[k]) continue;
    const p = pesoEllisse(x / w, y / h, zona);
    if (p <= 0) continue;
    for (let c = 0; c < 3; c++) out[k * 4 + c] = a[k * 4 + c] + (b[k * 4 + c] - a[k * 4 + c]) * p;
  }
  return out;
}

/**
 * Un ritratto con la trasparenza presa da un altro dello stesso personaggio, con la stessa sagoma (il cast lo dice: «alfa»), per le
 * espressioni consegnate con un velo scuro al posto del fondo trasparente (mara-esasperata), finché non si rifà lo scontorno.
 * Fase H: dove l'immagine non è piena ed è quasi nera (il velo) ma il riferimento ha la figura (una ciocca, il bordo della spalla), il
 * colore viene dal riferimento: prima lì restavano pezzi di contorno nero.
 */
export function conAlfaDi(img: Sorgente, sagoma: Sorgente): HTMLCanvasElement {
  const {w, h} = misure(img);
  const a = pixel(img, w, h), r = pixel(sagoma, w, h), out = new Uint8ClampedArray(a.length);
  for (let k = 0; k < w * h; k++) {
    const al = a[k * 4 + 3], scuro = (a[k * 4] + a[k * 4 + 1] + a[k * 4 + 2]) / 3 < 40;
    const p = al >= 250 ? 1 : scuro ? 0 : al / 255;  // quanto del colore viene dall'immagine
    for (let c = 0; c < 3; c++) out[k * 4 + c] = a[k * 4 + c] * p + r[k * 4 + c] * (1 - p);
    out[k * 4 + 3] = r[k * 4 + 3];
  }
  return tela(out, w, h);
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

/**
 * Fase H, banco della fluidità: il controllo delle immagini che il lettore compone. `bordi`: pixel che la versione usata cambia dove il
 * ritratto approvato non è pieno (il contorno: lì un velo farebbe un bordo scuro); `fuori`: pixel cambiati fuori dalla zona della bocca;
 * `scuri`: pixel quasi neri e visibili che non sono quasi neri nel riferimento (per la sagoma presa da un'altra espressione).
 */
export function controllaComposta(rif: Sorgente, composta: Sorgente, zona?: {u: number; v: number; ru: number; rv: number}): {bordi: number; fuori: number; scuri: number} {
  const {w, h} = misure(rif);
  const leggi = (s: Sorgente) => {
    const c = Object.assign(document.createElement('canvas'), {width: w, height: h});
    const g = c.getContext('2d', {willReadFrequently: true})!;
    g.drawImage(s, 0, 0, w, h);
    return g.getImageData(0, 0, w, h).data;
  };
  const a = leggi(rif), b = leggi(composta);
  let bordi = 0, fuori = 0, scuri = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const k = (y * w + x) * 4;
    const cambia = Math.max(Math.abs(a[k] - b[k]), Math.abs(a[k + 1] - b[k + 1]), Math.abs(a[k + 2] - b[k + 2]), Math.abs(a[k + 3] - b[k + 3])) > 3;
    if (cambia && a[k + 3] < 250) bordi++;
    if (cambia && zona && ((x / w - zona.u) / zona.ru) ** 2 + ((y / h - zona.v) / zona.rv) ** 2 > 1.01) fuori++;
    // Scuri: sul bordo della figura (dove il riferimento sfuma), quasi neri e visibili dove il riferimento è chiaro: il contorno nero.
    const lb = (b[k] + b[k + 1] + b[k + 2]) / 3, la = (a[k] + a[k + 1] + a[k + 2]) / 3;
    if (a[k + 3] > 0 && a[k + 3] < 250 && b[k + 3] > 40 && lb < 40 && la > 70) scuri++;
  }
  return {bordi, fuori, scuri};
}
