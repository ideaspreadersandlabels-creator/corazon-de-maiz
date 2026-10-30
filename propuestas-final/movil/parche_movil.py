"""Parche para que Corazón de Maíz se vea bien en el celular.

El juego dibuja toda la interfaz en un canvas pensado para pantallas de computadora
(unos 1280 px de ancho). En un celular (412 px) los paneles se enciman y tapan el campo.
Este parche agrega una escala de interfaz UIK: si la pantalla mide menos de 600 de
ancho o 560 de alto, el juego dibuja como si midiera eso y todo se reduce en proporción.
El mundo conserva su tamaño (el zoom se ajusta solo) y los toques se convierten a la
misma escala, así que los botones siguen respondiendo donde se ven.

Uso:  python3 parche_movil.py ruta/a/index.html     (modifica el archivo; idempotente)
"""
import sys

path = sys.argv[1]
s = open(path, encoding='utf-8').read()
if 'globalThis.UIK' in s:
    print('ya estaba aplicado'); sys.exit(0)

DPR = 'Math.min(2, Math.max(1, Math.round(devicePixelRatio || 1)))'

def rep(old, new, count=1):
    global s
    n = s.count(old)
    assert n == count, f'esperaba {count} y hay {n}: {old[:70]}'
    s = s.replace(old, new)

# 1. Escala de interfaz al cambiar el tamaño de la pantalla.
rep(f"""  const dpr = {DPR};
  VW = Math.max(1, innerWidth); VH = Math.max(1, innerHeight); 
  cv.width = VW * dpr; cv.height = VH * dpr; cv.style.width = VW + 'px'; cv.style.height = VH + 'px';""",
f"""  // UIK: en pantallas chicas (celular) la interfaz se dibuja en un lienzo virtual de al
  // menos 640×560 y se reduce en proporción; los toques se convierten con la misma escala.
  // La portada ya se adapta sola: ahí no se escala.
  globalThis.UIK = UI.menu === 'title' ? 1 : Math.min(1, Math.max(1, innerWidth) / 600, Math.max(1, innerHeight) / 560);
  const dpr = {DPR} * UIK;
  VW = Math.max(1, innerWidth) / UIK; VH = Math.max(1, innerHeight) / UIK;
  cv.width = Math.round(VW * dpr); cv.height = Math.round(VH * dpr); cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px';""")

# 2. Los demás lugares que dibujan con el dpr: multiplicar por UIK (no en el onResize de R27,
#    que ya trabaja con innerWidth en pixeles reales).
r27 = s.index('const onResize = () => {\n    const w = Math.max(1, innerWidth)')
head, tail = s[:r27], s[r27:]
end = tail.index('};') + 2
protected, tail = tail[:end], tail[end:]
head = head.replace(DPR, f'({DPR} * (globalThis.UIK || 1))')
tail = tail.replace(DPR, f'({DPR} * (globalThis.UIK || 1))')
# el primero (resize) ya quedó reescrito arriba; deshacer el doble escalado ahí
head = head.replace(f'const dpr = ({DPR} * (globalThis.UIK || 1))) * UIK;', f'const dpr = {DPR} * UIK;')
s = head + protected + tail

# 3. Resolución reducida (resWant): mantener el tamaño CSS real.
rep("cv.style.width = VW + 'px'; cv.style.height = VH + 'px'; ctx.imageSmoothingEnabled = false;",
    "cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px'; ctx.imageSmoothingEnabled = false;")
rep("Math.round(VW * dpr * sc);", "Math.round(VW * dpr * sc);")  # (ya usa el dpr escalado)
rep("R28.glCv.width !== W || R28.glCv.height !== H) { R28.glCv.width = W; R28.glCv.height = H; }",
    "R28.glCv.width !== Math.round(W) || R28.glCv.height !== Math.round(H)) { R28.glCv.width = Math.round(W); R28.glCv.height = Math.round(H); }")

