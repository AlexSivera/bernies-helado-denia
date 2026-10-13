// Prepara las imágenes de la web a partir de raw/ (no se publica).
// Cada foto recibe un recorte, un etalonaje común y varias anchuras webp.
// Salida: src/assets/img/<nombre>-<ancho>.webp + sizes.json  ·  Uso: npm run images
import sharp from 'sharp';
import fs from 'node:fs/promises';

const OUT = 'src/assets/img';

// ratio: recorte final (ancho/alto) · foco: punto 0–1 hacia el que se desplaza el recorte
// grade: sun (stock, sol cálido) · real (fotos de móvil del local, unificadas)
const FOTOS = {
  // — Stock provisional (Unsplash) —
  'paseo-mar':      { src: 'stock/LLrohGLmfAg.jpg', ratio: 16 / 9, foco: [0.45, 0.5], grade: 'sun', sizes: [800, 1400, 2000] },
  'og':             { src: 'stock/3D0HUHFcRrk.jpg', ratio: 1200 / 630, foco: [0.5, 0.45], grade: 'sun', sizes: [1200], jpg: true },

  // — Fotos reales de Bernie's (Google Maps) —
  'puerta':         { src: 'real/maps-07.jpg', ratio: 3 / 4, foco: [0.6, 0.5], grade: 'real', sizes: [480, 800, 1100] },
  'fachada':        { src: 'real/maps-06.jpg', ratio: 4 / 5, foco: [0.62, 0.45], grade: 'real', sizes: [480, 800, 1200] },
  'interior':       { src: 'real/maps-07.jpg', ratio: 4 / 3, foco: [0.55, 0.5], grade: 'real', sizes: [600, 1000, 1600] },
  'gofre-mano':     { src: 'real/maps-09.jpg', ratio: 4 / 5, foco: [0.5, 0.45], grade: 'real', sizes: [480, 800, 1200] },
  'gofre-mostrador':{ src: 'real/maps-04.jpg', ratio: 4 / 5, foco: [0.3, 0.62], grade: 'real', sizes: [480, 800, 1200] },
};

// Recortes con fondo transparente (raw/cut/*.png, sacados con @imgly/background-removal-node; ver docs/image-sources.md).
// box: [x, y, ancho, alto] sobre el png · rot: grados antes de recortar · wave: borde inferior ondulado de bola de helado
const RECORTES = {
  'scoop-fresa':     { src: 'trio', box: [200, 1170, 540, 250], wave: true },
  'scoop-pistacho':  { src: 'trio', box: [860, 1100, 700, 352], wave: true },
  'scoop-mango':     { src: 'trio', box: [1580, 1150, 630, 268], wave: true },
  'scoop-yogur':     { src: 'yogur', box: [710, 620, 1330, 940], wave: true },
  'scoop-vainilla':  { src: 'vainilla', box: [670, 730, 650, 360], wave: true },
  'scoop-mojito':    { src: 'mojito', box: [600, 470, 900, 540], rot: 6.5, wave: true },
  'scoop-chocolate': { src: 'chocolate', box: [690, 1320, 1380, 780], wave: true },
  'cono':            { src: 'cone', box: [740, 880, 880, 1760] },
  'waffle':          { src: 'waffle', box: [120, 180, 495, 372], taper: true },          // bubble waffle real de Bernie's (foto de Maps)
  'tarrina':         { src: 'tarrina' },                                    // tarrina repintada en amarillo (scripts en docs)
};

// Velo cálido en "soft-light": acerca la temperatura de fuentes distintas
const VELO = { sun: [255, 214, 140, 0.18], real: [255, 220, 160, 0.24] };

async function preparar({ src, ratio, foco, grade }) {
  const { width: w, height: h } = await sharp(`raw/${src}`).rotate().metadata();
  const [fx, fy] = foco;
  let cw = w, ch = Math.round(w / ratio);
  if (ch > h) { ch = h; cw = Math.round(h * ratio); }
  const left = Math.round(Math.max(0, Math.min(w - cw, fx * w - cw / 2)));
  const top = Math.round(Math.max(0, Math.min(h - ch, fy * h - ch / 2)));
  let img = sharp(`raw/${src}`).rotate().extract({ left, top, width: cw, height: ch }).removeAlpha();
  if (grade === 'real') img = img.modulate({ saturation: 1.06, brightness: 1.06 }).linear(1.06, -4);   // móviles: algo más de vida y contraste
  if (grade === 'sun') img = img.modulate({ saturation: 1.02 });
  const [r, g, b, a] = VELO[grade];
  const velo = await sharp({ create: { width: cw, height: ch, channels: 4, background: { r, g, b, alpha: a } } }).png().toBuffer();
  const buf = await img.composite([{ input: velo, blend: 'soft-light' }]).toBuffer();
  return { buf, cw };
}

