import type { ReactNode } from 'react'
import type { Key } from 'react-aria-components'

/** One node of the tree. A node without `children` is a leaf. */
export interface CascaderOption {
  key: Key
  label: ReactNode
  /** Text for type-ahead, search, tags and screen readers when `label` is not a string. */
  textValue?: string
  children?: CascaderOption[]
  isDisabled?: boolean
}

/** Keys from the first column down to the chosen node, e.g. `['hn', 'hoan-kiem', 'trang-tien']`. */
export type CascaderPath = Key[]

export const textOf = (o: Pick<CascaderOption, 'label' | 'textValue'>): string =>
  o.textValue ?? (typeof o.label === 'string' || typeof o.label === 'number' ? String(o.label) : '')

/** A stable string id for a path (used as a ListBox key and in sets). */
export const pathId = (path: readonly Key[]) => JSON.stringify(path.map(String))

export const hasChildren = (o: CascaderOption) => (o.children?.length ?? 0) > 0

/** The options along `path`; stops at the first key that is not found. */
export function nodesOf(options: CascaderOption[], path: readonly Key[]): CascaderOption[] {
  const out: CascaderOption[] = []
  let level: CascaderOption[] | undefined = options
  for (const key of path) {
    const node: CascaderOption | undefined = level?.find((o) => o.key === key)
    if (!node) break
    out.push(node)
    level = node.children
  }
  return out
}

interface Leaf {
  id: string
  disabled: boolean
}

/** Every leaf under `node` (the node itself when it is a leaf). A leaf is disabled when it or an ancestor is. */
function leavesOf(node: CascaderOption, path: readonly Key[], inheritedDisabled = false): Leaf[] {
  const disabled = inheritedDisabled || !!node.isDisabled
  if (!hasChildren(node)) return [{ id: pathId(path), disabled }]
  return node.children!.flatMap((c) => leavesOf(c, [...path, c.key], disabled))
}

export type CheckState = 'checked' | 'indeterminate' | 'unchecked'

/**
 * Multiple mode: a branch is checked when every leaf the user can change is
 * checked (disabled leaves only count when they already are), indeterminate
 * when some are.
 */
export function checkStateOf(node: CascaderOption, path: readonly Key[], checked: ReadonlySet<string>): CheckState {
  const leaves = leavesOf(node, path)
  const counted = leaves.filter((l) => !l.disabled || checked.has(l.id))
  if (counted.length > 0 && counted.every((l) => checked.has(l.id))) return 'checked'
  return leaves.some((l) => checked.has(l.id)) ? 'indeterminate' : 'unchecked'
}

/**
 * Checked leaves implied by a multiple value. A path to a branch checks its
 * enabled leaves (so a round trip through `valueFromChecked` is stable); a path
 * through a disabled node was set by the app on purpose and checks everything under it.
 */
export function checkedFromValue(options: CascaderOption[], value: readonly (readonly Key[])[]): Set<string> {
  const out = new Set<string>()
  for (const path of value) {
    const nodes = nodesOf(options, path)
    if (nodes.length !== path.length || nodes.length === 0) continue
    const explicit = nodes.some((n) => n.isDisabled)
    for (const leaf of leavesOf(nodes[nodes.length - 1], path)) if (explicit || !leaf.disabled) out.add(leaf.id)
  }
  return out
}

/** Checks or unchecks every enabled leaf under the node at `path`. */
export function toggleChecked(options: CascaderOption[], checked: ReadonlySet<string>, path: readonly Key[], on: boolean): Set<string> {
  const out = new Set(checked)
  const nodes = nodesOf(options, path)
  if (nodes.length !== path.length || nodes.length === 0) return out
  for (const leaf of leavesOf(nodes[nodes.length - 1], path)) {
    if (leaf.disabled) continue
    if (on) out.add(leaf.id)
    else out.delete(leaf.id)
  }
  return out
}

/** Removes every leaf under `path`, disabled ones included (removing a tag). */
export function removePath(options: CascaderOption[], checked: ReadonlySet<string>, path: readonly Key[]): Set<string> {
  const out = new Set(checked)
  const nodes = nodesOf(options, path)
  if (nodes.length !== path.length || nodes.length === 0) return out
  for (const leaf of leavesOf(nodes[nodes.length - 1], path)) out.delete(leaf.id)
  return out
}

/** The shortest list of paths that covers the checked leaves: a fully checked branch is one entry. */
export function valueFromChecked(options: CascaderOption[], checked: ReadonlySet<string>): CascaderPath[] {
  const out: CascaderPath[] = []
  const walk = (list: CascaderOption[], parent: Key[]) => {
    for (const o of list) {
      const path = [...parent, o.key]
      const state = checkStateOf(o, path, checked)
      if (state === 'checked') out.push(path)
      else if (state === 'indeterminate' && hasChildren(o)) walk(o.children!, path)
    }
  }
  walk(options, [])
  return out
}

/** One searchable path: "Hà Nội / Hoàn Kiếm / Tràng Tiền". */
export interface PathEntry {
  id: string
  path: CascaderPath
  nodes: CascaderOption[]
  text: string
  isDisabled: boolean
}

/** Every path to a leaf (and to every branch too when branches can be chosen). */
export function allPaths(options: CascaderOption[], includeBranches: boolean): PathEntry[] {
  const out: PathEntry[] = []
  const walk = (list: CascaderOption[], path: Key[], nodes: CascaderOption[], disabled: boolean) => {
    for (const o of list) {
      const p = [...path, o.key]
      const n = [...nodes, o]
      const d = disabled || !!o.isDisabled
      if (!hasChildren(o) || includeBranches) out.push({ id: pathId(p), path: p, nodes: n, text: n.map(textOf).join(' / '), isDisabled: d })
      if (hasChildren(o)) walk(o.children!, p, n, d)
    }
  }
  walk(options, [], [], false)
  return out
}

/** Accent- and case-insensitive form of a string: "Hoàn Kiếm" → "hoan kiem", "Đống Đa" → "dong da". */
export const fold = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()

/** Where `query` occurs in `text`, ignoring accents and case: [start, end) in `text`, or null. */
export function matchRange(text: string, query: string): [number, number] | null {
  const q = fold(query.trim())
  if (!q) return null
  const chars = Array.from(text)
  const owner: number[] = []
  let folded = ''
  chars.forEach((ch, i) => {
    const f = fold(ch)
    for (let j = 0; j < f.length; j++) owner.push(i)
    folded += f
  })
  const at = folded.indexOf(q)
  if (at < 0) return null
  const from = owner[at]
  const to = owner[at + q.length - 1] + 1
  return [chars.slice(0, from).join('').length, chars.slice(0, to).join('').length]
}
