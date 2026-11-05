# Reemplazo de add_light() en scripts/world.gd
# kind: "antorcha" (parpadea), "brasero" (parpadea, más ancha), "ventana" (pareja, cuadrada)
const LUZ_TEX = {
    "antorcha": "res://assets/arte_codice/luces/luz_antorcha.png",
    "brasero": "res://assets/arte_codice/luces/luz_brasero.png",
    "ventana": "res://assets/arte_codice/luces/luz_ventana.png",
}

func add_light(parent: Node2D, pos: Vector2, radius: float, color: Color, energy: float = 0.9, kind: String = "antorcha"):
    var light = PointLight2D.new()
    var path = LUZ_TEX.get(kind, "")
    light.texture = load(path) if path != "" and ResourceLoader.exists(path) else _make_light_texture()
    light.texture_scale = radius * 2.0 / 256.0
    light.color = color
    light.energy = energy
    light.position = pos
    light.enabled = lights_on
    if kind in ["antorcha", "brasero"]:
        light.set_script(load("res://scripts/visual/parpadeo_luz.gd"))
    parent.add_child(light)
    lights.append(light)
    return light
