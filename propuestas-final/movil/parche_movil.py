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
    const sb = UI.shopBox, below = sb ? sb[1] + sb[3] + 30 : VH - 130, py = below + 22 <= VH - 108 ? below : sb && sb[1] - 30 >= 4 ? sb[1] - 30 : VH - 130;
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

# 12. La tierra arada se veía como hoyos negros: el dibujo de la tierra (mundo) quedó dañado
#     en esta copia del juego (sus textos se volvieron códigos «·x…»). Se repone el original.
i0 = s.find('function tierra(_xa168e3 = false) {')
i1 = s.find('    return m;\n  }', i0)
assert i0 > 0 and i1 > i0, 'no encontré tierra()'
s = s[:i0] + r"""function tierra(hum = false) {
    const b = hum ? G.wet : G.soil, l = hum ? G.wetL : G.soilL, d = hum ? G.wetD : G.soilD;
    let m = `<rect width="64" height="64" fill="${b}"/>`;
    for (let y = 0; y < 64; y += 16) m += `<path d="M0 ${y + 3} H64 V${y + 9} H0Z" fill="${l}"/><path d="M0 ${y + 3} H64" stroke="${sh(l, 1.12)}" stroke-width="1.6"/><path d="M0 ${y + 13.4} H64" stroke="${d}" stroke-width="2.6"/>`;
    const R = rnd(hum ? 7 : 3);
    for (let i = 0; i < 10; i++) m += `<circle cx="${n(3 + R() * 58)}" cy="${n(3 + R() * 58)}" r="${n(.8 + R() * 1)}" fill="${d}" opacity=".6"/>`;
    if (hum) for (let i = 0; i < 4; i++) { const x = n(6 + R() * 50), y = 16 * Math.floor(R() * 4) + 11; m += `<ellipse cx="${x}" cy="${y}" rx="${n(3 + R() * 3)}" ry="1.4" fill="#8fb4d8" opacity=".75"/>`; }
""" + s[i1:]

