import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../space'
import styles from './Empty.module.css'

/**
 * Figma `Empty / Image`: `default` = Image=2 (a tray holding a page, with a
 * speech bubble), `simple` = Image=1 (an outlined empty tray).
 */
export type EmptyImage = 'default' | 'simple'
/** Figma `Empty` Size: MD (page, card, table body) or SM (inside Select, dropdowns and other small panels). */
export type EmptySize = 'sm' | 'md'

export interface EmptyProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Figma `Empty / Image`. Defaults to `default` (Image=2) at size `md` and
   * `simple` (Image=1) at size `sm`, as in the Figma set. Any node replaces
   * it; `null` hides it.
   */
  image?: EmptyImage | ReactNode
  /** Figma Size: `md` (illustration 184 wide) or `sm` (120 wide). */
  size?: EmptySize
  /** Text under the illustration. Default "Không có dữ liệu"; `null` hides it. */
  description?: ReactNode
  /** Actions under the description (Figma MD shows one primary Button). */
  children?: ReactNode
}

/** Figma `Empty / Image` Image=2. Greys are fc neutral tokens, so it follows Light / Dark. */
function DefaultImage() {
  return (
    <svg className={styles.art} width="184" height="152" viewBox="0 0 184 152" fill="none" aria-hidden="true" focusable="false">
      <path className={styles.shade} d="M91.797 151.228C129.24 151.228 159.594 145.556 159.594 138.56C159.594 131.564 129.24 125.892 91.797 125.892C54.354 125.892 24 131.564 24 138.56C24 145.556 54.354 151.228 91.797 151.228Z" />
      <path className={styles.shade} fillRule="evenodd" clipRule="evenodd" d="M146.034 101.344L122.109 71.899C120.961 70.513 119.283 69.674 117.516 69.674H66.076C64.31 69.674 62.632 70.513 61.484 71.899L37.56 101.344V114.727H146.035V101.344H146.034Z" />
      <path className={styles.paper} fillRule="evenodd" clipRule="evenodd" d="M57.83 31.67H125.763C126.824 31.67 127.841 32.091 128.591 32.842C129.342 33.592 129.763 34.609 129.763 35.67V129.014C129.763 130.075 129.342 131.092 128.591 131.842C127.841 132.593 126.824 133.014 125.763 133.014H57.83C56.769 133.014 55.752 132.593 55.002 131.842C54.251 131.092 53.83 130.075 53.83 129.014V35.67C53.83 34.609 54.251 33.592 55.002 32.842C55.752 32.091 56.769 31.67 57.83 31.67Z" />
      <path className={styles.detail} fillRule="evenodd" clipRule="evenodd" d="M66.678 41.623H116.915C117.445 41.623 117.954 41.834 118.329 42.209C118.704 42.584 118.915 43.093 118.915 43.623V68.58C118.915 69.11 118.704 69.619 118.329 69.994C117.954 70.369 117.445 70.58 116.915 70.58H66.678C66.148 70.58 65.639 70.369 65.264 69.994C64.889 69.619 64.678 69.11 64.678 68.58V43.623C64.678 43.093 64.889 42.584 65.264 42.209C65.639 41.834 66.148 41.623 66.678 41.623ZM66.94 81.437H116.653C117.253 81.437 117.828 81.675 118.252 82.1C118.677 82.524 118.915 83.099 118.915 83.699C118.915 84.299 118.677 84.874 118.252 85.299C117.828 85.723 117.253 85.961 116.653 85.961H66.94C66.34 85.961 65.765 85.723 65.341 85.299C64.916 84.874 64.678 84.299 64.678 83.699C64.678 83.099 64.916 82.524 65.341 82.1C65.765 81.675 66.34 81.437 66.94 81.437ZM66.94 93.2H116.653C117.253 93.2 117.829 93.438 118.253 93.863C118.677 94.287 118.915 94.862 118.915 95.463C118.915 96.063 118.677 96.638 118.253 97.062C117.829 97.487 117.253 97.725 116.653 97.725H66.94C66.34 97.725 65.765 97.487 65.34 97.062C64.916 96.638 64.678 96.063 64.678 95.463C64.678 94.862 64.916 94.287 65.34 93.863C65.765 93.438 66.34 93.2 66.94 93.2ZM145.813 136.702C145.038 139.773 142.316 142.062 139.078 142.062H44.515C41.277 142.062 38.555 139.772 37.781 136.702C37.633 136.117 37.559 135.516 37.559 134.912V101.345H63.877C66.784 101.345 69.127 103.793 69.127 106.765V106.805C69.127 109.776 71.497 112.175 74.404 112.175H109.189C112.096 112.175 114.466 109.754 114.466 106.782V106.77C114.466 103.798 116.809 101.344 119.716 101.344H146.034V134.913C146.034 135.53 145.957 136.129 145.813 136.702Z" />
      <path className={styles.paper} fillRule="evenodd" clipRule="evenodd" d="M149.121 33.292L142.291 35.942C142.116 36.01 141.924 36.028 141.74 35.992C141.555 35.956 141.384 35.869 141.246 35.741C141.108 35.612 141.01 35.448 140.962 35.266C140.914 35.084 140.918 34.892 140.974 34.712L142.911 28.505C140.322 25.561 138.802 21.971 138.802 18.097C138.802 8.102 148.92 0 161.402 0C173.881 0 184 8.102 184 18.097C184 28.092 173.882 36.194 161.401 36.194C156.873 36.194 152.657 35.128 149.121 33.292Z" />
      <path className={styles.shade} d="M170.304 21.365C171.877 21.365 173.153 20.105 173.153 18.55C173.153 16.995 171.877 15.735 170.304 15.735C168.731 15.735 167.455 16.995 167.455 18.55C167.455 20.105 168.731 21.365 170.304 21.365Z" />
      <path className={styles.shade} fillRule="evenodd" clipRule="evenodd" d="M155.348 21.013H149.65L152.548 16.087L155.348 21.013ZM158.909 16.087H163.894V21.013H158.909V16.087Z" />
    </svg>
  )
}

