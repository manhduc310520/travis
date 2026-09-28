// Figma Plugin API snippet — run through the Figma MCP `use_figma` tool on the
// FABi CMS Figma file. Phase A of deleting the `Legacy/*` variables (docs/fc-worklog.md §23).
//
// For every node on PAGES that is NOT an instance (and not inside one), each binding to a
// `Legacy/*` variable is moved to the end of its alias chain (the first non-Legacy variable).
// A Legacy variable with a raw value has no target: the binding is detached and the node keeps
// the value. Instances inherit from their main component; their own overrides are phase B.
//
// Writes on heavily-instanced pages (Button) cost ~200 ms each because Figma re-lays out every
// instance, so the script works in synchronous chunks (fonts loaded once up front) and stops
// after BUDGET ms. Re-run until `left` is 0. Button page: ~50 nodes per 70 s call.
const PAGES = ['368:430'], BUDGET = 70000, MAXN = 150
const t0 = Date.now()
const cols = await figma.variables.getLocalVariableCollectionsAsync()
const vars = await figma.variables.getLocalVariablesAsync()
const byId = new Map(vars.map(v => [v.id, v]))
const isL = (id) => byId.get(id)?.name.startsWith('Legacy/')
const modeOf = new Map(cols.map(c => [c.id, c.modes[0].modeId]))
const target = (id) => { let v = byId.get(id), h = 0; while (v && v.name.startsWith('Legacy/') && h < 10) { const val = v.valuesByMode[modeOf.get(v.variableCollectionId)]; if (val && val.type === 'VARIABLE_ALIAS') { v = byId.get(val.id); h++ } else return null } return v }
const hasL = (bv) => { for (const k in bv) { const v = bv[k]; const arr = Array.isArray(v) ? v : [v]; for (const a of arr) if (a && a.id && isL(a.id)) return true } return false }
const st = { rebound: 0, detached: 0, skipped: [], errors: [] }
const tally = (t) => { if (t) st.rebound++; else st.detached++; return t }
const mapPaints = (ps) => ps.map(p => { const a = p.boundVariables?.color; if (!a || !isL(a.id)) return p; const t = tally(target(a.id)); return figma.variables.setBoundVariableForPaint(p, 'color', t) })
const left = {}
for (const pid of PAGES) {
  const page = figma.root.children.find(p => p.id === pid)
  await page.loadAsync()
  const todo = []
  const stack = page.children.slice()
  while (stack.length) { const n = stack.pop(); if (n.type === 'INSTANCE') continue; const bv = n.boundVariables; if (bv && hasL(bv)) todo.push(n); if ('children' in n) for (const k of n.children) stack.push(k) }
  const batch = todo.slice(0, MAXN)
  const fonts = new Map()
  for (const n of batch) if (n.type === 'TEXT') for (const f of (n.characters.length ? n.getRangeAllFontNames(0, n.characters.length) : n.fontName === figma.mixed ? [] : [n.fontName])) fonts.set(f.family + '|' + f.style, f)
  await Promise.all([...fonts.values()].map(f => figma.loadFontAsync(f)))
  let done = 0
  for (const n of batch) {
    if (Date.now() - t0 > BUDGET) break
    const bv = n.boundVariables || {}
    for (const key of Object.keys(bv)) {
      const val = bv[key]
      try {
        if (key === 'fills' || key === 'strokes') { if (val.some(a => a && isL(a.id))) n[key] = mapPaints(n[key]) }
        else if (key === 'effects') { if (val.some(a => a && isL(a.id))) n.effects = n.effects.map(e => { let o = e; for (const [f, a] of Object.entries(e.boundVariables || {})) if (a && isL(a.id)) { const t = tally(target(a.id)); o = figma.variables.setBoundVariableForEffect(o, f, t) } return o }) }
        else if (key === 'layoutGrids') { if (val.some(a => a && isL(a.id))) n.layoutGrids = n.layoutGrids.map(g => { let o = g; for (const [f, a] of Object.entries(g.boundVariables || {})) if (a && isL(a.id)) { const t = tally(target(a.id)); o = figma.variables.setBoundVariableForLayoutGrid(o, f, t) } return o }) }
        else if (Array.isArray(val)) {
          if (!val.some(a => a && isL(a.id))) continue
          if (n.type !== 'TEXT') { st.skipped.push(n.id + ':' + key); continue }
          if (!n.characters.length) { if (key === 'textRangeFills') n.fills = mapPaints(n.fills); else { const a = val.find(x => x && isL(x.id)); const t = tally(target(a.id)); n.setBoundVariable(key, t) } }
          else if (key === 'textRangeFills') { for (const seg of n.getStyledTextSegments(['fills'])) if (seg.fills.some(p => p.boundVariables?.color && isL(p.boundVariables.color.id))) n.setRangeFills(seg.start, seg.end, mapPaints(seg.fills)) }
          else for (const seg of n.getStyledTextSegments(['boundVariables'])) { const a = seg.boundVariables?.[key]; if (a && isL(a.id)) { const t = tally(target(a.id)); n.setRangeBoundVariable(seg.start, seg.end, key, t) } }
        }
        else if (val && val.id) { if (isL(val.id)) { const t = tally(target(val.id)); n.setBoundVariable(key, t) } }
        else if (val && typeof val === 'object') { if (Object.values(val).some(a => a && a.id && isL(a.id))) st.skipped.push(n.id + ':' + key) }
      } catch (e) { st.errors.push(n.id + ':' + key + ':' + String(e).slice(0, 80)) }
    }
    done++
  }
  if (todo.length - done) left[pid] = todo.length - done
}
return { ...st, skipped: st.skipped.slice(0, 10), errors: st.errors.slice(0, 10), left, ms: Date.now() - t0 }
