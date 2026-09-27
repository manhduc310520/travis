import type { ReactNode } from 'react'
import type { Key } from 'react-aria-components'

/** One node of a Tree / TreeSelect. */
export interface TreeNode {
  key: Key
  /** Row text (Figma "Text"). */
  title: ReactNode
  /** Plain text for type-ahead, search and screen readers when `title` is not a string. */
  textValue?: string
  /** Figma Type=Icon: 16px icon before the title. */
  icon?: ReactNode
  children?: TreeNode[]
  /** Figma State=Disabled: cannot be focused, expanded, selected or checked. */
  isDisabled?: boolean
  /**
   * `true`: never expandable. `false` with no `children`: expandable, children
   * come from `loadData` (async load) the first time it opens.
   */
  isLeaf?: boolean
}

/** Where dragged nodes land: before / after a node, or inside it (last child). */
export interface TreeMoveTarget {
  key: Key
  position: 'before' | 'after' | 'on'
}

/** TreeSelect multiple: which checked keys make up the value. */
export type TreeCheckedStrategy = 'all' | 'parent' | 'child'

export interface TreeCheckState {
  /** Fully checked nodes (a parent is here only when all its enabled children are). */
  checked: Set<Key>
  /** Parents with some, not all, enabled children checked (indeterminate box). */
  half: Set<Key>
}

export const textOf = (node: Pick<TreeNode, 'title' | 'textValue'>): string =>
  node.textValue ?? (typeof node.title === 'string' || typeof node.title === 'number' ? String(node.title) : '')

export const isExpandable = (node: TreeNode) => (node.children?.length ?? 0) > 0 || node.isLeaf === false

interface IndexEntry { node: TreeNode; parent: Key | null }

/** Key → node and parent key, for the whole tree. */
export function indexTree(items: TreeNode[]): Map<Key, IndexEntry> {
  const map = new Map<Key, IndexEntry>()
  const dig = (list: TreeNode[], parent: Key | null) => {
    for (const node of list) {
      map.set(node.key, { node, parent })
      if (node.children) dig(node.children, node.key)
    }
  }
  dig(items, null)
  return map
}

/** Every key, in display order. */
export function allKeys(items: TreeNode[]): Key[] {
  const out: Key[] = []
  const dig = (list: TreeNode[]) => list.forEach((n) => { out.push(n.key); if (n.children) dig(n.children) })
  dig(items)
  return out
}

/** Keys of every node that has children — pass to `expandedKeys` to expand all. */
export function getExpandableKeys(items: TreeNode[]): Key[] {
  const out: Key[] = []
  const dig = (list: TreeNode[]) => list.forEach((n) => { if (n.children?.length) { out.push(n.key); dig(n.children) } })
  dig(items)
  return out
}

/** Keys of every ancestor of `keys` (to open the tree down to a selected value). */
export function ancestorKeys(items: TreeNode[], keys: Iterable<Key>): Key[] {
  const index = indexTree(items)
  const out = new Set<Key>()
  for (const key of keys) {
    let parent = index.get(key)?.parent ?? null
    while (parent != null) {
      out.add(parent)
      parent = index.get(parent)?.parent ?? null
    }
  }
  return [...out]
}

// ---------- search ----------

/** Case- and accent-insensitive form: "Phở Bò" and "pho bo" match (Vietnamese `đ` → `d`). */
export const fold = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()

/** Splits `text` into matched / unmatched runs of `query` (accent-insensitive), for highlighting. */
export function highlightParts(text: string, query: string): { text: string; match: boolean }[] {
  const q = fold(query.trim())
  if (!q) return [{ text, match: false }]
  let folded = ''
  const starts: number[] = []
  const ends: number[] = []
  let pos = 0
  for (const ch of text) {
    for (const c of fold(ch)) {
      folded += c
      starts.push(pos)
      ends.push(pos + ch.length)
    }
    pos += ch.length
  }
  const parts: { text: string; match: boolean }[] = []
  let last = 0
  for (let i = folded.indexOf(q); i !== -1; i = folded.indexOf(q, i + q.length)) {
    const s = starts[i]
    const e = ends[i + q.length - 1]
    if (s > last) parts.push({ text: text.slice(last, s), match: false })
    parts.push({ text: text.slice(s, e), match: true })
    last = e
  }
  if (last < text.length) parts.push({ text: text.slice(last), match: false })
  return parts
}

/**
 * Keeps the nodes whose text contains `query`, with all their descendants,
 * plus their ancestors. `expanded` holds every
 * ancestor of a match so the matches are in view.
 */
export function filterTree(items: TreeNode[], query: string): { items: TreeNode[]; expanded: Set<Key> } {
  const q = fold(query.trim())
  const expanded = new Set<Key>()
  if (!q) return { items, expanded }
  const dig = (list: TreeNode[], keepAll: boolean): { nodes: TreeNode[]; any: boolean } => {
    const nodes: TreeNode[] = []
    let any = false
    for (const node of list) {
      const self = fold(textOf(node)).includes(q)
      const below = node.children ? dig(node.children, keepAll || self) : { nodes: undefined, any: false }
      if (below.any) expanded.add(node.key)
      if (keepAll || self || below.any) nodes.push(node.children ? { ...node, children: below.nodes } : node)
      any = any || self || below.any
    }
    return { nodes, any }
  }
  return { items: dig(items, false).nodes, expanded }
}

