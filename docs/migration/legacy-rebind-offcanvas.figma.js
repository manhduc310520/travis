// Figma Plugin API snippet — run through the Figma MCP `use_figma` tool on the
// FABi CMS Figma file. Legacy deletion, off-canvas sources (docs/fc-worklog.md §23).
//
// SLOT default content (and similar) lives in frames that sit on no page. A layer shown inside an
// instance inherits from them, so neither phase A (pages only) nor the orphan-component pass
// reaches them. For each node on PAGES still bound to Legacy inside an instance, this looks up
// every shorter form of its id ("I a;b;c" → "I b;c", "c"); any node found that is on no page
// marks an off-canvas root, and every Legacy binding inside that root is rebound.
// Re-run until `fixed` is 0.
const PAGES = ['411:16'], BUDGET = 45000
const t0 = Date.now()
const cols = await figma.variables.getLocalVariableCollectionsAsync()
const vars = await figma.variables.getLocalVariablesAsync()
const byId = new Map(vars.map(v => [v.id, v]))
const isL = (id) => byId.get(id)?.name.startsWith('Legacy/')
const modeOf = new Map(cols.map(c => [c.id, c.modes[0].modeId]))
const target = (id) => { let v = byId.get(id), h = 0; while (v && v.name.startsWith('Legacy/') && h < 10) { const val = v.valuesByMode[modeOf.get(v.variableCollectionId)]; if (val && val.type === 'VARIABLE_ALIAS') { v = byId.get(val.id); h++ } else return null } return v }
const arr = (v) => (Array.isArray(v) ? v : [v]).filter(a => a && a.id)
const hasL = (v) => arr(v).some(a => isL(a.id))
const st = { rebound: 0, detached: 0, errors: [] }
const tally = (t) => { if (t) st.rebound++; else st.detached++; return t }
const fontsOf = (n) => n.characters.length ? n.getRangeAllFontNames(0, n.characters.length) : n.fontName === figma.mixed ? [] : [n.fontName]
const mapPaints = (ps) => ps.map(p => { const a = p.boundVariables?.color; if (!a || !isL(a.id)) return p; return figma.variables.setBoundVariableForPaint(p, 'color', tally(target(a.id))) })
function fixAll(n) {
  for (const key of Object.keys(n.boundVariables || {})) {
    try {
      if (!hasL(n.boundVariables[key])) continue
      if (key === 'fills' || key === 'strokes') n[key] = mapPaints(n[key])
      else if (key === 'effects') n.effects = n.effects.map(e => { let o = e; for (const [f, a] of Object.entries(e.boundVariables || {})) if (a && isL(a.id)) o = figma.variables.setBoundVariableForEffect(o, f, tally(target(a.id))); return o })
      else if (key === 'layoutGrids') n.layoutGrids = n.layoutGrids.map(g => { let o = g; for (const [f, a] of Object.entries(g.boundVariables || {})) if (a && isL(a.id)) o = figma.variables.setBoundVariableForLayoutGrid(o, f, tally(target(a.id))); return o })
      else if (key === 'textRangeFills') { if (!n.characters.length) n.fills = mapPaints(n.fills); else for (const seg of n.getStyledTextSegments(['fills'])) if (seg.fills.some(p => p.boundVariables?.color && isL(p.boundVariables.color.id))) n.setRangeFills(seg.start, seg.end, mapPaints(seg.fills)) }
      else if (Array.isArray(n.boundVariables[key])) { if (!n.characters.length) n.setBoundVariable(key, tally(target(arr(n.boundVariables[key]).find(x => isL(x.id)).id))); else for (const seg of n.getStyledTextSegments(['boundVariables'])) { const a = seg.boundVariables?.[key]; if (a && isL(a.id)) n.setRangeBoundVariable(seg.start, seg.end, key, tally(target(a.id))) } }
      else if (n.type === 'TEXT' && key === 'maxWidth') { n.setBoundVariable(key, null); st.detached++ }
      else n.setBoundVariable(key, tally(target(n.boundVariables[key].id)))
    } catch (e) { st.errors.push(n.id + ':' + key + ':' + String(e).slice(0, 80)) }
  }
}
const onPage = (n) => { let q = n; while (q && q.type !== 'PAGE') q = q.parent; return !!q }
const topOf = (n) => { let q = n; while (q.parent && q.parent.type !== 'DOCUMENT') q = q.parent; return q }
const cache = new Map()
const get = async (id) => { if (!cache.has(id)) cache.set(id, await figma.getNodeByIdAsync(id)); return cache.get(id) }
const roots = new Map()
for (const pid of PAGES) {
  if (Date.now() - t0 > BUDGET * 0.5) break
  const page = figma.root.children.find(p => p.id === pid)
  await page.loadAsync()
  const stack = page.children.slice()
  while (stack.length) {
    const n = stack.pop()
    if ('children' in n) for (const k of n.children) stack.push(k)
    if (!n.id.startsWith('I') || !Object.values(n.boundVariables || {}).some(hasL)) continue
    const segs = n.id.slice(1).split(';')
    for (let i = 1; i < segs.length; i++) {
      const rest = segs.slice(i)
      const s = await get(rest.length === 1 ? rest[0] : 'I' + rest.join(';'))
      if (s && !onPage(s)) { const r = topOf(s); roots.set(r.id, r) }
    }
  }
}
const todo = []
for (const r of roots.values()) { const stack = [r]; while (stack.length) { const n = stack.pop(); if (Object.values(n.boundVariables || {}).some(hasL)) todo.push(n); if ('children' in n) for (const k of n.children) stack.push(k) } }
const fonts = new Map()
for (const n of todo) if (n.type === 'TEXT') for (const f of fontsOf(n)) fonts.set(f.family + '|' + f.style, f)
await Promise.allSettled([...fonts.values()].map(f => figma.loadFontAsync(f)))
let fixed = 0
for (const n of todo) { if (Date.now() - t0 > BUDGET) break; fixAll(n); fixed++ }
return { roots: [...roots.values()].map(r => r.id + ' ' + r.type + ' ' + r.name.slice(0, 30)), found: todo.length, fixed, rebound: st.rebound, detached: st.detached, errors: st.errors.slice(0, 10), ms: Date.now() - t0 }