# 13. Barras de energía, vida y aliento: en vez de tres tubos de color planos, un panel de
#     Talavera con tres medidores esmaltados y su glifo (mazorca, corazón, pluma).
i0 = s.find("  rect('#5a3a1e', ex, ey, 24, eh); rect('#2a1a0c', ex+4, ey+4, 16, eh-8);")
i1 = s.find("text('❤', hx+12, ey-6, 13, '#ff6b6b', 'center', false);", i0)
assert i0 > 0 and i1 > i0, 'no encontré las barras'
i1 += len("text('❤', hx+12, ey-6, 13, '#ff6b6b', 'center', false);")
s = s[:i0] + "  const hx = ex - 30; barrasTal(ex, ey, eh);" + s[i1:]
rep("ey - (S.poison ? 54 : 30)", "ey - (S.poison ? 100 : 76)")
rep("ey - (S.poison ? 39 : 15)", "ey - (S.poison ? 85 : 61)")
rep("rect('rgba(20,60,20,.8)', hx - 70, ey - 30, 94, 20);", "rect('rgba(20,60,20,.8)', hx - 70, ey - 76, 94, 20);")
rep("text('☠ Envenenado', hx - 23, ey - 15,", "text('☠ Envenenado', hx - 23, ey - 61,")
rep("""    rect('#5a3a1e', sx, ey, 24, eh); rect('#2a1a0c', sx + 4, ey + 4, 16, eh - 8);
    const f = sp.stam / sp.max, col = f > 0.5 ? '#5ac8ff' : f > 0.2 ? '#ffd060' : '#ff6060';
    rect(col, sx + 4, ey + 4 + (eh - 8) * (1 - f), 16, (eh - 8) * f);
    text('⚡', sx + 12, ey - 6, 13, '#5ac8ff', 'center', false);
""", "")
rep("""    if (lagE > realE + .005) rect('rgba(255,80,80,.48)', ex + 4, ey + 4 + fillH * (1 - lagE), 16, fillH * (lagE - realE));""", "")
rep("""    if (lagH > realH + .005) rect('rgba(255,80,80,.48)', hx + 4, ey + 4 + fillH * (1 - lagH), 16, fillH * (lagH - realH));""", "")
rep("""</body>""", """<script>
const TINTA = '#1a1410';
function garzaCdm(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.strokeStyle = '#e8a020'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-2, 8); ctx.lineTo(-3, 18); ctx.moveTo(2, 8); ctx.lineTo(3, 18); ctx.stroke();
  ctx.fillStyle = '#fbf7ee'; ctx.strokeStyle = TINTA; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.ellipse(0, 4, 9, 5.5, -0.35, 0, 7); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(5, 1); ctx.bezierCurveTo(12, -4, 3, -9, 8, -15); ctx.lineWidth = 4.2; ctx.stroke(); ctx.strokeStyle = '#fbf7ee'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#fbf7ee'; ctx.strokeStyle = TINTA; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(9, -16, 3, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e8a020'; ctx.beginPath(); ctx.moveTo(11.5, -17); ctx.lineTo(19, -15.5); ctx.lineTo(11.5, -14.6); ctx.fill();
  ctx.fillStyle = TINTA; ctx.beginPath(); ctx.arc(9.6, -16.4, .8, 0, 7); ctx.fill();
  ctx.strokeStyle = TINTA; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-8, 3); ctx.lineTo(-13, 6); ctx.moveTo(-8, 5); ctx.lineTo(-12, 9); ctx.stroke();
  ctx.restore();
}
function pantliCdm(x, y, hgt, cols) {
  rect('#5a3a1e', x - 1.5, y, 3, hgt);
  const sway = Math.sin(T * 2 + x) * 1.5;
  cols.forEach((c, i) => { ctx.fillStyle = c; ctx.strokeStyle = TINTA; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x + 6 + sway * (i / cols.length), y + 4 + i * 7, 6, 4.2, 0.3, 0, 7); ctx.fill(); ctx.stroke(); });
  circ('#f2c84a', x, y - 1, 2.6);
}
function tecpanCdm(px, py, w, h) {
  const base = py + h, night = S.time > 18*60 || S.time < 6*60, cx = px + w / 2;
  ell('rgba(30,22,16,.22)', cx, base + 2, w / 2 + 10, 8);
  // basamento: talud de piedra y tablero rojo con greca
  ctx.fillStyle = '#a89c86'; ctx.beginPath(); ctx.moveTo(px - 8, base); ctx.lineTo(px + w + 8, base); ctx.lineTo(px + w + 2, base - 14); ctx.lineTo(px - 2, base - 14); ctx.fill();
  for (let i = 0; i < 3; i++) rect('rgba(60,45,30,.18)', px, base - 12 + i * 4, w, 1);
  rect('#3a2416', px - 4, base - 36, w + 8, 23); rect('#b5352a', px - 2, base - 34, w + 4, 19); greca(px, base - 30, w, '#f4ecd8', '#b5352a');
  // escalinata con alfardas
  const sx = cx - 30, sw = 60;
  rect('#d6ccb6', sx, base - 36, sw, 36); for (let yy = base - 33; yy < base; yy += 5) rect('rgba(60,45,30,.25)', sx, yy, sw, 1);
  rect('#b5352a', sx - 6, base - 38, 6, 38); rect('#b5352a', sx + sw, base - 38, 6, 38); rect('#f2c84a', sx - 6, base - 38, 6, 3); rect('#f2c84a', sx + sw, base - 38, 6, 3);
  // cuerpo: muro de aplanado, pórtico en sombra y pilares pintados
  const top = py + 40, bot = base - 36;
  rect('#efe4cc', px + 6, top, w - 12, bot - top);
  rect('#3a2416', px + 22, top + 14, w - 44, bot - top - 14);
  rect('rgba(255,170,80,' + (night ? .35 : .08) + ')', px + 22, top + 14, w - 44, bot - top - 14);
  const n = 6, gap = (w - 44) / (n - 1);
  for (let i = 0; i < n; i++) { const x = px + 22 + i * gap - 6; rect('#efe4cc', x, top + 12, 12, bot - top - 12); rect('#b5352a', x + 3, top + 22, 6, bot - top - 32); rect('#2f6aa8', x, top + 12, 12, 5); rect('rgba(26,20,16,.6)', x + 11, top + 12, 1, bot - top - 12); }
  rect('#b5352a', px + 6, bot - 8, w - 12, 8);
  // friso, cornisa y almenas
  rect('#3a2416', px + 2, top - 4, w - 4, 5);
  rect('#b5352a', px + 4, top + 1, w - 8, 13); greca(px + 4, top + 4, w - 8, '#f4ecd8', '#b5352a');
  for (let x = px + 6; x <= px + w - 18; x += 16) { rect('#efe4cc', x, top - 18, 12, 14); rect('#efe4cc', x + 3, top - 23, 6, 5); circ('#b5352a', x + 6, top - 12, 2.4); rect('rgba(26,20,16,.35)', x + 11, top - 18, 1, 14); }
  ctx.strokeStyle = 'rgba(26,20,16,.8)'; ctx.lineWidth = 1.6; ctx.strokeRect(px + 6.5, top - 3.5, w - 13, bot - top + 3);
  // estandarte central con la garza blanca de Tizatlán y estandartes de pluma a los lados
  rect('#5a3a1e', cx - 1.5, top - 62, 3, 44);
  const sw2 = Math.sin(T * 1.6) * 1.5;
  ctx.fillStyle = '#b5352a'; ctx.strokeStyle = TINTA; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(cx + 2, top - 62); ctx.lineTo(cx + 34, top - 62 + sw2); ctx.lineTo(cx + 34, top - 30 + sw2); ctx.lineTo(cx + 18, top - 36); ctx.lineTo(cx + 2, top - 30); ctx.closePath(); ctx.fill(); ctx.stroke();
  garzaCdm(cx + 17, top - 44, 0.72);
  pantliCdm(px + 10, top - 50, 32, ['#2f8a5a', '#f2c84a', '#b5352a', '#2f6aa8']);
  pantliCdm(px + w - 16, top - 50, 32, ['#2f6aa8', '#b5352a', '#f2c84a', '#2f8a5a']);
  // braseros
  for (const bx of [sx - 16, sx + sw + 16]) { rect('#6d6660', bx - 6, base - 50, 12, 12); ctx.fillStyle = '#ff8c28'; ctx.beginPath(); ctx.moveTo(bx - 6, base - 50); ctx.quadraticCurveTo(bx, base - 64 + Math.sin(T * 12 + bx) * 2, bx + 6, base - 50); ctx.fill(); }
}
function edifMuroCdm(e, b, W, wall) {
  const F = EDIF.floor + 30, k = e.kind, esp = k === 'iglesia' || k === 'capitan';
  rect(wall, 0, 0, W, F);
  const g = ctx.createLinearGradient(0, 0, 0, F); g.addColorStop(0, 'rgba(255,250,235,.18)'); g.addColorStop(1, 'rgba(90,50,25,.12)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, F);
  for (let i = 0; i < 60; i++) rect(i % 3 ? 'rgba(90,50,25,.07)' : 'rgba(255,255,255,.12)', hash(i, b.x) * W, 34 + hash(b.y, i) * (F - 40), 3 + hash(i, 5) * 10, 1.5);
  if (esp || k === 'tipi' || k === 'wickiup') return;
  // vigas del techo
  rect('#4a2f18', 0, 0, W, 12); rect('#6b4423', 0, 12, W, 4);
  for (let x = 18; x < W; x += 46) { rect('#5a3a1e', x - 7, 0, 14, 26); rect('#7a4a28', x - 7, 0, 3, 26); ctx.fillStyle = '#3a2416'; ctx.beginPath(); ctx.ellipse(x, 24, 7, 3, 0, 0, 7); ctx.fill(); }
  // mural del palacio: franja azul con chalchihuites y grecas rojas
  if (k === 'palacio') {
    const my = 44, mh = F - 44 - 34;
    rect('#16306e', 0, my - 2, W, mh + 4); rect('#2f7fa8', 0, my, W, mh);
    for (let x = 30, i = 0; x < W; x += 60, i++) {
      if (i % 2) { circ('#f2c84a', x, my + mh / 2, 12); circ('#2f8a5a', x, my + mh / 2, 9); circ('#f2c84a', x, my + mh / 2, 3.5); for (const a of [0, 1.57, 3.14, 4.71]) circ('#f2c84a', x + Math.cos(a) * 16, my + mh / 2 + Math.sin(a) * 16, 2.5); }
      else { ctx.strokeStyle = '#b5352a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 14, my + mh - 8); ctx.lineTo(x - 14, my + 10); ctx.lineTo(x + 8, my + 10); ctx.lineTo(x + 8, my + mh / 2 + 4); ctx.lineTo(x - 4, my + mh / 2 + 4); ctx.stroke(); }
    }
  }
  // guardapolvo rojo
  rect('#a8392b', 0, F - 30, W, 30); rect('#d39a26', 0, F - 32, W, 2);
}
function edifPisoCdm(W, H) {
  const F = EDIF.floor + 30;
  rect('#c99a72', 0, F, W, H - F); const gp = ctx.createLinearGradient(0, F, 0, H); gp.addColorStop(0, 'rgba(255,240,220,.18)'); gp.addColorStop(1, 'rgba(90,40,20,.12)'); ctx.fillStyle = gp; ctx.fillRect(0, F, W, H - F);
  for (let y = F; y < H; y += 30) for (let x = (y / 30 % 2) * 40; x < W; x += 80) rect('rgba(120,60,30,.08)', x, y, 40, 30);
  ctx.strokeStyle = 'rgba(90,50,25,.18)'; ctx.lineWidth = 1; for (let y = F + 30; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
}
function nichoCdm(x, y, b) {
  rect('#8a7a62', x - 30, y - 4, 60, 52); rect('#b8a888', x - 27, y - 1, 54, 46);
  rect('#3a2416', x - 21, y + 6, 42, 36);
  rect('#6b4423', x - 32, y - 8, 64, 7); rect('#8a5a30', x - 32, y - 8, 64, 2);
  const c = ['#b8693c', '#a8392b', '#c8901e'][Math.floor(hash(b.x, b.y) * 3)];
  ell('#7a4a22', x, y + 41, 12, 2.5); ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y + 31, 10, 10, 0, 0, 7); ctx.fill(); rect(c, x - 5, y + 17, 10, 6); rect('#f4ecd8', x - 9, y + 29, 18, 2);
  for (const dx of [-15, 15]) { circ('#f2a020', dx + x, y + 38, 3); circ('#e8501e', dx + x, y + 38, 1.4); }
}
function salaPalacioCdm(W, H) {
  for (const x of [56, W - 56]) pantliCdm(x, 60, 80, ['#2f8a5a', '#f2c84a', '#b5352a', '#2f6aa8', '#f2c84a', '#2f8a5a']);
  const ch = ESTADO_GLIFOS.chimalli;
  for (const x of [128, W - 128]) if (ch && ch.complete && ch.naturalWidth) ctx.drawImage(ch, x - 24, 64, 48, 48);
  // icpalli: respaldo de tule con piel de jaguar
  const cx = W / 2;
  rect('#3a2416', cx - 46, 92, 92, 84); rect('#c8a050', cx - 43, 95, 86, 78);
  for (let yy = 99; yy < 172; yy += 6) rect('rgba(120,80,30,.35)', cx - 43, yy, 86, 1.5);
  ctx.fillStyle = '#e0a030'; ctx.strokeStyle = TINTA; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(cx - 30, 100); ctx.lineTo(cx + 30, 100); ctx.lineTo(cx + 34, 160); ctx.lineTo(cx - 34, 160); ctx.closePath(); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 16; i++) { const sx = cx - 26 + hash(i, 3) * 52, sy = 106 + hash(3, i) * 48; ctx.strokeStyle = '#3a2416'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(sx, sy, 3, 0, 7); ctx.stroke(); circ('#3a2416', sx, sy, 1.1); }
  rect('#b5352a', cx - 50, 160, 100, 14); greca(cx - 50, 163, 100, '#f4ecd8', '#b5352a');
  // petate largo
  rect('#a88a52', cx - 38, 190, 76, H - 190); rect('#d8b878', cx - 35, 190, 70, H - 190);
  for (let yy = 194; yy < H; yy += 8) for (let xx = cx - 35 + ((yy / 8) % 2) * 7; xx < cx + 35; xx += 14) rect('rgba(120,80,30,.3)', xx, yy, 7, 4);
}
function magueyCdm(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ell('rgba(30,22,16,.2)', 0, 1, 12, 3);
  for (const [a, L] of [[-2.7, 12], [-0.45, 12], [-2.2, 15], [-0.95, 15], [-1.57, 17], [-1.85, 13], [-1.3, 13]]) {
    const tx = Math.cos(a) * L, ty = Math.sin(a) * L, nx = -Math.sin(a) * 2.6, ny = Math.cos(a) * 2.6;
    ctx.fillStyle = a === -1.57 ? '#7aa88a' : '#5e8f72'; ctx.strokeStyle = '#2f4a3a'; ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.moveTo(nx, ny); ctx.lineTo(tx, ty); ctx.lineTo(-nx, -ny); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}
function ollaCdm(x, y, c) {
  ell('rgba(30,22,16,.22)', x, y + 1, 7, 2);
  ctx.fillStyle = c; ctx.strokeStyle = TINTA; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y - 6, 6.5, 6.5, 0, 0, 7); ctx.fill(); ctx.stroke();
  rect(c, x - 3.5, y - 15, 7, 4); rect('#f4ecd8', x - 6, y - 7, 12, 1.5);
}
function adornosCdm(b) {
  if (b.t !== 'casita' && b.t !== 'otomihut') return;
  const px = b.x*TS, py = b.y*TS, w = b.w*TS, h = b.h*TS, base = py + h, hh = hash(b.x, b.y);
  if (b.t === 'casita') {
    for (let x = px + 4, i = 0; x < px + w - 6; x += 9, i++) { rect(i % 2 ? '#9a917f' : '#8a8274', x, base - 6, 8, 6); rect('rgba(255,255,255,.15)', x, base - 6, 8, 1); }
    rect('#6b4423', px + w/2 - 14, py + h - 40, 28, 5); rect('#8a5a30', px + w/2 - 14, py + h - 40, 28, 1.5);
    ctx.strokeStyle = 'rgba(26,20,16,.7)'; ctx.lineWidth = 1.4; ctx.strokeRect(px + 4.5, py + TS + 8.5, w - 9, h - TS - 9);
    ollaCdm(px + w/2 + 20, base - 1, hh < 0.5 ? '#b8693c' : '#a8392b');
  }
  if (hh < 0.65) magueyCdm(b.t === 'otomihut' ? px + w - 4 : px + w - 12, base - 1, 0.85 + hh * 0.3);
  else if (b.t === 'otomihut') ollaCdm(px + w - 8, base - 2, '#b8693c');
}
const _drawBuildingCdm = drawBuilding;
drawBuilding = function (b) { _drawBuildingCdm(b); try { adornosCdm(b); } catch (e) {} };
function barrasTal(ex, ey, eh) {
  const cl = v => Math.max(0, Math.min(1, v || 0)), sp = S.sprint;
  const lagOk = !UI.touch;
  const med = [];
  if (sp) med.push({ g:'pluma', f:cl(sp.stam / sp.max), c:sp.cool > 0 ? ['#c8ccd8', '#8a90a4'] : ['#9fd2ff', '#2f6fd0'] });
  const fh = cl(S.hp / MAX_HP);
  med.push({ g:'corazon', f:fh, lag:lagOk && S.hpLag != null ? cl(S.hpLag / MAX_HP) : 0, c:fh > 0.3 ? ['#f2826e', '#b8302a'] : ['#ff6a5a', '#d01a14'] });
  const fe = cl(S.energy / S.maxE);
  med.push({ g:'maiz', f:fe, lag:lagOk && S.energyLag != null ? cl(S.energyLag / S.maxE) : 0, c:fe > 0.3 ? ['#9ad66e', '#3f8a34'] : fe > 0.12 ? ['#f6d264', '#c8901e'] : ['#f07060', '#b8402e'] });
  const gw = 20, gap = 10, pad = 15, n = med.length, pw = pad * 2 + n * gw + (n - 1) * gap;
  const X0 = ex + 24 - pw + 6, Y0 = ey - 44, ph = eh + 56;
  codexPanel(X0, Y0, pw, ph);
  const round = (x, y, w, h, r) => { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); };
  med.forEach((m, i) => {
    const x = X0 + pad + i * (gw + gap), ty = ey + 2, th = eh - 8, cx = x + gw / 2;
    ctx.save();
    ctx.fillStyle = 'rgba(11,26,68,.35)'; round(x + 1, ty + 2, gw, th, gw / 2); ctx.fill();
    ctx.fillStyle = TAL.COB; round(x, ty, gw, th, gw / 2); ctx.fill();
    ctx.fillStyle = '#efe6d2'; round(x + 2.5, ty + 2.5, gw - 5, th - 5, (gw - 5) / 2); ctx.fill();
    ctx.clip();
    const iy = ty + 2.5, ih = th - 5;
    if (m.lag > m.f + .005) { ctx.fillStyle = 'rgba(232,80,60,.5)'; ctx.fillRect(x, iy + ih * (1 - m.lag), gw, ih * (m.lag - m.f)); }
    const g = ctx.createLinearGradient(x, 0, x + gw, 0); g.addColorStop(0, m.c[0]); g.addColorStop(1, m.c[1]);
    ctx.fillStyle = g; ctx.fillRect(x, iy + ih * (1 - m.f), gw, ih * m.f);
    if (m.f > 0.02) { ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(x, iy + ih * (1 - m.f), gw, 1.5); }
    ctx.fillStyle = 'rgba(255,255,255,.38)'; ctx.fillRect(x + 5, iy + 6, 2.5, ih - 12);
    ctx.restore();
    for (const q of [.25, .5, .75]) { const yy = Math.round(ty + 2.5 + (th - 5) * (1 - q)) + .5; ctx.strokeStyle = 'rgba(22,48,110,.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x + gw - 7, yy); ctx.lineTo(x + gw - 2.5, yy); ctx.stroke(); }
    const my = ey - 15, low = m.f < 0.2 && Math.sin(T * 8) > 0;
    circ(low ? '#c0392b' : TAL.COB, cx, my, 13); circ(TAL.OCH, cx, my, 11.2); circ('#fbf5e6', cx, my, 9.6);
    if (m.g === 'corazon') {
      ctx.save(); ctx.translate(cx, my + 0.5);
      ctx.beginPath(); ctx.moveTo(0, 6.5); ctx.bezierCurveTo(-9, 0, -7, -8, -2.4, -6.4); ctx.quadraticCurveTo(0, -5.4, 0, -3.4); ctx.quadraticCurveTo(0, -5.4, 2.4, -6.4); ctx.bezierCurveTo(7, -8, 9, 0, 0, 6.5); ctx.closePath();
      ctx.fillStyle = '#d03a2e'; ctx.fill(); ctx.strokeStyle = '#1a1410'; ctx.lineWidth = 1.6; ctx.stroke();
      ctx.fillStyle = 'rgba(255,220,210,.8)'; ctx.beginPath(); ctx.ellipse(-3, -3, 1.6, 1.1, -.6, 0, 7); ctx.fill();
      ctx.restore();
    } else {
      const im = m.g === 'maiz' ? (globalThis.iconoDe && iconoDe('maiz')) : ESTADO_GLIFOS[m.g];
      if (im && im.complete && im.naturalWidth) ctx.drawImage(im, cx - 9, my - 9, 18, 18);
      else text(m.g === 'maiz' ? 'E' : '⚡', cx, my + 4, 11, TAL.NAVY, 'center');
    }
  });
}
</script>
</body>""")

