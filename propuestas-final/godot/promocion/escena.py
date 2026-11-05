"""Escena de la granja con las piezas reales (mundo a 64 px por casilla)."""
import json, random, sys
from PIL import Image
P='/tmp/claude-0/-home-claude/0c1457f6-5ef2-51bf-9b92-f5fb42446de0/scratchpad'
C=P+'/conv'; K=P+'/cozy_png'; F=P+'/fauna_png'
T=64
atlas=Image.open(C+'/suelo/atlas_suelo_32.png').convert('RGBA')
mapa=json.load(open(C+'/suelo/atlas_suelo_32.json'))
def tile(n):
    x,y=mapa[n][:2];return atlas.crop((x*32,y*32,x*32+32,y*32+32)).resize((T,T),Image.BICUBIC)
def carga(p,s=1.0):
    im=Image.open(p).convert('RGBA')
    return im.resize((int(im.width*s),int(im.height*s)),Image.LANCZOS) if s!=1 else im
def escena(W=1920,H=1080,actores=(),semilla=5,cultivo_etapa=4):
    r=random.Random(semilla)
    M=Image.new('RGBA',(W,H))
    pasto=[tile('pasto'),tile('pasto-2'),tile('pasto-flores'),tile('pasto')]
    for ty in range(H//T+1):
        for tx in range(W//T+1):
            M.paste(r.choice(pasto),(tx*T,ty*T))
    for tx in range(W//T+1):  # camino
        M.paste(tile('camino'),(tx*T,8*T))
    for ty in range(5,8): M.paste(tile('camino'),(7*T,ty*T))
    for ty in range(9,14):    # milpa
        for tx in range(15,27): M.paste(tile('tierra-mojada' if (tx+ty)%3==0 else 'tierra'),(tx*T,ty*T))
    cosas=[]  # (y_base, imagen, x, y)
    def pon(im,x,ybase):
        cosas.append((ybase,im,int(x-im.width/2),int(ybase-im.height)))
    casa=carga(C+'/edificios/tu_casa_nivel_3.png',1.0); pon(casa,7.5*T,5.4*T)
    for (tx,ty,n) in ((2,4,'arbol_verano_0'),(12,3,'frutal_verano'),(28,5,'arbol_verano_1'),(1,13,'arbol_verano_1'),(29,14,'frutal_verano'),(13,15,'arbol_verano_0')):
        pon(carga(C+f'/naturaleza/{n}.png',1.25),tx*T,ty*T)
    for _ in range(14):
        tx,ty=r.randint(0,29),r.randint(0,16)
        if 8<=ty<=13 and 14<=tx<=27 or ty==8: continue
        pon(carga(C+f'/naturaleza/{r.choice(["zacate_verano_0","zacate_verano_1","arbusto_verano","piedra_grupo"])}.png',0.8),tx*T+32,ty*T+40)
    for ty in range(9,14):
        for tx in range(15,27):
            n=['maiz','maiz','calabaza','maiz','frijol'][(tx)%5]
            et=min(4,cultivo_etapa) if n!='calabaza' else min(3,cultivo_etapa)
            try: pon(carga(C+f'/cultivos/{n}/etapa_{et}.png',0.5),tx*T+32,ty*T+60)
            except FileNotFoundError: pass
    for (img,x,y,s) in actores:
        pon(carga(img,s),x,y)
    for _,im,x,y in sorted(cosas,key=lambda c:c[0]):
        M.alpha_composite(im,(max(-im.width,x),max(-im.height,y))) if x>=0 and y>=0 else M.paste(im,(x,y),im)
    return M
if __name__=='__main__':
    act=[(K+'/player/caminar_derecha_1.png',860,572,0.33),(K+'/xochitl/saludar_abajo_0.png',1010,566,0.33),
         (F+'/animales/guajolote/picotea.png',640,700,0.9),(F+'/mascotas/perro/quieto.png',900,640,0.9),
         (F+'/mascotas/gato/dormir.png',380,380,0.9),(F+'/animales/caballo/comer.png',300,900,1.0),(F+'/animales/caballo/potrillo.png',420,930,1.0),
         (K+'/michin/barrer_abajo_0.png',650,420,0.33),(F+'/animales/pato/quieto.png',780,760,0.9)]
    escena(actores=act).convert('RGB').save(P+'/promo/escena_granja.png')
