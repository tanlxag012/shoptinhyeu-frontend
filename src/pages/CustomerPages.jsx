import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { productAPI, categoryAPI, orderAPI, couponAPI, authAPI } from '../api'
import { useAuth, useCart } from '../context'
import { useScrollReveal } from '../hooks'
import { fmt, fmtDateTime, fmtDate, ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHODS, getImgUrl, MENH_COLORS } from '../utils'
import { ProductCard, ProductGrid, FilterSidebar, FilterContent, SortBar } from '../components/product'
import MediaGallery from '../components/product/MediaGallery'
import { CartItem, CartSummary } from '../components/cart'
import { Btn, Input, Select, Textarea, Spinner, PageLoader, Modal, Pagination, EmptyState, SectionHeader, Card, ConfirmDialog } from '../components/common'
import toast from 'react-hot-toast'
import AddressSelect from '../components/common/AddressSelect'
import Logo from '../components/common/Logo'

/* ════════════════════════════════════════════════════════════
   HOME PAGE
════════════════════════════════════════════════════════════ */
export function HomePage() {
  const [featured, setFeatured]       = useState([])
  const [newProducts, setNewProducts] = useState([])
  const [categories, setCategories]   = useState([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    Promise.all([
      productAPI.getAll({ isFeatured: true, limit: 8 }),
      productAPI.getAll({ isNew: true, limit: 4 }),
      categoryAPI.getAll(),
    ]).then(([f, n, c]) => {
      setFeatured(f.products); setNewProducts(n.products); setCategories(c.categories)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ paddingTop: 64 }}>
      <HeroSection />

      {/* Featured */}
      <section className="section" style={{ background:'#FFFDF9' }}>
        <div className="container">
          <SectionHeader label="Nổi Bật" title="Đồ Chơi Tình Dục" subtitle="Được tuyển chọn kỹ lưỡng, hài hòa ngũ hành, nâng cao vận khí." />
          <ProductGrid products={featured} loading={loading} cols={4} />
          <div style={{ textAlign:'center', marginTop:36 }}>
            <Link to="/products"><Btn variant="secondary">Xem tất cả sản phẩm →</Btn></Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section" style={{ background:'#FAF7F2' }}>
        <div className="container">
          <SectionHeader label="Danh Mục" title="Bộ Sưu Tập" />
          <div className="cat-grid">
            {loading
              ? Array(5).fill(0).map((_,i) => <div key={i} className="skeleton" style={{ aspectRatio:'.78', borderRadius:4 }}/>)
              : categories.slice(0,5).map((c,i) => <CategoryCard key={c._id} cat={c} delay={i*80}/>)
            }
          </div>
        </div>
      </section>

      {/* New arrivals */}
      {!loading && newProducts.length > 0 && (
        <section className="section" style={{ background:'#FFFDF9' }}>
          <div className="container">
            <SectionHeader label="Mới Về" title="Hàng Mới Nhất" />
            <ProductGrid products={newProducts} loading={false} cols={4} />
          </div>
        </section>
      )}

      <NguHanhSection />
    </div>
  )
}

function HeroSection() {
  // const [hov, setHov] = useState(false)
  // return (
  //   <section style={{ minHeight:'92vh', position:'relative', display:'flex', alignItems:'center', overflow:'hidden' }}>
  //     <div style={{ position:'absolute', inset:0, background:'linear-gradient(130deg,#221810 0%,#3A2615 40%,#5C3A1E 70%,#7A4E2A 100%)' }}/>
  //     <div style={{ position:'absolute', inset:0, opacity:.05, backgroundImage:'radial-gradient(circle at 2px 2px,#fff 1px,transparent 0)', backgroundSize:'28px 28px' }}/>
  //     <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(184,149,42,.22) 0%,transparent 70%)', right:'10%', top:'50%', transform:'translateY(-50%)' }}/>

  //     <div className="container" style={{ position:'relative', zIndex:2, width:'100%' }}>
  //       <div className="hero-content" style={{ maxWidth:600 }}>
  //         <div style={{ fontSize:11, letterSpacing:4, textTransform:'uppercase', color:'#D4AF5A', marginBottom:20, display:'flex', alignItems:'center', gap:12 }}>
  //           <span style={{ width:28, height:1, background:'#D4AF5A', display:'block' }}/>Bộ Sưu Tập Mới 2025
  //         </div>
  //         <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(40px,6vw,76px)', fontWeight:300, lineHeight:1.1, color:'#FAF7F2', marginBottom:20 }}>
  //           Vòng đá<br/><em style={{ fontStyle:'italic', color:'#D4AF5A' }}>phong thủy</em><br/>thuần thiên nhiên
  //         </h1>
  //         <p style={{ fontSize:15, lineHeight:1.85, color:'rgba(255,255,255,.62)', marginBottom:36, maxWidth:400 }}>
  //           Mỗi viên đá là một hành trình — từ lòng đất đến tay bạn. 4EM mang đến những vòng tay hài hòa ngũ hành.
  //         </p>
  //         <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
  //           <Link to="/products"><Btn size="lg">Mua ngay →</Btn></Link>
  //           <Link to="/products?isFeatured=true">
  //             <button style={{ padding:'13px 28px', borderRadius:2, fontSize:12, letterSpacing:2, textTransform:'uppercase', border:'1px solid rgba(255,255,255,.3)', background:'transparent', color:'rgba(255,255,255,.75)', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
  //               Bộ sưu tập
  //             </button>
  //           </Link>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Floating bracelet */}
  //     <div className="hero-visual" style={{ position:'absolute', right:'18%', top:'50%', transform:'translateY(-50%)', zIndex:2 }}
  //       onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
  //       <div style={{ width:280, height:280, borderRadius:'50%', border:'1px solid rgba(184,149,42,.35)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', animation:'float 2s ease-in-out infinite' }}>
  //         <div style={{ position:'absolute', inset:-24, borderRadius:'50%', border:'1px solid rgba(184,149,42,.12)' }}/>
  //         <div style={{ width:180, height:180, borderRadius:'50%', background:'radial-gradient(135deg,rgba(184,149,42,.15),rgba(74,53,32,.5))', display:'flex', alignItems:'center', justifyContent:'center', transition:'transform .3s', transform: hov ? 'scale(1.06)' : 'scale(1)' }}>
  //           <span style={{ fontSize:68, filter:'drop-shadow(0 8px 18px rgba(0,0,0,.5))' }}>📿</span>
  //         </div>
  //       </div>
  //     </div>
  //   </section>
  // )
}

function CategoryCard({ cat, delay }) {
  const [hov, setHov]   = useState(false)
  const [ref, vis]      = useScrollReveal()
  const [imgErr, setImgErr] = useState(false)

  // Fallback emoji nếu không có ảnh
  const icons = { Moonstone:'🌙', Aquamarine:'💎', 'Jade & Ngọc':'🍃', Garnet:'🔴', Citrine:'✨', 'Thạch Anh':'💎' }
  const fallbackIcon = icons[cat.name] || '📿'
  const hasImage = cat.image && !imgErr

  return (
    <Link to={`/products?category=${cat._id}`} ref={ref}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        aspectRatio: '.78', borderRadius: 4, overflow: 'hidden',
        position: 'relative', display: 'block', border: '1px solid #E5DDD4',
        opacity:    vis ? 1 : 0,
        transform:  vis ? (hov ? 'scale(1.02)' : 'scale(1)') : 'translateY(20px)',
        transition: `all .3s, opacity .6s ${delay}ms, transform .6s ${delay}ms`,
        background: '#EDD5C0',
      }}>

      {/* ── Ảnh thật từ Cloudinary ── */}
      {hasImage ? (
        <img
          src={cat.image}
          alt={cat.name}
          onError={() => setImgErr(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform .5s',
            transform: hov ? 'scale(1.06)' : 'scale(1)',
          }}
        />
      ) : (
        /* ── Fallback: gradient + emoji ── */
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg,#E8DCC8,#CFC0A0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 'clamp(36px,5vw,52px)',
          transition: 'transform .5s',
          transform: hov ? 'scale(1.06)' : 'scale(1)',
        }}>
          {fallbackIcon}
        </div>
      )}

      {/* ── Gradient overlay ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(28,24,20,.75) 0%, rgba(28,24,20,.15) 50%, transparent 100%)',
      }}/>

      {/* ── Label ── */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 12px' }}>
        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: 16, color: 'white', display: 'block', marginBottom: 3 }}>
          {cat.name}
        </span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,.65)', letterSpacing: 1 }}>
          {cat.productCount || 0} sản phẩm
        </span>
      </div>
    </Link>
  )
}

