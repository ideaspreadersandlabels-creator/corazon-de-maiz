# Corazón de Maíz · arte del mundo

Personajes caminando, acciones del jugador, terreno, cultivos por etapa y costales de semilla, en el mismo trazo que los retratos Códice Borgia y los menús de Talavera. Abre `mundo.html` para ver la escena animada y todas las hojas.

## Archivos para el juego (`export/`)

Cada imagen viene en dos tamaños: normal (cuadro de **32 px**) y `@2x` (cuadro de **64 px**). Todas tienen fondo transparente. `mundo.json` describe cada hoja.

| Archivo | Contenido |
| --- | --- |
| `personajes/<id>.png` | Una hoja por personaje (16). Cuadros de 32×48 px. Filas: abajo, izquierda, derecha, arriba. Columnas: los 4 cuadros de caminar; el primero sirve de quieto. Los pies quedan en el centro de abajo del cuadro. |
| `jugador-acciones.png` | Tu personaje. Mismas filas. Columnas: arar ×2, regar ×2, cosechar ×2 (agacharse y levantar la mazorca). |
| `terreno.png` | Cuadros de 32×32, 7 por fila: pasto (4 variantes, sin cuadrícula), tierra arada, tierra mojada, camino (2), agua (2 cuadros que se alternan) y las 4 orillas de pasto. |
| `cultivos.png` | Cuadros de 32×64 (dos casillas de alto; la mitad de abajo va sobre la tierra). Filas: maíz (5 etapas), frijol (5), calabaza (5), chile (5), cempasúchil (4) y milpa (las tres hermanas juntas). |
| `semillas/semilla-*.png` | Costales de semilla para la barra: maíz, maíz azul, frijol, calabaza, chile y cempasúchil. |

## Cómo usarlos

- **Caminar:** cambia de cuadro unas 8 veces por segundo mientras el personaje se mueve; quieto, usa la columna 0.
- **Orillas:** pon `orilla-n`, `-s`, `-e` u `-w` encima de una casilla de tierra o de camino del lado que toca el pasto. Así desaparece el borde recto.
- **Regar:** cambia la casilla de `tierra` a `tierra-mojada`.
- **Profundidad:** dibuja personajes y cultivos ordenados por la posición de sus pies (de arriba hacia abajo), así quien está más abajo tapa al de arriba.

## Si tu juego usa otro tamaño de cuadro

Todo está dibujado en vector (`mundo-art.js`). Cambia las escalas en `exportar.js` y vuelve a exportar:

```
node propuestas-final/mundo/exportar.js
```