# 14. Paneles de arriba más compactos en pantallas angostas (celular): el reloj ocupa menos alto,
#     el panel de fama tiene menos relleno, la mini-bolsa muestra una sola fila y el tutorial
#     se acomoda justo debajo de los paneles en vez de a una altura fija.
rep("const H1 = 124; codexPanel(X, 10, W, H1);", "const C = VW < 640, H1 = C ? 96 : 124; codexPanel(X, 10, W, H1);")
rep("estadoTexto(`${SEASONS[s]} ${d}`, cx, 46, `700 21px ${TAL_SERIF}`, TAL.COB, 'center');",
    "estadoTexto(`${SEASONS[s]} ${d}`, cx, C ? 39 : 46, `700 ${C ? 19 : 21}px ${TAL_SERIF}`, TAL.COB, 'center');")
rep("const aw = estadoTexto(`Año ${year}`, cx - 10, 63, `italic 700 13px ${TAL_ITAL}`, '#8a5a14', 'center');",
    "const aw = C ? estadoTexto(`Año ${year}`, X + 22, 62, `italic 700 12px ${TAL_ITAL}`, '#8a5a14', 'left') : estadoTexto(`Año ${year}`, cx - 10, 63, `italic 700 13px ${TAL_ITAL}`, '#8a5a14', 'center');")