// ---------- checkable (tri-state) ----------

function eachEnabledDescendant(node: TreeNode, fn: (n: TreeNode) => void) {
  for (const child of node.children ?? []) {
    if (child.isDisabled) continue
    fn(child)
    eachEnabledDescendant(child, fn)
  }
}

/**
 * Re-derives every parent from its children, bottom-up: checked when all
 * enabled children are, half-checked when some are. Disabled nodes keep their
 * own state and neither pass nor take checks.
 */
export function normalizeChecked(items: TreeNode[], keys: Iterable<Key>): TreeCheckState {
  const checked = new Set(keys)
  const half = new Set<Key>()
  const visit = (node: TreeNode) => {
    const kids = node.children ?? []
    kids.forEach(visit)
    const enabled = kids.filter((c) => !c.isDisabled)
    if (enabled.length === 0) return
    if (enabled.every((c) => checked.has(c.key))) {
      checked.add(node.key)
    } else {
      checked.delete(node.key)
      if (enabled.some((c) => checked.has(c.key) || half.has(c.key))) half.add(node.key)
    }
  }
  items.forEach(visit)
  return { checked, half }
}

/** State from a list of checked keys: each key checks its enabled subtree, then parents are derived. */
export function conductChecked(items: TreeNode[], keys: Iterable<Key>): TreeCheckState {
  const index = indexTree(items)
  const set = new Set<Key>()
  for (const key of keys) {
    set.add(key)
    const node = index.get(key)?.node
    if (node) eachEnabledDescendant(node, (c) => set.add(c.key))
  }
  return normalizeChecked(items, set)
}

/** Applies what changed between two checked sets: a newly (un)checked node (un)checks its enabled subtree. */
export function toggleChecked(items: TreeNode[], prev: ReadonlySet<Key>, next: ReadonlySet<Key>): TreeCheckState {
  const index = indexTree(items)
  const set = new Set(prev)
  for (const key of next) {
    if (prev.has(key)) continue
    set.add(key)
    const node = index.get(key)?.node
    if (node) eachEnabledDescendant(node, (c) => set.add(c.key))
  }
  for (const key of prev) {
    if (next.has(key)) continue
    set.delete(key)
    const node = index.get(key)?.node
    if (node) eachEnabledDescendant(node, (c) => set.delete(c.key))
  }
  return normalizeChecked(items, set)
}

/**
 * Checked keys → value, in display order. `child` (default in TreeSelect):
 * nodes without enabled children; `parent`: the top-most checked nodes;
 * `all`: every checked node.
 */
export function checkedToValue(items: TreeNode[], checked: ReadonlySet<Key>, strategy: TreeCheckedStrategy): Key[] {
  const out: Key[] = []
  const seen = new Set<Key>()
  const dig = (list: TreeNode[]) => {
    for (const node of list) {
      seen.add(node.key)
      const isChecked = checked.has(node.key)
      const hasEnabledKids = (node.children ?? []).some((c) => !c.isDisabled)
      if (isChecked && (strategy === 'all' || strategy === 'parent' || !hasEnabledKids)) out.push(node.key)
      if (node.children && !(isChecked && strategy === 'parent')) dig(node.children)
    }
  }
  dig(items)
  // Keys not in the tree (e.g. children not loaded yet) are kept as given.
  for (const key of checked) if (!seen.has(key)) out.push(key)
  return out
}

// ---------- drag and drop ----------

/** True when `key` sits somewhere below `ancestor`. */
export function isDescendantOf(index: Map<Key, IndexEntry>, key: Key, ancestor: Key): boolean {
  let parent = index.get(key)?.parent ?? null
  while (parent != null) {
    if (parent === ancestor) return true
    parent = index.get(parent)?.parent ?? null
  }
  return false
}

/**
 * Returns a new tree with `keys` moved before / after / into `target`.
 * Unchanged when the target is one of the moved nodes or inside one of them.
 */
export function moveNodes(items: TreeNode[], keys: Iterable<Key>, target: TreeMoveTarget): TreeNode[] {
  const index = indexTree(items)
  const moving = [...keys].filter((k) => index.has(k))
  const top = moving.filter((k) => !moving.some((o) => o !== k && isDescendantOf(index, k, o)))
  if (top.length === 0 || top.includes(target.key) || top.some((k) => isDescendantOf(index, target.key, k))) return items
  const order = allKeys(items)
  top.sort((a, b) => order.indexOf(a) - order.indexOf(b))
  const moved = top.map((k) => index.get(k)!.node)
  const drop = new Set(top)

  const remove = (list: TreeNode[]): TreeNode[] =>
    list.filter((n) => !drop.has(n.key)).map((n) => (n.children ? { ...n, children: remove(n.children) } : n))
  const insert = (list: TreeNode[]): TreeNode[] => {
    const i = list.findIndex((n) => n.key === target.key)
    if (i === -1) return list.map((n) => (n.children ? { ...n, children: insert(n.children) } : n))
    if (target.position === 'on') {
      return list.map((n, j) => (j === i ? { ...n, isLeaf: undefined, children: [...(n.children ?? []), ...moved] } : n))
    }
    const at = target.position === 'before' ? i : i + 1
    return [...list.slice(0, at), ...moved, ...list.slice(at)]
  }
  return insert(remove(items))
}
