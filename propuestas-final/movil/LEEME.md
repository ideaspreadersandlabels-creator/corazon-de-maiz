# Corazón de Maíz · arreglo para celular

`index.html` es tu juego con el arreglo ya aplicado. Reemplaza el `index.html` del repositorio `maiz` con este archivo (lo demás no cambia).

`parche_movil.py` aplica el mismo arreglo a cualquier versión futura del juego:

```
python3 parche_movil.py ruta/al/index.html
```

## Qué arregla

- **Escala de interfaz en celular.** Si la pantalla mide menos de 600 de ancho (o 560 de alto), la interfaz se dibuja como si midiera eso y se reduce en proporción. El mundo se ve del mismo tamaño; los paneles (bolsa, reloj, fama, tutorial) ya no se enciman ni tapan el campo. La portada no cambia, porque ya se adaptaba sola.
- **Toques.** Los toques se convierten a la misma escala, así que botones, mascotas, menús y deslizadores responden donde se ven. Los botones táctiles (joystick, Usar, E, R y los redondos de la izquierda) son un 35 % más grandes.
- **Barras de energía y vida.** Ya no tapan el último espacio de la barra de herramientas.
- **Menú de Opciones** (también en computadora): cada fila de Gráficos y de efectos muestra su valor y se puede cambiar tocándola o con ◂ ▸; la lista se desplaza cuando no cabe, y «Volver a la pausa» queda siempre al final.
- **Mapa.** En celular era una tira delgada. Ahora se parte en franjas apiladas (se lee de izquierda a derecha y de arriba abajo; ↩ marca dónde sigue), así se ve unas cuatro veces más grande. Los botones de filtro (Postas, Templos, Marcador, Tú) van dentro del panel; antes tapaban la barra de herramientas.
- **Tiendas y listas.** En pantallas altas muestran hasta 16 filas en vez de 9, para que no aparezca «▼ N más» con medio panel vacío.
- **Pastilla «"/" buscar».** Ya no se encima con la barra de herramientas: va justo debajo del panel. En pantalla táctil sólo aparece si hay una búsqueda activa.
- **Globo de ayuda en tiendas.** En pantalla táctil ya no se queda flotando sobre la lista donde tocaste (la descripción ya va en cada fila).
- **Mini-bolsa** (arriba a la izquierda). Las cantidades grandes se abrevian (40k, 1.2M) en vez de cortarse («40000(»). El pie ya no pisa el marco. Al tocarla se abre la bolsa completa.
- **Logros.** Salía una fila vacía con sólo la estrella; ahora se ven todos los logros con nombre y descripción, y «Defensor» ya no aparece dos veces.

`menus-antes-despues.jpg` compara el mapa, una tienda y los logros en un Pixel 7.

## Arte del mundo y barras (segunda ronda)

- **Tierra arada.** Se veía como hoyos negros: en esta copia del juego el dibujo de la tierra quedó dañado (sus textos se volvieron códigos «·x…»). Se repuso el original: surcos cafés, y más oscuros cuando están regados.
- **Barras de energía, vida y aliento.** Ahora son un panel de azulejo de Talavera con tres medidores esmaltados y su glifo: pluma (aliento), corazón (vida) y mazorca (energía). El medallón parpadea en rojo cuando queda menos del 20 %, y lo que acabas de perder se ve un momento en rojo claro.
- **Tiendas del pueblo.** Ventanas enmarcadas en azulejo, guardapolvo de Talavera al pie del muro, contorno de tinta estilo códice, y los letreros son placas de Talavera con letra azul cobalto.
- **Paneles compactos en celular.** El reloj ocupa menos alto, el panel de fama tiene menos relleno, la mini-bolsa muestra una fila, y el tutorial se acomoda justo debajo de los paneles.
- **Barra de herramientas.** Las cantidades se abrevian (400k).

`mundo-antes-despues.jpg` y `tiendas-talavera.jpg` muestran el cambio.

## Casas, interiores, palacio y aldeas (tercera ronda)

- **Palacio de Xicohténcatl.** Parecía un templo griego de columnas. Ahora es un tecpan tlaxcalteca: basamento de talud y tablero rojo con greca, escalinata con alfardas, pórtico de pilares pintados, friso con greca, almenas escalonadas, el estandarte rojo con la garza blanca de Tizatlán, estandartes de pluma (pantli) y braseros.
- **Sala del palacio.** Mural azul con chalchihuites y grecas, escudos (chimalli) y estandartes de pluma en el muro, icpalli de tule con piel de jaguar, piso de aplanado rojizo y un petate largo en lugar de la alfombra roja y el piso de ajedrez europeo.
- **Interiores de casas y tiendas.** Vigas de madera en el techo, muro de aplanado con guardapolvo rojo, y nichos con ofrenda (olla y flores de cempasúchil) en vez de ventanas de vidrio, que no existían antes de la conquista. La iglesia y la casa del capitán españoles conservan sus ventanas.
- **Tu casa.** Muros de adobe con remate rojo y contorno de tinta.
- **Casas del pueblo y de las aldeas.** Cimiento de piedra, dintel de madera sobre la puerta, contorno de tinta, ollas de barro y magueyes; las chozas otomíes también llevan magueyes y ollas.

`palacio-antes-despues.jpg` e `interiores-antes-despues.jpg` muestran el cambio.