rep("estadoGlifo(clima, cx - 10 + aw / 2 + 4, 50, 18);", "if (C) estadoGlifo(clima, X + W - 40, 47, 18); else estadoGlifo(clima, cx - 10 + aw / 2 + 4, 50, 18);")
rep("estadoTexto(fmtTime(S.time), cx, 88, `800 23px ${SANS}`, TAL.NAVY, 'center');",
    "estadoTexto(fmtTime(S.time), cx, C ? 63 : 88, `800 ${C ? 20 : 23}px ${SANS}`, TAL.NAVY, 'center');")
rep("const py = 94, pw = W - 40", "const py = C ? 70 : 94, pw = W - 40")
rep("const H2 = inner + 40, b =", "const H2 = inner + (C ? 30 : 40), b =")
rep("let y = Y2 + 2 + b + 6;", "let y = Y2 + 2 + b + (C ? 1 : 6);")
rep("return Y2 + H2;", "return UI.estadoBottom = Y2 + H2;")
rep("const cols = 4, cs = 38, show = items.slice(0, 8)", "const cols = 4, cs = 38, show = items.slice(0, VW < 640 ? 4 : 8)")
rep("items.length > 8 ? `+${items.length - 8} más", "items.length > show.length ? `+${items.length - show.length} más")
rep("const top = VW - 420 >= 320, w = top ? Math.min(470, VW - 420) : Math.min(470, VW - 20), x = VW/2 - w/2, y = top ? 12 : UI.touch ? 250 : 210;",
    "const top = VW - 420 >= 320, w = top ? Math.min(470, VW - 420) : Math.min(470, VW - 20), x = VW/2 - w/2, y = top ? 12 : Math.max(UI.estadoBottom || 0, UI.invRect ? UI.invRect.y + UI.invRect.h : 0) + 8;")

