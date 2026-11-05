extends PointLight2D
# Parpadeo de fuego para antorchas, braseros y fogones.
# Se le pone a la luz ANTES de add_child; toma la intensidad (energy) que ya tenga.
# Las ventanas NO llevan este script (su luz es pareja).

@export var amount := 0.12   # cuánto varía la intensidad
@export var speed := 7.0     # qué tan rápido parpadea
var base_energy := 0.9
var _t := 0.0

func _ready():
    base_energy = energy
    _t = randf() * 100.0     # cada fuego parpadea distinto

func _process(delta):
    if not enabled:
        return
    _t += delta * speed
    var n = sin(_t) * 0.5 + sin(_t * 2.3 + 1.1) * 0.3 + sin(_t * 5.7) * 0.2
    energy = base_energy * (1.0 + n * amount)