# 3b. Al salir o volver a la portada, recalcular la escala.
rep("function update(dt) {\n  T += dt;",
    "function update(dt) {\n  T += dt;\n  { const t = UI.menu === 'title'; if (UI._uikTitle !== t) { UI._uikTitle = t; resize(); } }")

# 4. Toques y mouse: el navegador entrega las coordenadas ya convertidas a la escala.
#    También agranda los botones táctiles para que sigan siendo fáciles de tocar.
rep("const JOY = { x:() => 84, y:() => VH - 190, r:54 };",
"""// Coordenadas de toque y mouse en la escala de la interfaz (ver UIK en resize).
{
  // Toques y mouse leen clientX/clientY ya divididos entre UIK (solo cambia en celular).
  for (const proto of [MouseEvent.prototype, typeof Touch !== 'undefined' && Touch.prototype].filter(Boolean))
    for (const prop of ['clientX', 'clientY']) {
      const d = Object.getOwnPropertyDescriptor(proto, prop);
      if (d && d.get) Object.defineProperty(proto, prop, { configurable:true, enumerable:d.enumerable, get() { return d.get.call(this) / (globalThis.UIK || 1); } });
    }
}
const TB = () => (globalThis.UIK || 1) < 1 ? 1.35 : 1;   // botones táctiles más grandes en celular
const JOY = { x:() => 84 * TB(), y:() => VH - 190 * TB(), get r() { return 54 * TB(); } };""")
rep("const big = [['use', 'Usar', VW - 112, VH - 250, 34, inT ? inAct : useTool], ['act', 'E', VW - 186, VH - 196, 28, inT ? inAct : interactFacing], ['atk', 'R', VW - 186, VH - 290, 24, attack]];",
    "const k = TB(), big = [['use', 'Usar', VW - 112*k, VH - 250*k, 34*k, inT ? inAct : useTool], ['act', 'E', VW - 186*k, VH - 196*k, 28*k, inT ? inAct : interactFacing], ['atk', 'R', VW - 186*k, VH - 290*k, 24*k, attack]];")
rep("...small.map(([id, label, act], i) => ({ id, label, x:34, y:180 + i*50, r:20, act }))];",
    "...small.map(([id, label, act], i) => ({ id, label, x:34*k, y:180*k + i*50*k, r:20*k, act }))];")
rep("const dx = t.clientX - JOY.x(), dy = t.clientY - JOY.y(), d = Math.hypot(dx, dy), m = Math.min(d, 46);",
    "const dx = t.clientX - JOY.x(), dy = t.clientY - JOY.y(), d = Math.hypot(dx, dy), m = Math.min(d, 46 * TB());")
rep("circ('rgba(255,246,208,.75)', jx + (UI.joy?.dx || 0), jy + (UI.joy?.dy || 0), 22);",
    "circ('rgba(255,246,208,.75)', jx + (UI.joy?.dx || 0), jy + (UI.joy?.dy || 0), 22 * TB());")

# 5. Menú de Opciones: «Volver» al final, desplazamiento cuando no caben las filas, y las
#    filas genéricas (Gráficos, etc.) muestran su valor y se pueden tocar.
rep("const pRows = SHOPS.pausa.rows(), oRows = SHOPS.ajustes.rows();",
    "const pRows = SHOPS.pausa.rows(), oRows = (rows => [...rows.filter(r => r.name !== 'Volver'), ...rows.filter(r => r.name === 'Volver')])(SHOPS.ajustes.rows());")
