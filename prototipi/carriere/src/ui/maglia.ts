// CA-0a, Fase E: deformazione a maglia di un unico ritratto con WebGL. L'immagine è una griglia di triangoli con le coordinate di
// tessitura ferme; a ogni fotogramma si spostano i vertici (deforma, in ../animazione.ts) e la scheda grafica piega l'immagine senza cuciture.
import {deforma, SPAZIENZIO, type Controlli} from '../animazione.ts';

const COLONNE = 14, RIGHE = 21;  // pochi vertici: abbastanza per piegare il collo senza spigoli

const VERTICE = `attribute vec2 dove; attribute vec2 tessitura; varying vec2 t;
void main() { t = tessitura; gl_Position = vec4(dove.x * 2.0 - 1.0, 1.0 - dove.y * 2.0, 0.0, 1.0); }`;
const FRAMMENTO = `precision mediump float; varying vec2 t; uniform sampler2D immagine;
void main() { gl_FragColor = texture2D(immagine, t); }`;

export class Maglia {
  private gl: WebGLRenderingContext;
  private dove: WebGLBuffer;
  private posizioni = new Float32Array(COLONNE * RIGHE * 2);
  private quanti: number;

  /** null se WebGL non c'è: il lettore torna al movimento sull'immagine intera. */
  static crea(tela: HTMLCanvasElement, img: HTMLImageElement, c: Controlli = SPAZIENZIO): Maglia | null {
    const gl = tela.getContext('webgl', {premultipliedAlpha: true, alpha: true, antialias: true});
    return gl ? new Maglia(gl, img, c) : null;
  }

  private constructor(gl: WebGLRenderingContext, img: HTMLImageElement, private c: Controlli) {
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
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  }

  disegna(t: number, parlando: boolean, daParola: number | null) {
    const gl = this.gl;
    for (let j = 0; j < RIGHE; j++) for (let i = 0; i < COLONNE; i++) {
      const q = deforma(i / (COLONNE - 1), j / (RIGHE - 1), t, parlando, daParola, this.c);
      this.posizioni[(j * COLONNE + i) * 2] = q.u; this.posizioni[(j * COLONNE + i) * 2 + 1] = q.v;
    }
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.dove); gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.posizioni);
    gl.drawElements(gl.TRIANGLES, this.quanti, gl.UNSIGNED_SHORT, 0);
  }
}
