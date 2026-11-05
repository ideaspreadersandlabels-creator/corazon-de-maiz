extends Node

# Iluminación de "Corazón de Maíz" — reemplaza a scripts/systems/lighting.gd
# Igual API que antes (set_hour, advance_time, get_ambient_color, get_darkness,
# get_preset_name y las mismas señales), pero el color del cielo se mezcla
# suavemente entre las horas en vez de saltar de golpe.
# La noche es azul añil legible (no casi negra) para que se vean las luces cálidas.

var current_hour = 6.0
var day_length = 24.0
var ambient_light = Color(1, 1, 1, 1)
var darkness_level = 0.0
var current_preset = "morning"

# hora -> [color ambiente, oscuridad]
const KEYS = [
    [0.0,  Color(0.26, 0.29, 0.50), 0.92],   # medianoche
    [4.5,  Color(0.30, 0.32, 0.54), 0.88],
    [5.5,  Color(0.62, 0.52, 0.62), 0.45],   # alba morada
    [6.5,  Color(1.00, 0.80, 0.62), 0.20],   # amanecer dorado
    [8.0,  Color(1.00, 0.97, 0.92), 0.03],
    [12.0, Color(1.00, 1.00, 1.00), 0.00],
    [16.0, Color(1.00, 0.95, 0.86), 0.06],
    [17.8, Color(1.00, 0.74, 0.52), 0.30],   # atardecer naranja
    [19.0, Color(0.70, 0.50, 0.62), 0.55],   # crepúsculo
    [20.5, Color(0.36, 0.38, 0.62), 0.80],   # noche
    [24.0, Color(0.26, 0.29, 0.50), 0.92],
]

signal time_of_day_changed(preset: String)
signal ambient_light_changed(color: Color)
signal darkness_changed(level: float)

func _ready():
    update_lighting()

func _sample(hour: float) -> Array:
    for i in range(KEYS.size() - 1):
        var a = KEYS[i]
        var b = KEYS[i + 1]
        if hour >= a[0] and hour <= b[0]:
            var t = (hour - a[0]) / max(0.001, b[0] - a[0])
            t = t * t * (3.0 - 2.0 * t)  # suavizado
            return [a[1].lerp(b[1], t), lerpf(a[2], b[2], t)]
    return [KEYS[0][1], KEYS[0][2]]

func update_lighting():
    var preset_name = get_time_preset(current_hour)
    if preset_name != current_preset:
        current_preset = preset_name
        time_of_day_changed.emit(preset_name)
    var s = _sample(current_hour)
    ambient_light = s[0]
    darkness_level = s[1]
    ambient_light_changed.emit(ambient_light)
    darkness_changed.emit(darkness_level)

func get_time_preset(hour: float) -> String:
    if hour >= 5 and hour < 7: return "dawn"
    elif hour >= 7 and hour < 10: return "morning"
    elif hour >= 10 and hour < 14: return "noon"
    elif hour >= 14 and hour < 17: return "afternoon"
    elif hour >= 17 and hour < 19: return "dusk"
    elif hour >= 19 and hour < 21: return "evening"
    elif hour >= 21 and hour < 24: return "night"
    return "midnight"

func set_hour(hour: float):
    current_hour = fmod(hour, 24.0)
    update_lighting()

func advance_time(hours: float):
    current_hour = fmod(current_hour + hours, 24.0)
    update_lighting()

func get_ambient_color() -> Color:
    return ambient_light

func get_darkness() -> float:
    return darkness_level

func get_preset_name() -> String:
    return current_preset
