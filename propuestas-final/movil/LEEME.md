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
