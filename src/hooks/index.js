import { useState, useEffect, useRef, useCallback } from 'react'

// Scroll reveal
export function useScrollReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.08 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

// Fetch with loading/error state
export function useFetch(fetchFn, deps = []) {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  const run = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await fetchFn()
      setData(res)
    } catch (e) {
      setError(e?.message || 'Lỗi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }, deps)

  useEffect(() => { run() }, [run])
  return { data, loading, error, refetch: run }
}

// Debounce
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

// Sticky header
export function useSticky(threshold = 8) {
  const [sticky, setSticky] = useState(false)
  useEffect(() => {
    const fn = () => setSticky(window.scrollY > threshold)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [threshold])
  return sticky
}

// Pagination
export function usePagination(total, perPage = 12) {
  const [page, setPage] = useState(1)
  const pages = Math.ceil(total / perPage)
  const goTo  = (p) => setPage(Math.max(1, Math.min(p, pages)))
  return { page, pages, goTo, setPage }
}

// Local storage state
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial }
    catch { return initial }
  })
  const set = (v) => {
    const val = typeof v === 'function' ? v(value) : v
    setValue(val)
    localStorage.setItem(key, JSON.stringify(val))
  }
  return [value, set]
}
