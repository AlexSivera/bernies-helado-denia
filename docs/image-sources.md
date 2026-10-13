# Fuentes de imagen y brief fotográfico

Originales en `raw/` (no se publica). `npm run images` recorta, etaloniza y genera los webp de `src/assets/img/`.
Para sustituir una foto: reemplazar el archivo de `raw/`, ajustar `ratio`/`foco` en `scripts/images.mjs` y relanzar. Los contenedores usan `aspect-ratio` + `object-fit: cover`, así que cualquier foto con el mismo encuadre aproximado encaja.

## Stock provisional (Unsplash, licencia Unsplash: uso libre, atribución apreciada)
| Archivo web | Sección | Fuente | Autor | Sustituir por |
|---|---|---|---|---|
| `paseo-mar` | Banda «Calle abajo, hasta el puerto» | https://unsplash.com/photos/LLrohGLmfAg | ilya | Horizontal 16:9: helado de Bernie's en mano con el puerto de Dénia o la Explanada Cervantes detrás, hora dorada. |
| `og` | Imagen para compartir | https://unsplash.com/photos/3D0HUHFcRrk | Zach Camp | Composición 1200×630 con producto de Bernie's sobre amarillo. |

Descargadas y descartadas (no publicadas): TLD6iCOlyb0 (era el hero de la v1), G5ZenftPPOA, Nag3E3yzygU, -cQ2kQqpEB8, gNm9YigxOCI, k9YuEwhnxpA, piA65cp-1EI, rDe_q_URd1s, _dWyfbhIvKo, 6A7dU3J3eh0 (este último muestra la marca de otra gofrería en el envoltorio).

## Fotos reales del negocio (ficha pública de Google Maps — pedir permiso / sustituir)
| Archivo web | Sección | Origen | Notas |
|---|---|---|---|
| `puerta` | Hero (puerta) | Foto de Maps (interior, recorte vertical) | Real. Rehacer vertical 3:4 desde la puerta, neón encendido y vitrina llena: es la foto principal del hero. |
| `gofre-mano` | Bubble waffle | Foto de Maps (cliente) | Calidad de móvil. Sustituir por bubble waffle con dos bolas y toppings, fondo amarillo liso, flash suave. |
| `gofre-mostrador` | Bubble waffle (foto pequeña) | Foto de Maps | Bueno de ambiente. Rehacer con mejor luz y el neón encendido. |
| `interior` | La casa | Foto de Maps | Real y útil. Rehacer horizontal 4:3 con la vitrina llena y el neón encendido. |
| `fachada` | Visítanos | Foto de Maps | Clave para orientarse. Rehacer vertical frontal, mañana sin sombras duras. |
| `sabor-*` (10) | La vitrina | Recortes de 3 fotos de la vitrina (Maps) | Resolución baja (100–200 px de origen). **Sesión prioritaria**: macro cenital de cada tarrina recién peinada, misma luz y altura, 1:1, para todos los sabores de temporada. |

## Brief de sesión (si compran la web)
1. Macro 1:1 de cada sabor en la vitrina (luz continua, sin reflejos del cristal: fotografiar desde dentro del mostrador).
2. Hero: vista vertical desde la puerta hacia la vitrina con el neón encendido (sustituye a `puerta`).
3. Bubble waffle montado, paso a paso (gofre, helado, topping) para la sección de la especialidad.
4. Interior con neón encendido y la vitrina llena; detalle de los vasos amarillos.
5. Paseo: helado en Marqués de Campo y en el puerto, hora dorada.
6. Logotipo en vector (sustituye al script tipográfico provisional *Yesteryear*).
