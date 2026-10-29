# Corazón de Maíz · intro

Intro animado de 3:32, sincronizado con la canción del juego. Las escenas están pintadas como murales de Talavera y los personajes van en estilo Códice Borgia.

- **Para verlo:** abre `corazon-de-maiz-intro.html` (trae la canción adentro y funciona sin internet).
- **Para editarlo:** usa `index.html` con los archivos sueltos y vuelve a generar el archivo único con `python3 build.py`.

## Controles

| Tecla | Acción |
| --- | --- |
| Enter, Espacio o clic | Termina de escribir el texto, o salta al siguiente momento de la historia (la canción salta también) |
| Esc | Va directo al título |
| M | Silencia la música |
| Cuadritos de arriba | Saltan a una escena |

Al terminar, en el título, Enter o el botón «¡Que empiece tu historia!» bajan la música y lanzan el evento `cdm:intro-end` en `window`. El juego lo escucha para pasar al menú:

```js
window.addEventListener('cdm:intro-end', () => mostrarMenuDeInicio());
```

## Archivos

| Archivo | Qué contiene |
| --- | --- |
| `intro-story.js` | El guion: las 11 escenas, cuándo entra cada cosa y los textos de la narración |
| `intro-art.js` | El arte pintado en azulejo: cielos, la Malinche, templos, maíz, garzas, barco… |
| `intro.js` | El reproductor: usa la canción como reloj, así que imagen y música nunca se separan |
| `intro.css` | Animaciones, transición de azulejos, panel de texto |
| `lyrics.js` | La letra con sus tiempos (sale del archivo de audio original) |
| `assets/corazon-de-maiz-cancion.mp3` | La canción |
| `build.py` | Junta todo en `corazon-de-maiz-intro.html` |

Usa también `../../propuestas-v2/chars.js`, `../../propuestas-v2/textures.js` y `../../propuestas-v4/figs4.js` (personajes y azulejos).

## Escenas y canción

| Tiempo | Lo que se canta | Escena |
| --- | --- | --- |
| 0:00 | «¡Corazón de Maíz!» | La Malinche de noche; el corazón de maíz se arma grano por grano |
| 0:22 | «¡Que retumbe el huéhuetl!» | Tenochtitlan sobre su lago (transición de azulejos) |
| 0:37 | (música) | La frontera: sin sal, sin algodón, sin cacao; se alza el estandarte de la garza |
| 0:52 | «Sobre el valle se levanta…» | Amanece en Tlaxcallan; pasan las garzas en «va la garza» |
| 1:02 | «Tengo tierra y tengo coa…» | Llegas a tu milpa; brotan las plantas en «siembra la milpa»; suena el caracol |
| 1:20 | «¡Ven, ven, ven!» | Xicohténcatl en Tizatlán; los guerreros llegan y saltan con cada «ven» |
| 1:35 | (puente) | El maizal se dobla con el viento y anochece: «corazón de maíz» |
| 2:02 | «Las del valle ya te esperan» | Las mujeres del valle junto al río |
| 2:12 | «Vienen casas sobre el mar» | El barco español aparece entre la niebla |
| 2:33 | «Tlaxcallan abre sus caminos» | Amanecer; tus huellas marcan el camino |
| 2:51 | (coro final) | Lo que vas a hacer: sembrar, comerciar, defender, honrar, amar |
| 3:12 | «¡Corazón de Maíz!» | Título con tu personaje y las mujeres del valle |
