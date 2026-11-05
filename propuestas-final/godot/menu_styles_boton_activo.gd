# Cambio en scripts/ui/menu_styles.gd -> función material_style()
# Ahora obsidiana, terracota y amate también usan su <nombre>_button_active.svg
# (antes solo aclaraban el botón con modulate). Reemplaza la función completa:

static func material_style(button: bool = false, active: bool = false) -> StyleBoxTexture:
    if selected() == 0:
        return ceramic_style(button, active)
    var names = ["talavera", "obsidian", "terracotta", "amate"]
    var part = "frame"
    if button:
        part = "button_active" if active else "button"
    var path = "res://assets/ui/%s_%s.svg" % [names[selected()], part]
    if not ResourceLoader.exists(path):
        path = "res://assets/ui/%s_button.svg" % names[selected()]
    var style = StyleBoxTexture.new()
    style.texture = texture(path)
    var margin = 11 if button else 30
    for side in [SIDE_LEFT, SIDE_TOP, SIDE_RIGHT, SIDE_BOTTOM]:
        style.set_texture_margin(side, margin)
        style.set_content_margin(side, 14 if button else 36)
    style.axis_stretch_horizontal = StyleBoxTexture.AXIS_STRETCH_MODE_TILE_FIT
    style.axis_stretch_vertical = StyleBoxTexture.AXIS_STRETCH_MODE_TILE_FIT
    return style
