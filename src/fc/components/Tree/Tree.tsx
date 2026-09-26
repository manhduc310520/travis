import { useMemo, useRef, useState, type CSSProperties, type ReactNode, type Ref } from 'react'
import {
  Button as AriaButton,
  DropIndicator,
  Tree as AriaTree,
  TreeItem,
  TreeItemContent,
  TreeLoadMoreItem,
  useDragAndDrop,
  type DropTarget,
  type Key,
  type Selection,
} from 'react-aria-components'
import { ChevronDown, File06, Folder, MinusSquare, PlusSquare } from '../../../icons'
import { cx } from '../../space'
import { Checkbox } from '../Checkbox/Checkbox'
import { Empty } from '../Empty/Empty'
import { Spin } from '../Spin/Spin'
import {
  allKeys,
  conductChecked,
  filterTree,
  getExpandableKeys,
  highlightParts,
  indexTree,
  isDescendantOf,
  isExpandable,
  moveNodes,
  textOf,
  toggleChecked,
  type TreeCheckState,
  type TreeMoveTarget,
  type TreeNode,
} from './treeData'
import styles from './Tree.module.css'

export type { TreeNode, TreeMoveTarget, TreeCheckState, TreeCheckedStrategy } from './treeData'

export interface TreeMoveInfo {
  /** The dragged keys. */
  keys: Key[]
  target: TreeMoveTarget
}

export interface TreeProps {
  /** The nodes. */
  items: TreeNode[]
  /** Required unless `aria-labelledby` names the tree. */
  'aria-label'?: string
  'aria-labelledby'?: string

  /** Figma Type=Checkbox: a tri-state checkbox per row; checking a parent checks its subtree. */
  checkable?: boolean
  /** Checkable: every fully checked key (as `onCheckedChange` reports them). */
  checkedKeys?: Key[]
  defaultCheckedKeys?: Key[]
  onCheckedChange?: (keys: Key[], info: { halfCheckedKeys: Key[] }) => void

  /** Figma State=Selected: `single` / `multiple` highlight rows. Default `none` (a row click expands). Ignored with `checkable`. */
  selectionMode?: 'none' | 'single' | 'multiple'
  selectedKeys?: Key[]
  defaultSelectedKeys?: Key[]
  onSelectionChange?: (keys: Key[]) => void
  /** Keep at least one row selected (clicking the selected row again does nothing). */
  disallowEmptySelection?: boolean

  expandedKeys?: Key[]
  defaultExpandedKeys?: Key[]
  /** Open every node with children on first render. */
  defaultExpandAll?: boolean
  onExpandedChange?: (keys: Key[]) => void

  /** Figma Line=True: guide lines from each parent to its children, ± switchers. */
  showLine?: boolean
  /** Figma "Show Leaf" (Type=Leaf): with `showLine`, a tick links each leaf to its parent's line. */
  showLeafLine?: boolean
  /**
   * Directory tree: whole-row highlight (selected row solid accent, text
   * on-solid), folder / file icons by default, click selects, double-click
   * or Enter opens. Defaults `selectionMode` to `single`.
   */
  directory?: boolean
  /** Figma Type=Draggable: a holder per row; drop before / after / onto a node. */
  draggable?: boolean
  /** Draggable: the reordered tree (and what moved where). Store it and pass it back as `items`. */
  onMove?: (items: TreeNode[], info: TreeMoveInfo) => void
  /**
   * Async load: called the first time a node with `isLeaf: false` and no
   * `children` opens; a Spin row shows until the promise settles. Add the
   * children to `items` when it resolves.
   */
  loadData?: (node: TreeNode) => Promise<unknown>
  /** Search text: shows only matches (with their subtree) and their ancestors, opened, match highlighted. */
  searchValue?: string
  /** Shown when there is nothing to show. Default fc `Empty` (size sm). */
  emptyContent?: ReactNode
  /** Text of the async-load row. */
  loadingText?: string
  isDisabled?: boolean
  /** Focus the tree (its selected row, else the first) on mount. */
  autoFocus?: boolean
  /** `none` leaves Escape to a surrounding overlay instead of clearing the selection. */
  escapeKeyBehavior?: 'clearSelection' | 'none'
  className?: string
  style?: CSSProperties
  ref?: Ref<HTMLDivElement>
}

