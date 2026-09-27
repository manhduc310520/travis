// Figma Plugin API snippet — run through the Figma MCP `use_figma` tool on
// file hneVCBNUiPizVorg7Jp18G. The Variables REST API needs an Enterprise
// plan, so this is the export path. It is read-only.
//
// Set SLICE (output is capped at ~20 KB per call) and run it once per slice:
//   'global'    → 0. Global (primitives, one mode)
//   'palette'   → 2. Colors, color/palette/*
//   'semantic'  → 2. Colors, everything else
//   'rest'      → 1. Brand, 3. Dimensions, 4. Typography
//   'component' → 5. Components, Component/* only
//   'effects'   → effect styles Shadow/* as CSS box-shadow strings (type "E")
// Save each result to a file, merge them with
// `node scripts/merge-figma-export.mjs <files…>`, then run `npm run build:tokens`.
//
// SLICE = 'checksum' returns an FNV-1a hash of every slice instead of the JSON.
// `node scripts/export-checksum.mjs` computes the same hashes from
// tokens/figma-export.json: equal hashes mean the local export matches Figma.
//
// Names are exported as Figma shows them (Title Case); scripts/tokens-lib.mjs
// lowercases them for code.
// Value encoding: "@name" = alias, "@name|10" = alias at 10 % opacity,
// "#rrggbb[aa]" = colour, numbers and strings as-is.
const SLICE = 'global';
// Matched on the collection name's ending, so a renamed prefix does not break the export.
const keyOf = (name) => (name.match(/(Global|Brand|Colors|Dimensions|Typography|Components)$/) || [])[1]?.toLowerCase();
const SLICES = {
  global: { keys: ['global'], keep: () => true },
  palette: { keys: ['colors'], keep: (n) => n.toLowerCase().startsWith('color/palette/') },
  semantic: { keys: ['colors'], keep: (n) => !n.toLowerCase().startsWith('color/palette/') },
  rest: { keys: ['brand', 'dimensions', 'typography'], keep: () => true },
  component: { keys: ['components'], keep: (n) => n.startsWith('Component/') },
};
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const vars = await figma.variables.getLocalVariablesAsync();
const byId = Object.fromEntries(vars.map((v) => [v.id, v]));
const hex = (c) => '#' + [c.r, c.g, c.b].concat(typeof c.a === 'number' && c.a < 1 ? [c.a] : [])
  .map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
const enc = (val) => {
  if (val && val.type === 'VARIABLE_ALIAS') return '@' + byId[val.id].name;
  if (val && val.color && val.color.type === 'VARIABLE_ALIAS') return '@' + byId[val.color.id].name + '|' + val.opacity;
  if (val && typeof val.r === 'number') return hex(val);
  return val;
};
async function sliceJSON(name) {
  if (name === 'effects') {
    // Figma lists the bottom layer last; CSS lists the top layer first, so reverse.
    const rgba = (c) => `rgba(${[c.r, c.g, c.b].map((x) => Math.round(x * 255)).join(', ')}, ${+c.a.toFixed(3)})`;
    const layer = (e) => `${e.type === 'INNER_SHADOW' ? 'inset ' : ''}${e.offset.x}px ${e.offset.y}px ${e.radius}px ${e.spread || 0}px ${rgba(e.color)}`;
    const effectVars = {};
    for (const s of await figma.getLocalEffectStylesAsync()) {
      if (!s.name.startsWith('Shadow/')) continue;
      effectVars[s.name] = ['E', s.effects.filter((e) => e.visible !== false && /SHADOW$/.test(e.type)).reverse().map(layer).join(', ')];
    }
    return JSON.stringify({ effects: { modes: ['value'], vars: effectVars } });
  }
  const slice = SLICES[name];
  const out = {};
  for (const c of cols) {
    const key = keyOf(c.name);
    if (!key || !slice.keys.includes(key)) continue;
    const entry = { modes: c.modes.map((m) => m.name.toLowerCase()), vars: {} };
    for (const id of c.variableIds) {
      const v = byId[id];
      if (!slice.keep(v.name)) continue;
      entry.vars[v.name] = [v.resolvedType[0], ...c.modes.map((m) => enc(v.valuesByMode[m.modeId]))];
    }
    out[key] = entry;
  }
  return JSON.stringify(out);
}
if (SLICE !== 'checksum') return await sliceJSON(SLICE);
// Figma does not return collections or variables in a stable order, so hash a key-sorted copy.
// FNV-1a 32-bit over UTF-16 code units; keep identical to scripts/export-checksum.mjs.
const canon = (x) => Array.isArray(x) ? x.map(canon) : x && typeof x === 'object' ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, canon(x[k])])) : x;
const fnv = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, '0'); };
const sums = {};
for (const name of [...Object.keys(SLICES), 'effects']) sums[name] = fnv(JSON.stringify(canon(JSON.parse(await sliceJSON(name)))));
return sums;
