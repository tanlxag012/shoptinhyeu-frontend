import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context'
import { fmt, getImgUrl, getFirstImage, MENH_COLORS } from '../../utils'
import { useScrollReveal } from '../../hooks'
import { Btn } from '../common'
import toast from 'react-hot-toast'

/* ── PRODUCT CARD ────────────────────────────────────────── */
export function ProductCard({ product, delay = 0 }) {
  const [hov, setHov]   = useState(false)
  const [ref, vis]      = useScrollReveal()
  const { addItem }     = useCart()

  const handleAddCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    toast.success('Đã thêm vào giỏ hàng!')
  }

  const imgUrl = getImgUrl(product.media || product.images)
  const price  = product.salePrice || product.price
  const onSale = product.salePrice && product.salePrice < product.price

  // Kiểm tra có video không
  const hasVideo = product.media?.some(m => m.type === 'video')

  return (
    <div ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:'#FAF7F2', border:'1px solid #E5DDD4', borderRadius:4,
        overflow:'hidden',
        opacity: vis ? 1 : 0,
        transform: vis ? (hov ? 'translateY(-6px)' : 'none') : 'translateY(22px)',
        boxShadow: hov ? '0 20px 40px rgba(0,0,0,.09)' : 'none',
        transition:`opacity .6s ${delay}ms, transform .6s ${delay}ms, box-shadow .3s`,
      }}>
      <Link to={`/products/${product.slug}`}>
        {/* Image */}
        <div style={{ position:'relative', aspectRatio:1, overflow:'hidden', background:'#EDD5C0' }}>
          <img src={imgUrl} alt={product.name}
            style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .4s', transform: hov ? 'scale(1.06)' : 'scale(1)' }}/>

          {/* Tags */}
          <div style={{ position:'absolute', top:8, left:8, display:'flex', flexDirection:'column', gap:4 }}>
            {product.isNew  && <span className="badge badge-gold">New</span>}
            {onSale         && <span className="badge badge-sale">Sale</span>}
          </div>

          {/* Video indicator */}
          {hasVideo && (
            <div style={{ position:'absolute', top:8, right:8, background:'rgba(28,24,20,.65)', color:'white', fontSize:9, padding:'3px 8px', borderRadius:20, letterSpacing:1 }}>▶ Video</div>
          )}

          {/* Hover overlay */}
          <div style={{ position:'absolute', inset:0, background:'rgba(28,24,20,.48)', display:'flex', alignItems:'center', justifyContent:'center', opacity: hov ? 1 : 0, transition:'opacity .3s' }}>
            <button onClick={handleAddCart}
              style={{ background:'white', color:'#3A2F25', padding:'9px 18px', borderRadius:2, fontSize:10, letterSpacing:1.5, textTransform:'uppercase', border:'none', cursor:'pointer' }}>
              + Thêm vào giỏ
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:'14px 13px 16px' }}>
          <p style={{ fontSize:13, lineHeight:1.5, color:'#3A2F25', marginBottom:8, minHeight:40 }}>{product.name}</p>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600, color:'#B8952A' }}>{fmt(price)}</span>
            {onSale && <span style={{ fontSize:12, color:'#9B8E82', textDecoration:'line-through' }}>{fmt(product.price)}</span>}
          </div>
          <div style={{ display:'flex', gap:4 }}>
            {product.menh?.map(m => (
              <div key={m} title={m} style={{ width:11, height:11, borderRadius:'50%', background: MENH_COLORS[m]||'#ccc', border:'1px solid rgba(0,0,0,.1)' }}/>
            ))}
          </div>
        </div>
      </Link>
    </div>
  )
}

