# Bernie's · Helado artesano en Dénia — demo web

Propuesta de web para Bernie's helado artesano, C/ del Marqués de Campo 51, Dénia.
Concepto: *Happy, hecho aquí* — el amarillo de la fachada, helado de verdad en primer plano y el neón del mostrador. La vitrina es la interfaz: texturas reales de sus sabores con las que se monta una combinación (cucurucho, tarrina o bubble waffle) que se puede mandar por WhatsApp. Ver `docs/`.

## Uso

```bash
npm install        # solo hace falta sharp para regenerar imágenes
npm run images     # raw/ → src/assets/img (necesita raw/, que no está en el repo)
npm run dev        # build + servidor en http://localhost:4321
npm run check      # build + comprobaciones (recursos, anclas, alt, JSON-LD)
npm run deploy     # build + check + push de dist/ a la rama gh-pages
```

HTML, CSS y JS sin dependencias en `src/`. El build (`scripts/build.mjs`) expande `<img data-img="nombre">` a `srcset` con las tallas generadas y escribe `dist/`.

## Pendiente de confirmar con el cliente
- Horario, teléfono / WhatsApp (no figuran en Google Maps).
- Sabores y descripciones de summer shakes (leídos de fotos de la pizarra).
- Permiso para usar las fotos de Google Maps y las reseñas citadas.
- Logotipo en vector (el wordmark actual es tipográfico y provisional).
