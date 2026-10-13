# QA — 13/10/2026

Herramientas: Playwright (Chromium) contra `dist/` servido en local y contra la URL pública; `npm run check`.

## Automático (`npm run check`)
- Todos los recursos locales existen (46), anclas internas válidas (19), todas las `img` con `alt` y `width/height`, JSON-LD válido, sin placeholders.
- Primera carga aprox. 243 KB (HTML + CSS + JS + 3 fuentes + hero 760w).

## Viewports revisados (capturas)
| Ancho | Resultado |
|---|---|
| 320×640 | Sin overflow horizontal. Rejilla de sabores a 2 columnas. CTA del hero queda justo bajo el pliegue (aceptado). |
| 390×844 | Sin overflow. Hero: producto, titular y dos CTA visibles en la primera pantalla. |
| 768×1024 | Sin overflow. Rejilla de 4 sabores, pizarra a 2 columnas. |
| 1440×900 | Selector sticky a la derecha de la vitrina; sin overflow (scrollWidth = ancho menos la barra de scroll). |
| 1920×1080 | Contenido centrado a 1320 px. |

Corregido durante QA: variable `top` que chocaba con `window.top` (rompía todo el JS), overflow de 25 px en móvil (min-width de items de grid), recipientes del SVG que no cambiaban (`hidden` no existe como propiedad en SVG), pasos del gofre descolocados en escritorio, bolas que «flotaban» sobre la tarrina (ahora capa trasera y delantera).

## Funcional
- Selector: elegir 2 sabores, cambiar a tarrina / bubble waffle / cucurucho, la tercera elección sustituye a la primera, vaciar. Resumen y enlace de WhatsApp correctos (`wa.me/?text=…`, sin número: el usuario elige destinatario).
- Bandeja flotante en móvil aparece con sabores elegidos y lleva al selector; «Cómo llegar» flotante se oculta en hero, selector y visita.
- Filtros (cremosos / frutales / sin gluten) atenúan y desactivan los que no encajan.
- Menú móvil: abre con foco en el primer enlace, se cierra con Escape devolviendo el foco al botón.
- `prefers-reduced-motion`: sin revelados, neón encendido fijo, titular en peso final.
- Enlaces externos verificados: `maps?cid=16839739642171214478` abre la ficha «Bernie's helado artesano»; ruta de Google Maps con destino por nombre + dirección; Instagram `@bernies_happy_icecream` (el perfil no se pudo ver sin sesión).
- Consola: 0 errores en todas las pasadas.

## No comprobado
- Dispositivos físicos iOS/Android (solo emulación de Chromium).
- Safari: `clip-path: url(#…)` en HTML y transiciones de `font-weight` variables deberían funcionar, pero no se ha probado en WebKit.
- Lighthouse no ejecutado.

## Ronda 2 — nuevo hero «la fachada» (13/10/2026)
- Motivo: el hero v1 repetía el esqueleto de otras demos (texto a la izquierda, foto en arco a la derecha). Sustituido por la fachada; eliminados también los arcos de gofre y visita.
- Capturas a 320×640, 390×844, 768×1024, 1440×900 y 1920×1080: sin overflow horizontal, sin errores de consola; la torre cabe en la primera pantalla en todos los tamaños (tamaño de bola ligado a `svh`).
- En móvil solo se muestran 3 banderitas para no tapar el vinilo; pegatina de reseñas reducida por debajo de 360 px.
- Primera carga ≈ 352 KB (la foto de la puerta pesa más que el cucurucho de stock, pero es real).
