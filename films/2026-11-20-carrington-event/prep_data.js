// Builds data.js: world land outlines for the globes + a clipped high-detail New England coast.
const fs = require('fs');
const topo = require('topojson-client');
const rd = f => JSON.parse(fs.readFileSync('node_modules/world-atlas/' + f, 'utf8'));
const l110 = rd('land-110m.json'), l50 = rd('land-50m.json'), l10 = rd('land-10m.json');
const bb = [-73.8, 41.0, -67.2, 45.2]; // lon0, lat0, lon1, lat1
const edges = [
  [p => p[0] >= bb[0], (a, b) => { const t = (bb[0] - a[0]) / (b[0] - a[0]); return [bb[0], a[1] + t * (b[1] - a[1])]; }],
  [p => p[0] <= bb[2], (a, b) => { const t = (bb[2] - a[0]) / (b[0] - a[0]); return [bb[2], a[1] + t * (b[1] - a[1])]; }],
  [p => p[1] >= bb[1], (a, b) => { const t = (bb[1] - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), bb[1]]; }],
  [p => p[1] <= bb[3], (a, b) => { const t = (bb[3] - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), bb[3]]; }],
];
function clipRing(ring) { // Sutherland-Hodgman against the bbox
  let out = ring.slice(0, -1);
  for (const [inside, inter] of edges) {
    const inp = out; out = [];
    if (!inp.length) break;
    for (let i = 0; i < inp.length; i++) {
      const a = inp[i], b = inp[(i + 1) % inp.length], ia = inside(a), ib = inside(b);
      if (ia && ib) out.push(b);
      else if (ia && !ib) out.push(inter(a, b));
      else if (!ia && ib) { out.push(inter(a, b)); out.push(b); }
    }
  }
  return out;
}
const f10 = topo.feature(l10, l10.objects.land);
const geoms = f10.type === 'FeatureCollection' ? f10.features.map(f => f.geometry) : [f10.geometry];
const polys = [];
for (const g of geoms) {
  const list = g.type === 'MultiPolygon' ? g.coordinates : [g.coordinates];
  for (const poly of list) {
    const r = clipRing(poly[0]);
    if (r.length >= 3) polys.push(r.map(p => [+p[0].toFixed(4), +p[1].toFixed(4)]));
  }
}
const js = 'window.LAND110=' + JSON.stringify(l110) + ';\nwindow.LAND50=' + JSON.stringify(l50) + ';\nwindow.NE10=' + JSON.stringify(polys) + ';\n';
fs.writeFileSync('data.js', js);
console.log('polys', polys.length, 'points', polys.reduce((a, r) => a + r.length, 0), 'bytes', js.length);
