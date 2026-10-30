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