# 15. Edificios del pueblo: las tiendas llevan un guardapolvo de azulejo de Talavera al pie del
#     muro, contorno de tinta estilo códice, y los letreros son placas de Talavera.
rep("rect(side > 0 ? 'rgba(70,40,20,.16)' : 'rgba(255,240,210,.12)', px + w - 18, wallTop, 14, base - 12 - wallTop);",
"""rect(side > 0 ? 'rgba(70,40,20,.16)' : 'rgba(255,240,210,.12)', px + w - 18, wallTop, 14, base - 12 - wallTop);
  { const dyT = base - 25; rect(TAL.COB, px + 4, dyT - 2, w - 8, 15); if (!TAL.fill('deco', 11, px + 4, dyT, w - 8, 11)) rect('#f4ecd8', px + 4, dyT, w - 8, 11); rect(TAL.OCH, px + 4, dyT - 2, w - 8, 1); rect('rgba(0,0,0,.18)', px + 4, dyT + 11, w - 8, 2);
    ctx.strokeStyle = 'rgba(26,20,16,.75)'; ctx.lineWidth = 1.6; ctx.strokeRect(px + 4.5, wallTop + .5, w - 9, base - 12 - wallTop);
    const wx0 = px + w - 34 - 7, wy0 = wallTop + 11; rect(TAL.COB, wx0 - 1, wy0 - 1, 36, 30); if (!TAL.fill('deco', 9, wx0, wy0, 34, 28)) rect('#f4ecd8', wx0, wy0, 34, 28); }""")
