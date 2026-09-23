import { useEffect } from 'react'

/* ── BUTTON ─────────────────────────────────────────────── */
export function Btn({ children, variant = 'primary', size = 'md', loading, disabled, full, onClick, type = 'button', className = '' }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, border: 'none', cursor: disabled || loading ? 'not-allowed' : 'pointer',
    fontFamily: "'DM Sans',sans-serif", fontWeight: 400, letterSpacing: '1.5px',
    textTransform: 'uppercase', borderRadius: 2, transition: 'all .22s',
    opacity: disabled || loading ? .6 : 1,
    width: full ? '100%' : undefined,
  }
  const sizes = { sm: { padding: '8px 18px', fontSize: 11 }, md: { padding: '12px 28px', fontSize: 12 }, lg: { padding: '15px 36px', fontSize: 13 } }
  const variants = {
    primary: { background: '#B8952A', color: 'white' },
    secondary: { background: 'transparent', color: '#3A2F25', border: '1px solid #3A2F25' },
    ghost: { background: 'transparent', color: '#8B7D6B', border: '1px solid #E5DDD4' },
    danger: { background: '#C44A4A', color: 'white' },
    dark: { background: '#3A2F25', color: 'white' },
  }
  return (
    <button type={type} onClick={!disabled && !loading ? onClick : undefined}
      style={{ ...base, ...sizes[size], ...variants[variant] }} className={className}>
      {loading ? <Spinner size={14} color="currentColor" /> : children}
    </button>
  )
}

/* ── INPUT ──────────────────────────────────────────────── */
export function Input({ label, error, type = 'text', ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', fontSize: 12, color: '#8B7D6B', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>}
      <input type={type} {...props}
        style={{ width: '100%', padding: '11px 14px', border: `1px solid ${error ? '#C44A4A' : '#E5DDD4'}`, borderRadius: 2, background: '#FFFDF9', fontSize: 14, color: '#3A2F25', outline: 'none', transition: 'border .2s', ...props.style }} />
      {error && <p style={{ color: '#C44A4A', fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  )
}

export function Select({ label, error, children, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', fontSize: 12, color: '#8B7D6B', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>}
      <select {...props} style={{ width: '100%', padding: '11px 14px', border: `1px solid ${error ? '#C44A4A' : '#E5DDD4'}`, borderRadius: 2, background: '#FFFDF9', fontSize: 14, color: '#3A2F25', outline: 'none', ...props.style }}>
        {children}
      </select>
      {error && <p style={{ color: '#C44A4A', fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  )
}

export function Textarea({ label, error, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', fontSize: 12, color: '#8B7D6B', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>}
      <textarea {...props} style={{ width: '100%', padding: '11px 14px', border: `1px solid ${error ? '#C44A4A' : '#E5DDD4'}`, borderRadius: 2, background: '#FFFDF9', fontSize: 14, color: '#3A2F25', outline: 'none', resize: 'vertical', minHeight: 100, ...props.style }} />
      {error && <p style={{ color: '#C44A4A', fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  )
}

/* ── SPINNER ─────────────────────────────────────────────── */
export function Spinner({ size = 24, color = '#B8952A' }) {
  return (
    <div style={{ width: size, height: size, border: `2px solid ${color}30`, borderTop: `2px solid ${color}`, borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
  )
}

export function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <Spinner size={40} />
      <p style={{ color: '#9B8E82', fontSize: 13 }}>Đang tải...</p>
    </div>
  )
}

/* ── MODAL ──────────────────────────────────────────────── */
export function Modal({ open, onClose, title, children, width = 520 }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(28,24,20,.5)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', zIndex: 1, background: '#FFFDF9', borderRadius: 4, width: '100%', maxWidth: width, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #E5DDD4' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 400, color: '#3A2F25' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: '#9B8E82', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  )
}

/* ── PAGINATION ─────────────────────────────────────────── */
export function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null
  const arr = Array.from({ length: pages }, (_, i) => i + 1)
    .filter(p => p === 1 || p === pages || Math.abs(p - page) <= 2)

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 40 }}>
      <PagBtn disabled={page === 1} onClick={() => onPage(page - 1)}>←</PagBtn>
      {arr.map((p, i) => {
        const gap = i > 0 && arr[i] - arr[i - 1] > 1
        return [
          gap && <span key={`dot-${p}`} style={{ padding: '0 4px', color: '#9B8E82' }}>…</span>,
          <PagBtn key={p} active={p === page} onClick={() => onPage(p)}>{p}</PagBtn>
        ]
      })}
      <PagBtn disabled={page === pages} onClick={() => onPage(page + 1)}>→</PagBtn>
    </div>
  )
}

function PagBtn({ children, active, disabled, onClick }) {
  return (
    <button onClick={!disabled ? onClick : undefined}
      style={{ width: 36, height: 36, borderRadius: 2, border: `1px solid ${active ? '#3A2F25' : '#E5DDD4'}`, background: active ? '#3A2F25' : 'transparent', color: active ? 'white' : disabled ? '#C9B99A' : '#3A2F25', cursor: disabled ? 'default' : 'pointer', fontSize: 13, transition: 'all .2s' }}>
      {children}
    </button>
  )
}

/* ── EMPTY STATE ─────────────────────────────────────────── */
export function EmptyState({ icon = '🔍', title, desc, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '64px 24px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 400, color: '#3A2F25', marginBottom: 8 }}>{title}</h3>
      {desc && <p style={{ color: '#9B8E82', fontSize: 14, marginBottom: 24 }}>{desc}</p>}
      {action}
    </div>
  )
}

/* ── SECTION HEADER ─────────────────────────────────────── */
export function SectionHeader({ label, title, subtitle, center = true }) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 48 }}>
      {label && <span style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: '#B8952A', display: 'block', marginBottom: 10 }}>{label}</span>}
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 300, color: '#3A2F25', lineHeight: 1.2 }}>{title}</h2>
      {subtitle && <p style={{ marginTop: 12, fontSize: 14, color: '#9B8E82', lineHeight: 1.8, maxWidth: center ? 480 : undefined, margin: center ? '12px auto 0' : '12px 0 0' }}>{subtitle}</p>}
    </div>
  )
}

/* ── CARD ────────────────────────────────────────────────── */
export function Card({ children, style = {}, padding = 24 }) {
  return (
    <div style={{ background: '#FFFDF9', border: '1px solid #E5DDD4', borderRadius: 4, padding, ...style }}>
      {children}
    </div>
  )
}

/* ── CONFIRM DIALOG ─────────────────────────────────────── */
export function ConfirmDialog({ open, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title || 'Xác nhận'} width={400}>
      <p style={{ color: '#8B7D6B', marginBottom: 24, lineHeight: 1.7 }}>{message}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onClose}>Huỷ</Btn>
        <Btn variant="danger" onClick={onConfirm} loading={loading}>Xác nhận</Btn>
      </div>
    </Modal>
  )
}

