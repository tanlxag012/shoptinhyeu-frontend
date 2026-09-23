import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { productAPI, categoryAPI, orderAPI, couponAPI, userAPI } from '../api'
import { fmt, fmtDateTime, fmtDate, ORDER_STATUS, PAYMENT_STATUS, MENH_COLORS, truncate } from '../utils'
import { Btn, Input, Select, Textarea, PageLoader, Modal, Pagination, EmptyState, Card, ConfirmDialog } from '../components/common'
import { useAuth } from '../context'
import toast from 'react-hot-toast'
import Logo from '../components/common/Logo'
/* ── breakpoint hook ── */
function useIsMobile(bp = 768) {
  const [is, setIs] = useState(window.innerWidth < bp)
  useEffect(() => {
    const fn = () => setIs(window.innerWidth < bp)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [bp])
  return is
}

/* ════════════════════════════════════════════════════════════
   MENU CONFIG
════════════════════════════════════════════════════════════ */
const MENU = [
  { path: '/admin',            icon: '📊', label: 'Dashboard' },
  { path: '/admin/products',   icon: '💎', label: 'Sản Phẩm' },
  { path: '/admin/categories', icon: '📁', label: 'Danh Mục' },
  { path: '/admin/orders',     icon: '📦', label: 'Đơn Hàng' },
  { path: '/admin/users',      icon: '👥', label: 'Người Dùng' },
  { path: '/admin/coupons',    icon: '🎟', label: 'Mã Giảm Giá' },
]

/* ════════════════════════════════════════════════════════════
   ADMIN LAYOUT
════════════════════════════════════════════════════════════ */
export function AdminLayout({ children }) {
  const location   = useLocation()
  const { user, logout } = useAuth()
  const navigate   = useNavigate()
  const isMobile   = useIsMobile(900)
  const [sideOpen, setSideOpen]     = useState(false)   // mobile drawer
  const [collapsed, setCollapsed]   = useState(false)   // desktop collapse

  // close drawer on route change
  useEffect(() => setSideOpen(false), [location.pathname])

  const sidebarWidth = isMobile ? 260 : (collapsed ? 64 : 220)

  const SidebarContent = () => (
    <>
      {/* Logo row */}
      <div style={{ padding: collapsed && !isMobile ? '18px 0' : '18px 20px', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: collapsed && !isMobile ? 'center' : 'space-between', flexShrink: 0 }}>
        {(!collapsed || isMobile) && (
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, letterSpacing: 4, color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Logo />
          </span>
        )}
        {isMobile ? (
          <button onClick={() => setSideOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>✕</button>
        ) : (
          <button onClick={() => setCollapsed(v => !v)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: 15, padding: 4 }}>
            {collapsed ? '→' : '←'}
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
        {MENU.map(m => {
          const active = location.pathname === m.path || (m.path !== '/admin' && location.pathname.startsWith(m.path))
          const showLabel = isMobile || !collapsed
          return (
            <Link key={m.path} to={m.path} title={!showLabel ? m.label : ''}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: showLabel ? '13px 20px' : '13px 0', justifyContent: showLabel ? 'flex-start' : 'center', color: active ? '#D4AF5A' : 'rgba(255,255,255,.55)', background: active ? 'rgba(255,255,255,.06)' : 'transparent', borderLeft: `3px solid ${active ? '#B8952A' : 'transparent'}`, fontSize: 13, transition: 'all .15s', textDecoration: 'none' }}>
              <span style={{ fontSize: 17, flexShrink: 0 }}>{m.icon}</span>
              {showLabel && <span>{m.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User row */}
      <div style={{ padding: collapsed && !isMobile ? '14px 0' : '14px 20px', borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: collapsed && !isMobile ? 'center' : 'space-between', flexShrink: 0, gap: 10 }}>
        {(!collapsed || isMobile) && (
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 12, color: 'white', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>Admin</p>
          </div>
        )}
        <button onClick={() => { logout(); navigate('/login') }} title="Đăng xuất"
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.4)', cursor: 'pointer', fontSize: 16, padding: 2, flexShrink: 0 }}>
          🚪
        </button>
      </div>
    </>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F0EB' }}>

      {/* Mobile overlay */}
      {isMobile && sideOpen && (
        <div onClick={() => setSideOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 299, backdropFilter: 'blur(2px)' }} />
      )}

      {/* Sidebar */}
      {isMobile ? (
        <aside style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: sidebarWidth, background: '#1C1814', zIndex: 300, display: 'flex', flexDirection: 'column', transform: sideOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform .28s cubic-bezier(.4,0,.2,1)' }}>
          <SidebarContent />
        </aside>
      ) : (
        <aside style={{ width: sidebarWidth, flexShrink: 0, background: '#1C1814', display: 'flex', flexDirection: 'column', transition: 'width .25s', position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
          <SidebarContent />
        </aside>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Mobile top bar */}
        {isMobile && (
          <div style={{ background: '#1C1814', padding: '0 16px', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <button onClick={() => setSideOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[0,1,2].map(i => <span key={i} style={{ width: 20, height: 2, background: 'white', borderRadius: 1, display: 'block' }} />)}
            </button>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 600, letterSpacing: 4, color: 'white', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#B8952A', display: 'inline-block' }} />4EM
            </span>
            <div style={{ width: 28 }} />
          </div>
        )}

        <main style={{ flex: 1, overflow: 'auto', padding: 'clamp(16px,3vw,32px)' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   DASHBOARD
════════════════════════════════════════════════════════════ */
export function AdminDashboard() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    orderAPI.getDashboard().then(r => setData(r)).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  if (loading) return <PageLoader />
  if (!data) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <p style={{ fontSize: 32, marginBottom: 16 }}>⚠️</p>
      <p style={{ color: '#C44A4A', fontSize: 15 }}>Không tải được dữ liệu dashboard.</p>
      <p style={{ color: '#9B8E82', fontSize: 13, marginTop: 8, marginBottom: 20 }}>Kiểm tra kết nối backend và thử lại.</p>
      <Btn onClick={load}>Thử lại</Btn>
    </div>
  )

  const { stats, revenueByMonth, topProducts, recentOrders } = data

  return (
    <div>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(24px,4vw,32px)', fontWeight: 300, color: '#3A2F25', marginBottom: 24 }}>Dashboard</h1>

      {/* Stat cards – 2 col mobile, 4 col desktop */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard icon="💰" label="Doanh thu tháng" value={fmt(stats.monthRevenue)} sub={`Tổng: ${fmt(stats.totalRevenue)}`} color="#B8952A" />
        <StatCard icon="📦" label="Đơn tháng này"   value={stats.monthOrders}  sub={`Tổng: ${stats.totalOrders} đơn`} color="#4A7C59" />
        <StatCard icon="⏳" label="Chờ xác nhận"    value={stats.pendingOrders} sub="Cần xử lý ngay" color="#C4714A" />
        <StatCard icon="👥" label="Khách hàng"       value={stats.totalUsers}   sub={`${stats.lowStockProducts} SP sắp hết`} color="#5A8AAA" />
      </div>

      {/* Chart + Top products */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginBottom: 24 }}>
        <Card>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 400, color: '#3A2F25', marginBottom: 18 }}>Doanh Thu 6 Tháng</h3>
          <RevenueChart data={revenueByMonth} />
        </Card>
        <Card>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 400, color: '#3A2F25', marginBottom: 18 }}>Top Sản Phẩm</h3>
          {topProducts.map((p, i) => (
            <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: '#9B8E82', width: 16, flexShrink: 0 }}>#{i+1}</span>
              <img src={(p.media?.find(m => m.type==='image') || p.media?.[0])?.url || 'https://via.placeholder.com/40'} alt={p.name}
                style={{ width: 38, height: 38, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, color: '#3A2F25', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                <p style={{ fontSize: 11, color: '#9B8E82' }}>Đã bán: {p.sold}</p>
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#B8952A', flexShrink: 0 }}>{fmt(p.price)}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Recent orders – scroll on mobile */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 400, color: '#3A2F25' }}>Đơn Hàng Mới Nhất</h3>
          <Link to="/admin/orders" style={{ fontSize: 12, color: '#B8952A', letterSpacing: 1 }}>Xem tất cả →</Link>
        </div>
        <AdminTable headers={['Mã đơn','Khách hàng','Tổng tiền','Trạng thái','Ngày']}>
          {recentOrders.map(o => {
            const st = ORDER_STATUS[o.status] || {}
            return (
              <tr key={o._id}>
                <Td><Link to={`/admin/orders`} style={{ color: '#B8952A', fontWeight: 500 }}>#{o.orderCode}</Link></Td>
                <Td>{o.shippingAddress?.fullName}</Td>
                <Td><span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: '#B8952A' }}>{fmt(o.total)}</span></Td>
                <Td><span className={`badge ${st.color}`}>{st.label}</span></Td>
                <Td style={{ color: '#9B8E82', whiteSpace: 'nowrap' }}>{fmtDate(o.createdAt)}</Td>
              </tr>
            )
          })}
        </AdminTable>
      </Card>
    </div>
  )
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <Card style={{ borderLeft: `3px solid ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 26 }}>{icon}</span>
        <span style={{ fontSize: 10, color: '#9B8E82', letterSpacing: 1, textTransform: 'uppercase', textAlign: 'right', lineHeight: 1.4 }}>{label}</span>
      </div>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(20px,3vw,26px)', fontWeight: 600, color: '#3A2F25', marginBottom: 3 }}>{value}</p>
      <p style={{ fontSize: 11, color: '#9B8E82' }}>{sub}</p>
    </Card>
  )
}

function RevenueChart({ data }) {
  if (!data?.length) return <p style={{ color: '#9B8E82', fontSize: 13 }}>Chưa có dữ liệu</p>
  const max = Math.max(...data.map(d => d.revenue), 1)
  const months = ['','T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12']
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140 }}>
      {data.map(d => (
        <div key={`${d._id.year}-${d._id.month}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 9, color: '#9B8E82', writingMode: 'horizontal-tb' }}></span>
          <div style={{ width: '100%', height: `${(d.revenue / max) * 110}px`, minHeight: 4, background: 'linear-gradient(to top,#B8952A,#D4AF5A)', borderRadius: '2px 2px 0 0', transition: 'height .5s' }} />
          <span style={{ fontSize: 9, color: '#9B8E82' }}>{months[d._id.month]}</span>
        </div>
      ))}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   ADMIN PRODUCTS
════════════════════════════════════════════════════════════ */
export function AdminProducts() {
  const [products, setProducts] = useState([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(true)
  const [page, setPage]         = useState(1)
  const [keyword, setKeyword]   = useState('')
  const [categories, setCategories] = useState([])
  const [modal, setModal]       = useState(null)
  const [delConfirm, setDelConfirm] = useState(null)
  const [delLoading, setDelLoading] = useState(false)
  const LIMIT = 15

  const load = () => {
    setLoading(true)
    productAPI.adminGetAll({ page, limit: LIMIT, keyword })
      .then(r => { setProducts(r.products); setTotal(r.total) })
      .finally(() => setLoading(false))
  }
  useEffect(() => { categoryAPI.getAll().then(r => setCategories(r.categories)) }, [])
  useEffect(() => { load() }, [page, keyword])

  const handleDelete = async () => {
    setDelLoading(true)
    try { await productAPI.delete(delConfirm._id); toast.success('Đã xoá sản phẩm'); setDelConfirm(null); load() }
    catch (e) { toast.error(e.message) }
    finally { setDelLoading(false) }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(22px,4vw,30px)', fontWeight: 300, color: '#3A2F25' }}>Sản Phẩm</h1>
        <Btn onClick={() => setModal('create')}>+ Thêm</Btn>
      </div>

      {/* Search */}
      <Card style={{ marginBottom: 14, padding: '10px 14px' }}>
        <input value={keyword} onChange={e => { setKeyword(e.target.value); setPage(1) }}
          placeholder="🔍 Tìm sản phẩm..."
          style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: '#3A2F25' }} />
      </Card>

      <Card style={{ padding: 0 }}>
        {loading ? <div style={{ padding: 32 }}><PageLoader /></div> : (
          <>
            <AdminTable headers={['','Tên','Danh mục','Giá','Kho','Trạng thái','']}>
              {products.map(p => (
                <tr key={p._id}>
                  <Td style={{ width: 52 }}>
                    <img src={(p.media?.find(m=>m.type==='image')||p.media?.[0])?.url||'https://via.placeholder.com/44'} alt={p.name}
                      style={{ width: 44, height: 44, borderRadius: 4, objectFit: 'cover', display: 'block' }} />
                  </Td>
                  <Td>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#3A2F25', maxWidth: 200 }}>{truncate(p.name, 36)}</p>
                    <p style={{ fontSize: 11, color: '#9B8E82' }}>{p.sku || '—'}</p>
                  </Td>
                  <Td style={{ color: '#8B7D6B', fontSize: 12, whiteSpace: 'nowrap' }}>{p.category?.name}</Td>
                  <Td style={{ whiteSpace: 'nowrap' }}>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: '#B8952A' }}>{fmt(p.salePrice || p.price)}</span>
                    {p.salePrice && <span style={{ fontSize: 10, color: '#9B8E82', display: 'block', textDecoration: 'line-through' }}>{fmt(p.price)}</span>}
                  </Td>
                  <Td style={{ color: p.stock < 10 ? '#C44A4A' : '#3A2F25', fontWeight: p.stock < 10 ? 600 : 400 }}>{p.stock}</Td>
                  <Td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: p.isActive ? '#4A7C59' : '#C44A4A' }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.isActive ? '#4A7C59' : '#C44A4A', display: 'inline-block' }} />
                      {p.isActive ? 'Đang bán' : 'Ẩn'}
                    </span>
                  </Td>
                  <Td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Btn size="sm" variant="ghost" onClick={() => setModal(p)}>Sửa</Btn>
                      <Btn size="sm" variant="danger" onClick={() => setDelConfirm(p)}>Xoá</Btn>
                    </div>
                  </Td>
                </tr>
              ))}
            </AdminTable>
            <div style={{ padding: '0 16px 8px' }}>
              <Pagination page={page} pages={Math.ceil(total / LIMIT)} onPage={setPage} />
            </div>
          </>
        )}
      </Card>

      <ProductFormModal open={!!modal} product={modal === 'create' ? null : modal} categories={categories}
        onClose={() => setModal(null)} onSaved={() => { setModal(null); load() }} />

      <ConfirmDialog open={!!delConfirm} onClose={() => setDelConfirm(null)} onConfirm={handleDelete} loading={delLoading}
        title="Xoá sản phẩm" message={`Xoá "${delConfirm?.name}"? Hành động không thể hoàn tác.`} />
    </div>
  )
}

function ProductFormModal({ open, product, categories, onClose, onSaved }) {
  const isEdit = !!product
  const [form, setForm] = useState({
    name:'', price:'', salePrice:'', category:'', description:'', shortDesc:'',
    stoneType:'', origin:'', size:'', material:'', gender:'Unisex',
    stock:0, isActive:true, isFeatured:false, isNew:false, menh:[], tags:'',
  })
  const [loading, setLoading] = useState(false)
  const [files, setFiles]     = useState([])

  useEffect(() => {
    if (!open) return
    if (product) {
      setForm({
        name: product.name||'', price: product.price||'', salePrice: product.salePrice||'',
        category: product.category?._id||'', description: product.description||'',
        shortDesc: product.shortDesc||'', stoneType: product.stoneType||'',
        origin: product.origin||'', size: product.size||'', material: product.material||'',
        gender: product.gender||'Unisex', stock: product.stock||0,
        isActive: product.isActive??true, isFeatured: product.isFeatured??false,
        isNew: product.isNew??false, menh: product.menh||[], tags: product.tags?.join(', ')||'',
      })
    } else {
      setForm({ name:'',price:'',salePrice:'',category:'',description:'',shortDesc:'',stoneType:'',origin:'',size:'',material:'',gender:'Unisex',stock:0,isActive:true,isFeatured:false,isNew:false,menh:[],tags:'' })
    }
    setFiles([])
  }, [product, open])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type==='checkbox' ? e.target.checked : e.target.value }))
  const toggleMenh = m => setForm(f => ({ ...f, menh: f.menh.includes(m) ? f.menh.filter(x=>x!==m) : [...f.menh, m] }))

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category) return toast.error('Vui lòng điền tên, giá, danh mục')
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'menh') fd.append(k, JSON.stringify(v))
        else if (k === 'tags') fd.append(k, JSON.stringify(v.split(',').map(t=>t.trim()).filter(Boolean)))
        else fd.append(k, v)
      })
      files.forEach(f => fd.append('files', f))
      if (isEdit) await productAPI.update(product._id, fd)
      else await productAPI.create(fd)
      toast.success(isEdit ? 'Đã cập nhật sản phẩm' : 'Đã tạo sản phẩm')
      onSaved()
    } catch (e) { toast.error(e.message || 'Lỗi lưu sản phẩm') }
    finally { setLoading(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'} width={680}>
      {/* 2-col grid, 1-col on narrow */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '0 16px' }}>
        <div style={{ gridColumn: '1 / -1' }}><Input label="Tên sản phẩm *" value={form.name} onChange={set('name')} /></div>
        <Input label="Giá gốc (₫) *"       type="number" value={form.price}     onChange={set('price')} />
        <Input label="Giá khuyến mãi (₫)"  type="number" value={form.salePrice} onChange={set('salePrice')} />
        <Select label="Danh mục *" value={form.category} onChange={set('category')}>
          <option value="">Chọn danh mục</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </Select>
        <Select label="Giới tính" value={form.gender} onChange={set('gender')}>
          {['Nam','Nữ','Unisex'].map(g => <option key={g} value={g}>{g}</option>)}
        </Select>
        {/* <Input label="Loại đá"       value={form.stoneType} onChange={set('stoneType')} />
        <Input label="Xuất xứ"       value={form.origin}    onChange={set('origin')} />
        <Input label="Kích thước hạt" value={form.size}     onChange={set('size')} />
        <Input label="Chất liệu khoen" value={form.material} onChange={set('material')} /> */}
        <Input label="Số lượng kho" type="number" value={form.stock} onChange={set('stock')} />
        {/* <Input label="Tags (cách bằng dấu phẩy)" value={form.tags} onChange={set('tags')} /> */}
        <div style={{ gridColumn: '1 / -1' }}>
          <Textarea label="Mô tả" value={form.description} onChange={set('description')} />
        </div>
      </div>

      {/* Mệnh */}
      {/* <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 11, color: '#8B7D6B', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Hợp mệnh</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Kim','Mộc','Thuỷ','Hoả','Thổ'].map(m => (
            <button key={m} onClick={() => toggleMenh(m)}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:20, border:`1px solid ${form.menh.includes(m)?'#3A2F25':'#E5DDD4'}`, background:form.menh.includes(m)?'#3A2F25':'transparent', color:form.menh.includes(m)?'white':'#8B7D6B', fontSize:12, cursor:'pointer' }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:MENH_COLORS[m], display:'inline-block' }}/>{m}
            </button>
          ))}
        </div>
      </div> */}

      {/* Toggles */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 18, flexWrap: 'wrap' }}>
        {[['isActive','Đang bán'],['isFeatured','Nổi bật'],['isNew','Hàng mới']].map(([k,l]) => (
          <label key={k} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, cursor:'pointer', color:'#3A2F25' }}>
            <input type="checkbox" checked={form[k]} onChange={set(k)} style={{ accentColor:'#B8952A' }}/>{l}
          </label>
        ))}
      </div>

      {/* Upload */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, color: '#8B7D6B', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Ảnh / Video sản phẩm</p>
        <label style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'9px 16px', border:'1px dashed #E5DDD4', borderRadius:4, cursor:'pointer', fontSize:13, color:'#8B7D6B' }}>
          📎 Chọn file ảnh / video
          <input type="file" multiple accept="image/*,video/*" style={{ display:'none' }} onChange={e => setFiles(Array.from(e.target.files))} />
        </label>
        {files.length > 0 && <p style={{ fontSize: 12, color: '#4A7C59', marginTop: 6 }}>✓ {files.length} file đã chọn</p>}
        {isEdit && product?.media?.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <p style={{ fontSize: 11, color: '#9B8E82', marginBottom: 8 }}>Media hiện tại ({product.media.length})</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {product.media.map((m, i) => (
                <div key={i} style={{ width: 56, height: 56, borderRadius: 4, overflow: 'hidden', border: '1px solid #E5DDD4', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {m.type === 'video'
                    ? <span style={{ fontSize: 22 }}>🎬</span>
                    : <img src={m.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  }
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <Btn variant="ghost" onClick={onClose}>Huỷ</Btn>
        <Btn onClick={handleSubmit} loading={loading}>{isEdit ? 'Lưu thay đổi' : 'Tạo sản phẩm'}</Btn>
      </div>
    </Modal>
  )
}

/* ════════════════════════════════════════════════════════════
   ADMIN ORDERS
════════════════════════════════════════════════════════════ */
export function AdminOrders() {
  const [orders, setOrders]     = useState([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(true)
  const [page, setPage]         = useState(1)
  const [status, setStatus]     = useState('')
  const [keyword, setKeyword]   = useState('')
  const [selected, setSelected] = useState(null)
  const LIMIT = 20

  const load = () => {
    setLoading(true)
    orderAPI.adminGetAll({ page, limit: LIMIT, status, keyword })
      .then(r => { setOrders(r.orders); setTotal(r.total) })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [page, status, keyword])

  return (
    <div>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(22px,4vw,30px)', fontWeight: 300, color: '#3A2F25', marginBottom: 20 }}>Đơn Hàng</h1>

      {/* Filters */}
      <Card style={{ marginBottom: 14, padding: '12px 14px' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input value={keyword} onChange={e => { setKeyword(e.target.value); setPage(1) }}
            placeholder="🔍 Mã đơn, tên, SĐT..."
            style={{ flex: 1, minWidth: 160, padding: '9px 0', border: 'none', outline: 'none', fontSize: 13, background: 'transparent', color: '#3A2F25' }} />
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}
            style={{ padding: '8px 12px', border: '1px solid #E5DDD4', borderRadius: 2, fontSize: 13, outline: 'none', background: '#FAF7F2', color: '#3A2F25' }}>
            <option value="">Tất cả trạng thái</option>
            {Object.entries(ORDER_STATUS).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </Card>

      <Card style={{ padding: 0 }}>
        {loading ? <div style={{ padding: 32 }}><PageLoader /></div> : (
          <>
            <AdminTable headers={['Mã đơn','Khách hàng','Tổng tiền','Thanh toán','Trạng thái','Ngày','']}>
              {orders.map(o => {
                const st = ORDER_STATUS[o.status] || {}
                const pt = PAYMENT_STATUS[o.paymentStatus] || {}
                return (
                  <tr key={o._id}>
                    <Td><span style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:600, color:'#B8952A', whiteSpace:'nowrap' }}>#{o.orderCode}</span></Td>
                    <Td>
                      <p style={{ fontSize:13, color:'#3A2F25', whiteSpace:'nowrap' }}>{o.shippingAddress?.fullName}</p>
                      <p style={{ fontSize:11, color:'#9B8E82' }}>{o.shippingAddress?.phone}</p>
                    </Td>
                    <Td style={{ whiteSpace:'nowrap' }}><span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, color:'#B8952A' }}>{fmt(o.total)}</span></Td>
                    <Td><span className={`badge ${pt.color}`}>{pt.label}</span></Td>
                    <Td><span className={`badge ${st.color}`}>{st.label}</span></Td>
                    <Td style={{ color:'#9B8E82', fontSize:12, whiteSpace:'nowrap' }}>{fmtDate(o.createdAt)}</Td>
                    <Td><Btn size="sm" variant="ghost" onClick={() => setSelected(o)}>Chi tiết</Btn></Td>
                  </tr>
                )
              })}
            </AdminTable>
            <div style={{ padding: '0 16px 8px' }}>
              <Pagination page={page} pages={Math.ceil(total / LIMIT)} onPage={setPage} />
            </div>
          </>
        )}
      </Card>

      <OrderDetailModal order={selected} onClose={() => setSelected(null)} onUpdated={() => { setSelected(null); load() }} />
    </div>
  )
}

function OrderDetailModal({ order, onClose, onUpdated }) {
  const [status, setStatus]   = useState('')
  const [note, setNote]       = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (order) { setStatus(order.status); setNote('') } }, [order])

  const handleUpdate = async () => {
    setLoading(true)
    try { await orderAPI.updateStatus(order._id, { status, note }); toast.success('Đã cập nhật'); onUpdated() }
    catch (e) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  if (!order) return null
  return (
    <Modal open={!!order} onClose={onClose} title={`Đơn #${order.orderCode}`} width={640}>
      {/* Ship + Payment info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, marginBottom: 20 }}>
        <div>
          <p style={{ fontSize:11, color:'#9B8E82', letterSpacing:1, textTransform:'uppercase', marginBottom:8 }}>Giao đến</p>
          <p style={{ fontSize:13, color:'#3A2F25', lineHeight:1.8 }}>
            <strong>{order.shippingAddress?.fullName}</strong><br/>
            {order.shippingAddress?.phone}<br/>
            {order.shippingAddress?.street}, {order.shippingAddress?.ward}<br/>
            {order.shippingAddress?.district}, {order.shippingAddress?.province}
          </p>
        </div>
        <div>
          <p style={{ fontSize:11, color:'#9B8E82', letterSpacing:1, textTransform:'uppercase', marginBottom:8 }}>Thanh toán</p>
          <p style={{ fontSize:13, color:'#3A2F25', lineHeight:1.8 }}>
            {order.paymentMethod}<br/>
            <span className={`badge ${PAYMENT_STATUS[order.paymentStatus]?.color}`}>{PAYMENT_STATUS[order.paymentStatus]?.label}</span>
          </p>
        </div>
      </div>

      {/* Items */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize:11, color:'#9B8E82', letterSpacing:1, textTransform:'uppercase', marginBottom:12 }}>Sản phẩm</p>
        {order.items?.map(item => (
          <div key={item._id} style={{ display:'flex', gap:10, marginBottom:10, alignItems:'center' }}>
            <img src={item.image||'https://via.placeholder.com/44'} alt="" style={{ width:44, height:44, borderRadius:4, objectFit:'cover', flexShrink:0 }}/>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:13, color:'#3A2F25', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</p>
              <p style={{ fontSize:11, color:'#9B8E82' }}>x{item.quantity} × {fmt(item.price)}</p>
            </div>
            <p style={{ fontSize:13, fontWeight:500, color:'#3A2F25', flexShrink:0 }}>{fmt(item.price * item.quantity)}</p>
          </div>
        ))}
        <div style={{ borderTop:'1px solid #E5DDD4', marginTop:10, paddingTop:10 }}>
          {order.discountAmount > 0 && (
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#4A7C59', marginBottom:6 }}>
              <span>Giảm giá</span><span>−{fmt(order.discountAmount)}</span>
            </div>
          )}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17 }}>Tổng cộng</span>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:'#B8952A', fontWeight:600 }}>{fmt(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Update status */}
      <div style={{ background:'#FAF7F2', borderRadius:4, padding:16, border:'1px solid #E5DDD4' }}>
        <p style={{ fontSize:11, color:'#9B8E82', letterSpacing:1, textTransform:'uppercase', marginBottom:12 }}>Cập Nhật Trạng Thái</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:10, marginBottom:12 }}>
          <select value={status} onChange={e => setStatus(e.target.value)}
            style={{ padding:'9px 12px', border:'1px solid #E5DDD4', borderRadius:2, fontSize:13, outline:'none', background:'#FFFDF9' }}>
            {Object.entries(ORDER_STATUS).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Ghi chú (tuỳ chọn)"
            style={{ padding:'9px 12px', border:'1px solid #E5DDD4', borderRadius:2, fontSize:13, outline:'none', background:'#FFFDF9' }}/>
        </div>
        <Btn onClick={handleUpdate} loading={loading} size="sm">Cập nhật trạng thái</Btn>
      </div>
    </Modal>
  )
}