function NguHanhSection() {
  // const hanh = [
  //   { name:'Kim',  icon:'⚙️', bg:'linear-gradient(135deg,#F5F0E8,#E4D8C0)', desc:'Bạch thạch anh, mã não trắng' },
  //   { name:'Mộc',  icon:'🌿', bg:'linear-gradient(135deg,#EAF0E8,#D0E4CA)', desc:'Ngọc bích, diopside, jade' },
  //   { name:'Thuỷ', icon:'💧', bg:'linear-gradient(135deg,#E8EEF5,#C4D8EC)', desc:'Aquamarine, moonstone' },
  //   { name:'Hoả',  icon:'🔥', bg:'linear-gradient(135deg,#F5EAE8,#ECC4BC)', desc:'Garnet, ruby, mã não đỏ' },
  //   { name:'Thổ',  icon:'🌍', bg:'linear-gradient(135deg,#F0EDE8,#E0D0B8)', desc:'Citrine, hổ phách' },
  // ]
  // return (
  //   <section className="section" style={{ background:'#FAF7F2' }}>
  //     <div className="container">
  //       <SectionHeader label="Phong Thủy" title="Chọn Theo Ngũ Hành" subtitle="Chọn vòng đá phù hợp mệnh để tối ưu hoá năng lượng." />
  //       <div className="nguhanh-grid">
  //         {hanh.map((h, i) => {
  //           const [hov, setHov] = useState(false)
  //           return (
  //             <Link to={`/products?menh=${h.name}`} key={h.name}
  //               onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
  //               style={{ padding:'clamp(16px,3vw,28px) 16px 22px', borderRadius:4, textAlign:'center', border:'1px solid #E5DDD4', background:h.bg, display:'block', transform: hov ? 'translateY(-5px)' : 'none', boxShadow: hov ? '0 14px 30px rgba(0,0,0,.08)' : 'none', transition:'all .3s' }}>
  //               <span style={{ fontSize:'clamp(28px,4vw,36px)', display:'block', marginBottom:10 }}>{h.icon}</span>
  //               <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(18px,2.5vw,22px)', fontWeight:400, color:'#3A2F25', marginBottom:6 }}>{h.name}</h3>
  //               <p style={{ fontSize:12, color:'#9B8E82', lineHeight:1.6 }}>{h.desc}</p>
  //             </Link>
  //           )
  //         })}
  //       </div>
  //     </div>
  //   </section>
  // )
}