rep("""    const rh = 40, h = oRows.length * rh + 26;
    codexPanel(x, top, ow, h);
    const lx = x + 18, cx0 = x + Math.round(ow * 0.42), cw = ow - (cx0 - x) - 40;
    oRows.forEach((r, i) => {
      const ry = top + 14 + i * rh, on = inOpts && i === UI.shopSel;""",
"""    const rh = 40, vis = Math.max(4, Math.min(oRows.length, Math.floor((maxH - 26) / rh))), h = vis * rh + 26;
    if (inOpts) { UI.optScroll = Math.max(0, Math.min(UI.optScroll || 0, oRows.length - vis));
      if (UI.shopSel < UI.optScroll) UI.optScroll = UI.shopSel;
      if (UI.shopSel >= UI.optScroll + vis) UI.optScroll = UI.shopSel - vis + 1; } else UI.optScroll = 0;
    const o0 = UI.optScroll;
    codexPanel(x, top, ow, h);
    if (o0 > 0) text('▲', x + ow/2, top + 11, 10, UIC.muted, 'center');
    if (o0 + vis < oRows.length) text('▼', x + ow/2, top + h - 4, 10, UIC.muted, 'center');
    const lx = x + 18, cx0 = x + Math.round(ow * 0.42), cw = ow - (cx0 - x) - 40;
    oRows.forEach((r, i) => {
      if (i < o0 || i >= o0 + vis) return;
      const ry = top + 14 + (i - o0) * rh, on = inOpts && i === UI.shopSel;""")
rep("""      text((on ? '▸ ' : '') + label, lx, ry + 22, 15, UIC.ink, 'left', on);
      const key = { General:'vol',""",
"""      let lb = (on ? '▸ ' : '') + label; ctx.font = `${on ? 'bold ' : ''}15px ${FONT}`;
      if (ctx.measureText(lb).width > cx0 - lx - 8) { while (lb.length > 4 && ctx.measureText(lb + '…').width > cx0 - lx - 8) lb = lb.slice(0, -1); lb = lb.trimEnd() + '…'; }
      text(lb, lx, ry + 22, 15, UIC.ink, 'left', on);
      const key = { General:'vol',""")
rep("""          if (inOpts) UI.optHits.push({ x:bx, y:ry + 4, w:bw, h:28, act:() => { PREFS[key] = v; savePrefs(); sfx('click'); UI.shopSel = i; } });
        });
      }
    });""",
"""          if (inOpts) UI.optHits.push({ x:bx, y:ry + 4, w:bw, h:28, act:() => { PREFS[key] = v; savePrefs(); sfx('click'); UI.shopSel = i; } });
        });
      } else {
        // Fila genérica: su valor en un botón (◂ ▸ si se puede ajustar); tocar la fila la cambia.
        const ex = x + ow - 18, vw = ex - cx0, val = String(r.price ?? '');
        const fit = (t, w) => { ctx.font = `12px ${FONT}`; if (ctx.measureText(t).width <= w) return t; while (t.length > 3 && ctx.measureText(t + '…').width > w) t = t.slice(0, -1); return t.trimEnd() + '…'; };
        if (r.adj) {
          designBtn(cx0, ry + 4, 26, 28, '◂', false, 12); designBtn(ex - 26, ry + 4, 26, 28, '▸', false, 12);
          if (val) designBtn(cx0 + 30, ry + 4, vw - 60, 28, fit(val, vw - 70), on, 12);
          if (inOpts) { UI.optHits.push({ x:cx0 - 4, y:ry + 2, w:32, h:rh - 4, act:() => { UI.shopSel = i; r.adj(-1); savePrefs?.(); sfx('click'); } });
                        UI.optHits.push({ x:ex - 30, y:ry + 2, w:34, h:rh - 4, act:() => { UI.shopSel = i; r.adj(1); savePrefs?.(); sfx('click'); } }); }
        } else if (val) designBtn(cx0, ry + 4, vw, 28, fit(val, vw - 12), on, 12);
        if (inOpts && r.buy) UI.optHits.push({ x:x + 8, y:ry, w:ow - 16, h:rh - 4, act:() => { UI.shopSel = i; r.buy(); sfx('click'); } });
      }
    });""")


