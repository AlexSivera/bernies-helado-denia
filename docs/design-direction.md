# Dirección artística — «Happy, hecho aquí»

**En una frase**: la web se siente como estar delante del mostrador de Bernie's en una tarde de verano en Marqués de Campo: amarillo de la fachada, helado de verdad en primer plano y el neón del fondo cuando cae la tarde.

**Por qué**: el negocio ya tiene una identidad reconocible (amarillo, script, «Happy Ice Cream», neón sobre pared pizarra) y un producto que se ve muy bien en la vitrina. Lo que le falta es intención: fotografía cuidada, jerarquía y una forma de enseñar los sabores. No hace falta metáfora: el objeto real (la vitrina) es la interfaz.

## Sistema
- **Paleta**: amarillo Bernie's `#FFC61A` (fachada) · nata `#FFF6E2` · chocolate-tinta `#221A14` · pizarra `#283034` (pared del neón) · barquillo `#C8893A` (detalles). El resto de color lo ponen los sabores.
- **Tipografía**:
  - *Fraunces* variable (ejes SOFT y WONK al máximo en titulares): una serif blanda, «cremosa», con letras que parecen hechas de helado.
  - *Figtree* para texto e interfaz: amable, legible en móvil.
  - *Yesteryear* solo para el wordmark/neón, evocando el script del rótulo (provisional hasta tener el logotipo vectorial).
- **Selector y torre**: todo fotográfico y recortado (bolas, cucurucho, tarrina, gofre) para que se apilen como un bodegón de producto; nada de dibujos mezclados con fotos.
- **Fotografía**: luz de sol directa, color cálido, fondo liso amarillo/ocre o mar; manos sosteniendo el helado (es un producto que se come paseando). Real del local para todo lo específico (vitrina, gofre, fachada, interior). Stock solo para ambiente.
- **Formas**: nada de arcos (patrón repetido en demos anteriores). Fotos como piezas físicas: marco de puerta, fotos clavadas giradas, marco con sombra dura. Bolas con el borde ondulado de la cuchara. Nada de cards redondeadas genéricas ni sombras grandes.
- **Botones**: píldora plana, borde 2px tinta, sombra dura desplazada (como pegatina de vaso), sin degradados.
- **Movimiento**: el rótulo se enciende y las bolas caen una a una sobre el cucurucho del pilar, bolas que caen al cucurucho en el selector, parpadeo del neón al entrar en escena. Todo desactivado con `prefers-reduced-motion`.

## Arquitectura
1. **Hero: la fachada** — composición centrada que reproduce el frente real del local: rótulo «Heladería artesanal · Elaboración propia» (h1), letras «Bernie's» retroiluminadas, puerta con la foto real del interior y el mensaje en vinilo, pegatina de reseñas en el cristal, pilar con el cucurucho gigante (en la fachada está pintado; aquí se monta con bolas recortadas y un cucurucho fotográfico, con banderitas de pizarra) y la acera con dirección + «Cómo llegar». En escritorio, escaparate oscuro con la lista de productos en vinilo.
2. **La vitrina (nata)** — 7 sabores reales de su vitrina con fotos ilustrativas recortadas (bolas con volumen) + ficha «+12»; filtros (cremosos / frutales / sin gluten); selector «Tu combinación» que monta las bolas sobre tarrina amarilla, cucurucho o bubble waffle y se comparte por WhatsApp. Honesto: no es un pedido.
3. **Bubble waffle (amarillo/tinta)** — el producto más comentado («gofres» en 47 reseñas). Fotos reales + toppings y salsas de la pizarra.
4. **Pizarra (nata)** — batidos, summer shakes, granizados, horchata, affogato, cafés. Sin precios.
5. **La casa (pizarra + neón)** — elaboración en el local, foto real del interior, tres reseñas reales.
6. **Visítanos (amarillo)** — dirección enorme, fachada real («busca la fachada amarilla con el cucurucho gigante»), cómo llegar, Instagram, horario pendiente.
7. **Pie** — wordmark gigante.

Acción principal: **Cómo llegar** (siempre visible: cabecera en escritorio, píldora flotante en móvil).

## Por qué no «texto a la izquierda + foto a la derecha»
Las demos de Boreal, La Sacristía y Niki usan ese esqueleto (y Boreal el arco). Para Bernie's el hero sale del propio negocio: su fachada es el punto de referencia en Marqués de Campo («busca el cucurucho gigante»), así que la primera pantalla es esa fachada. Pasa el test de identidad: sin logotipo, sigue siendo esta heladería.