/* ════════════════════════════════════════════════════════════
   PRODUCTS PAGE
════════════════════════════════════════════════════════════ */
export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts]   = useState([])
  const [total, setTotal]         = useState(0)
  const [loading, setLoading]     = useState(true)
  const [categories, setCategories] = useState([])
  const [page, setPage]           = useState(1)
  const [mobileFilter, setMobileFilter] = useState(false)
  const LIMIT = 12

  const filters = {
    category: searchParams.get('category') || '',
    menh:     searchParams.get('menh') || '',
    gender:   searchParams.get('gender') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    isNew:    searchParams.get('isNew') || '',
    isFeatured: searchParams.get('isFeatured') || '',
    keyword:  searchParams.get('keyword') || '',
  }
  const sort = searchParams.get('sort') || '-createdAt'

  useEffect(() => { categoryAPI.getAll().then(r => setCategories(r.categories)) }, [])

  useEffect(() => {
    setLoading(true)
    const params = { ...filters, sort, page, limit: LIMIT }
    Object.keys(params).forEach(k => !params[k] && delete params[k])
    productAPI.getAll(params).then(r => { setProducts(r.products); setTotal(r.total) }).finally(() => setLoading(false))
  }, [searchParams, page])

  const changeFilter = (key, val) => {
    if (key === 'reset') { setSearchParams({}); setPage(1); return }
    const next = new URLSearchParams(searchParams)
    if (val) next.set(key, val); else next.delete(key)
    setSearchParams(next); setPage(1)
  }

  return (
    <div style={{ paddingTop:64 }}>
      <div style={{ background:'#FAF7F2', padding:'28px 0', borderBottom:'1px solid #E5DDD4' }}>
        <div className="container">
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(26px,4vw,36px)', fontWeight:300, color:'#3A2F25' }}>
            {filters.keyword ? `Kết quả: "${filters.keyword}"` : 'Tất Cả Sản Phẩm'}
          </h1>
        </div>
      </div>

      <div className="container" style={{ padding:'32px 24px' }}>

        {/* ── Mobile filter drawer ── */}
        {mobileFilter && (
          <>
            {/* Overlay */}
            <div onClick={() => setMobileFilter(false)}
              style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:399 }}/>

            {/* Drawer */}
            <div style={{
              position:'fixed', top:0, left:0, bottom:0, width:'min(320px,90vw)',
              background:'#FFFDF9', zIndex:400,
              display:'flex', flexDirection:'column',
              boxShadow:'4px 0 20px rgba(0,0,0,.15)',
              animation:'slideInLeft .25s ease',
            }}>
              {/* Drawer header */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid #E5DDD4', flexShrink:0 }}>
                <span style={{ fontSize:16, fontWeight:500, color:'#3A2F25' }}>Bộ lọc</span>
                <button onClick={() => setMobileFilter(false)} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#9B8E82', lineHeight:1 }}>✕</button>
              </div>

              {/* Scrollable filter content */}
              <div style={{ flex:1, overflowY:'auto', padding:'8px 0 80px' }}>
                <FilterContent
                  filters={filters}
                  categories={categories}
                  onChange={(k,v) => {
                    changeFilter(k, v)
                    if (k === 'reset') setMobileFilter(false)
                  }}
                />
              </div>

              {/* Sticky bottom button */}
              <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 16px', background:'#FFFDF9', borderTop:'1px solid #E5DDD4' }}>
                <Btn full onClick={() => setMobileFilter(false)}>
                  Xem {total} sản phẩm
                </Btn>
              </div>
            </div>
          </>
        )}

        <div className="products-layout">
          {/* Desktop sidebar */}
          <FilterSidebar filters={filters} onChange={changeFilter} categories={categories} />

          {/* Products */}
          <div style={{ flex:1, minWidth:0 }}>
            <SortBar total={total} sort={sort} onSort={v => changeFilter('sort',v)} onFilterClick={() => setMobileFilter(true)} />
            {!loading && products.length === 0
              ? <EmptyState icon="🔍" title="Không tìm thấy sản phẩm" desc="Thử thay đổi bộ lọc hoặc từ khoá" action={<Btn onClick={() => changeFilter('reset')}>Xoá bộ lọc</Btn>}/>
              : <ProductGrid products={products} loading={loading} cols={3} />
            }
            <Pagination page={page} pages={Math.ceil(total/LIMIT)} onPage={p => { setPage(p); window.scrollTo(0,260) }} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   PRODUCT DETAIL PAGE
