import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useCart } from '../../context'
import { useSticky } from '../../hooks'
import Logo from '../common/Logo'
export default function Header() {
  const sticky             = useSticky()
  const { user, logout }   = useAuth()
  const { count }          = useCart()
  const navigate           = useNavigate()
  const [search, setSearch]     = useState('')
  const [userMenu, setUserMenu] = useState(false)
  const [drawer, setDrawer]     = useState(false)   // mobile nav drawer

  const handleSearch = e => {
    e.preventDefault()
    if (search.trim()) { navigate(`/products?keyword=${encodeURIComponent(search.trim())}`); setDrawer(false) }
  }

  return (
    <>
      <header style={{
        position:'fixed', top:0, left:0, right:0, zIndex:200,
        background: sticky ? 'rgba(250,247,242,0.97)' : 'rgba(250,247,242,0.85)',
        backdropFilter:'blur(14px)',
        borderBottom:`1px solid ${sticky ? '#E5DDD4' : 'transparent'}`,
        boxShadow: sticky ? '0 2px 20px rgba(0,0,0,.06)' : 'none',
        transition:'all .3s',
      }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>

          {/* Logo */}
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="header-nav">
            {[
              { to:'/', label:'Trang Chủ' },
              { to:'/products', label:'Sản Phẩm' }
            ].map(n => <NavLink key={n.to} to={n.to}>{n.label}</NavLink>)}
          </nav>

          {/* Desktop search */}
          <form className="header-search" onSubmit={handleSearch} style={{ display:'flex', alignItems:'center', gap:8, background:'#EDD5C0', borderRadius:20, padding:'7px 14px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9B8E82" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm đồ chơi hợp mệnh..."
              style={{ border:'none', background:'transparent', outline:'none', fontSize:12, color:'#3A2F25', fontFamily:"'DM Sans',sans-serif", width:130 }}/>
          </form>

          {/* Actions */}
          <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
            {/* Cart */}
            <Link to="/cart" style={{ position:'relative', color:'#8B7D6B', fontSize:32, lineHeight:1 }}>
              🛍
              {count > 0 && (
                <span style={{ position:'absolute', top:-5, right:-6, width:16, height:16, borderRadius:'50%', background:'#B8952A', color:'white', fontSize:9, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600 }}>
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>

            {/* User (desktop) */}
            {user ? (
              <div className="hide-mobile" style={{ position:'relative' }}>
                <button onClick={() => setUserMenu(v => !v)}
                  style={{ background:'#EDD5C0', border:'none', borderRadius:'50%', width:34, height:34, cursor:'pointer', fontSize:13, color:'#3A2F25', fontWeight:500, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {user.name?.[0]?.toUpperCase()}
                </button>
                {userMenu && (
                  <div onMouseLeave={() => setUserMenu(false)}
                    style={{ position:'absolute', right:0, top:'110%', background:'#FFFDF9', border:'1px solid #E5DDD4', borderRadius:4, minWidth:180, boxShadow:'0 8px 24px rgba(0,0,0,.1)', zIndex:100 }}>
                    <div style={{ padding:'12px 16px', borderBottom:'1px solid #E5DDD4' }}>
                      <p style={{ fontSize:13, fontWeight:500, color:'#3A2F25' }}>{user.name}</p>
                      <p style={{ fontSize:11, color:'#9B8E82' }}>{user.email}</p>
                    </div>
                    {[
                      { to:'/account', label:'👤 Tài khoản' },
                      { to:'/account/orders', label:'📦 Đơn hàng' },
                      ...(user.role==='admin' ? [{ to:'/admin', label:'⚙️ Admin' }] : []),
                    ].map(m => (
                      <Link key={m.to} to={m.to} onClick={() => setUserMenu(false)}
                        style={{ display:'block', padding:'10px 16px', fontSize:13, color:'#3A2F25', borderBottom:'1px solid #F5F0E8', transition:'background .15s' }}
                        onMouseEnter={e => e.target.style.background='#FAF7F2'}
                        onMouseLeave={e => e.target.style.background='transparent'}>
                        {m.label}
                      </Link>
                    ))}
                    <button onClick={() => { logout(); setUserMenu(false) }}
                      style={{ display:'block', width:'100%', padding:'10px 16px', fontSize:13, color:'#C44A4A', border:'none', background:'none', textAlign:'left', cursor:'pointer' }}>
                      🚪 Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link className="hide-mobile" to="/login"
                style={{ fontSize:12, letterSpacing:1.5, textTransform:'uppercase', color:'#3A2F25', border:'1px solid #E5DDD4', padding:'7px 14px', borderRadius:2, whiteSpace:'nowrap' }}>
                Đăng nhập
              </Link>
            )}

            {/* Hamburger */}
            <button className="header-mobile-btn"
              onClick={() => setDrawer(true)}
              style={{ background:'none', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', gap:5, padding:4 }}>
              {[0,1,2].map(i => <span key={i} style={{ width:22, height:2, background:'#3A2F25', borderRadius:2, display:'block' }}/>)}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {drawer && <div className="mobile-overlay" onClick={() => setDrawer(false)}/>}
      <div className={`mobile-drawer ${drawer ? 'open' : ''}`}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px 20px', borderBottom:'1px solid #E5DDD4', marginBottom:8 }}>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, letterSpacing:4, color:'#3A2F25' }}>4EM</span>
          <button onClick={() => setDrawer(false)} style={{ background:'none', border:'none', fontSize:22, color:'#9B8E82', cursor:'pointer' }}>✕</button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ margin:'0 16px 16px', display:'flex', gap:8, background:'#EDD5C0', borderRadius:20, padding:'9px 16px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9B8E82" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm sản phẩm..."
            style={{ border:'none', background:'transparent', outline:'none', fontSize:13, color:'#3A2F25', flex:1 }}/>
        </form>

        {/* Nav links */}
        {[
          { to:'/', label:'🏠 Trang Chủ' },
          { to:'/products', label:'💎 Sản Phẩm' },
          { to:'/products?isNew=true', label:'✨ Mới Nhất' },
          { to:'/products?isFeatured=true', label:'⭐ Nổi Bật' },
          { to:'/cart', label:'🛍 Giỏ Hàng' },
        ].map(n => (
          <Link key={n.to} to={n.to} onClick={() => setDrawer(false)}
            style={{ display:'block', padding:'13px 20px', fontSize:14, color:'#3A2F25', borderBottom:'1px solid #F5F0E8', transition:'background .15s' }}
            onMouseEnter={e => e.target.style.background='#FAF7F2'}
            onMouseLeave={e => e.target.style.background='transparent'}>
            {n.label}
          </Link>
        ))}

        {/* Auth */}
        <div style={{ padding:'16px 20px', borderTop:'1px solid #E5DDD4', marginTop:8 }}>
          {user ? (
            <>
              <div style={{ marginBottom:12 }}>
                <p style={{ fontSize:13, fontWeight:500, color:'#3A2F25' }}>{user.name}</p>
                <p style={{ fontSize:11, color:'#9B8E82' }}>{user.email}</p>
              </div>
              {[
                { to:'/account', label:'👤 Tài khoản' },
                { to:'/account/orders', label:'📦 Đơn hàng của tôi' },
                ...(user.role==='admin' ? [{ to:'/admin', label:'⚙️ Trang Admin' }] : []),
              ].map(m => (
                <Link key={m.to} to={m.to} onClick={() => setDrawer(false)}
                  style={{ display:'block', fontSize:14, color:'#3A2F25', padding:'8px 0', borderBottom:'1px solid #F5F0E8' }}>
                  {m.label}
                </Link>
              ))}
              <button onClick={() => { logout(); setDrawer(false) }}
                style={{ marginTop:12, fontSize:13, color:'#C44A4A', background:'none', border:'none', cursor:'pointer', padding:0 }}>
                🚪 Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setDrawer(false)}
              style={{ display:'block', textAlign:'center', padding:'12px', background:'#3A2F25', color:'white', borderRadius:2, fontSize:13, letterSpacing:1 }}>
              Đăng nhập / Đăng ký
            </Link>
          )}
        </div>
      </div>
    </>
  )
}

function NavLink({ to, children }) {
  const [hov, setHov] = useState(false)
  return (
    <Link to={to} style={{ fontSize:12, letterSpacing:1.8, textTransform:'uppercase', color: hov ? '#3A2F25' : '#8B7D6B', borderBottom:`1px solid ${hov ? '#B8952A' : 'transparent'}`, paddingBottom:2, transition:'all .2s', whiteSpace:'nowrap' }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </Link>
  )
}
