# Tlaxcallan — pantalla de inicio y menús

Implementación web de los diseños de `project/Tlaxcallan Pantalla de Inicio.dc.html`:

- **1a · Amanecer en la Malinche**: pantalla de inicio con el paisaje en pixel art (320×180, escalado ×3).
- **4a · Bolsa**: inventario con barra 1–0, 3 bolsas de 20 casillas, detalle del objeto, Usar y Soltar.
- **4b · Tienda en la plaza**: puesto de Citlalmina con pestañas, cantidades, total en cacao, Comprar y Vender.
- **4c · Pausa y opciones**: Reanudar, Guardar partida, Opciones (volumen, pantalla, idioma, clima), Controles y Salir al menú.

No necesita compilar nada: abre `index.html` en el navegador (también funciona con `file://`).

## Controles

| Pantalla | Teclas |
| --- | --- |
| Inicio | ▲▼ / W S para elegir, Enter |
| Juego | Q bolsa · T tienda · Esc pausa · 1–0 barra |
| Bolsa | 1–0 barra · ◂ ▸ cambiar bolsa · Q / Esc cerrar |
| Tienda | ▲▼ producto · ◂ ▸ cantidad · Enter comprar/vender · Esc cerrar |
| Pausa | ▲▼ · Enter · ◂ ▸ cambiar opción · Esc volver |

Todo también funciona con el mouse; las barras de volumen se pueden arrastrar.

## Archivos

- `js/pixel.js` — dibujo en pixel art (íconos, retratos, paisaje). Viene tal cual del prototipo, así que se ve idéntico.
- `js/data.js` — objetos, precios, inventario de la tienda y estado inicial.
- `js/ui.js` — pantallas, teclado y mouse, guardado.
- `css/tlaxcallan.css` — estilos; los valores salen tal cual del diseño.
- `assets/` — greca, chalchihuite, papel amate y tus capturas del juego, que se usan de fondo.

## Conectarlo con el juego

La pantalla "juego" es solo una captura de relleno: ahí va tu juego. El módulo avisa con eventos en `window`:

| Evento | `detail` |
| --- | --- |
| `tlax:start` | `{ nueva }` — se eligió Nueva partida o Continuar |
| `tlax:screen` | `{ screen }` — `title`, `game`, `bag`, `shop` o `pause` |
| `tlax:hand` | `{ slot, item }` — objeto que lleva en la mano |
| `tlax:use`, `tlax:drop` | `{ item }` |
| `tlax:buy`, `tlax:sell` | `{ items, total }` |
| `tlax:settings` | `{ musica, efectos, idioma, clima }` |
| `tlax:save`, `tlax:exit` | — |

`Tlax.ui.state` tiene el estado (vida, energía, cacao, inventario). `Tlax.ui.open('bag')` abre una pantalla y `Tlax.ui.render()` la vuelve a dibujar después de cambiar el estado.

La partida se guarda en `localStorage` (`tlaxcallan.partida`) y las opciones en `tlaxcallan.opciones`.

## Pendiente

- Las pestañas Habilidades, Vecinos, Mapa y Diario muestran "Próximamente": el diseño solo incluye la Bolsa.
- Cambiar el idioma guarda la opción, pero los textos todavía no se traducen.
- El audio y el clima dependen del juego: este módulo solo guarda las opciones y avisa con `tlax:settings`.