# 6. Mapa: en pantallas angostas el mapa (824×72 casillas) quedaba como una tira delgada.
#    Ahora se parte en franjas apiladas (de izquierda a derecha, de arriba abajo) para que
#    se vea grande, y los botones de filtro van dentro del panel en vez de encima de la barra.
i0 = s.find("drawMap=function(){\n    const w=VW-30,sc=Math.min((w-40)/MW,(VH-140)/WORLD_H)")
i1 = s.find("text('M o Esc = cerrar · clic o 1-4 = filtros',x+w/2,y+h-20,11,'#7a5530','center',false);\n  };", i0)
assert i0 > 0 and i1 > i0, 'no encontré el drawMap de R24'
i1 = s.find('};', i1) + 2
s = s[:i0] + r"""globalThis.mapGeom=function(){
    const w=VW-30,gap=16;let k=1,sc=Math.min((w-40)/MW,(VH-176)/WORLD_H);
    if(VW<740)for(let n=2;n<=6;n++){const s2=Math.min((w-40)/(MW/n),(VH-250-(n-1)*gap)/(WORLD_H*n));if(s2>sc*1.05){sc=s2;k=n;}}
    const bw=MW/k,mw=bw*sc,bh=WORLD_H*sc,mh=k*bh+(k-1)*gap,h=mh+176;
    const x=Math.round(VW/2-w/2),y=Math.round(VH/2-h/2),mx=x+(w-mw)/2,my=y+56;
    const P=(tx,ty)=>{const b=Math.max(0,Math.min(k-1,Math.floor(tx/bw)));return [mx+(tx-b*bw)*sc,my+b*(bh+gap)+ty*sc,b];};
    return {w,h,x,y,k,sc,bw,bh,mw,mh,mx,my,gap,P,ly1:my+mh+24,ly2:my+mh+44};
  };
  drawMap=function(){
    const G=mapGeom(),{w,h,k,sc,bw,bh,mw,mh,mx,my,gap,P}=G;
    const [x,y]=dialog(w,h);
    text('Mapa de Tlaxcallan y sus alrededores',x+w/2,y+40,VW<500?17:20,'#4a2f18','center');
    ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
    const pxT=MAP_CV.width/MW;
    for(let b=0;b<k;b++){
      const by=my+b*(bh+gap),ox=mx-b*bw*sc;
      ctx.save();ctx.beginPath();ctx.rect(mx,by,mw,bh);ctx.clip();
      ctx.drawImage(MAP_CV,b*bw*pxT,0,bw*pxT,MAP_CV.height,mx,by,mw,bh);
      for(let cy=0;cy<SEEN_H;cy++)for(let cx=0;cx<SEEN_W;cx++){
        const cx0=cx*SEEN;if(cx0+SEEN<b*bw||cx0>(b+1)*bw)continue;
        if(!S.seen?.[cy*SEEN_W+cx])rect('#d8c49a',ox+cx0*sc-.5,by+cy*SEEN*sc-.5,SEEN*sc+1,SEEN*sc+1);
      }
      ctx.restore();
      ctx.strokeStyle='#5a3a1e';ctx.lineWidth=2;ctx.strokeRect(mx,by,mw,bh);
      if(b<k-1)text('↩',mx+mw+9,by+bh+12,13,'#9a7040','center',false);
    }
    const seenAt=(tx,ty)=>!!S.seen?.[Math.floor(ty/SEEN)*SEEN_W+Math.floor(tx/SEEN)];
    for(const [name,lx,ly] of MAP_LABELS)if(seenAt(lx,ly)){
      ctx.font=`bold 11px ${FONT}`;const lw=ctx.measureText(name).width+8;const [px,py]=P(lx,ly);
      const lx2=Math.max(mx+lw/2,Math.min(mx+mw-lw/2,px));
      rect('rgba(42,26,12,.75)',lx2-lw/2,py-10,lw,14);
      text(name,lx2,py+1,11,'#fff6d0','center');
    }
    if(!UI.mapHide.has('postas'))for(const b of postaList())if(S.postas?.[b.id]){
      const [px,py]=P(b.x,b.y);rect('#c0392b',px-2,py-8,2,9);rect('#f2c94c',px,py-8,6,4);
    }
    if(!UI.mapHide.has('templos'))for(const sh of S.shrines||[]){
      if(!sh.found&&!sh.revealed)continue;
      const [sx,sy]=P(sh.x+1.5,sh.y+1.5);
      if(!sh.found){circ('#5a3a1e',sx,sy,7);text('?',sx,sy+5,13,'#fff6d0','center');}
      else{circ(GODS[sh.god].col,sx,sy,6);ctx.save();ctx.translate(sx,sy);ctx.scale(.3,.3);GOD_ICON[sh.god](0,0);ctx.restore();}
    }
    if(!UI.mapHide.has('marcador')&&S.marcador){
      const [sx,sy]=P(S.marcador.x+.5,S.marcador.y+.5);
      circ('#ff6f3a',sx,sy,8);text('🚩',sx,sy+4,12,'#fff','center');
    }
    const [ptx,pty]=playerTile(),inMine=pty>=WORLD_H;
    if(!UI.mapHide.has('player')&&!inMine&&Math.sin(T*6)>-.3){
      const [px,py]=P(ptx,pty);circ('#fff',px,py,5);circ('#d9483b',px,py,3.5);
    }
    text(inMine?'Estás dentro de una mina':'● tú   🚩 postas   ◉ templos',x+w/2,G.ly2,12,'#7a5530','center',false);
    UI.mapFilterBtns=[];
    const filters=[['postas','🚩 Postas'],['templos','⛩ Templos'],['marcador','🚩 Marcador'],['player','● Tú']];
    const fw=Math.min(120,(w-40)/filters.length),start=x+w/2-filters.length*fw/2,fy=my+mh+58,fh=UI.touch?32:26;
    filters.forEach(([cat,label],i)=>{
      const bx=start+i*fw,on=!UI.mapHide.has(cat);
      rect(on?'rgba(40,80,40,.9)':'rgba(60,20,20,.9)',bx+3,fy,fw-6,fh);
      text(label,bx+fw/2,fy+fh/2+4,11,on?'#a0f0a0':'#ff8080','center',false);
      UI.mapFilterBtns.push({cat,x:bx,y:fy,w:fw,h:fh});
    });
    text(UI.touch?'toca un filtro para mostrar u ocultar':'M o Esc = cerrar · clic o 1-4 = filtros',x+w/2,y+h-26,11,'#7a5530','center',false);
  };""" + s[i1:]