rep("""function signBoard(b, y) {
  const px = b.x*TS, w = b.w*TS;
  ctx.font = `bold 11px ${FONT}`;
  const tw = ctx.measureText(b.name).width + 14;
  rect('#5a3a1e', px+w/2 - tw/2 - 2, y-4, tw+4, 20);
  rect('#e8d8b8', px+w/2 - tw/2, y-2, tw, 16);
  text(b.name, px+w/2, y+10, 11, '#4a2f18', 'center');
}""", """function signBoard(b, y) {
  const px = b.x*TS, w = b.w*TS, cx = px + w/2;
  ctx.font = `bold 11px ${FONT}`;
  const tw = ctx.measureText(b.name).width + 30, x0 = cx - tw/2;
  rect('rgba(20,12,8,.35)', x0 + 1, y - 2, tw, 22);
  rect(TAL.COB, x0 - 1, y - 5, tw + 2, 22);
  if (!TAL.fill('plain', 30, x0 + 1, y - 3, tw - 2, 18)) rect('#fbf7ee', x0 + 1, y - 3, tw - 2, 18);
  ctx.strokeStyle = TAL.OCH; ctx.lineWidth = 1; ctx.strokeRect(x0 + 3.5, y - 0.5, tw - 7, 12);
  for (const rx of [x0 + 8, x0 + tw - 8]) { circ(TAL.COB, rx, y + 6, 3.6); circ(TAL.OCH, rx, y + 6, 1.8); }
  text(b.name, cx, y + 10, 11, TAL.NAVY, 'center');
}""")