// Máscara de gofre: se estrecha hacia abajo, como el bubble waffle doblado en su cono
function cono(w, h) {
  const d = `M0 0H${w}V${h * 0.55}C${w} ${h * 0.8} ${w * 0.7} ${h} ${w * 0.5} ${h}C${w * 0.3} ${h} 0 ${h * 0.8} 0 ${h * 0.55}Z`;
  return Buffer.from(`<svg width="${w}" height="${h}"><path d="${d}" fill="#fff"/></svg>`);
}

// Máscara: todo opaco salvo un borde inferior ondulado (el labio que deja la cuchara)
function ola(w, h) {
  const y0 = h * 0.86, n = 6;
  let d = `M0 0H${w}V${y0}`;
  for (let i = n; i > 0; i--) {
    const xm = (w * (i - 0.5)) / n, x0 = (w * (i - 1)) / n;
    d += `Q${xm} ${i % 2 ? h : y0 + h * 0.04} ${x0} ${y0 + (i % 2 ? h * 0.05 : 0)}`;
  }
  return Buffer.from(`<svg width="${w}" height="${h}"><path d="${d}Z" fill="#fff"/></svg>`);
}

async function recortar({ src, box, rot, wave, taper }) {
  let buf = await fs.readFile(`raw/cut/${src}.png`);
  if (rot) buf = await sharp(buf).rotate(rot, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  if (box) {
    const [left, top, width, height] = box;
    buf = await sharp(buf).extract({ left, top, width, height }).png().toBuffer();
    if (wave) buf = await sharp(buf).composite([{ input: ola(width, height), blend: 'dest-in' }]).png().toBuffer();
    if (taper) buf = await sharp(buf).composite([{ input: cono(width, height), blend: 'dest-in' }]).png().toBuffer();
  }
  buf = await sharp(buf).trim({ threshold: 1 }).modulate({ saturation: 1.06, brightness: 1.02 }).png().toBuffer();
  const { width, height } = await sharp(buf).metadata();
  return { buf, width, height };
}

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });
const tallas = {};
for (const [nombre, def] of Object.entries(FOTOS)) {
  const { buf, cw } = await preparar(def);
  const hechos = [];
  if (def.jpg) {
    for (const w of def.sizes) {
      await sharp(buf).resize({ width: w }).jpeg({ quality: 82, mozjpeg: true }).toFile(`${OUT}/${nombre}-${w}.jpg`);
      hechos.push(w);
    }
  } else {
    for (const w of def.sizes) {
      if (w > cw * 1.05) continue; // nunca ampliar fotos
      await sharp(buf).resize({ width: w }).sharpen({ sigma: 0.5 }).webp({ quality: def.grade === 'real' ? 78 : 74, effort: 6 }).toFile(`${OUT}/${nombre}-${w}.webp`);
      hechos.push(w);
    }
    if (!hechos.length) {
      await sharp(buf).webp({ quality: 80, effort: 6 }).toFile(`${OUT}/${nombre}-${cw}.webp`);
      hechos.push(cw);
    }
    tallas[nombre] = { ratio: def.ratio, widths: hechos };
  }
  console.log(`${nombre}: ${hechos.join(', ')}`);
}

for (const [nombre, def] of Object.entries(RECORTES)) {
  const { buf, width, height } = await recortar(def);
  const hechos = [];
  for (const w of [240, 480]) {
    await sharp(buf).resize({ width: Math.min(w, width) }).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(`${OUT}/${nombre}-${w}.webp`);
    hechos.push(w);
  }
  tallas[nombre] = { ratio: +(width / height).toFixed(4), widths: hechos };
  console.log(`${nombre}: ${hechos.join(', ')}  (${width}×${height}, ratio ${(width / height).toFixed(3)})`);
}
await fs.writeFile(`${OUT}/sizes.json`, JSON.stringify(tallas, null, 2));
