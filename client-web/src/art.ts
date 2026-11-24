// O9, SB-31 F2 (D196 (6)): provisional illustrations are looked up by bindingName in the manifest of the atlases, one or more per set (8×8 cells).
/** One atlas file of a set: its grid, its size and the cells of the classes it holds. */
export interface AtlasFile {file:string;set:string;atlas:number;cols:number;rows:number;cell:number;pad:number;width:number;height:number;placeholder?:number;tiles:Record<string,number>}
export interface AtlasLayout {files:AtlasFile[]}
/** Where a class is drawn: the atlas (index in `files`) and the cell inside it. */
export interface ArtRef {atlas:number;cell:number}
export interface ArtFrame {x:number;y:number;size:number}
let layout:AtlasLayout|null=null;
export const setAtlas=(l:AtlasLayout)=>{layout=l;};
export async function loadAtlas():Promise<AtlasLayout>{
 if(layout)return layout;
 const manifest=await (await fetch('/art/manifest.json')).json() as {files:(Partial<AtlasFile>&{file:string})[]};
 const files=manifest.files.filter(f=>f.tiles) as AtlasFile[];
 if(!files.length||!files.some(f=>f.placeholder!==undefined))throw new Error('Manifest degli atlanti non valido');
 return layout={files};
}
/** The neutral placeholder: the one of the first set that has it (they are all the same plain tile). */
export const placeholderRef=(l:AtlasLayout):ArtRef=>{const atlas=l.files.findIndex(f=>f.placeholder!==undefined);return {atlas,cell:l.files[atlas].placeholder!};};
/** Atlas and cell of a class; an unknown or missing bindingName gets the neutral placeholder. Before the manifest loads: the first cell of the first atlas. */
export const artIndex=(binding:string,l:AtlasLayout|null=layout):ArtRef=>{
 if(!l)return {atlas:0,cell:0};
 const atlas=l.files.findIndex(f=>Object.hasOwn(f.tiles,binding));
 return atlas<0?placeholderRef(l):{atlas,cell:l.files[atlas].tiles[binding]};
};
/** Pixel rectangle of a cell inside its atlas, without the copied edge. */
export const artFrame=(cell:number,f:AtlasFile):ArtFrame=>({x:(cell%f.cols)*f.cell+f.pad,y:Math.floor(cell/f.cols)*f.cell+f.pad,size:f.cell-2*f.pad});
/** CSS background for the whole cell (inspection), scaled by atlas size. */
export const artCss=(ref:ArtRef,l:AtlasLayout|null=layout)=>{
 const f=l?.files[ref.atlas];if(!f)return {};
 const {cols,rows}=f;return {backgroundImage:`url('/${f.file}')`,backgroundSize:`${cols*100}% ${rows*100}%`,backgroundPosition:`${(ref.cell%cols)*100/(cols-1)}% ${Math.floor(ref.cell/cols)*100/(rows-1)}%`};
};