# 16. Barra de herramientas: cantidades abreviadas (400k) para que no se salgan de la casilla.
rep("if (i >= 5 && slotBag(i)) text(String(S.inv[slotBag(i).id] || 0), x+sw-6, by+sw-6, 12, '#2a1a0c', 'right');",
    "if (i >= 5 && slotBag(i)) { const q = S.inv[slotBag(i).id] || 0; text(q >= 1e6 ? `${+(q / 1e6).toFixed(1)}M` : q >= 1e4 ? `${Math.floor(q / 1000)}k` : String(q), x+sw-6, by+sw-6, 12, '#2a1a0c', 'right'); }")

# 17. Palacio de Xicohténcatl: parecía un templo griego de columnas. Ahora es un tecpan
#     tlaxcalteca: basamento de talud y tablero con escalinata, pórtico de pilares pintados,
#     friso con greca, almenas escalonadas, la garza blanca de Tizatlán y estandartes de pluma.
p0 = s.find("  } else if (b.t === 'palacio') { \n")
p1 = s.find("  } else if (b.t === 'tlatoani') {", p0)
assert p0 > 0 and p1 > p0, 'no encontré el palacio'
s = s[:p0] + """  } else if (b.t === 'palacio') { 
    tecpanCdm(px, py, w, h);
""" + s[p1:]

