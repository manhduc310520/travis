import type { ReactElement, ReactNode } from 'react'
import {
  OverlayArrow,
  Tooltip as AriaTooltip,
  TooltipTrigger,
  type TooltipProps as AriaTooltipProps,
} from 'react-aria-components'
import { cx } from '../../space'
import type { PaletteHue } from '../../palette'
import palette from '../../palette.module.css'
import styles from './Tooltip.module.css'

export interface TooltipProps {
  /** Short supplementary text. Never put the only copy of important information here. */
  content: ReactNode
  placement?: AriaTooltipProps['placement']
  /** Milliseconds before showing on hover. Keyboard focus shows it immediately. */
  delay?: number
  isDisabled?: boolean
  /** Figma Arrow: show the pointer toward the trigger. */
  showArrow?: boolean
  /**
   * Figma "Tooltip / Color Preset": a palette hue instead of the default dark
   * surface. Text flips white/black with the mode so it stays at 4.5:1.
   */
  color?: 'default' | PaletteHue
  defaultOpen?: boolean
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  /**
   * The trigger. fc components built on React Aria (Button, Link…) work as
   * they are. Wrap anything else in React Aria's `<Focusable>` — it must be
   * focusable and able to hold a ref.
   */
  children: ReactElement
}

export function Tooltip({ content, placement = 'top', delay = 500, isDisabled, showArrow = true, color = 'default', defaultOpen, isOpen, onOpenChange, children }: TooltipProps) {
  return (
    <TooltipTrigger delay={delay} isDisabled={isDisabled} defaultOpen={defaultOpen} isOpen={isOpen} onOpenChange={onOpenChange}>
      {children}
      <AriaTooltip
        className={cx(styles.tooltip, color !== 'default' && cx(styles.hue, palette[color]))}
        placement={placement}
        offset={showArrow ? 8 : 4}
      >
        {showArrow && (
          <OverlayArrow className={styles.arrow}>
            <svg width={8} height={4} viewBox="0 0 8 4" aria-hidden="true">
              <path d="M0 0 4 4 8 0Z" />
            </svg>
          </OverlayArrow>
        )}
        {content}
      </AriaTooltip>
    </TooltipTrigger>
  )
}