# la capa de chicas usa la misma geometría
rep("""  const w = VW - 30, sc = Math.min((w - 40) / MW, (VH - 140) / WORLD_H), mw = MW * sc, mh = WORLD_H * sc, h = mh + 130;
  const x = Math.round(VW / 2 - w / 2), y = Math.round(VH / 2 - h / 2), mx = x + (w - mw) / 2, my = y + 56;""",
"""  const G = mapGeom(), { w, h, x, y } = G;""")
rep("""    const amante = !!AMANTE_DE[v.name], px = mx + v.x / TS * sc, py = my + (v.y - 4) / TS * sc;""",
"""    const amante = !!AMANTE_DE[v.name], [px, py] = G.P(v.x / TS, (v.y - 4) / TS);""")
rep("""'center', false);
};

const CHICA_DE""", """'center', false);
};

const CHICA_DE""")
rep("""tus amantes', x + w / 2, y + h - 58, 12,""", """tus amantes', x + w / 2, G.ly1, 12,""")

# 7. Tiendas: en pantallas altas (celular) mostrar más filas en vez de «▼ N más» con hueco vacío.
rep("""Math.min(Math.max(rows.length, shop.compact ? 1 : 4), 9, Math.floor((VH - 60 - top - 46) / rh)));
  const h = top + vis*rh + 46, [x, y] = dialog(w, h), look = shopLook();""",
"""Math.min(Math.max(rows.length, shop.compact ? 1 : 4), VH > 900 ? 16 : 9, Math.floor((VH - 60 - top - 46 - (VH > 900 ? 120 : 0)) / rh)));
  const h = top + vis*rh + 46, [x, y] = dialog(w, h), look = shopLook(); UI.shopBox = [x, y, w, h];""")

