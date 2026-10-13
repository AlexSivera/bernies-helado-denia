// Tarrina limpia: silueta + luz de una tarrina fotografiada, repintada en amarillo Bernie's sin logos ni estampado.
// Uso (desde la raíz): node scripts/tools/tarrina.cjs <carpeta-previa>  ·  lee raw/cut/trio.png, escribe raw/cut/tarrina.png
const sharp=require(process.cwd()+'/node_modules/sharp');
const [S]=process.argv.slice(2);
(async()=>{
 const L=850,T=1452,W=730,H=568;
 const {data}=await sharp('raw/cut/trio.png').extract({left:L,top:T,width:W,height:H}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const lum=(i)=>0.2126*data[i]+0.7152*data[i+1]+0.0722*data[i+2];
 const med=(a)=>{a.sort((x,y)=>x-y);return a[Math.floor(a.length/2)]||0};
 const smooth=(a,r)=>a.map((_,i)=>{let s=0,n=0;for(let j=i-r;j<=i+r;j++)if(a[j]){s+=a[j];n++;}return n?s/n:0;});
 const fill=(a)=>{let last=0;const b=a.slice();for(let i=0;i<b.length;i++){if(b[i])last=b[i];else b[i]=last;}last=0;for(let i=b.length-1;i>=0;i--){if(a[i])last=a[i];else if(!b[i])b[i]=last;}return b;};
 let col=[],row=[];
 for(let x=0;x<W;x++){const v=[];for(let y=Math.round(H*0.2);y<H*0.9;y++){const i=(y*W+x)*4;if(data[i+3]>220)v.push(lum(i));}col.push(v.length>20?med(v):0);}
 for(let y=0;y<H;y++){const v=[];for(let x=0;x<W;x++){const fx=x/W;if(!((fx>0.1&&fx<0.24)||(fx>0.76&&fx<0.9)))continue;const i=(y*W+x)*4;if(data[i+3]>220)v.push(lum(i));}row.push(v.length>4?med(v):0);}
 col=smooth(fill(col),10); row=fill(row);
 // el borde enrollado (primeras filas) se conserva; el cuerpo se suaviza mucho
 const rim=Math.round(H*0.055); const rowS=row.map((v,i)=>{const t=i/H; if(i<rim) return 1.1; if(i<rim+6) return 0.86; return 1-0.1*t;});
 const g=1;const cm=Math.max(...col);
 const out=Buffer.alloc(W*H*4);const Y=[255,200,30];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4;const l=(col[x]/cm)*(rowS[y]/g);
  for(let c=0;c<3;c++){out[i+c]=Math.max(0,Math.min(255,Math.round(Y[c]*Math.min(l,1.0)*1.04+(l>1?(l-1)*260:0))));}
  out[i+3]=data[i+3];}
 await sharp(out,{raw:{width:W,height:H,channels:4}}).png().toFile('raw/cut/tarrina.png');
 const b=await sharp('raw/cut/tarrina.png').resize({height:300}).toBuffer();
 await sharp({create:{width:420,height:340,channels:4,background:'#FFF6E2'}}).composite([{input:b,left:30,top:20}]).jpeg().toFile(S+'/cut/cup-test.jpg');
})();
