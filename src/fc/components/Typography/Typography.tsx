import { useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { Button as AriaButton, Input as AriaInput, Link as AriaLink, TextField, type LinkProps as AriaLinkProps } from 'react-aria-components'
import { Edit01 } from '../../../icons'
import { cx } from '../../space'
import styles from './Typography.module.css'

export type TextTone = 'default' | 'secondary' | 'success' | 'warning' | 'danger'

export type TextSize = 'sm' | 'base' | 'lg'

interface TextStyleProps {
  tone?: TextTone
  /** Figma Text Size: SM 12/20, Base 14/22, LG 16/24. */
  size?: TextSize
  disabled?: boolean
  /** Semibold (600) — the only other weight the UI uses. */
  strong?: boolean
  code?: boolean
  underline?: boolean
  delete?: boolean
  mark?: boolean
  /** Keyboard key, e.g. Ctrl, Enter. */
  keyboard?: boolean
  /** `true` = one line with ellipsis; a number = clamp to that many lines. */
  truncate?: boolean | number
}

function decorate({ strong, code, underline, delete: del, mark, keyboard }: TextStyleProps, children: ReactNode) {
  let node = children
  if (code) node = <code className={styles.code}>{node}</code>
  if (keyboard) node = <kbd className={styles.kbd}>{node}</kbd>
  if (mark) node = <mark className={styles.mark}>{node}</mark>
  if (underline) node = <u>{node}</u>
  if (del) node = <del>{node}</del>
  if (strong) node = <strong className={styles.strong}>{node}</strong>
  return node
}

function textClasses({ tone = 'default', size = 'base', disabled, truncate }: TextStyleProps, inline: boolean) {
  const lines = truncate === true ? 1 : typeof truncate === 'number' ? truncate : 0
  return {
    className: cx(
      tone !== 'default' && styles[tone],
      size !== 'base' && styles[size],
      disabled && styles.disabled,
      lines === 1 && styles.truncate,
      lines === 1 && inline && styles.inlineTruncate,
      lines > 1 && styles.clamp,
    ),
    style: lines > 1 ? ({ WebkitLineClamp: lines } as CSSProperties) : undefined,
  }
}

export interface TextProps extends TextStyleProps, HTMLAttributes<HTMLSpanElement> {}

export function Text({ tone, size, disabled, strong, code, underline, delete: del, mark, keyboard, truncate, className, style, children, ...rest }: TextProps) {
  const t = textClasses({ tone, size, disabled, truncate }, true)
  return (
    <span {...rest} className={cx(t.className, className)} style={{ ...t.style, ...style }}>
      {decorate({ strong, code, underline, delete: del, mark, keyboard }, children)}
    </span>
  )
}

export interface ParagraphProps extends TextStyleProps, HTMLAttributes<HTMLParagraphElement> {}

export function Paragraph({ tone, size, disabled, strong, code, underline, delete: del, mark, keyboard, truncate, className, style, children, ...rest }: ParagraphProps) {
  const t = textClasses({ tone, size, disabled, truncate }, false)
  return (
    <p {...rest} className={cx(styles.paragraph, t.className, className)} style={{ ...t.style, ...style }}>
      {decorate({ strong, code, underline, delete: del, mark, keyboard }, children)}
    </p>
  )
}

export interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5
  truncate?: boolean | number
  /**
   * Figma Title "Editable": an edit button turns the title into a text field.
   * Enter or leaving the field saves (calls `onEdit`), Escape cancels.
   * Needs plain-text `children`.
   */
  editable?: boolean
  onEdit?: (value: string) => void
  /** Accessible name of the edit button. */
  editLabel?: string
}

export function Title({ level = 1, truncate, editable = false, onEdit, editLabel = 'Sửa tiêu đề', className, style, children, ...rest }: TitleProps) {
  const Tag = `h${level}` as const
  const t = textClasses({ truncate }, false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const editButton = useRef<HTMLButtonElement>(null)
  const text = typeof children === 'string' ? children : ''

  const finish = (save: boolean) => {
    if (save && draft.trim() && draft !== text) onEdit?.(draft.trim())
    setEditing(false)
    requestAnimationFrame(() => editButton.current?.focus())
  }

  return (
    <Tag {...rest} className={cx(styles.title, styles[Tag], editable && styles.editableTitle, !editing && t.className, className)} style={{ ...t.style, ...style }}>
      {editing ? (
        <TextField aria-label={editLabel} value={draft} onChange={setDraft} autoFocus className={styles.editField}>
          <AriaInput
            className={styles.editInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') finish(true)
              if (e.key === 'Escape') finish(false)
            }}
            onBlur={() => finish(true)}
          />
        </TextField>
      ) : (
        <>
          {children}
          {editable && (
            <AriaButton ref={editButton} className={styles.editButton} aria-label={editLabel} onPress={() => { setDraft(text); setEditing(true) }}>
              <Edit01 />
            </AriaButton>
          )}
        </>
      )}
    </Tag>
  )
}

export interface LinkProps extends Omit<AriaLinkProps, 'className' | 'style'> {
  /** Figma Link "Underlined": always underlined, not only on hover. */
  underline?: boolean
  className?: string
  style?: CSSProperties
}

export function Link({ underline = false, className, ...rest }: LinkProps) {
  return <AriaLink {...rest} className={cx(styles.link, underline && styles.linkUnderline, className)} />
}