/** Figma `Empty / Image` Image=1. Figma binds these to Fill/Neutral, Fill/Neutral-Light and Border/Neutral. */
function SimpleImage() {
  return (
    <svg className={styles.art} width="184" height="117" viewBox="0 0 184 117" fill="none" aria-hidden="true" focusable="false">
      <path className={styles.trayShadow} d="M25.875 83C9.857 86.595 0 91.492 0 96.888C0 107.921 41.19 116.864 92 116.864C142.81 116.864 184 107.921 184 96.888C184 91.492 174.143 86.595 158.125 83V91.708C158.125 97.766 154.33 102.732 149.644 102.732H34.356C29.67 102.732 25.875 97.764 25.875 91.708V83Z" />
      <path className={styles.tray} vectorEffect="non-scaling-stroke" d="M119.637 48.315C119.637 43.735 122.495 39.954 126.04 39.951H158.125V91.708C158.125 97.766 154.33 102.732 149.644 102.732H34.356C29.67 102.732 25.875 97.764 25.875 91.708V39.951H57.96C61.505 39.951 64.363 43.727 64.363 48.307V48.37C64.363 52.95 67.252 56.648 70.794 56.648H113.206C116.748 56.648 119.637 52.915 119.637 48.335V48.315Z" />
      <path className={styles.trayEdge} vectorEffect="non-scaling-stroke" d="M158.125 40.266L128.955 7.444C127.555 5.206 125.511 3.854 123.358 3.854H60.642C58.489 3.854 56.445 5.206 55.045 7.441L25.875 40.269" />
    </svg>
  )
}

const PRESET: Record<EmptyImage, () => ReactNode> = { default: DefaultImage, simple: SimpleImage }

const isPreset = (image: unknown): image is EmptyImage => image === 'default' || image === 'simple'

/**
 * Figma "❖ Empty" — shown where a list, table, search or dropdown has
 * nothing to display. Size MD for pages and cards, SM inside Select and
 * other small panels. The illustration is decorative; the description
 * carries the message.
 */
export function Empty({ image, size = 'md', description = 'Không có dữ liệu', children, className, ...rest }: EmptyProps) {
  const preset = image === undefined ? (size === 'sm' ? 'simple' : 'default') : isPreset(image) ? image : undefined
  const Preset = preset && PRESET[preset]
  return (
    <div {...rest} className={cx(styles.empty, size === 'sm' && styles.sm, className)}>
      {Preset ? (
        <div className={cx(styles.image, styles.preset)}><Preset /></div>
      ) : (
        image != null && image !== false && <div className={styles.image}>{image}</div>
      )}
      {description != null && description !== false && <div className={styles.description}>{description}</div>}
      {children != null && <div className={styles.footer}>{children}</div>}
    </div>
  )
}