# 18. Interiores (casas, tiendas, palacio): muro de aplanado con vigas de madera en el techo,
#     guardapolvo rojo pintado, nichos con ofrenda en vez de ventanas de vidrio (no había vidrio
#     antes de la conquista; la iglesia y la casa del capitán sí los conservan). El palacio lleva
#     mural azul con chalchihuites, escudos y estandartes de pluma, icpalli con piel de jaguar
#     y un petate largo en vez de alfombra roja.
rep("  rect(wall, 0, 0, W, EDIF.floor + 30); for (let i = 0; i < 30; i++) rect('rgba(90,50,25,.1)', hash(i, b.x) * W, hash(b.y, i) * EDIF.floor, 10 + hash(i, 5) * 16, 2);",
    "  edifMuroCdm(e, b, W, wall);")
rep("  if (e.kind === 'palacio' || e.kind === 'iglesia') for (let y = EDIF.floor + 30; y < H; y += 26) for (let x = (y / 26 % 2) * 26; x < W; x += 52) rect('rgba(0,0,0,.06)', x, y, 26, 26); ",
    "  if (e.kind === 'palacio') edifPisoCdm(W, H); else if (e.kind === 'iglesia') for (let y = EDIF.floor + 30; y < H; y += 26) for (let x = (y / 26 % 2) * 26; x < W; x += 52) rect('rgba(0,0,0,.06)', x, y, 26, 26); ")
rep("  const win = (x) => { rect('#5a3a1e', x - 30, 56, 60, 44); rect(night ? '#1c2450' : '#9fd3ff', x - 27, 59, 54, 38); rect('#5a3a1e', x - 1, 59, 2, 38); };",
    "  const win = (x) => { if (e.kind !== 'iglesia' && e.kind !== 'capitan') return nichoCdm(x, 56, b); rect('#5a3a1e', x - 30, 56, 60, 44); rect(night ? '#1c2450' : '#9fd3ff', x - 27, 59, 54, 38); rect('#5a3a1e', x - 1, 59, 2, 38); };")
rep("""    for (const x of [60, W - 60]) { rect('#c0392b', x - 16, 50, 32, 70); for (let i = 0; i < 4; i++) rect('#f4ecd8', x - 14, 56 + i * 16, 28, 3); }
    rect('#c8a040', W / 2 - 50, 110, 100, 60); rect('#2f8a5a', W / 2 - 46, 114, 92, 8); """,
"""    salaPalacioCdm(W, H);""")
rep("""    rect('#c0392b', W / 2 - 40, 190, 80, H - 190); 
  """, """  """)

# 19. Tu casa por dentro: muros de adobe aplanado con remate rojo y contorno de tinta,
#     y el muro exterior con textura de adobe.
rep("  const wall = (x, y, w, h) => { rect('#c9a27a', x, y, w, h); rect('rgba(90,55,30,.18)', x, y, w, 1); };",
    "  const wall = (x, y, w, h) => { rect('#d9bf96', x, y, w, h); for (let i = 0; i < Math.max(w, h) / 10; i++) rect('rgba(150,100,60,.25)', x + (w > h ? i * 10 + 2 : 3 + (i % 2) * 5), y + (w > h ? 3 + (i % 2) * 6 : i * 10 + 2), w > h ? 6 : 4, w > h ? 2 : 6); if (w > h) rect('#a8392b', x, y + h - 3, w, 3); else rect('#a8392b', x + w - 3, y, 3, h); ctx.strokeStyle = 'rgba(26,20,16,.7)'; ctx.lineWidth = 1.5; ctx.strokeRect(x + .75, y + .75, w - 1.5, h - 1.5); };")
rep("  rect('#b08968', 0, 0, HOME.w, HOME.h);",
    "  rect('#b08968', 0, 0, HOME.w, HOME.h); for (let i = 0; i < 160; i++) rect('rgba(110,70,40,.22)', hash(i, 3) * HOME.w, hash(5, i) * HOME.h, 8, 3); ctx.strokeStyle = '#1a1410'; ctx.lineWidth = 3; ctx.strokeRect(1.5, 1.5, HOME.w - 3, HOME.h - 3);")

open(path, 'w', encoding='utf-8').write(s)
print('parche aplicado; UIK en', s.count('globalThis.UIK'), 'lugares')
