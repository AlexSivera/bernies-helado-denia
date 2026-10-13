// Quita el fondo de una foto con un modelo local. No es dependencia del proyecto:
//   npm i --no-save @imgly/background-removal-node@1.4.5
// Uso: node scripts/tools/cut.mjs raw/scoops/foto.jpg raw/cut/salida.png
import { removeBackground } from '@imgly/background-removal-node';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
const [inp, out] = process.argv.slice(2);
const blob = await removeBackground(pathToFileURL(inp).href, { model: 'medium', output: { format: 'image/png', quality: 1 } });
fs.writeFileSync(out, Buffer.from(await blob.arrayBuffer()));
console.log('ok', out);
