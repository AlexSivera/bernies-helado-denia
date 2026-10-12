// Prepara las imágenes de la web a partir de raw/ (no se publica).
// Cada foto recibe un recorte, un etalonaje común y varias anchuras webp.
// Salida: src/assets/img/<nombre>-<ancho>.webp + sizes.json  ·  Uso: npm run images
import sharp from 'sharp';
import fs from 'node:fs/promises';

const OUT = 'src/assets/img';

// ratio: recorte final (ancho/alto) · foco: punto 0–1 hacia el que se desplaza el recorte
// rect: [cx, cy, lado] recorte cuadrado exacto en px (texturas de sabores sacadas de las fotos de la vitrina)
// grade: sun (stock, sol cálido) · real (fotos de móvil del local, unificadas) · swatch (texturas de vitrina)
const FOTOS = {
  // — Stock provisional (Unsplash) —
  'hero-cono':      { src: 'stock/TLD6iCOlyb0.jpg', ratio: 4 / 5.2, foco: [0.52, 0.42], grade: 'sun', sizes: [480, 760, 1100, 1500] },
  'paseo-mar':      { src: 'stock/LLrohGLmfAg.jpg', ratio: 16 / 9, foco: [0.45, 0.5], grade: 'sun', sizes: [800, 1400, 2000] },
  'og':             { src: 'stock/3D0HUHFcRrk.jpg', ratio: 1200 / 630, foco: [0.5, 0.45], grade: 'sun', sizes: [1200], jpg: true },

  // — Fotos reales de Bernie's (Google Maps) —
  'fachada':        { src: 'real/maps-06.jpg', ratio: 4 / 5, foco: [0.62, 0.45], grade: 'real', sizes: [480, 800, 1200] },
  'interior':       { src: 'real/maps-07.jpg', ratio: 4 / 3, foco: [0.55, 0.5], grade: 'real', sizes: [600, 1000, 1600] },
  'gofre-mano':     { src: 'real/maps-09.jpg', ratio: 4 / 5, foco: [0.5, 0.45], grade: 'real', sizes: [480, 800, 1200] },
  'gofre-mostrador':{ src: 'real/maps-04.jpg', ratio: 4 / 5, foco: [0.3, 0.62], grade: 'real', sizes: [480, 800, 1200] },

  // — Texturas reales de la vitrina (recortes de fotos de Maps) —
  'sabor-pistacho':        { src: 'real/maps-05.jpg', rect: [400, 1328, 100], grade: 'swatch' },
  'sabor-leche-merengada': { src: 'real/maps-08.jpg', rect: [165, 630, 170], grade: 'swatch' },
  'sabor-happy-hippo':     { src: 'real/maps-05.jpg', rect: [118, 1090, 200], grade: 'swatch' },
  'sabor-cheesecake':      { src: 'real/maps-05.jpg', rect: [770, 1090, 120], grade: 'swatch' },
  'sabor-coco-maracuya':   { src: 'real/maps-05.jpg', rect: [1255, 925, 85], grade: 'swatch' },
  'sabor-dulce-de-leche':  { src: 'real/maps-05.jpg', rect: [775, 895, 100], grade: 'swatch' },
  'sabor-ferrero':         { src: 'real/maps-05.jpg', rect: [500, 880, 170], grade: 'swatch' },
  'sabor-fresa':           { src: 'real/maps-08.jpg', rect: [214, 376, 124], grade: 'swatch' },
  'sabor-mango':           { src: 'real/maps-08.jpg', rect: [440, 390, 150], grade: 'swatch' },
  'sabor-vainilla':        { src: 'real/maps-08.jpg', rect: [462, 668, 128], grade: 'swatch' },
};

// Velo cálido en "soft-light": acerca la temperatura de fuentes distintas
const VELO = { sun: [255, 214, 140, 0.18], real: [255, 220, 160, 0.24], swatch: [255, 236, 200, 0.12] };

async function preparar({ src, ratio, foco, rect, grade }) {
  const meta = await sharp(`raw/${src}`).rotate().metadata();
  let left, top, cw, ch;
  if (rect) {
    const [cx, cy, s] = rect;
    left = Math.round(cx - s / 2); top = Math.round(cy - s / 2); cw = ch = s;
  } else {
    const [fx, fy] = foco;
    const { width: w, height: h } = meta;
    cw = w; ch = Math.round(w / ratio);
    if (ch > h) { ch = h; cw = Math.round(h * ratio); }
    left = Math.round(Math.max(0, Math.min(w - cw, fx * w - cw / 2)));
    top = Math.round(Math.max(0, Math.min(h - ch, fy * h - ch / 2)));
  }
  let img = sharp(`raw/${src}`).rotate().extract({ left, top, width: cw, height: ch }).removeAlpha();
  if (grade === 'real') img = img.modulate({ saturation: 1.06, brightness: 1.06 }).linear(1.06, -4);   // móviles: algo más de vida y contraste
  if (grade === 'swatch') img = img.modulate({ saturation: 1.12, brightness: 0.98 }).linear(1.08, -10);
  if (grade === 'sun') img = img.modulate({ saturation: 1.02 });
  const [r, g, b, a] = VELO[grade];
  const velo = await sharp({ create: { width: cw, height: ch, channels: 4, background: { r, g, b, alpha: a } } }).png().toBuffer();
  const buf = await img.composite([{ input: velo, blend: 'soft-light' }]).toBuffer();
  return { buf, cw };
}

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });
const tallas = {};
for (const [nombre, def] of Object.entries(FOTOS)) {
  const { buf, cw } = await preparar(def);
  const hechos = [];
  if (def.rect) {
    // Texturas: pequeñas en origen; se exportan a 160/320 con un leve enfoque (se ven a ~120–150px CSS)
    for (const w of [160, 320]) {
      await sharp(buf).resize(w, w, { kernel: 'lanczos3' }).sharpen({ sigma: 0.8 }).webp({ quality: 80, effort: 6 }).toFile(`${OUT}/${nombre}-${w}.webp`);
      hechos.push(w);
    }
    tallas[nombre] = { ratio: 1, widths: hechos };
  } else if (def.jpg) {
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
await fs.writeFile(`${OUT}/sizes.json`, JSON.stringify(tallas, null, 2));