/* ════════════════════════════════════════════════════════════
   ADMIN CATEGORIES
════════════════════════════════════════════════════════════ */
export function AdminCategories() {
  const [cats, setCats]             = useState([])
  const [loading, setLoading]       = useState(true)
  const [modal, setModal]           = useState(null)   // null | 'create' | catObj
  const [delConfirm, setDelConfirm] = useState(null)
  const [delLoading, setDelLoading] = useState(false)
  const [saving, setSaving]         = useState(false)
  const [imageFile, setImageFile]   = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [form, setForm] = useState({ name:'', description:'', sortOrder:0, isActive:true })

  const load = () => {
    setLoading(true)
    categoryAPI.adminGetAll().then(r => setCats(r.categories)).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  useEffect(() => {
    if (!modal) return
    if (modal !== 'create') {
      setForm({ name:modal.name, description:modal.description||'', sortOrder:modal.sortOrder||0, isActive:modal.isActive??true })
      setImagePreview(modal.image || '')
    } else {
      setForm({ name:'', description:'', sortOrder:0, isActive:true })
      setImagePreview('')
    }
    setImageFile(null)
  }, [modal])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!form.name) return toast.error('Vui lòng nhập tên danh mục')
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name',        form.name)
      fd.append('description', form.description)
      fd.append('sortOrder',   form.sortOrder)
      fd.append('isActive',    form.isActive)
      if (imageFile) fd.append('image', imageFile)

      if (modal === 'create') await categoryAPI.create(fd)
      else await categoryAPI.update(modal._id, fd)

      toast.success(modal === 'create' ? 'Đã tạo danh mục' : 'Đã cập nhật')
      setModal(null); load()
    } catch (e) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDelLoading(true)
    try { await categoryAPI.delete(delConfirm._id); toast.success('Đã xoá'); setDelConfirm(null); load() }
    catch (e) { toast.error(e.message) }
    finally { setDelLoading(false) }
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, gap:12, flexWrap:'wrap' }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(22px,4vw,30px)', fontWeight:300, color:'#3A2F25' }}>Danh Mục</h1>
        <Btn onClick={() => setModal('create')}>+ Thêm</Btn>
      </div>

      <Card style={{ padding:0 }}>
        {loading ? <div style={{ padding:32 }}><PageLoader /></div> : (
          <AdminTable headers={['Ảnh','Tên','Slug','Số SP','Thứ tự','Trạng thái','']}>
            {cats.map(c => (
              <tr key={c._id}>
                {/* Thumbnail */}
                <Td style={{ width:56 }}>
                  {c.image
                    ? <img src={c.image} alt={c.name} style={{ width:48, height:48, borderRadius:4, objectFit:'cover', display:'block' }} />
                    : <div style={{ width:48, height:48, borderRadius:4, background:'#EDD5C0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>📁</div>
                  }
                </Td>
                <Td>
                  <p style={{ fontSize:13, fontWeight:500, color:'#3A2F25' }}>{c.name}</p>
                  <p style={{ fontSize:11, color:'#9B8E82' }}>{c.description}</p>
                </Td>
                <Td style={{ color:'#9B8E82', fontSize:12 }}>{c.slug}</Td>
                <Td style={{ color:'#8B7D6B' }}>{c.productCount||0}</Td>
                <Td style={{ color:'#8B7D6B' }}>{c.sortOrder}</Td>
                <Td><span style={{ fontSize:12, color:c.isActive?'#4A7C59':'#C44A4A' }}>{c.isActive?'✓ Hiển thị':'✗ Ẩn'}</span></Td>
                <Td>
                  <div style={{ display:'flex', gap:6 }}>
                    <Btn size="sm" variant="ghost" onClick={() => setModal(c)}>Sửa</Btn>
                    <Btn size="sm" variant="danger" onClick={() => setDelConfirm(c)}>Xoá</Btn>
                  </div>
                </Td>
              </tr>
            ))}
          </AdminTable>
        )}
      </Card>

      {/* Create / Edit Modal */}
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal==='create' ? 'Thêm Danh Mục' : 'Sửa Danh Mục'} width={480}>
        <Input label="Tên danh mục *" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} />
        <Input label="Mô tả" value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} />
        <Input label="Thứ tự hiển thị" type="number" value={form.sortOrder} onChange={e => setForm(f=>({...f,sortOrder:e.target.value}))} />

        {/* Image upload */}
        <div style={{ marginBottom:20 }}>
          <p style={{ fontSize:11, color:'#8B7D6B', letterSpacing:1, textTransform:'uppercase', marginBottom:10 }}>Ảnh danh mục</p>
          <div style={{ display:'flex', gap:16, alignItems:'flex-start', flexWrap:'wrap' }}>
            {/* Preview */}
            <div style={{ width:100, height:100, borderRadius:4, overflow:'hidden', border:'1px dashed #E5DDD4', background:'#FAF7F2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {imagePreview
                ? <img src={imagePreview} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                : <span style={{ fontSize:28, color:'#C9B99A' }}>🖼</span>
              }
            </div>
            {/* Upload button */}
            <div style={{ flex:1 }}>
              <label style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'9px 16px', border:'1px dashed #E5DDD4', borderRadius:4, cursor:'pointer', fontSize:13, color:'#8B7D6B', marginBottom:8 }}>
                📎 Chọn ảnh
                <input type="file" accept="image/*" style={{ display:'none' }} onChange={handleImageChange} />
              </label>
              {imageFile && <p style={{ fontSize:12, color:'#4A7C59', marginTop:4 }}>✓ {imageFile.name}</p>}
              {!imageFile && imagePreview && <p style={{ fontSize:11, color:'#9B8E82', marginTop:4 }}>Ảnh hiện tại. Chọn file mới để thay thế.</p>}
              <p style={{ fontSize:11, color:'#9B8E82', marginTop:6, lineHeight:1.5 }}>
                Khuyến nghị: ảnh vuông, tối thiểu 400×400px.<br/>JPG, PNG, WebP · Tối đa 5MB.
              </p>
            </div>
          </div>
        </div>

        <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, cursor:'pointer', marginBottom:22, color:'#3A2F25' }}>
          <input type="checkbox" checked={form.isActive} onChange={e => setForm(f=>({...f,isActive:e.target.checked}))} style={{ accentColor:'#B8952A' }}/>
          Hiển thị trên trang
        </label>
        <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
          <Btn variant="ghost" onClick={() => setModal(null)}>Huỷ</Btn>
          <Btn onClick={handleSave} loading={saving}>Lưu</Btn>
        </div>
      </Modal>

      <ConfirmDialog open={!!delConfirm} onClose={() => setDelConfirm(null)} onConfirm={handleDelete} loading={delLoading}
        title="Xoá danh mục" message={`Xoá danh mục "${delConfirm?.name}"?`} />
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   ADMIN USERS
════════════════════════════════════════════════════════════ */
export function AdminUsers() {
  const [users, setUsers]     = useState([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(1)
  const [keyword, setKeyword] = useState('')
  const LIMIT = 20

  const load = () => {
    setLoading(true)
    userAPI.getAll({ page, limit: LIMIT, keyword }).then(r => { setUsers(r.users); setTotal(r.total) }).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [page, keyword])

  const handleToggle = async (u) => {
    try { await userAPI.update(u._id, { isActive: !u.isActive }); toast.success(u.isActive ? 'Đã khoá' : 'Đã mở khoá'); load() }
    catch (e) { toast.error(e.message) }
  }

  return (
    <div>
      <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(22px,4vw,30px)', fontWeight:300, color:'#3A2F25', marginBottom:20 }}>Người Dùng</h1>
      <Card style={{ marginBottom:14, padding:'10px 14px' }}>
        <input value={keyword} onChange={e => { setKeyword(e.target.value); setPage(1) }}
          placeholder="🔍 Tên, email, SĐT..."
          style={{ width:'100%', border:'none', background:'transparent', outline:'none', fontSize:13, color:'#3A2F25' }}/>
      </Card>
      <Card style={{ padding:0 }}>
        {loading ? <div style={{ padding:32 }}><PageLoader /></div> : (
          <>
            <AdminTable headers={['Người dùng','SĐT','Mệnh','Vai trò','Ngày tạo','Trạng thái','']}>
              {users.map(u => (
                <tr key={u._id}>
                  <Td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:34, height:34, borderRadius:'50%', background:'#EDD5C0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:500, color:'#3A2F25', flexShrink:0 }}>{u.name?.[0]?.toUpperCase()}</div>
                      <div style={{ minWidth:0 }}>
                        <p style={{ fontSize:13, fontWeight:500, color:'#3A2F25', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:140 }}>{u.name}</p>
                        <p style={{ fontSize:11, color:'#9B8E82', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:140 }}>{u.email}</p>
                      </div>
                    </div>
                  </Td>
                  <Td style={{ color:'#8B7D6B', fontSize:12, whiteSpace:'nowrap' }}>{u.phone||'—'}</Td>
                  <Td>
                    {u.menh && <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, whiteSpace:'nowrap' }}><span style={{ width:8, height:8, borderRadius:'50%', background:MENH_COLORS[u.menh], display:'inline-block' }}/>{u.menh}</span>}
                  </Td>
                  <Td><span className={`badge ${u.role==='admin'?'badge-gold':'badge-muted'}`}>{u.role==='admin'?'Admin':'Khách'}</span></Td>
                  <Td style={{ color:'#9B8E82', fontSize:12, whiteSpace:'nowrap' }}>{fmtDate(u.createdAt)}</Td>
                  <Td>
                    <button onClick={() => handleToggle(u)}
                      style={{ fontSize:11, padding:'4px 10px', borderRadius:20, border:'none', cursor:'pointer', whiteSpace:'nowrap', background:u.isActive?'#D1FAE5':'#FEE2E2', color:u.isActive?'#065F46':'#991B1B' }}>
                      {u.isActive ? '✓ Hoạt động' : '✗ Đã khoá'}
                    </button>
                  </Td>
                  <Td><span style={{ fontSize:12, color:'#9B8E82' }}>#</span></Td>
                </tr>
              ))}
            </AdminTable>
            <div style={{ padding:'0 16px 8px' }}>
              <Pagination page={page} pages={Math.ceil(total / LIMIT)} onPage={setPage} />
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   ADMIN COUPONS
════════════════════════════════════════════════════════════ */
export function AdminCoupons() {
  const [coupons, setCoupons]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null)
  const [delConfirm, setDelConfirm] = useState(null)
  const [saving, setSaving]     = useState(false)
  const [delLoading, setDelLoading] = useState(false)
  const [form, setForm]         = useState({ code:'', type:'percent', value:'', minOrderValue:0, maxDiscount:'', usageLimit:'', endDate:'', isActive:true, description:'' })

  const load = () => { setLoading(true); couponAPI.adminGetAll().then(r => setCoupons(r.coupons)).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  useEffect(() => {
    if (modal && modal !== 'create') setForm({ code:modal.code, type:modal.type, value:modal.value, minOrderValue:modal.minOrderValue, maxDiscount:modal.maxDiscount||'', usageLimit:modal.usageLimit||'', endDate:modal.endDate?.slice(0,10), isActive:modal.isActive, description:modal.description||'' })
    else setForm({ code:'', type:'percent', value:'', minOrderValue:0, maxDiscount:'', usageLimit:'', endDate:'', isActive:true, description:'' })
  }, [modal])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type==='checkbox' ? e.target.checked : e.target.value }))

  const handleSave = async () => {
    if (!form.code || !form.value || !form.endDate) return toast.error('Vui lòng điền đầy đủ thông tin')
    setSaving(true)
    try {
      const data = { ...form, maxDiscount: form.maxDiscount||null, usageLimit: form.usageLimit||null }
      if (modal === 'create') await couponAPI.create(data)
      else await couponAPI.update(modal._id, data)
      toast.success(modal === 'create' ? 'Đã tạo mã' : 'Đã cập nhật'); setModal(null); load()
    } catch (e) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDelLoading(true)
    try { await couponAPI.delete(delConfirm._id); toast.success('Đã xoá'); setDelConfirm(null); load() }
    catch (e) { toast.error(e.message) }
    finally { setDelLoading(false) }
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, gap:12, flexWrap:'wrap' }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(22px,4vw,30px)', fontWeight:300, color:'#3A2F25' }}>Mã Giảm Giá</h1>
        <Btn onClick={() => setModal('create')}>+ Tạo mã</Btn>
      </div>
      <Card style={{ padding:0 }}>
        {loading ? <div style={{ padding:32 }}><PageLoader /></div> : (
          <AdminTable headers={['Mã','Loại','Giảm','Đơn tối thiểu','Đã dùng','Hết hạn','Trạng thái','']}>
            {coupons.map(c => (
              <tr key={c._id}>
                <Td><span style={{ fontFamily:'monospace', fontWeight:600, color:'#3A2F25', background:'#F5F0E8', padding:'2px 8px', borderRadius:2, whiteSpace:'nowrap' }}>{c.code}</span></Td>
                <Td style={{ color:'#8B7D6B', fontSize:12 }}>{c.type==='percent'?'%':'Cố định'}</Td>
                <Td style={{ fontWeight:500, color:'#B8952A', whiteSpace:'nowrap' }}>{c.type==='percent'?`${c.value}%`:fmt(c.value)}</Td>
                <Td style={{ color:'#8B7D6B', fontSize:12, whiteSpace:'nowrap' }}>{fmt(c.minOrderValue)}</Td>
                <Td style={{ color:'#8B7D6B' }}>{c.usedCount}{c.usageLimit?` / ${c.usageLimit}`:''}</Td>
                <Td style={{ color:new Date(c.endDate)<new Date()?'#C44A4A':'#9B8E82', fontSize:12, whiteSpace:'nowrap' }}>{fmtDate(c.endDate)}</Td>
                <Td><span style={{ fontSize:12, color:c.isActive?'#4A7C59':'#C44A4A' }}>{c.isActive?'✓ Đang dùng':'✗ Tắt'}</span></Td>
                <Td>
                  <div style={{ display:'flex', gap:6 }}>
                    <Btn size="sm" variant="ghost" onClick={() => setModal(c)}>Sửa</Btn>
                    <Btn size="sm" variant="danger" onClick={() => setDelConfirm(c)}>Xoá</Btn>
                  </div>
                </Td>
              </tr>
            ))}
          </AdminTable>
        )}
      </Card>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal==='create'?'Tạo Mã Giảm Giá':'Sửa Mã Giảm Giá'} width={500}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'0 16px' }}>
          <Input label="Mã *" value={form.code} onChange={set('code')} placeholder="SALE20" />
          <Select label="Loại giảm" value={form.type} onChange={set('type')}>
            <option value="percent">Phần trăm (%)</option>
            <option value="fixed">Số tiền cố định</option>
          </Select>
          <Input label={form.type==='percent'?'Giảm (%) *':'Số tiền (₫) *'} type="number" value={form.value} onChange={set('value')} />
          <Input label="Đơn tối thiểu (₫)" type="number" value={form.minOrderValue} onChange={set('minOrderValue')} />
          {form.type === 'percent' && <Input label="Giảm tối đa (₫)" type="number" value={form.maxDiscount} onChange={set('maxDiscount')} placeholder="Không giới hạn" />}
          <Input label="Giới hạn lượt dùng" type="number" value={form.usageLimit} onChange={set('usageLimit')} placeholder="Không giới hạn" />
          <div style={{ gridColumn:'1 / -1' }}><Input label="Ngày hết hạn *" type="date" value={form.endDate} onChange={set('endDate')} /></div>
          <div style={{ gridColumn:'1 / -1' }}><Input label="Mô tả" value={form.description} onChange={set('description')} /></div>
        </div>
        <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, cursor:'pointer', marginBottom:20, color:'#3A2F25' }}>
          <input type="checkbox" checked={form.isActive} onChange={set('isActive')} style={{ accentColor:'#B8952A' }}/>
          Kích hoạt mã
        </label>
        <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
          <Btn variant="ghost" onClick={() => setModal(null)}>Huỷ</Btn>
          <Btn onClick={handleSave} loading={saving}>Lưu</Btn>
        </div>
      </Modal>
      <ConfirmDialog open={!!delConfirm} onClose={() => setDelConfirm(null)} onConfirm={handleDelete} loading={delLoading}
        title="Xoá mã giảm giá" message={`Xoá mã "${delConfirm?.code}"?`} />
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   SHARED: TABLE + TD
════════════════════════════════════════════════════════════ */
export function AdminTable({ headers, children }) {
  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 480 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #E5DDD4' }}>
            {headers.map(h => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: '#9B8E82', fontWeight: 400, whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function Td({ children, style = {} }) {
  return (
    <td style={{ padding: '12px 14px', borderBottom: '1px solid #F5F0E8', verticalAlign: 'middle', ...style }}>
      {children}
    </td>
  )
}