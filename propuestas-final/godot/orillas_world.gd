# ---- Orillas suaves para scripts/world.gd ----
# 1) Renombra la función vieja `_paint_shores` a `_paint_shores_viejo`.
# 2) Pega esto en world.gd. No cambia la lógica del agua: el agua sigue siendo T_WATER
#    en $TileMapLayer; la orilla se dibuja ENCIMA en una capa aparte ("Orillas").
# 3) Si el suelo del juego es el atlas pixel (terrain.png) usa orillas_pixel.*;
#    si ya pasaste al suelo códice (suelo_codice.tres) usa orillas_codice.*.

const ORILLA_TABLA = preload("res://assets/arte_codice/orillas/orillas_pixel.gd")
const ORILLA_PNG = "res://assets/arte_codice/orillas/orillas_pixel.png"
const ORILLA_DIRS = [Vector2i(0, -1), Vector2i(1, -1), Vector2i(1, 0), Vector2i(1, 1),
    Vector2i(0, 1), Vector2i(-1, 1), Vector2i(-1, 0), Vector2i(-1, -1)]
var orillas_layer: TileMapLayer = null

func _paint_shores():
    if not ResourceLoader.exists(ORILLA_PNG):
        _paint_shores_viejo()
        return
    var ts = TileSet.new()
    ts.tile_size = Vector2i(32, 32)
    var src = TileSetAtlasSource.new()
    src.texture = load(ORILLA_PNG)
    src.texture_region_size = Vector2i(32, 32)
    for c in ORILLA_TABLA.ATLAS.values():
        src.create_tile(c)
    ts.add_source(src, 0)
    orillas_layer = TileMapLayer.new()
    orillas_layer.name = "Orillas"
    orillas_layer.tile_set = ts
    orillas_layer.material = tilemap.material
    orillas_layer.position = tilemap.position
    orillas_layer.z_index = tilemap.z_index      # mismo nivel que el suelo...
    tilemap.add_sibling(orillas_layer)           # ...pero dibujada después, encima
    for y in range(SURFACE_H):
        for x in range(MW):
            _orilla_en(Vector2i(x, y))

func _orilla_en(p: Vector2i):
    if orillas_layer == null:
        return
    if ground(p) != T_WATER:
        orillas_layer.erase_cell(p)
        return
    var m = 0
    for i in range(8):
        var q = p + ORILLA_DIRS[i]
        if q.x >= 0 and q.y >= 0 and q.x < MW and q.y < SURFACE_H and _is_land(q):
            m |= 1 << i
    m = ORILLA_TABLA.canon(m)
    if m == 0:
        orillas_layer.erase_cell(p)
    else:
        orillas_layer.set_cell(p, 0, ORILLA_TABLA.ATLAS[m])

# Si en algún lugar el juego cambia agua <-> tierra después de generar el mundo
# (cargar partida con tile_changes, rellenar, etc.), llama después:
#   for d in [Vector2i.ZERO] + ORILLA_DIRS: _orilla_en(pos + d)
