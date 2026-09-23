import { Link } from 'react-router-dom'
import { useState } from 'react'
import Logo from '../common/Logo'
export default function Footer() {
  return (
    <footer style={{ background: '#1C1814', color: 'rgba(255,255,255,.55)' }}>

      {/* ── Main grid ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(40px,6vw,60px) clamp(16px,4vw,48px) 0' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'clamp(28px,4vw,44px)',
          marginBottom: 'clamp(32px,5vw,44px)',
        }}>

          {/* Brand block */}
          <div style={{ gridColumn: 'span 1' }}>
            {/* <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 600, letterSpacing: 5, color: 'white', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#B8952A', display: 'inline-block' }} />
              4EM
            </div> */}
            <Logo />
            <p style={{ fontSize: 13, lineHeight: 1.85, marginBottom: 20, maxWidth: 280 }}>
              4EM là thương hiệu đồ chơi người lớn phong thủy thuần thiên nhiên, kết nối con người với năng lượng đất trời.
            </p>
            <div style={{ fontSize: 13, lineHeight: 2.1 }}>
              <div>Hotline: <a href="tel:19002929" style={{ color: 'white' }}>1900 29 29 17</a></div>
              <div>Email: <a href="mailto:hello@4em.vn" style={{ color: 'white' }}>hello@4em.vn</a></div>
            </div>

            {/* Social – hiện ở đây trên mobile */}
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              {[
                { ic: 'f',  href: '#', label: 'Facebook' },
                { ic: 'in', href: '#', label: 'Instagram' },
                { ic: '▶',  href: '#', label: 'YouTube' },
                { ic: '✦',  href: '#', label: 'TikTok' },
              ].map(s => <SocialBtn key={s.label} href={s.href}>{s.ic}</SocialBtn>)}
            </div>
          </div>

          {/* Sản phẩm */}
          <FooterCol title="Sản Phẩm" links={[
            { to: '/products',                label: 'Tất cả sản phẩm' },
            { to: '/products?isNew=true',     label: 'Hàng mới về' },
            { to: '/products?isFeatured=true',label: 'Nổi bật' },
            { to: '/products?menh=Kim',       label: 'Sex toys theo mệnh' },
          ]} />

          {/* Hỗ trợ */}
          <FooterCol title="Hỗ Trợ" links={[
            { to: '/policy',         label: 'Chính sách đổi trả' },
            { to: '/policy',         label: 'Hướng dẫn mua hàng' },
            { to: '/contact',        label: 'Liên hệ' },
          ]} />

          {/* Showroom – accordion trên mobile */}
          <ShowroomBlock />
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,.08)',
          paddingTop: 20,
          paddingBottom: 24,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          fontSize: 12,
          color: 'rgba(255,255,255,.35)',
        }}>
          <p>© 2025 4EM. All rights reserved.</p>
          <p style={{ fontSize: 11 }}>Thiết kế bởi <span style={{ color: 'rgba(255,255,255,.6)' }}>4EM Studio</span></p>
        </div>
      </div>
    </footer>
  )
}

/* ── Showroom block – accordion trên mobile ── */
function ShowroomBlock() {
  const [open, setOpen] = useState(true)
  const showrooms = [
    { name: '4EM – Quận 1',   addr: '123 Lê Lợi, Bến Nghé, Q.1, TP.HCM' },
    { name: '4EM – Quận 3',   addr: '456 Võ Văn Tần, P.5, Q.3, TP.HCM' },
    { name: '4EM – Thủ Đức',  addr: '789 Võ Văn Ngân, Linh Chiểu, TP. Thủ Đức' },
  ]

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 0, marginBottom: open ? 14 : 0,
        }}
      >
        <h4 style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'white', fontWeight: 400 }}>
          Showroom
        </h4>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', transition: 'transform .25s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'none' }}>▼</span>
      </button>

      <div style={{
        overflow: 'hidden',
        maxHeight: open ? 400 : 0,
        transition: 'max-height .3s ease',
      }}>
        {showrooms.map(s => (
          <div key={s.name} style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,.8)', marginBottom: 3 }}>
              📍 {s.name}
            </p>
            <p style={{ fontSize: 12, lineHeight: 1.65, color: 'rgba(255,255,255,.45)' }}>{s.addr}</p>
          </div>
        ))}
        <p style={{ fontSize: 12, marginTop: 4, color: 'rgba(255,255,255,.35)' }}>
          🕐 8:00 – 21:00 · Thứ 2 – Chủ Nhật
        </p>
      </div>
    </div>
  )
}

/* ── Footer column ── */
function FooterCol({ title, links }) {
  const [open, setOpen] = useState(true)

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 0, marginBottom: open ? 14 : 0,
        }}
      >
        <h4 style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'white', fontWeight: 400 }}>
          {title}
        </h4>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', transition: 'transform .25s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'none' }}>▼</span>
      </button>

      <div style={{
        overflow: 'hidden',
        maxHeight: open ? 300 : 0,
        transition: 'max-height .3s ease',
      }}>
        {links.map(l => <FooterLink key={l.label} to={l.to}>{l.label}</FooterLink>)}
      </div>
    </div>
  )
}

/* ── Footer link ── */
function FooterLink({ to, children }) {
  const [hov, setHov] = useState(false)
  return (
    <Link
      to={to}
      style={{ display: 'block', fontSize: 13, color: hov ? '#D4AF5A' : 'rgba(255,255,255,.45)', marginBottom: 10, transition: 'color .2s' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </Link>
  )
}

/* ── Social button ── */
function SocialBtn({ children, href }) {
  const [hov, setHov] = useState(false)
  return (
    <a
      href={href}
      style={{
        width: 34, height: 34, borderRadius: '50%',
        border: `1px solid ${hov ? '#B8952A' : 'rgba(255,255,255,.18)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hov ? '#D4AF5A' : 'rgba(255,255,255,.5)',
        fontSize: 13, transition: 'all .2s', textDecoration: 'none',
        flexShrink: 0,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </a>
  )
}