// O9: provisional illustrations are looked up by bindingName in the atlas manifest.
export interface AtlasLayout {cols:number;rows:number;cell:number;pad:number;placeholder:number;tiles:Record<string,number>}
export interface ArtFrame {x:number;y:number;size:number}
let layout:AtlasLayout|null=null;
export const setAtlas=(l:AtlasLayout)=>{layout=l;};
export async function loadAtlas():Promise<AtlasLayout>{
 if(layout)return layout;
 const manifest=await (await fetch('/art/manifest.json')).json() as {files:({file:string}&Partial<AtlasLayout>)[]};
 const entry=manifest.files.find(f=>f.file==='art/atlas.webp') as AtlasLayout|undefined;
 if(!entry?.tiles)throw new Error('Manifest dell’atlante non valido');
 return layout=entry;
}
/** Tile of a class; an unknown or missing bindingName gets the neutral placeholder. */
export const artIndex=(binding:string,l:AtlasLayout|null=layout)=>{
 if(!l)return 0;
 const i=l.tiles[binding];return i===undefined?l.placeholder:i;
};
/** Pixel rectangle of a tile inside the atlas, without the copied edge. */
export const artFrame=(index:number,l:AtlasLayout|null=layout):ArtFrame=>{
 const {cols,cell,pad}=l!;return {x:(index%cols)*cell+pad,y:Math.floor(index/cols)*cell+pad,size:cell-2*pad};
};
/** CSS background for the whole cell (inspection), scaled by atlas size. */
export const artCss=(index:number,l:AtlasLayout|null=layout)=>{
 if(!l)return {};
 const {cols,rows}=l;return {backgroundSize:`${cols*100}% ${rows*100}%`,backgroundPosition:`${(index%cols)*100/(cols-1)}% ${Math.floor(index/cols)*100/(rows-1)}%`};
};
