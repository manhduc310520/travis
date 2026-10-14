/**
 * After a deploy, a tab opened before it still asks for the old hashed chunks (…/assets/Button.stories-<old>.js),
 * which are gone (404): "Failed to fetch dynamically imported module". Reload once to get the new build.
 * The reload time is kept in sessionStorage: a second failure within a minute (the chunk is really missing)
 * shows the error as usual instead of reloading again, so it cannot loop. No React here: the manager uses it too.
 */
const KEY = 'fabi-sb-stale-chunk-reload'
const WINDOW_MS = 60_000
// Chrome / Edge, Safari, Firefox wordings of a failed dynamic import
const STALE_CHUNK = /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i

function reloadOnce(reason: unknown): boolean {
  const message = reason instanceof Error ? reason.message : String((reason as { message?: unknown })?.message ?? reason)
  if (!STALE_CHUNK.test(message)) return false
  try {
    const last = Number(sessionStorage.getItem(KEY) ?? 0)
    if (Date.now() - last < WINDOW_MS) return false
    sessionStorage.setItem(KEY, String(Date.now()))
  } catch {
    return false // no sessionStorage (private mode, blocked): no guard, so no automatic reload
  }
  location.reload()
  return true
}

export function installStaleChunkReload(onStoryError?: (handler: (error: unknown) => void) => void): void {
  // Vite's preload helper fires this when a dynamic import (or a chunk it needs) fails to load
  window.addEventListener('vite:preloadError', (event) => {
    if (reloadOnce((event as Event & { payload?: unknown }).payload)) event.preventDefault()
  })
  window.addEventListener('unhandledrejection', (event) => { reloadOnce(event.reason) })
  window.addEventListener('error', (event) => { reloadOnce(event.error ?? event.message) })
  // Storybook catches a failed story / docs import itself and shows its error page
  onStoryError?.(reloadOnce)
}
