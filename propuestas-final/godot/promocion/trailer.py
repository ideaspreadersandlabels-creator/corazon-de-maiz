import os, sys, math
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(__file__))
from escena import escena, carga, K, F, C, P
OUT=P+'/promo/trailer_frames'; os.makedirs(OUT,exist_ok=True)
W,H=1280,720
UI=P+'/ui_png'
bree=lambda s: ImageFont.truetype('/home/claude/corazon-de-maiz-godot/fonts/BreeSerif.ttf',s)
nun=lambda s: ImageFont.truetype('/home/claude/corazon-de-maiz-godot/fonts/Nunito-Bold.ttf',s)
n=0
def guarda(im):
    global n
    im.convert('RGB').save(f'{OUT}/f{n:04d}.png'); n+=1
def texto_banda(im,t):
    d=ImageDraw.Draw(im); f=bree(44); w=d.textlength(t,font=f)
    d.rounded_rectangle(((W-w)/2-30,H-110,(W+w)/2+30,H-40),radius=30,fill=(251,244,228,235),outline=(122,74,58),width=5)
    d.text(((W-w)/2,H-102),t,font=f,fill=(122,74,58))
# --- 1) la granja: la cámara avanza y el jugador camina por el camino
act=[(F+'/animales/guajolote/picotea.png',640,700,0.9),(F+'/mascotas/gato/dormir.png',380,380,0.9),(F+'/animales/caballo/comer.png',300,900,1.0),
     (F+'/animales/caballo/potrillo.png',420,930,1.0),(K+'/michin/barrer_abajo_0.png',650,420,0.33),(F+'/animales/pato/quieto.png',780,760,0.9),
     (K+'/xochitl/quieto_abajo.png',1180,566,0.33)]
base=escena(actores=act)
caminar=[carga(K+f'/player/caminar_derecha_{i}.png',0.33) for i in range(4)]
perro=[carga(F+f'/mascotas/perro/{m}.png',0.9) for m in ('caminar_1','caminar_2')]
N=42
for i in range(N):
    t=i/(N-1)
    px=300+t*820
    cam=min(1920-W,max(0,px-W/2+100))
    fr=base.copy()
    c=caminar[i%4]; fr.alpha_composite(c,(int(px-c.width/2),572-c.height))
    pr=perro[(i//2)%2]; fr.alpha_composite(pr,(int(px-90-pr.width/2),580-pr.height))
    im=fr.crop((int(cam),180,int(cam)+W,180+H))
    if i<18: texto_banda(im,'Siembra tu milpa en Tlaxcallan')
    guarda(im)
# --- 2) los cultivos crecen
for et in range(5):
    fr=escena(actores=[(K+'/player/regar_abajo_%d.png'%(et%2),1000,520,0.33)],cultivo_etapa=et)
    im=fr.crop((640,380,640+W,380+H))
    if et==4:
        br=carga(UI+'/efectos/brillo_1.png',1.4)
        for (x,y) in ((500,300),(760,420),(980,260)): im.alpha_composite(br,(x,y))
    texto_banda(im,'Maíz, frijol y calabaza')
    for _ in range(4): guarda(im)
# --- 3) platica con los vecinos
fondo=base.crop((560,240,560+W,240+H)).convert('RGBA')
fondo=Image.blend(fondo,Image.new('RGBA',(W,H),(40,30,30,255)),0.25)
panel=Image.open(UI+'/dialogo/panel_dialogo.png').convert('RGBA')
def nine(img,w,h,m=48):
    out=Image.new('RGBA',(w,h));iw,ih=img.size
    cs=[(0,m,0,m),(m,iw-m,0,m),(iw-m,iw,0,m),(0,m,m,ih-m),(m,iw-m,m,ih-m),(iw-m,iw,m,ih-m),(0,m,ih-m,ih),(m,iw-m,ih-m,ih),(iw-m,iw,ih-m,ih)]
    ds=[(0,m,0,m),(m,w-m,0,m),(w-m,w,0,m),(0,m,m,h-m),(m,w-m,m,h-m),(w-m,w,m,h-m),(0,m,h-m,h),(m,w-m,h-m,h),(w-m,w,h-m,h)]
    for (a,b,c,d),(e,f,g,hh) in zip(cs,ds):
        out.paste(img.crop((a,c,b,d)).resize((f-e,hh-g)),(e,g))
    return out
caja=nine(panel,1040,230)
marco=carga(UI+'/dialogo/marco_retrato.png',0.85)
lineas=[('feliz','¡Bienvenido a Tlaxcallan! Traje flores del tianguis.'),('apenado','¿Son... para mí? ¡Qué bonito detalle!')]
for cara,txt in lineas:
    ret=carga(K+f'/xochitl/retrato_{cara}.png',0.42)
    for k in range(len(txt)//3+10):
        im=fondo.copy()
        x0,y0=120,H-260
        im.alpha_composite(caja,(x0,y0))
        im.alpha_composite(marco,(x0-40,y0-150)); im.alpha_composite(ret,(x0-40+(marco.width-ret.width)//2,y0-150+(marco.height-ret.height)//2))
        d=ImageDraw.Draw(im)
        d.rounded_rectangle((x0+220,y0-26,x0+420,y0+26),radius=26,fill=(232,138,90),outline=(122,74,58),width=4)
        d.text((x0+255,y0-20),'Xóchitl',font=bree(34),fill=(251,244,228))
        d.text((x0+230,y0+60),txt[:k*3],font=nun(36),fill=(90,58,42))
        if cara=='apenado' and k>len(txt)//3:
            b=carga(UI+'/burbujas/corazon.png',1.4); im.alpha_composite(b,(x0+90,y0-300))
            ef=carga(UI+'/efectos/corazones_%d.png'%(k%4),1.6); im.alpha_composite(ef,(x0+60,y0-240))
        guarda(im)
# --- 4) cierre con el logo
cierre=Image.open(P+'/promo/portadas/fondo_con_logo_1920x1080.png').convert('RGBA').resize((W,H),Image.LANCZOS)
for k in range(30):
    im=cierre.copy()
    if k<8: im=Image.blend(fondo.convert('RGBA'),cierre,k/8)
    d=ImageDraw.Draw(im); f=nun(30); t='Próximamente'
    w=d.textlength(t,font=f); d.text(((W-w)/2,H-60),t,font=f,fill=(251,244,228),stroke_width=4,stroke_fill=(122,74,58))
    guarda(im)
print(n,'cuadros')
