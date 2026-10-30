"""Une los 11 clips del intro (768×768, 24 fps) con fundidos y les pone la canción.

La canción suena desde el principio hasta que entra el título; ahí salta al final
(«¡Corazón de Maíz! … Tu historia empieza al amanecer») y el cuadro del título se
sostiene hasta que termina.

Uso: python3 montar.py clip00.mp4 … clip10.mp4 cancion.mp3 salida.mp4
"""
import subprocess, sys

*clips, song, out = sys.argv[1:]
D, X, n = 7.2917, 0.6, len(clips)          # duración de cada clip, fundido, cantidad
step = D - X
title_start = (n - 1) * step
lenA = title_start + 0.74
B0, AX = 190.8, 1.5                          # inicio del outro en la canción, cruce de audio
total = lenA + (212.0 - B0) - AX
hold = total - title_start - D

inputs = sum([['-i', c] for c in clips], [])
fc, prev = [], '[0:v]'
for i in range(1, n):
    src = f'[{i}:v]'
    if i == n - 1:
        fc.append(f'{src}tpad=stop_mode=clone:stop_duration={hold:.3f}[t]'); src = '[t]'
    fc.append(f'{prev}{src}xfade=transition=fade:duration={X}:offset={i * step:.3f}[v{i}]'); prev = f'[v{i}]'
fc.append(f'{prev}fade=t=in:st=0:d=1.2,fade=t=out:st={total - 2.5:.3f}:d=2.5,format=yuv420p[vout]')
fc.append(f'[{n}:a]atrim=0:{lenA:.3f},asetpts=PTS-STARTPTS[a1];[{n + 1}:a]atrim={B0}:212,asetpts=PTS-STARTPTS[a2];'
          f'[a1][a2]acrossfade=d={AX}:c1=tri:c2=tri,afade=t=out:st={total - 3:.3f}:d=3[aout]')
subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-i', song, '-i', song, '-filter_complex', ';'.join(fc),
                '-map', '[vout]', '-map', '[aout]', '-c:v', 'libx264', '-crf', '17', '-preset', 'slow',
                '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-t', f'{total:.3f}', out], check=True)
print(f'{out}: {total:.1f} s')