# 8. La pastilla «"/" buscar» se encimaba con la barra de objetos: va justo debajo del panel,
#    y en pantalla táctil (sin teclado) sólo aparece si hay una búsqueda activa.
rep("""    const width = Math.max(180, ctx.measureText(label).width + 22);
    rect('rgba(20,10,10,.85)', VW/2 - width/2, VH - 68, width, 22);
    text(label, VW/2, VH - 53, 12,""",
"""    const width = Math.max(180, ctx.measureText(label).width + 22);
    const py = UI.shopBox ? Math.min(VH - 130, UI.shopBox[1] + UI.shopBox[3] + 8) : VH - 130;
    if (!UI.touch || R20_1.on || R20_1.q) rect('rgba(20,10,10,.85)', VW/2 - width/2, py, width, 22);
    if (!UI.touch || R20_1.on || R20_1.q) text(label, VW/2, py + 15, 12,""")

# 9. Mini-bolsa (arriba a la izquierda): cantidades grandes se cortaban («40000(»);
#    ahora se abrevian (40k, 1.2M) y el pie «Tab = bolsa» ya no pisa el marco.
rep("""const n = String(S.inv[k]); ctx.font = `bold 11px ${FONT}`;""",
"""const q = S.inv[k], n = q >= 1e6 ? `${+(q / 1e6).toFixed(1)}M` : q >= 1e4 ? `${Math.floor(q / 1000)}k` : String(q); ctx.font = `bold 11px ${FONT}`;""")
rep("""pw = cols*cs + 16, ph = Math.ceil(show.length/cols)*cs + 34;""",
"""pw = cols*cs + 16, ph = Math.ceil(show.length/cols)*cs + 40;""")
rep("""'Tab = bolsa', 10 + pw/2, 10 + ph - 11, 11,""", """(UI.touch ? 'toca = bolsa' : 'Tab = bolsa'), 10 + pw/2, 10 + ph - 14, 11,""")

# 9b. Sin teclado no hay Tab: tocar la mini-bolsa abre la bolsa completa.
rep("""</body>""", """<script>
addEventListener('pointerdown', e => {
  const r = UI.invRect; if (UI.menu || !r || !S?.player) return;
  if (e.clientX >= r.x && e.clientX <= r.x + r.w && e.clientY >= r.y && e.clientY <= r.y + r.h) {
    openMenu('bolsa'); e.stopImmediatePropagation(); e.preventDefault();
  }
}, true);
</script>
</body>""")
rep("""`+${items.length - 8} más · Tab = bolsa`""", """`+${items.length - 8} más · ${UI.touch ? 'toca' : 'Tab'} = bolsa`""")

# 10. En pantalla táctil no hay «pasar el mouse»: el globo de ayuda de las tiendas se quedaba
#     flotando sobre la lista en el último lugar tocado. La descripción ya va en cada fila.
rep("""if (R20.tooltip && mouse.on) {""", """if (R20.tooltip && mouse.on && !UI.touch) {""")

# 11. Panel de Logros: las filas traían «nombre» en vez de «name» (salía una fila vacía
#     con sólo la estrella) y «Defensor» venía repetido.
rep("""      { id: 'primer_asalto', nombre: 'Defensor', desc: 'Resiste tu primer asalto', icono: '🛡️' },
      { id: 'primer_asalto', nombre: 'Defensor', desc: 'Resiste tu primer asalto', icono: '🛡️' },
""", """      { id: 'primer_asalto', nombre: 'Defensor', desc: 'Resiste tu primer asalto', icono: '🛡️' },
""")
rep("""      nombre: l.nombre,
      price: LOGROS.estaDesbloqueado(l.id) ? 'Desbloqueado' : 'Pendiente',""",
"""      name: l.nombre, nombre: l.nombre,
      price: LOGROS.estaDesbloqueado(l.id) ? 'Desbloqueado' : 'Pendiente',""")

open(path, 'w', encoding='utf-8').write(s)
print('parche aplicado; UIK en', s.count('globalThis.UIK'), 'lugares')
