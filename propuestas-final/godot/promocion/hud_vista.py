import sys
from PIL import Image, ImageDraw, ImageFont
P='/tmp/claude-0/-home-claude/0c1457f6-5ef2-51bf-9b92-f5fb42446de0/scratchpad'
H=P+'/hud_png/hud/'
def nine(img,w,h,m):
    out=Image.new('RGBA',(w,h));iw,ih=img.size
    mx,my=(m,m) if isinstance(m,int) else m
    xs=[(0,mx,0,mx),(mx,iw-mx,mx,w-mx),(iw-mx,iw,w-mx,w)];ys=[(0,my,0,my),(my,ih-my,my,h-my),(ih-my,ih,h-my,h)]
    for a,b,c,d in xs:
        for e,f,g,hh in ys:
            if b>a and f>e and d>c and hh>g: out.paste(img.crop((a,e,b,f)).resize((d-c,hh-g)),(c,g))
    return out
L=lambda n: Image.open(H+n+'.png').convert('RGBA')
nun=lambda s: ImageFont.truetype('/home/claude/corazon-de-maiz-godot/fonts/Nunito-Bold.ttf',s)
bree=lambda s: ImageFont.truetype('/home/claude/corazon-de-maiz-godot/fonts/BreeSerif.ttf',s)
im=Image.open(P+'/promo/escena_granja.png').convert('RGBA')
d=ImageDraw.Draw(im);T=(90,58,42)
# reloj y fecha (arriba a la izquierda)
disco=L('disco_dia_noche').rotate(-40,resample=Image.BICUBIC)  # media mañana
marco=L('marco_reloj')
cx,cy=40+marco.width//2,24+160
mitad=disco.crop((0,0,disco.width,disco.height//2))
im.alpha_composite(mitad,(cx-disco.width//2,cy-disco.height//2))
# tapar la mitad de abajo del disco con el marco y un panel
im.alpha_composite(marco,(40,24))
pf=nine(L('panel_fecha'),400,80,36);im.alpha_composite(pf,(20,200))
im.alpha_composite(L('estacion_primavera'),(36,208));im.alpha_composite(L('clima_sol'),(352,208))
d.text((104,219),'Primavera · Día 14 · 9:20',font=nun(26),fill=T)
# minimapa (arriba a la derecha)
mm=L('marco_minimapa');mini=im.crop((0,0,1920,1080)).resize((248,140)).crop((0,0,248,248)) if False else im.resize((248,248))
im.alpha_composite(mini,(1920-320+36,24+36));im.alpha_composite(mm,(1920-320,24))
# estado (abajo a la izquierda)
pe=nine(L('panel_estado'),470,200,48);im.alpha_composite(pe,(20,860))
for i,(ic,rl,v,t) in enumerate((('icono_vida','relleno_vida',1.0,'100'),('icono_energia','relleno_energia',0.72,'72'),('icono_agua','relleno_agua',0.45,'45'))):
    y=890+i*52
    im.alpha_composite(L(ic),(44,y-6))
    mb=nine(L('marco_barra'),280,48,(24,20));im.alpha_composite(mb,(116,y))
    r=nine(L(rl),int(260*v),28,(14,14));im.alpha_composite(r,(126,y+10))
    d.text((404,y+8),t,font=nun(22),fill=T)
# barra de herramientas (abajo al centro)
herr=['coa_basica','cantaro_basica','hacha_cobre','pico_basica','cuchillo_obsidiana']
bf=nine(L('barra_fondo'),8*104+40,136,48);x0=(1920-bf.width)//2;im.alpha_composite(bf,(x0,930))
for i in range(8):
    c=L('casilla_activa' if i==0 else 'casilla');x=x0+20+i*104;im.alpha_composite(c,(x,946))
    if i<len(herr):
        try:
            h=Image.open(P+f'/conv/../godot-arte/herramientas/{herr[i]}.png').convert('RGBA');h.thumbnail((64,64));im.alpha_composite(h,(x+(96-h.width)//2,946+(96-h.height)//2))
        except Exception: pass
    n=L('numero_tecla');im.alpha_composite(n,(x+62,1004));d.text((x+71,1009),str(i+1),font=nun(18),fill=(251,244,228),anchor='mt')
# cacao
im.alpha_composite(L('cacao'),(1920-320,300));d.text((1920-250,312),'1,250',font=bree(34),fill=(251,244,228),stroke_width=5,stroke_fill=(122,74,58))
# aviso
av=nine(L('aviso'),520,96,48);im.alpha_composite(av,(700,40))
ic=Image.open(P+'/fauna_png/animales/guajolote/quieto.png').convert('RGBA');ic.thumbnail((52,52));im.alpha_composite(ic,(722,62))
d.text((800,70),'¡Tu guajolota puso un huevo!',font=nun(26),fill=T)
# letrero de la casa
lt=nine(L('letrero'),300,112,(48,32));im.alpha_composite(lt,(330,20))
d.text((480,48),'Tu casa',font=bree(30),fill=T,anchor='mt')
# indicación de tecla
im.alpha_composite(L('tecla_e'),(1060,490));d.text((1124,500),'Hablar con Xóchitl',font=nun(24),fill=(251,244,228),stroke_width=4,stroke_fill=(122,74,58))
im.convert('RGB').save(P+'/promo/hud_vista.png');im.convert('RGB').resize((960,540)).save(P+'/vistas/hud_vista.png')
