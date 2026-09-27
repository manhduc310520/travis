import { useMemo, useRef, useState, type ReactElement, type ReactNode } from 'react'
import { StatusModal, type ConfirmModalProps, type ModalStatus } from './Modal'

/** Options of `modal.confirm()`, `modal.info()`… */
export interface ModalFuncProps extends Omit<ConfirmModalProps, 'isOpen' | 'defaultOpen' | 'onOpenChange' | 'children'> {
  /** Detail under the title. */
  content?: ReactNode
}

/**
 * Imperative modals. Each call opens one modal and
 * resolves `true` once OK finished (after `onOk`'s promise, if any) or
 * `false` when it was cancelled or dismissed.
 */
export interface ModalApi {
  /** Question with "Hủy" (Cancel) + "Đồng ý" (OK) and a warning icon. */
  confirm: (props: ModalFuncProps) => Promise<boolean>
  info: (props: ModalFuncProps) => Promise<boolean>
  success: (props: ModalFuncProps) => Promise<boolean>
  warning: (props: ModalFuncProps) => Promise<boolean>
  error: (props: ModalFuncProps) => Promise<boolean>
}

type ModalFuncType = ModalStatus | 'confirm'

interface Entry {
  id: number
  type: ModalFuncType
  props: ModalFuncProps
  isOpen: boolean
  resolve: (confirmed: boolean) => void
}

const isThenable = (value: unknown): value is PromiseLike<unknown> =>
  typeof (value as PromiseLike<unknown> | undefined)?.then === 'function'

/**
 * `const [modal, contextHolder] = useModal()` — render `contextHolder`
 * somewhere inside `<FcTheme>` so the modals pick up the theme, then
 * `if (await modal.confirm({ title: 'Xóa món ăn?', danger: true })) …`.
 * Figma `Modal / Information` (info / success / warning / error) and the
 * confirmation example.
 */
export function useModal(): [ModalApi, ReactElement] {
  const [entries, setEntries] = useState<Entry[]>([])
  const nextId = useRef(0)

  const api = useMemo<ModalApi>(() => {
    const open = (type: ModalFuncType) => (props: ModalFuncProps) =>
      new Promise<boolean>((resolve) => {
        nextId.current += 1
        const id = nextId.current
        // Modals already closed (and done animating) are dropped here.
        setEntries((list) => [...list.filter((e) => e.isOpen), { id, type, props, isOpen: true, resolve }])
      })
    return { confirm: open('confirm'), info: open('info'), success: open('success'), warning: open('warning'), error: open('error') }
  }, [])

  const markClosed = (id: number) => setEntries((list) => list.map((e) => (e.id === id ? { ...e, isOpen: false } : e)))

  const contextHolder = (
    <>
      {entries.map(({ id, type, props: { content, onOk, onCancel, ...props }, isOpen, resolve }) => (
        <StatusModal
          key={id}
          {...props}
          type={type}
          isOpen={isOpen}
          onOpenChange={(open) => { if (!open) markClosed(id) }}
          onOk={(): unknown => {
            const result = onOk?.()
            if (isThenable(result)) {
              return result.then((value) => {
                if (value !== false) resolve(true)
                return value
              })
            }
            if (result !== false) resolve(true)
            return result
          }}
          onCancel={() => {
            onCancel?.()
            resolve(false)
          }}
        >
          {content}
        </StatusModal>
      ))}
    </>
  )

  return [api, contextHolder]
}
