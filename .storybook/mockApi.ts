/**
 * Local stand-in for the outside servers the antd demos call (user decision 2026-09-30: fixed
 * data on this machine, no network). The converter rewrites those URLs to /mock-api/…; this
 * module answers them for both fetch() and XMLHttpRequest (Upload uses XHR with progress).
 *
 *   GET  /mock-api/users?page&limit&search&gender&orderby&order   → User[] (was mockapi.io)
 *   GET  /mock-api/github/search/users?q                          → { items } (was api.github.com)
 *   POST /mock-api/upload                                         → { status: 'done', url }
 *   POST /mock-api/preview                                        → { thumbnail } (was json-generator)
 */
const FIRST = ['Anna', 'Ben', 'Chloe', 'David', 'Emma', 'Felix', 'Grace', 'Henry', 'Ivy', 'Jack', 'Kate', 'Leo', 'Mia', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Ruby', 'Sam', 'Tina', 'Uma', 'Victor', 'Wendy', 'Xavier', 'Yara']
const LAST = ['Nguyen', 'Tran', 'Le', 'Pham', 'Hoang']

const USERS = Array.from({ length: 100 }, (_, i) => {
  const first = FIRST[i % FIRST.length]
  const last = LAST[Math.floor(i / FIRST.length) % LAST.length]
  return {
    id: String(i + 1),
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
    gender: i % 2 ? 'female' : 'male',
    avatar: `/mock-assets/avatar-${(i % 12) + 1}.svg`,
  }
})

function answer(method: string, rawUrl: string): { status: number; body: unknown } | null {
  const url = new URL(rawUrl, window.location.origin)
  if (!url.pathname.startsWith('/mock-api/')) return null
  const p = url.searchParams
  const route = url.pathname.slice('/mock-api/'.length).replace(/\/$/, '')

  if (route === 'users') {
    let list = USERS
    const search = (p.get('search') ?? '').toLowerCase()
    if (search) list = list.filter((u) => u.name.toLowerCase().includes(search))
    const gender = p.get('gender')
    if (gender) list = list.filter((u) => gender.split(',').includes(u.gender))
    const orderby = p.get('orderby') as keyof (typeof USERS)[number] | null
    if (orderby) list = [...list].sort((a, b) => String(a[orderby]).localeCompare(String(b[orderby])) * (p.get('order') === 'desc' ? -1 : 1))
    const limit = Number(p.get('limit') ?? 0)
    const page = Number(p.get('page') ?? 1)
    return { status: 200, body: limit ? list.slice((page - 1) * limit, page * limit) : list }
  }
  if (route === 'github/search/users') {
    const q = (p.get('q') ?? '').toLowerCase()
    const items = USERS.filter((u) => u.name.toLowerCase().includes(q)).slice(0, 10)
      .map((u) => ({ login: u.name.toLowerCase().replace(' ', '-'), avatar_url: u.avatar }))
    return { status: 200, body: { items } }
  }
  if (route === 'upload' && method === 'POST') return { status: 200, body: { status: 'done', url: '/mock-assets/photo-1.svg' } }
  if (route === 'preview' && method === 'POST') return { status: 200, body: { thumbnail: '/mock-assets/photo-2.svg' } }
  return { status: 404, body: { message: 'not mocked' } }
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function installMockApi() {
  const w = window as typeof window & { __mockApiInstalled?: boolean }
  if (w.__mockApiInstalled) return
  w.__mockApiInstalled = true

  const realFetch = window.fetch.bind(window)
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase()
    const res = answer(method, url)
    if (!res) return realFetch(input, init)
    await delay(300) // feel like a real request so loading states show
    return new Response(JSON.stringify(res.body), { status: res.status, headers: { 'Content-Type': 'application/json' } })
  }

  type MockXhr = XMLHttpRequest & { __mock?: { method: string; url: string } }
  const open = XMLHttpRequest.prototype.open
  const send = XMLHttpRequest.prototype.send
  XMLHttpRequest.prototype.open = function (this: MockXhr, method: string, url: string | URL, ...rest: unknown[]) {
    const u = String(url)
    this.__mock = new URL(u, window.location.origin).pathname.startsWith('/mock-api/') ? { method: method.toUpperCase(), url: u } : undefined
    return (open as (...a: unknown[]) => void).call(this, method, url, ...rest)
  } as typeof XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.send = function (this: MockXhr, body?: Document | XMLHttpRequestBodyInit | null) {
    if (!this.__mock) return send.call(this, body)
    const xhr = this
    const res = answer(xhr.__mock!.method, xhr.__mock!.url)!
    const text = JSON.stringify(res.body)
    const total = 100
    ;[25, 60, 100].forEach((loaded, i) => setTimeout(() => {
      const ev = new ProgressEvent('progress', { lengthComputable: true, loaded, total })
      xhr.upload.onprogress?.(ev)
      xhr.upload.dispatchEvent(ev)
    }, 150 * (i + 1)))
    setTimeout(() => {
      Object.defineProperty(xhr, 'readyState', { value: 4, configurable: true })
      Object.defineProperty(xhr, 'status', { value: res.status, configurable: true })
      Object.defineProperty(xhr, 'responseText', { value: text, configurable: true })
      Object.defineProperty(xhr, 'response', { value: text, configurable: true })
      xhr.onreadystatechange?.(new Event('readystatechange'))
      xhr.onload?.(new ProgressEvent('load'))
      xhr.dispatchEvent(new ProgressEvent('load'))
    }, 600)
  }
}