════════════════════════════════════════════════════════════ */
export function ProductDetailPage() {
  const slug = window.location.pathname.split('/').pop()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty]         = useState(1)
  const [tab, setTab]         = useState('desc')
  const [rating, setRating]   = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { addItem } = useCart()
  const { user }    = useAuth()

  useEffect(() => {
    setLoading(true)
    window.scrollTo(0, 0)
    productAPI.getOne(slug).then(r => setData(r)).finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div style={{ paddingTop:64 }}><PageLoader/></div>
  if (!data?.product) return <div style={{ paddingTop:64 }}><EmptyState icon="❌" title="Không tìm thấy sản phẩm"/></div>

  const { product, related } = data
  const price  = product.salePrice || product.price
  const onSale = product.salePrice && product.salePrice < product.price
  const media  = product.media || []

  const handleAddCart = () => { addItem({ ...product, media }, qty); toast.success('Đã thêm vào giỏ hàng!') }

  const handleReview = async () => {
    if (!comment.trim()) return toast.error('Vui lòng nhập nội dung đánh giá')
    setSubmitting(true)
    try {
      await productAPI.addReview(product._id, { rating, comment })
      toast.success('Cảm ơn bạn! Đánh giá đang chờ duyệt.')
      setComment(''); setRating(5)
    } catch (e) { toast.error(e.message || 'Lỗi gửi đánh giá') }
    finally { setSubmitting(false) }
  }

  return (
    <div style={{ paddingTop:64 }}>
      <div className="container" style={{ padding:'40px 24px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize:12, color:'#9B8E82', marginBottom:28, display:'flex', gap:8, flexWrap:'wrap' }}>
          <Link to="/">Trang chủ</Link> /
          <Link to="/products">Sản phẩm</Link> /
          <span style={{ color:'#3A2F25' }}>{product.name}</span>
        </div>

        {/* Main grid */}
        <div className="product-detail-grid" style={{ marginBottom:56 }}>
          {/* Gallery */}
          <div>
            <MediaGallery media={media} />
          </div>

          {/* Info */}
          <div>
            <div style={{ display:'flex', gap:8, marginBottom:10, flexWrap:'wrap' }}>
              {product.isNew  && <span className="badge badge-gold">New</span>}
              {onSale         && <span className="badge badge-sale">Sale {product.discountPercent}%</span>}
              {media.some(m => m.type==='video') && <span className="badge badge-muted">▶ Có video</span>}
            </div>

            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(26px,4vw,36px)', fontWeight:300, color:'#3A2F25', lineHeight:1.2, marginBottom:14 }}>{product.name}</h1>

            {/* Rating */}
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18, flexWrap:'wrap' }}>
              <StarRow rating={product.avgRating}/>
              <span style={{ fontSize:12, color:'#9B8E82' }}>({product.numReviews} đánh giá)</span>
              <span style={{ fontSize:12, color:'#9B8E82' }}>· {product.views} lượt xem</span>
            </div>

            {/* Price */}
            <div style={{ marginBottom:22 }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(28px,4vw,36px)', fontWeight:600, color:'#B8952A' }}>{fmt(price)}</span>
              {onSale && <span style={{ fontSize:15, color:'#9B8E82', textDecoration:'line-through', marginLeft:12 }}>{fmt(product.price)}</span>}
            </div>

            {/* Attributes */}
            <div style={{ borderTop:'1px solid #E5DDD4', borderBottom:'1px solid #E5DDD4', padding:'18px 0', marginBottom:22 }}>
              <AttrRow label="Loại đá"    value={product.stoneType}/>
              <AttrRow label="Xuất xứ"    value={product.origin}/>
              <AttrRow label="Kích thước" value={product.size}/>
              <AttrRow label="Chất liệu"  value={product.material}/>
              <AttrRow label="Giới tính"  value={product.gender}/>
              <AttrRow label="Tình trạng" value={product.stock > 0 ? `Còn ${product.stock} cái` : 'Hết hàng'} warn={product.stock===0}/>
              {product.menh?.length > 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, flexWrap:'wrap' }}>
                  <span style={{ fontSize:12, color:'#9B8E82', width:90, flexShrink:0 }}>Hợp mệnh</span>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {product.menh.map(m => (
                      <span key={m} style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'#3A2F25', background:'#FAF7F2', padding:'3px 10px', borderRadius:20, border:'1px solid #E5DDD4' }}>
                        <span style={{ width:8, height:8, borderRadius:'50%', background:MENH_COLORS[m], display:'inline-block' }}/>{m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Qty + Add */}
            {product.stock > 0 ? (
              <div style={{ display:'flex', gap:10, marginBottom:14, flexWrap:'wrap' }}>
                <div style={{ display:'flex', alignItems:'center', border:'1px solid #E5DDD4', borderRadius:2 }}>
                  <button onClick={() => setQty(q=>Math.max(1,q-1))} style={{ width:40, height:46, background:'none', border:'none', cursor:'pointer', fontSize:18 }}>−</button>
                  <span style={{ width:40, textAlign:'center', fontSize:15 }}>{qty}</span>
                  <button onClick={() => setQty(q=>Math.min(product.stock,q+1))} style={{ width:40, height:46, background:'none', border:'none', cursor:'pointer', fontSize:18 }}>+</button>
                </div>
                <div style={{ flex:1, minWidth:160 }}>
                  <Btn size="lg" onClick={handleAddCart} full>🛍 Thêm vào giỏ hàng</Btn>
                </div>
              </div>
            ) : (
              <div style={{ padding:14, background:'#FEE2E2', borderRadius:4, color:'#991B1B', fontSize:13, marginBottom:16 }}>Sản phẩm tạm hết hàng</div>
            )}

            {/* Short desc */}
            {product.shortDesc && <p style={{ fontSize:14, color:'#8B7D6B', lineHeight:1.8, marginTop:12 }}>{product.shortDesc}</p>}
          </div>
        </div>

        {/* Tabs: desc + reviews */}
        <div style={{ marginBottom:56 }}>
          <div style={{ display:'flex', borderBottom:'1px solid #E5DDD4', marginBottom:24, overflowX:'auto' }}>
            {[{ k:'desc', l:'Mô tả' }, { k:'reviews', l:`Đánh giá (${product.numReviews})` }].map(t => (
              <button key={t.k} onClick={() => setTab(t.k)}
                style={{ padding:'12px 24px', fontSize:13, letterSpacing:1, border:'none', background:'none', cursor:'pointer', color: tab===t.k ? '#3A2F25' : '#9B8E82', borderBottom:`2px solid ${tab===t.k ? '#B8952A' : 'transparent'}`, marginBottom:-1, whiteSpace:'nowrap', flexShrink:0 }}>
                {t.l}
              </button>
            ))}
          </div>

          {tab === 'desc' && (
            <div style={{ fontSize:15, lineHeight:1.85, color:'#3A2F25', maxWidth:720, whiteSpace:'pre-line' }}>
              {product.description || 'Chưa có mô tả.'}
            </div>
          )}

          {tab === 'reviews' && (
            <div>
              {product.reviews?.filter(r => r.isApproved).length === 0 && (
                <p style={{ color:'#9B8E82', fontSize:14, marginBottom:24 }}>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
              )}
              {product.reviews?.filter(r => r.isApproved).map(r => (
                <div key={r._id} style={{ padding:'18px 0', borderBottom:'1px solid #F5F0E8' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8, flexWrap:'wrap' }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:'#EDD5C0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:500, color:'#3A2F25', flexShrink:0 }}>{r.name?.[0]}</div>
                    <div>
                      <p style={{ fontSize:13, fontWeight:500, color:'#3A2F25' }}>{r.name}</p>
                      <StarRow rating={r.rating} size={12}/>
                    </div>
                    <span style={{ marginLeft:'auto', fontSize:11, color:'#9B8E82' }}>{fmtDate(r.createdAt)}</span>
                  </div>
                  <p style={{ fontSize:13, color:'#8B7D6B', lineHeight:1.7, paddingLeft:46 }}>{r.comment}</p>
                </div>
              ))}

              {user ? (
                <div style={{ marginTop:32, background:'#FFFDF9', border:'1px solid #E5DDD4', borderRadius:4, padding:24 }}>
                  <h4 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:400, marginBottom:16, color:'#3A2F25' }}>Viết đánh giá</h4>
                  <div style={{ marginBottom:14 }}>
                    <p style={{ fontSize:12, color:'#9B8E82', letterSpacing:1, textTransform:'uppercase', marginBottom:8 }}>Đánh giá của bạn</p>
                    <div style={{ display:'flex', gap:6 }}>
                      {[1,2,3,4,5].map(s => (
                        <button key={s} onClick={() => setRating(s)} style={{ fontSize:26, background:'none', border:'none', cursor:'pointer', opacity: s<=rating ? 1 : .3 }}>★</button>
                      ))}
                    </div>
                  </div>
                  <Textarea label="Nhận xét" value={comment} onChange={e => setComment(e.target.value)} placeholder="Chia sẻ cảm nhận của bạn..."/>
                  <Btn onClick={handleReview} loading={submitting}>Gửi đánh giá</Btn>
                </div>
              ) : (
                <div style={{ marginTop:24, padding:20, background:'#FAF7F2', borderRadius:4, textAlign:'center' }}>
                  <p style={{ color:'#9B8E82', marginBottom:12 }}>Đăng nhập để viết đánh giá</p>
                  <Link to="/login"><Btn>Đăng nhập</Btn></Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related */}
        {related?.length > 0 && (
          <div>
            <SectionHeader label="Gợi ý" title="Sản Phẩm Liên Quan" center={false}/>
            <ProductGrid products={related} loading={false} cols={4}/>
          </div>
        )}
      </div>
    </div>
  )
}

function AttrRow({ label, value, warn }) {
  if (!value) return null
  return (
    <div style={{ display:'flex', gap:8, marginBottom:8 }}>
      <span style={{ fontSize:12, color:'#9B8E82', width:90, flexShrink:0 }}>{label}</span>
      <span style={{ fontSize:13, color: warn ? '#C44A4A' : '#3A2F25' }}>{value}</span>
    </div>
  )
}

function StarRow({ rating, size=14 }) {
  return (
    <div style={{ display:'flex', gap:2 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ fontSize:size, color: s<=Math.round(rating) ? '#B8952A' : '#E5DDD4' }}>★</span>
      ))}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   CART PAGE
════════════════════════════════════════════════════════════ */
export function CartPage() {
  const { items, clearCart, subtotal } = useCart()
  const [discount, setDiscount]        = useState(0)
  const [couponCode, setCouponCode]    = useState('')
  const shippingFee = subtotal >= 1500000 ? 0 : 30000

  const handleCoupon = async (code) => {
    try {
      const res = await couponAPI.validate(code, subtotal)
      setDiscount(res.discount); setCouponCode(code)
      toast.success(`Áp dụng thành công! Giảm ${fmt(res.discount)}`)
    } catch (e) { toast.error(e.message || 'Mã không hợp lệ') }
  }

  if (items.length === 0) return (
    <div style={{ paddingTop:64 }}>
      <div className="container" style={{ padding:'64px 24px' }}>
        <EmptyState icon="🛒" title="Giỏ hàng trống" desc="Hãy thêm sản phẩm vào giỏ hàng"
          action={<Link to="/products"><Btn>Tiếp tục mua sắm</Btn></Link>}/>
      </div>
    </div>
  )

  return (
    <div style={{ paddingTop:64 }}>
      <div className="container" style={{ padding:'40px 24px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:12 }}>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(26px,4vw,36px)', fontWeight:300, color:'#3A2F25' }}>Giỏ Hàng ({items.length})</h1>
          <button onClick={clearCart} style={{ fontSize:12, color:'#9B8E82', background:'none', border:'none', cursor:'pointer', letterSpacing:1 }}>Xoá tất cả</button>
        </div>
        <div className="cart-layout">
          <div>{items.map(item => <CartItem key={item.product} item={item}/>)}</div>
          <div>
            <CartSummary subtotal={subtotal} shippingFee={shippingFee} discountAmount={discount} couponCode={couponCode} onCoupon={handleCoupon}/>
            <div style={{ marginTop:14 }}>
              <Link to="/checkout"><Btn full size="lg">Tiến hành đặt hàng →</Btn></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   CHECKOUT PAGE
════════════════════════════════════════════════════════════ */
export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const { user }    = useAuth()
  const navigate    = useNavigate()
  const [loading, setLoading]       = useState(false)
  const [discount, setDiscount]     = useState(0)
  const [couponCode, setCouponCode] = useState('')
  const [errors, setErrors]         = useState({})
  const shippingFee = subtotal >= 1500000 ? 0 : 30000

  const [form, setForm] = useState({
    fullName: user?.name || '', phone: user?.phone || '',
    // tên hiển thị (gửi lên backend)
    province: '', district: '', ward: '',
    // code nội bộ để load cấp dưới
    provinceCode: '', districtCode: '', wardCode: '',
    street: '', paymentMethod: 'COD', note: '',
  })

  if (!items.length) { navigate('/cart'); return null }

  // Generic setter cho text input
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  // Setter cho AddressSelect (nhận key + value)
  const setAddr = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Vui lòng nhập họ tên'
    if (!form.phone.trim())    e.phone    = 'Vui lòng nhập số điện thoại'
    if (!form.province)        e.province = 'Vui lòng chọn tỉnh / thành phố'
    if (!form.district)        e.district = 'Vui lòng chọn quận / huyện'
    if (!form.ward)            e.ward     = 'Vui lòng chọn phường / xã'
    if (!form.street.trim())   e.street   = 'Vui lòng nhập địa chỉ cụ thể'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const res = await orderAPI.create({
        items: items.map(i => ({ product: i.product, quantity: i.quantity })),
        shippingAddress: {
          fullName: form.fullName, phone: form.phone,
          province: form.province, district: form.district,
          ward: form.ward, street: form.street,
        },
        paymentMethod: form.paymentMethod,
        note: form.note,
        couponCode: couponCode || undefined,
        guestInfo: !user ? { name: form.fullName, phone: form.phone } : undefined,
      })
      clearCart()
      navigate(`/order-success/${res.order._id}`)
    } catch (e) { toast.error(e.message || 'Đặt hàng thất bại') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ paddingTop: 64 }}>
      <div className="container" style={{ padding: '40px 24px' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(26px,4vw,36px)', fontWeight: 300, color: '#3A2F25', marginBottom: 32 }}>Đặt Hàng</h1>
        <div className="checkout-layout">
          <div>
            <Card style={{ marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 400, color: '#3A2F25', marginBottom: 20 }}>Thông Tin Giao Hàng</h3>

              {/* Họ tên + SĐT */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '0 16px' }}>
                <Input label="Họ và tên *"     value={form.fullName} onChange={set('fullName')} placeholder="Nguyễn Văn A"   error={errors.fullName} />
                <Input label="Số điện thoại *" value={form.phone}    onChange={set('phone')}    placeholder="0901 234 567" error={errors.phone} />
              </div>

              {/* Địa chỉ dropdown */}
              <AddressSelect
                value={form}
                onChange={setAddr}
                errors={{ province: errors.province, district: errors.district, ward: errors.ward }}
              />

              {/* Số nhà / đường */}
              <Input
                label="Địa chỉ cụ thể (số nhà, tên đường) *"
                value={form.street}
                onChange={set('street')}
                placeholder="123 Đường Lê Lợi"
                error={errors.street}
              />

              <Textarea label="Ghi chú" value={form.note} onChange={set('note')} placeholder="Ghi chú cho shipper (tuỳ chọn)..." />
            </Card>

            <Card>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 400, color: '#3A2F25', marginBottom: 20 }}>Phương Thức Thanh Toán</h3>
              {Object.entries(PAYMENT_METHODS).map(([k, v]) => (
                <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', marginBottom: 8, border: `1px solid ${form.paymentMethod === k ? '#B8952A' : '#E5DDD4'}`, borderRadius: 4, cursor: 'pointer', background: form.paymentMethod === k ? '#FFF8EE' : '#FFFDF9', transition: 'all .2s' }}>
                  <input type="radio" name="payment" value={k} checked={form.paymentMethod === k} onChange={set('paymentMethod')} style={{ accentColor: '#B8952A' }} />
                  <span style={{ fontSize: 14, color: '#3A2F25' }}>{v}</span>
                </label>
              ))}
            </Card>
          </div>

          {/* Right col */}
          <div>
            <Card style={{ marginBottom: 14 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 400, color: '#3A2F25', marginBottom: 14 }}>Sản phẩm ({items.length})</h3>
              {items.map(item => (
                <div key={item.product} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <img src={item.image || 'https://via.placeholder.com/52'} alt={item.name} style={{ width: 52, height: 52, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, color: '#3A2F25', lineHeight: 1.4 }}>{item.name}</p>
                    <p style={{ fontSize: 11, color: '#9B8E82' }}>x{item.quantity}</p>
                  </div>
                  <p style={{ fontSize: 13, color: '#3A2F25', fontWeight: 500, flexShrink: 0 }}>{fmt(item.price * item.quantity)}</p>
                </div>
              ))}
            </Card>
            <CartSummary subtotal={subtotal} shippingFee={shippingFee} discountAmount={discount} couponCode={couponCode}
              onCoupon={async code => {
                const res = await couponAPI.validate(code, subtotal)
                setDiscount(res.discount); setCouponCode(code)
                toast.success(`Giảm ${fmt(res.discount)}`)
              }} />
            <Btn full size="lg" onClick={handleSubmit} loading={loading} style={{ marginTop: 14 }}>
              Xác nhận đặt hàng →
            </Btn>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   ORDER SUCCESS
════════════════════════════════════════════════════════════ */
export function OrderSuccessPage() {
  // const orderId = window.location.pathname.split('/').pop()
  // const [order, setOrder] = useState(null)
  // useEffect(() => { orderAPI.getOne(orderId).then(r => setOrder(r.order)).catch(()=>{}) }, [orderId])
  return (
    <div style={{ paddingTop:64 }}>
      <div className="container" style={{ padding:'72px 24px', textAlign:'center', maxWidth:560 }}>
        <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(30px,4vw,40px)', fontWeight:300, color:'#3A2F25', marginBottom:12 }}>Đặt hàng thành công!</h1>
        <p style={{ color:'#8B7D6B', fontSize:15, lineHeight:1.8, marginBottom:8 }}>Cảm ơn bạn đã tin tưởng 4EM.</p>
        {/* {order && <p style={{ fontSize:14, color:'#9B8E82', marginBottom:32 }}>Mã đơn: <strong style={{ color:'#3A2F25' }}>{order.orderCode}</strong></p>} */}
        {/* <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <Link to="/account/orders"><Btn>Xem đơn hàng</Btn></Link>
          <Link to="/"><Btn variant="secondary">Tiếp tục mua sắm</Btn></Link>
        </div> */}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   LOGIN / REGISTER
════════════════════════════════════════════════════════════ */
export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm]       = useState({ name:'', email:'', password:'', confirmPassword:'' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})
  const { login, register }   = useAuth()
  const navigate              = useNavigate()

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Vui lòng nhập email'
    if (!form.password) e.password = 'Vui lòng nhập mật khẩu'
    if (!isLogin) {
      if (!form.name) e.name = 'Vui lòng nhập tên'
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Mật khẩu không khớp'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      if (isLogin) await login(form.email, form.password)
      else await register({ name:form.name, email:form.email, password:form.password })
      navigate('/')
    } catch (e) { toast.error(e.message || 'Đăng nhập thất bại') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#FAF7F2,#EDD5C0)', display:'flex', alignItems:'center', justifyContent:'center', padding:'80px 16px' }}>
      <div style={{ background:'#FFFDF9', borderRadius:4, width:'100%', maxWidth:420, padding:'clamp(24px,5vw,40px) clamp(20px,5vw,36px)', border:'1px solid #E5DDD4', boxShadow:'0 20px 60px rgba(0,0,0,.08)' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <Link to="/" style={{ display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none' }}>
            <Logo size={26} />
          </Link>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:300, color:'#3A2F25', marginTop:14 }}>
            {isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
          </h2>
        </div>
        {!isLogin && <Input label="Họ và tên" value={form.name} onChange={set('name')} error={errors.name} placeholder="Nguyễn Văn A"/>}
        <Input label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="hello@email.com"/>
        <Input label="Mật khẩu" type="password" value={form.password} onChange={set('password')} error={errors.password} placeholder="••••••••"/>
        {!isLogin && <Input label="Xác nhận mật khẩu" type="password" value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} placeholder="••••••••"/>}
        <Btn full size="lg" onClick={handleSubmit} loading={loading} style={{ marginTop:8 }}>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</Btn>
        <p style={{ textAlign:'center', marginTop:18, fontSize:13, color:'#9B8E82' }}>
          {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
          <button onClick={() => setIsLogin(v=>!v)} style={{ color:'#B8952A', background:'none', border:'none', cursor:'pointer', fontSize:13 }}>
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
          </button>
        </p>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   ACCOUNT PAGE
════════════════════════════════════════════════════════════ */
export function AccountPage() {
  const { user, refreshUser } = useAuth()
  const [form, setForm]       = useState({ name:user?.name||'', phone:user?.phone||'', menh:user?.menh||'', gender:user?.gender||'' })
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await authAPI.updateProfile(form)
      await refreshUser()
      toast.success('Cập nhật thành công!')
    } catch (e) { toast.error(e.message || 'Lỗi cập nhật') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ paddingTop:64 }}>
      <div className="container" style={{ padding:'40px 24px', maxWidth:720 }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(26px,4vw,36px)', fontWeight:300, color:'#3A2F25', marginBottom:32 }}>Tài Khoản</h1>
        <Card>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:400, color:'#3A2F25', marginBottom:22 }}>Thông Tin Cá Nhân</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'0 16px' }}>
            <Input label="Họ và tên" value={form.name}   onChange={e => setForm(f=>({...f,name:e.target.value}))}/>
            <Input label="Số điện thoại" value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))}/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'0 16px' }}>
            <Select label="Mệnh ngũ hành" value={form.menh} onChange={e => setForm(f=>({...f,menh:e.target.value}))}>
              <option value="">Chọn mệnh</option>
              {['Kim','Mộc','Thuỷ','Hoả','Thổ'].map(m => <option key={m} value={m}>{m}</option>)}
            </Select>
            <Select label="Giới tính" value={form.gender} onChange={e => setForm(f=>({...f,gender:e.target.value}))}>
              <option value="">Chọn giới tính</option>
              {['Nam','Nữ','Khác'].map(g => <option key={g} value={g}>{g}</option>)}
            </Select>
          </div>
          <p style={{ fontSize:12, color:'#9B8E82', marginBottom:16 }}>Email: <strong style={{ color:'#3A2F25' }}>{user?.email}</strong></p>
          <Btn onClick={handleSave} loading={loading}>Lưu thay đổi</Btn>
        </Card>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   ORDERS PAGE