/** Figma "Tree / Tree Item / Holder Icon": six dots, exported from Figma. */
function HolderIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      {[4.125, 9.875].map((cx) => [2.5625, 7, 11.4375].map((cy) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={0.875} />))}
    </svg>
  )
}

interface RowContext {
  expanded: ReadonlySet<Key>
  loading: ReadonlySet<Key>
  checkState: TreeCheckState | null
  showLine: boolean
  showLeafLine: boolean
  draggable: boolean
  directory: boolean
  isDisabled: boolean
  query: string
  loadingText: string
  toggle: (key: Key) => void
}

function Title({ node, query }: { node: TreeNode; query: string }) {
  if (!query || typeof node.title !== 'string') return <>{node.title}</>
  return (
    <>
      {highlightParts(node.title, query).map((part, i) =>
        part.match ? <mark key={i} className={styles.mark}>{part.text}</mark> : part.text,
      )}
    </>
  )
}

interface RowProps {
  node: TreeNode
  depth: number
  /** Per ancestor column above the parent's: does that ancestor's line continue through this row? */
  rails: boolean[]
  isLast: boolean
  isExpanded: boolean
  hasChildItems: boolean
  ctx: RowContext
}

function Row({ node, depth, rails, isLast, isExpanded, hasChildItems, ctx }: RowProps) {
  const leafTick = ctx.showLine && ctx.showLeafLine && !hasChildItems && depth > 0
  const icon = node.icon ?? (ctx.directory ? (hasChildItems ? <Folder size={16} /> : <File06 />) : undefined)
  return (
    <>
      {Array.from({ length: depth }, (_, j) => {
        const own = j === depth - 1
        const line = ctx.showLine && (own ? (isLast ? styles.railEnd : styles.rail) : rails[j] && styles.rail)
        return <span key={j} className={cx(styles.indent, line)} aria-hidden="true" />
      })}
      {ctx.draggable && (
        <AriaButton slot="drag" className={styles.handle}>
          <HolderIcon />
        </AriaButton>
      )}
      {hasChildItems ? (
        <AriaButton slot="chevron" className={styles.switcher}>
          {ctx.showLine ? (
            isExpanded ? <MinusSquare size={12} aria-hidden="true" /> : <PlusSquare size={12} aria-hidden="true" />
          ) : (
            <ChevronDown className={styles.chevron} aria-hidden="true" />
          )}
        </AriaButton>
      ) : (
        <span className={cx(styles.switcher, styles.leaf, leafTick && styles.leafLine)} aria-hidden="true" />
      )}
      {ctx.checkState && (
        <span className={styles.check}>
          <Checkbox slot="selection" isIndeterminate={ctx.checkState.half.has(node.key)} />
        </span>
      )}
      {icon != null && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      <span className={styles.title}>
        <Title node={node} query={ctx.query} />
      </span>
    </>
  )
}

function renderNodes(nodes: TreeNode[], depth: number, rails: boolean[], ctx: RowContext): ReactNode[] {
  return nodes.map((node, i) => {
    const isLast = i === nodes.length - 1
    const children = node.children ?? []
    const expandable = isExpandable(node)
    const open = expandable && ctx.expanded.has(node.key)
    return (
      <TreeItem
        key={node.key}
        id={node.key}
        textValue={textOf(node) || String(node.key)}
        isDisabled={ctx.isDisabled || node.isDisabled}
        hasChildItems={expandable}
        onAction={ctx.directory && expandable ? () => ctx.toggle(node.key) : undefined}
        className={styles.row}
      >
        <TreeItemContent>
          {({ isExpanded, hasChildItems }) => (
            <Row node={node} depth={depth} rails={rails} isLast={isLast} isExpanded={isExpanded} hasChildItems={hasChildItems} ctx={ctx} />
          )}
        </TreeItemContent>
        {open && children.length > 0 && renderNodes(children, depth + 1, depth === 0 ? [] : [...rails, !isLast], ctx)}
        {open && ctx.loading.has(node.key) && (
          <TreeLoadMoreItem isLoading className={styles.loader} style={{ '--_depth': depth + 1 } as CSSProperties}>
            <Spin size="sm" label={ctx.loadingText} className={styles.loaderSpin} />
            <span aria-hidden="true">{ctx.loadingText}</span>
          </TreeLoadMoreItem>
        )}
      </TreeItem>
    )
  })
}

const inOrder = (items: TreeNode[], keys: ReadonlySet<Key>) => {
  const ordered = allKeys(items).filter((k) => keys.has(k))
  for (const k of keys) if (!ordered.includes(k)) ordered.push(k)
  return ordered
}

/**
 * Figma "❖ Tree": nested rows built on React Aria `Tree` (treegrid) — arrow
 * keys move and open / close, Space selects or checks, type-ahead. Variants:
 * Basic, Checkbox (tri-state), Icon, Leaf / Line, Draggable, plus the usual
 * directory style, async load and search highlight.
 */
export function Tree(props: TreeProps) {
  const {
    items, checkable = false, checkedKeys, defaultCheckedKeys, onCheckedChange,
    selectionMode: selectionModeProp, selectedKeys, defaultSelectedKeys, onSelectionChange, disallowEmptySelection,
    expandedKeys, defaultExpandedKeys, defaultExpandAll, onExpandedChange,
    showLine = false, showLeafLine = false, directory = false, draggable = false, onMove, loadData,
    searchValue, emptyContent, loadingText = 'Đang tải…', isDisabled = false, autoFocus, escapeKeyBehavior,
    className, style, ref, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby,
  } = props

  const index = useMemo(() => indexTree(items), [items])
  const query = searchValue?.trim() ?? ''
  const filtered = useMemo(() => filterTree(items, query), [items, query])

  // ---------- expansion (searching opens the ancestors of every match) ----------
  const [innerExpanded, setInnerExpanded] = useState<ReadonlySet<Key>>(
    () => new Set(defaultExpandAll ? getExpandableKeys(items) : defaultExpandedKeys ?? []),
  )
  const [searchExpanded, setSearchExpanded] = useState<{ query: string; keys: ReadonlySet<Key> } | null>(null)
  const userExpanded = useMemo(() => (expandedKeys ? new Set(expandedKeys) : innerExpanded), [expandedKeys, innerExpanded])
  const expanded = query ? (searchExpanded?.query === query ? searchExpanded.keys : filtered.expanded) : userExpanded

  const [loading, setLoading] = useState<ReadonlySet<Key>>(() => new Set())
  const startLoads = (next: ReadonlySet<Key>) => {
    if (!loadData) return
    for (const key of next) {
      if (expanded.has(key) || loading.has(key)) continue
      const node = index.get(key)?.node
      if (!node || node.isLeaf !== false || node.children !== undefined) continue
      setLoading((s) => new Set(s).add(key))
      const done = () => setLoading((s) => { const n = new Set(s); n.delete(key); return n })
      loadData(node).then(done, done)
    }
  }
  const changeExpanded = (next: ReadonlySet<Key>) => {
    startLoads(next)
    if (query) {
      setSearchExpanded({ query, keys: next })
      return
    }
    if (!expandedKeys) setInnerExpanded(next)
    onExpandedChange?.([...next])
  }
  const toggle = (key: Key) => {
    const next = new Set(expanded)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    changeExpanded(next)
  }

  // ---------- checking (tri-state, conducted through the whole tree) ----------
  const [innerChecked, setInnerChecked] = useState<ReadonlySet<Key>>(() => conductChecked(items, defaultCheckedKeys ?? []).checked)
  const checkState = useMemo(
    () => (checkable ? conductChecked(items, checkedKeys ?? innerChecked) : null),
    [checkable, items, checkedKeys, innerChecked],
  )
  const handleCheck = (selection: Selection) => {
    if (!checkState) return
    const prev = checkState.checked
    const next = selection === 'all'
      ? new Set([...prev, ...allKeys(filtered.items).filter((k) => !index.get(k)?.node.isDisabled)])
      : new Set(selection)
    const state = toggleChecked(items, prev, next)
    if (!checkedKeys) setInnerChecked(state.checked)
    onCheckedChange?.(inOrder(items, state.checked), { halfCheckedKeys: inOrder(items, state.half) })
  }

  // ---------- selection ----------
  const [innerSelected, setInnerSelected] = useState<ReadonlySet<Key>>(() => new Set(defaultSelectedKeys ?? []))
  const selected = selectedKeys ? new Set(selectedKeys) : innerSelected
  const handleSelect = (selection: Selection) => {
    const next = selection === 'all' ? new Set(allKeys(filtered.items)) : new Set(selection)
    if (!selectedKeys) setInnerSelected(next)
    onSelectionChange?.(inOrder(items, next))
  }
  const selectionMode = checkable ? 'multiple' : selectionModeProp ?? (directory ? 'single' : 'none')

  // ---------- drag and drop ----------
  const dragging = useRef<ReadonlySet<Key>>(new Set())
  const canDrop = (target: DropTarget) => {
    const keys = dragging.current
    if (target.type !== 'item' || keys.size === 0 || keys.has(target.key)) return false
    for (const key of keys) if (isDescendantOf(index, target.key, key)) return false
    return !(target.dropPosition === 'on' && index.get(target.key)?.node.isLeaf === true)
  }
  const { dragAndDropHooks } = useDragAndDrop<TreeNode>({
    isDisabled: !draggable || isDisabled,
    getItems: (keys) => [...keys].map((key) => ({ 'text/plain': textOf(index.get(key)?.node ?? { title: String(key) }) })),
    onDragStart: (e) => { dragging.current = e.keys },
    onDragEnd: () => { dragging.current = new Set() },
    getDropOperation: (target) => (canDrop(target) ? 'move' : 'cancel'),
    onMove: (e) => {
      const target: TreeMoveTarget = { key: e.target.key, position: e.target.dropPosition }
      onMove?.(moveNodes(items, e.keys, target), { keys: [...e.keys], target })
    },
    renderDropIndicator: (target) => <DropIndicator target={target} className={styles.dropIndicator} />,
  })

  const ctx: RowContext = {
    expanded, loading, checkState, showLine, showLeafLine, draggable, directory, isDisabled, query, loadingText, toggle,
  }

  return (
    <AriaTree
      ref={ref}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      className={cx(
        styles.tree,
        checkable && styles.checkable,
        directory && styles.directory,
        draggable && styles.draggable,
        className,
      )}
      style={style}
      selectionMode={selectionMode}
      selectionBehavior={directory ? 'replace' : 'toggle'}
      selectedKeys={checkState ? checkState.checked : selected}
      onSelectionChange={checkState ? handleCheck : handleSelect}
      disallowEmptySelection={disallowEmptySelection}
      expandedKeys={expanded}
      onExpandedChange={changeExpanded}
      dragAndDropHooks={draggable ? dragAndDropHooks : undefined}
      autoFocus={autoFocus}
      escapeKeyBehavior={escapeKeyBehavior}
      renderEmptyState={() => <div className={styles.empty}>{emptyContent ?? <Empty size="sm" />}</div>}
    >
      {renderNodes(filtered.items, 0, [], ctx)}
    </AriaTree>
  )
}
