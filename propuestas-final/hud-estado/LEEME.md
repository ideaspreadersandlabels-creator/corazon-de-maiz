# Corazón de Maíz · panel de estado

Reemplaza la columna de la derecha del HUD (reloj, fama, equipo y encargo) con el mismo azulejo de Talavera de los menús. Abre `index.html` para ver el antes y el después.

## Cómo ponerlo en el juego

1. Copia a tu juego `estado.css`, `estado.js` y la carpeta `azulejos/`, juntos en la misma carpeta.
2. En el HTML del juego carga las fuentes, el CSS y el JS:

```html
<link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,700;0,800;1,600;1,700;1,800&family=Alegreya+Sans:wght@500;700;800&family=Cinzel:wght@700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="estado.css">
<script src="estado.js"></script>
```

3. Pon un contenedor donde iban las franjas azules (y quita las franjas viejas):

```html
<div id="estado" style="position:absolute; top:8px; right:8px;"></div>
```

4. Cada vez que cambie algo (la hora, el cacao, la fama, el encargo…), llama a `render` con los datos:

```js
CdmEstado.render(document.getElementById('estado'), {
  estacion: 'Verano', dia: 3, anio: 1,
  clima: 'lluvia',          // 'sol' | 'nublado' | 'lluvia' | 'tormenta'
  hora: '7:10 am', cacao: 397018,
  fama: { valor: -80, nombre: 'Deshonrado' },        // -100 a 100
  equipo: { cantidad: 18, defensa: 0, tecla: 'I' },  // icono: opcional, p. ej. 'obsidiana'
  encargo: { quien: 'Yolotl', objeto: 'calabaza', nombre: 'calabaza', cantidad: 1, dias: 3, tienes: 400000 },
});
```

Si no hay encargo activo, quita `encargo` y esa sección desaparece (igual con `fama` y `equipo`).

## Qué muestra

- **Fama:** cráneo si es negativa, flor si es positiva y pluma de quetzal desde +50. La barra va de -100 a +100 con una marca en el centro.
- **Encargo:** el ícono del objeto, los días que quedan en puntos (en rojo si vence en un día) y «✓ Ya la tienes» o «Te faltan N».
- `objeto` puede ser cualquiera de los 18 íconos: coa, cantaro, hacha, obsidiana, maiz, maizAzul, frijol, calabaza, chile, cacao, tlaxcalli, octli, nopal, cempa, sal, copal, chimalli, costal.
