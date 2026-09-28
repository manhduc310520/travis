// Figma Plugin API snippet — run through the Figma MCP `use_figma` tool on the
// FABi CMS Figma file. Phase B of deleting the `Legacy/*` variables (docs/fc-worklog.md §23).
// Run it only after phase A (legacy-rebind.figma.js) has finished on every page.
//
// Handles Legacy bindings on instances and inside them. Such a binding is either an override set
// at some instance level, or inherited from an override set further in (for example a Tab Item
// main component overriding its icon's stroke). Only bindings that Figma lists in an instance's
// `overrides` on THIS page are rebound; everything else is inherited and follows automatically once
// the level that set it is fixed. Rebinding an inherited value would create a new override and cut
// that layer off from future changes to its main component.
// Re-run over all pages until every page reports 0 candidates; a pass that fixes nothing while
// candidates remain means something is stuck — inspect `stuck`.
//
// FALLBACK = true: when a rebind does not stick (Figma ignores width/height bindings on a swapped
// icon nested in an instance), detach that binding instead; the value stays as it is.
//
// DRY = true only classifies. Writes happen in one synchronous loop after classification (an
// await between writes makes Figma re-lay out instances after every write).
const PAGES = ['27314:16859','448:65','371:11372','388:11035','396:13800','27784:133643','388:11438','411:16'], BUDGET = 45000, DRY = false, FALLBACK = true
const t0 = Date.now()
const cols = await figma.variables.getLocalVariableCollectionsAsync()
const vars = await figma.variables.getLocalVariablesAsync()
const byId = new Map(vars.map(v => [v.id, v]))
const isL = (id) => byId.get(id)?.name.startsWith('Legacy/')
const modeOf = new Map(cols.map(c => [c.id, c.modes[0].modeId]))
const target = (id) => { let v = byId.get(id), h = 0; while (v && v.name.startsWith('Legacy/') && h < 10) { const val = v.valuesByMode[modeOf.get(v.variableCollectionId)]; if (val && val.type === 'VARIABLE_ALIAS') { v = byId.get(val.id); h++ } else return null } return v }
const arr = (v) => (Array.isArray(v) ? v : [v]).filter(a => a && a.id)
const hasL = (v) => arr(v).some(a => isL(a.id))
// binding key → override field names Figma may report for it
const TEXT = ['styledTextSegments']
const FIELDS = {
  fontSize: ['fontSize', ...TEXT], fontFamily: ['fontName', ...TEXT], fontStyle: ['fontName', ...TEXT], fontWeight: ['fontName', ...TEXT],
  lineHeight: ['lineHeight', ...TEXT], letterSpacing: ['letterSpacing', ...TEXT], paragraphSpacing: ['paragraphSpacing', ...TEXT],
  paragraphIndent: ['paragraphIndent', ...TEXT], textRangeFills: ['fills', ...TEXT], characters: ['characters', 'text'],
  strokeTopWeight: ['stokeTopWeight', 'strokeWeight'], strokeBottomWeight: ['strokeBottomWeight', 'strokeWeight'],
  strokeLeftWeight: ['strokeLeftWeight', 'strokeWeight'], strokeRightWeight: ['strokeRightWeight', 'strokeWeight'],
  topLeftRadius: ['topLeftRadius', 'cornerRadius'], topRightRadius: ['topRightRadius', 'cornerRadius'],
  bottomLeftRadius: ['bottomLeftRadius', 'cornerRadius'], bottomRightRadius: ['bottomRightRadius', 'cornerRadius'],
}
// Figma sometimes reports a changed variable binding only as the field 'boundVariables'.
const fieldsFor = (k) => [...(FIELDS[k] || [k]), 'boundVariables']
const st = { rebound: 0, detached: 0, gone: 0, missingFont: [], errors: [] }
const tally = (t) => { if (t) st.rebound++; else st.detached++; return t }
const badFonts = new Set()
const fontsOf = (n) => n.characters.length ? n.getRangeAllFontNames(0, n.characters.length) : n.fontName === figma.mixed ? [] : [n.fontName]
const mapPaints = (ps) => ps.map(p => { const a = p.boundVariables?.color; if (!a || !isL(a.id)) return p; const t = tally(target(a.id)); return figma.variables.setBoundVariableForPaint(p, 'color', t) })
function fixKeys(n, keys) {
  // Fixing one override can rebuild the sublayers of a nested instance, so a queued node may be gone;
  // the next pass finds its replacement.
  if (n.removed) { st.gone++; return }
  // A text layer whose font is not available cannot be edited at all; report it instead.
  if (n.type === 'TEXT' && fontsOf(n).some(f => badFonts.has(f.family + '|' + f.style))) { st.missingFont.push(n.id); return }
  for (const key of keys) {
    try {
      // Rebinding width on a proportion-locked layer drops its height binding (height follows width).
      if (!hasL(n.boundVariables?.[key])) continue
      if (key === 'fills' || key === 'strokes') n[key] = mapPaints(n[key])
      else if (key === 'effects') n.effects = n.effects.map(e => { let o = e; for (const [f, a] of Object.entries(e.boundVariables || {})) if (a && isL(a.id)) { const t = tally(target(a.id)); o = figma.variables.setBoundVariableForEffect(o, f, t) } return o })
      else if (key === 'layoutGrids') n.layoutGrids = n.layoutGrids.map(g => { let o = g; for (const [f, a] of Object.entries(g.boundVariables || {})) if (a && isL(a.id)) { const t = tally(target(a.id)); o = figma.variables.setBoundVariableForLayoutGrid(o, f, t) } return o })
      else if (key === 'textRangeFills' && !n.characters.length) n.fills = mapPaints(n.fills)
      else if (Array.isArray(n.boundVariables[key]) && !n.characters.length) { const a = arr(n.boundVariables[key]).find(x => isL(x.id)); const t = tally(target(a.id)); n.setBoundVariable(key, t) }
      else if (key === 'textRangeFills') { for (const seg of n.getStyledTextSegments(['fills'])) if (seg.fills.some(p => p.boundVariables?.color && isL(p.boundVariables.color.id))) n.setRangeFills(seg.start, seg.end, mapPaints(seg.fills)) }
      else if (Array.isArray(n.boundVariables[key])) { for (const seg of n.getStyledTextSegments(['boundVariables'])) { const a = seg.boundVariables?.[key]; if (a && isL(a.id)) { const t = tally(target(a.id)); n.setRangeBoundVariable(seg.start, seg.end, key, t) } } }
      else if (n.type === 'TEXT' && key === 'maxWidth') { n.setBoundVariable(key, null); st.detached++ }
      else { const t = tally(target(n.boundVariables[key].id)); n.setBoundVariable(key, t) }
    } catch (e) { st.errors.push(n.id + ':' + key + ':' + String(e).slice(0, 80)) }
    if (FALLBACK && !n.removed && hasL(n.boundVariables?.[key])) detach(n, key)
  }
}
function detach(n, key) {
  try {
    const off = (ps) => ps.map(p => p.boundVariables?.color && isL(p.boundVariables.color.id) ? figma.variables.setBoundVariableForPaint(p, 'color', null) : p)
    if (key === 'fills' || key === 'strokes') n[key] = off(n[key])
    else if (key === 'effects') n.effects = n.effects.map(e => { let o = e; for (const [f, a] of Object.entries(e.boundVariables || {})) if (a && isL(a.id)) o = figma.variables.setBoundVariableForEffect(o, f, null); return o })
    else if (key === 'layoutGrids') n.layoutGrids = n.layoutGrids.map(g => { let o = g; for (const [f, a] of Object.entries(g.boundVariables || {})) if (a && isL(a.id)) o = figma.variables.setBoundVariableForLayoutGrid(o, f, null); return o })
    else if (key === 'textRangeFills') { if (!n.characters.length) n.fills = off(n.fills); else for (const seg of n.getStyledTextSegments(['fills'])) n.setRangeFills(seg.start, seg.end, off(seg.fills)) }
    else if (Array.isArray(n.boundVariables[key]) && n.characters.length) { for (const seg of n.getStyledTextSegments(['boundVariables'])) { const a = seg.boundVariables?.[key]; if (a && isL(a.id)) n.setRangeBoundVariable(seg.start, seg.end, key, null) } }
    else n.setBoundVariable(key, null)
    st.fallback = (st.fallback || 0) + 1
    if (hasL(n.boundVariables?.[key])) st.errors.push(n.id + ':' + key + ':detach did not stick')
  } catch (e) { st.errors.push(n.id + ':' + key + ':detach:' + String(e).slice(0, 60)) }
}
const report = {}
for (const pid of PAGES) {
  const page = figma.root.children.find(p => p.id === pid)
  await page.loadAsync()
  const r = { candidates: 0, override: 0, inherited: 0, sourceNodes: 0, fixed: 0, left: 0 }
  // every (node, field) overridden at an instance level that lives on this page
  const ov = new Map()
  for (const inst of page.findAllWithCriteria({ types: ['INSTANCE'] })) for (const o of inst.overrides) { const s = ov.get(o.id) || new Set(); for (const f of o.overriddenFields) s.add(f); ov.set(o.id, s) }
  const todo = []
  const stack = page.children.map(n => [n, false])
  while (stack.length) {
    const [n, inI] = stack.pop()
    if ('children' in n) { const nowIn = inI || n.type === 'INSTANCE'; for (const k of n.children) stack.push([k, nowIn]) }
    const bv = n.boundVariables
    if (!bv || !Object.values(bv).some(hasL)) continue
    if (!inI && n.type !== 'INSTANCE') { r.sourceNodes++; continue }
    r.candidates++
    const set = ov.get(n.id)
    const keys = set ? Object.keys(bv).filter(k => hasL(bv[k]) && fieldsFor(k).some(f => set.has(f))) : []
    if (keys.length) { r.override++; todo.push([n, keys]) } else r.inherited++
  }
  if (!DRY) {
    const fonts = new Map()
    for (const [n] of todo) if (n.type === 'TEXT' && !n.removed) for (const f of fontsOf(n)) fonts.set(f.family + '|' + f.style, f)
    const loaded = await Promise.allSettled([...fonts.values()].map(f => figma.loadFontAsync(f)))
    ;[...fonts.keys()].forEach((k, i) => { if (loaded[i].status === 'rejected') badFonts.add(k) })
    for (const [n, keys] of todo) { if (Date.now() - t0 > BUDGET) break; fixKeys(n, keys); r.fixed++ }
  }
  r.left = r.override - r.fixed
  report[pid] = [r.candidates, r.override, r.inherited, r.fixed, r.left, r.sourceNodes].join('/')
  if (Date.now() - t0 > BUDGET) break
}
return { legend: 'candidates/override/inherited/fixed/left/sourceNodes', DRY, report, ...st, missingFont: st.missingFont.length + ' ' + st.missingFont.slice(0, 5).join(','), badFonts: [...badFonts], errors: st.errors.slice(0, 10), ms: Date.now() - t0 }
