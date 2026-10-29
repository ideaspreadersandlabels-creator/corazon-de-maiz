// Game data for the Tlaxcallan menus: item catalog, shop stock and the starting
// state shown in the 4a–4c mockups.
"use strict";
(function () {
  // kind: label under the item name. energy: restored when used. tool: can't be dropped or sold.
  const ITEMS = {
    maiz:     { name: 'Maíz',      kind: 'COSECHA',     desc: 'Base de la milpa. Se muele para hacer masa y tortillas.', price: 3 },
    maizAzul: { name: 'Maíz azul', kind: 'SEMILLA',     desc: 'Brota en 6 días. Siémbralo junto al frijol y la calabaza.', price: 12 },
    frijol:   { name: 'Frijol',    kind: 'SEMILLA',     desc: 'Trepa por la caña del maíz y le devuelve fuerza a la tierra.', price: 6 },
    calabaza: { name: 'Calabaza',  kind: 'SEMILLA',     desc: 'Sus hojas cubren la milpa y guardan la humedad.', price: 10 },
    chile:    { name: 'Chile',     kind: 'SEMILLA',     desc: 'Para la salsa. Pica más si se cosecha en verano.', price: 8 },
    nopal:    { name: 'Nopal',     kind: 'PLANTA',      desc: 'Crece en cualquier tierra, aun sin riego.', price: 5 },
    tuna:     { name: 'Tuna',      kind: 'COMIDA',      desc: 'Dulce y fresca. Recupera 8 de energía.', price: 6, energy: 8 },
    maguey:   { name: 'Maguey',    kind: 'PLANTA',      desc: 'De su aguamiel sale el pulque. Tarda un año en dar.', price: 25 },
    pulque:   { name: 'Pulque',    kind: 'OFRENDA',     desc: 'Ofrenda para los dioses. A los vecinos también les gusta.', price: 18 },
    tortilla: { name: 'Tortillas', kind: 'COMIDA',      desc: 'Recién salidas del comal. Recuperan 20 de energía.', price: 4, energy: 20 },
    coa:      { name: 'Coa',       kind: 'HERRAMIENTA', desc: 'Abre la tierra para sembrar. Un golpe por casilla.', tool: true },
    cantaro:  { name: 'Cántaro',   kind: 'HERRAMIENTA', desc: 'Riega 3 surcos por llenada. Rellénalo en el río o en el apantle.', tool: true },
  };

  // Citlalmina's stall, per tab. Row: [item key, row name, row note].
  const SHOP = {
    Semillas: [
      ['maizAzul', 'Semilla de maíz azul', 'Brota en 6 días'],
      ['frijol', 'Semilla de frijol', 'Junto al maíz'],
      ['calabaza', 'Semilla de calabaza', 'Cubre la milpa'],
      ['chile', 'Semilla de chile', 'Para la salsa'],
      ['nopal', 'Penca de nopal', 'Crece en cualquier tierra'],
    ],
    Comida: [
      ['tortilla', 'Tortillas', 'Recupera 20 de energía'],
      ['tuna', 'Tuna', 'Recupera 8 de energía'],
      ['maiz', 'Mazorca', 'Para moler masa'],
    ],
    Ofrendas: [
      ['pulque', 'Pulque', 'Ofrenda para los dioses'],
      ['maguey', 'Hijuelo de maguey', 'Da aguamiel en un año'],
    ],
  };

  const SHOP_LINES = [
    'Ya casi es la fiesta de Nezahual. ¿Llevas algo para la ofrenda?',
    'El maíz azul se da bonito al pie de la Malinche.',
    'Si me traes tunas, te las compro para el mercado.',
  ];

  const stack = (key, n) => ({ key, n: ITEMS[key].tool ? null : n });
  const emptyBag = () => Array(20).fill(null);

  function newGame() {
    const bag1 = emptyBag();
    [['maizAzul', 4], ['maguey', 1], ['frijol', 6], ['tortilla', 3], ['coa', 0]].forEach(([k, n], i) => { bag1[i] = stack(k, n); });
    return {
      vida: 85, energia: 92, cacao: 1888, agua: 8, respeto: 43, amistad: 5,
      bar: [['coa', 0], ['cantaro', 0], ['maiz', 12], ['frijol', 19], ['calabaza', 3], ['chile', 8], ['tuna', 7], ['nopal', 5], ['pulque', 2], ['tortilla', 6]].map(([k, n]) => stack(k, n)),
      bags: [bag1, emptyBag(), emptyBag()],
    };
  }

  window.Tlax = window.Tlax || {};
  Object.assign(window.Tlax, { ITEMS, SHOP, SHOP_LINES, newGame });
})();