/* ── PRODUCT GRID ────────────────────────────────────────── */
export function ProductGrid({ products, loading, cols = 4 }) {
  if (loading) return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(${Math.min(cols,2)},1fr)`, gap:16 }}
         className={`grid-${cols}`}>
      {Array(8).fill(0).map((_,i) => (
        <div key={i}>
          <div className="skeleton" style={{ aspectRatio:1, marginBottom:10 }}/>
          <div className="skeleton" style={{ height:13, marginBottom:7, width:'80%' }}/>
          <div className="skeleton" style={{ height:18, width:'50%' }}/>
        </div>
      ))}
    </div>
  )
  if (!products?.length) return null
  return (
    <div className={`grid-${cols}`}>
      {products.map((p,i) => <ProductCard key={p._id} product={p} delay={i*50}/>)}
    </div>
  )
}

/* ── FILTER CONTENT (dùng được cả desktop sidebar lẫn mobile drawer) ── */
export function FilterContent({ filters, onChange, categories }) {
  const menh    = ['Kim','Mộc','Thuỷ','Hoả','Thổ']
  const genders = ['Nam','Nữ','Unisex']

  return (
    <div style={{ background:'#FFFDF9', border:'1px solid #E5DDD4', borderRadius:4, overflow:'hidden' }}>
      <FilterSection title="Danh Mục">
        <FilterItem label="Tất cả" active={!filters.category} onClick={() => onChange('category','')}/>
        {categories?.map(c => (
          <FilterItem key={c._id} label={c.name} count={c.productCount}
            active={filters.category===c._id} onClick={() => onChange('category',c._id)}/>
        ))}
      </FilterSection>

      {/* <FilterSection title="Ngũ Hành / Mệnh">
        {menh.map(m => {
          const active = filters.menh?.includes(m)
          return (
            <div key={m} onClick={() => {
                const cur  = filters.menh ? filters.menh.split(',').filter(Boolean) : []
                const next = cur.includes(m) ? cur.filter(x=>x!==m) : [...cur,m]
                onChange('menh', next.join(','))
              }}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px', cursor:'pointer', background: active ? '#FAF7F2' : 'transparent' }}>
              <div style={{ width:13, height:13, borderRadius:'50%', background:MENH_COLORS[m], flexShrink:0 }}/>
              <span style={{ fontSize:14, color:'#3A2F25' }}>{m}</span>
              {active && <span style={{ marginLeft:'auto', color:'#B8952A', fontSize:14 }}>✓</span>}
            </div>
          )
        })}
      </FilterSection> */}
{/* 
      <FilterSection title="Giới Tính">
        {genders.map(g => (
          <FilterItem key={g} label={g} active={filters.gender===g}
            onClick={() => onChange('gender', filters.gender===g ? '' : g)}/>
        ))}
      </FilterSection> */}

      {/* <FilterSection title="Khoảng Giá">
        {[
          { label:'Dưới 1 triệu',  min:0,       max:1000000 },
          { label:'1tr – 2tr',     min:1000000, max:2000000 },
          { label:'2tr – 4tr',     min:2000000, max:4000000 },
          { label:'Trên 4 triệu',  min:4000000, max:null    },
        ].map(r => {
          // Dùng !== '' thay vì truthy để tránh min=0 bị coi là null
          const curMin = filters.minPrice !== '' && filters.minPrice !== undefined ? Number(filters.minPrice) : null
          const curMax = filters.maxPrice !== '' && filters.maxPrice !== undefined ? Number(filters.maxPrice) : null
          const active = curMin === r.min && curMax === r.max
          return (
            <FilterItem key={r.label} label={r.label} active={active}
              onClick={() => {
                if (active) { onChange('minPrice', ''); onChange('maxPrice', '') }
                else { onChange('minPrice', r.min); onChange('maxPrice', r.max ?? '') }
              }}/>
          )
        })}
      </FilterSection> */}

      {/* <FilterSection title="Bộ Lọc Nhanh">
        <div style={{ padding:'10px 16px', display:'flex', gap:8, flexWrap:'wrap' }}>
          {[
            { label:'Mới nhất',  key:'isNew',      val:'true' },
            { label:'Nổi bật',   key:'isFeatured', val:'true' },
          ].map(t => (
            <button key={t.key} onClick={() => onChange(t.key, filters[t.key] ? '' : t.val)}
              style={{ padding:'6px 14px', borderRadius:20, fontSize:13, cursor:'pointer', border:`1px solid ${filters[t.key]?'#3A2F25':'#E5DDD4'}`, background: filters[t.key]?'#3A2F25':'transparent', color: filters[t.key]?'white':'#8B7D6B', transition:'all .18s' }}>
              {t.label}
            </button>
          ))}
        </div>
      </FilterSection> */}

      <div style={{ padding:'12px 16px', borderTop:'1px solid #E5DDD4' }}>
        <button onClick={() => onChange('reset')}
          style={{ width:'100%', padding:'9px', fontSize:12, letterSpacing:1, textTransform:'uppercase', color:'#9B8E82', border:'1px solid #E5DDD4', background:'none', borderRadius:2, cursor:'pointer' }}>
          Xoá bộ lọc
        </button>
      </div>
    </div>
  )
}

/* ── FILTER SIDEBAR – chỉ dùng trên desktop ── */
export function FilterSidebar({ filters, onChange, categories }) {
  return (
    <aside style={{ width:240, flexShrink:0, position:'sticky', top:80, alignSelf:'flex-start', display:'block' }}
      className="filter-sidebar-desktop">
      <FilterContent filters={filters} onChange={onChange} categories={categories} />
    </aside>
  )
}

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ borderBottom:'1px solid #E5DDD4' }}>
      <button onClick={() => setOpen(v=>!v)}
        style={{ width:'100%', padding:'13px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'none', border:'none', cursor:'pointer', fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'#3A2F25' }}>
        {title}
        <span style={{ fontSize:9, transform: open ? 'rotate(180deg)' : 'none', transition:'transform .2s' }}>▼</span>
      </button>
      {open && <div style={{ paddingBottom:8 }}>{children}</div>}
    </div>
  )
}

function FilterItem({ label, count, active, onClick }) {
  return (
    <div onClick={onClick}
      style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 16px', cursor:'pointer', background: active ? '#FAF7F2' : 'transparent', transition:'background .15s' }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background='#FAF7F2' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background='transparent' }}>
      <span style={{ fontSize:13, color: active ? '#3A2F25' : '#8B7D6B', fontWeight: active ? 500 : 400 }}>{label}</span>
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        {count !== undefined && <span style={{ fontSize:11, color:'#9B8E82' }}>{count}</span>}
        {active && <span style={{ color:'#B8952A', fontSize:12 }}>✓</span>}
      </div>
    </div>
  )
}

/* ── SORT BAR ────────────────────────────────────────────── */
export function SortBar({ total, sort, onSort, onFilterClick }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, padding:'12px 0', borderBottom:'1px solid #E5DDD4', flexWrap:'wrap', gap:10 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        {/* Mobile: filter button */}
        <button onClick={onFilterClick}
          className="show-mobile"
          style={{ padding:'8px 14px', border:'1px solid #E5DDD4', borderRadius:2, background:'none', fontSize:12, color:'#3A2F25', cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
          ⚙ Bộ lọc
        </button>
        <p style={{ fontSize:13, color:'#9B8E82' }}>
          <span style={{ color:'#3A2F25', fontWeight:500 }}>{total}</span> sản phẩm
        </p>
      </div>
      <select value={sort} onChange={e => onSort(e.target.value)}
        style={{ padding:'8px 12px', border:'1px solid #E5DDD4', borderRadius:2, background:'#FFFDF9', fontSize:13, color:'#3A2F25', outline:'none' }}>
        <option value="-createdAt">Mới nhất</option>
        <option value="-sold">Bán chạy nhất</option>
        <option value="price">Giá thấp → cao</option>
        <option value="-price">Giá cao → thấp</option>
        <option value="-avgRating">Đánh giá cao</option>
      </select>
    </div>
  )
}
