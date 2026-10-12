# Dirección artística — «Happy, hecho aquí»

**En una frase**: la web se siente como estar delante del mostrador de Bernie's en una tarde de verano en Marqués de Campo: amarillo de la fachada, helado de verdad en primer plano y el neón del fondo cuando cae la tarde.

**Por qué**: el negocio ya tiene una identidad reconocible (amarillo, script, «Happy Ice Cream», neón sobre pared pizarra) y un producto que se ve muy bien en la vitrina. Lo que le falta es intención: fotografía cuidada, jerarquía y una forma de enseñar los sabores. No hace falta metáfora: el objeto real (la vitrina) es la interfaz.

## Sistema
- **Paleta**: amarillo Bernie's `#FFC61A` (fachada) · nata `#FFF6E2` · chocolate-tinta `#221A14` · pizarra `#283034` (pared del neón) · barquillo `#C8893A` (detalles). El resto de color lo ponen los sabores.
- **Tipografía**:
  - *Fraunces* variable (ejes SOFT y WONK al máximo en titulares): una serif blanda, «cremosa», con letras que parecen hechas de helado. En el hero su peso «crece» al cargar, como una bola que se sirve.
  - *Figtree* para texto e interfaz: amable, legible en móvil.
  - *Yesteryear* solo para el wordmark/neón, evocando el script del rótulo (provisional hasta tener el logotipo vectorial).
- **Fotografía**: luz de sol directa, color cálido, fondo liso amarillo/ocre o mar; manos sosteniendo el helado (es un producto que se come paseando). Real del local para todo lo específico (vitrina, gofre, fachada, interior). Stock solo para ambiente.
- **Formas**: máscara de «arco de bola» (rectángulo con remate semicircular) para fotos, círculos para sabores. Nada de cards redondeadas genéricas ni sombras grandes.
- **Botones**: píldora plana, borde 2px tinta, sombra dura desplazada (como pegatina de vaso), sin degradados.
- **Movimiento**: crecimiento del peso tipográfico en el hero, marquee de sabores, bolas que caen al cucurucho en el selector, parpadeo del neón al entrar en escena. Todo desactivado con `prefers-reduced-motion`.

## Arquitectura
1. **Hero (amarillo)** — «Helado artesano, hecho aquí.» + foto en arco + sello de reseñas + CTA Ver la vitrina / Cómo llegar. Marquee de sabores reales.
2. **La vitrina (nata)** — 10 texturas reales recortadas de las fotos de la vitrina; filtros (cremosos / frutales / sin gluten); selector «Tu combinación» que monta las bolas sobre tarrina amarilla, cucurucho o bubble waffle y se comparte por WhatsApp. Honesto: no es un pedido.
3. **Bubble waffle (amarillo/tinta)** — el producto más comentado («gofres» en 47 reseñas). Fotos reales + toppings y salsas de la pizarra.
4. **Pizarra (nata)** — batidos, summer shakes, granizados, horchata, affogato, cafés. Sin precios.
5. **La casa (pizarra + neón)** — elaboración en el local, foto real del interior, tres reseñas reales.
6. **Visítanos (amarillo)** — dirección enorme, fachada real («busca la fachada amarilla con el cucurucho gigante»), cómo llegar, Instagram, horario pendiente.
7. **Pie** — wordmark gigante.

Acción principal: **Cómo llegar** (siempre visible: cabecera en escritorio, píldora flotante en móvil).