════════════════════════════════════════════════════════════ */
export function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage]     = useState(1)
  const [total, setTotal]   = useState(0)

  useEffect(() => {
    setLoading(true)
    orderAPI.getMyOrders({ page, limit:10 }).then(r => { setOrders(r.orders); setTotal(r.total) }).finally(() => setLoading(false))
  }, [page])

  if (loading) return <div style={{ paddingTop:64 }}><PageLoader/></div>

  return (
    <div style={{ paddingTop:64 }}>
      <div className="container" style={{ padding:'40px 24px' }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(26px,4vw,36px)', fontWeight:300, color:'#3A2F25', marginBottom:32 }}>Đơn Hàng Của Tôi</h1>
        {orders.length === 0
          ? <EmptyState icon="📦" title="Chưa có đơn hàng" action={<Link to="/products"><Btn>Mua sắm ngay</Btn></Link>}/>
          : orders.map(o => <OrderRow key={o._id} order={o}/>)
        }
        <Pagination page={page} pages={Math.ceil(total/10)} onPage={setPage}/>
      </div>
    </div>
  )
}

function OrderRow({ order }) {
  const st = ORDER_STATUS[order.status] || {}
  return (
    <Card style={{ marginBottom:12 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:500, color:'#3A2F25' }}>#{order.orderCode}</p>
          <p style={{ fontSize:12, color:'#9B8E82', marginTop:2 }}>{fmtDateTime(order.createdAt)}</p>
        </div>
        <span className={`badge ${st.color}`}>{st.label}</span>
        <div style={{ textAlign:'right' }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:'#B8952A' }}>{fmt(order.total)}</p>
          <p style={{ fontSize:12, color:'#9B8E82' }}>{order.items?.length||0} sản phẩm</p>
        </div>
        <Link to={`/account/orders/${order._id}`}><Btn variant="ghost" size="sm">Chi tiết</Btn></Link>
      </div>
    </Card>
  )
}