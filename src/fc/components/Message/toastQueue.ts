import { UNSTABLE_ToastQueue } from 'react-aria-components'

/**
 * Time a closing toast stays mounted with `data-exiting`, so the exit
 * animation of `overlay.module.css` (`.surface[data-exiting]`, 0.1s) plays out.
 */
const EXIT_MS = 120

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * The queue behind `message` and `notification`. The only place (with
 * `toast.tsx`) that touches React Aria's UNSTABLE_ toast API, so a rename
 * upstream stays inside this folder.
 *
 * Two additions to React Aria's queue:
 * - **Exit animation.** React Aria drops a toast the moment it closes, so
 *   there is nothing left to animate. `close` — used by the timer, the close
 *   button and fc's `close()` alike — first marks the toast as exiting (it
 *   renders `data-exiting`), then removes it once the animation has played.
 *   With reduced motion it removes at once.
 * - **One region per queue.** `message` is a module-level singleton; if two
 *   regions mount (two FcTheme trees, or a Storybook docs page with several
 *   stories), only the first renders it, so a toast never shows twice.
 */
export class FcToastQueue<T> extends UNSTABLE_ToastQueue<T> {
  #exiting = new Set<string>()
  #regions: string[] = []
  #listeners = new Set<() => void>()

  override close(key: string): void {
    if (this.#exiting.has(key)) return
    const isShown = this.#regions.length > 0 && this.visibleToasts.some((t) => t.key === key)
    if (!isShown || prefersReducedMotion()) {
      super.close(key)
      return
    }
    this.#exiting.add(key)
    this.#emit()
    setTimeout(() => {
      this.#exiting.delete(key)
      super.close(key)
    }, EXIT_MS)
  }

  override clear(): void {
    this.#exiting.clear()
    super.clear()
  }

  /** Whether the toast is playing its exit animation. */
  isExiting(key: string): boolean {
    return this.#exiting.has(key)
  }

  /** Called by a region on mount; returns the detach function. */
  attachRegion(id: string): () => void {
    this.#regions = [...this.#regions, id]
    this.#emit()
    return () => {
      this.#regions = this.#regions.filter((r) => r !== id)
      this.#emit()
    }
  }

  /** The region that renders this queue: the first one still mounted. */
  activeRegion(): string | undefined {
    return this.#regions[0]
  }

  /** Subscribes to exiting / region changes (for `useSyncExternalStore`). */
  subscribeFc = (fn: () => void): (() => void) => {
    this.#listeners.add(fn)
    return () => {
      this.#listeners.delete(fn)
    }
  }

  #emit() {
    for (const fn of this.#listeners) fn()
  }
}

/** Seconds (fc API) → React Aria's milliseconds; 0 = stays until closed. */
export const toTimeout = (seconds: number) => (seconds > 0 ? Math.round(seconds * 1000) : undefined)
