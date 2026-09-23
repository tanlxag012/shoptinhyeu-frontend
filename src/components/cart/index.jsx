import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context'
import { fmt, getImgUrl } from '../../utils'
import { Btn } from '../common'

/* ── CART ITEM ───────────────────────────────────────────── */
export function CartItem({ item, editable = true }) {
  const { updateQty, removeItem } = useCart()

  return (
    <div style={{ display: 'flex', gap: 14, padding: '16px 0', borderBottom: '1px solid #E5DDD4' }}>
      {/* Image */}
      <Link to={`/products/${item.slug || '#'}`}>
        <div style={{ width: 72, height: 72, borderRadius: 4, overflow: 'hidden', background: '#EDD5C0', flexShrink: 0 }}>
          <img src={item.image || 'https://via.placeholder.com/72'} alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </Link>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, color: '#3A2F25', lineHeight: 1.4, marginBottom: 6 }}>{item.name}</p>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 600, color: '#B8952A' }}>
          {fmt(item.price)}
        </p>

        {editable && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            {/* Qty stepper */}
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5DDD4', borderRadius: 2, overflow: 'hidden' }}>
              <button onClick={() => updateQty(item.product, item.quantity - 1)}
                style={{ width: 28, height: 28, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#8B7D6B' }}>−</button>
              <span style={{ width: 32, textAlign: 'center', fontSize: 13, color: '#3A2F25' }}>{item.quantity}</span>
              <button onClick={() => updateQty(item.product, Math.min(item.quantity + 1, item.stock))}
                style={{ width: 28, height: 28, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#8B7D6B' }}>+</button>
            </div>
            {/* Remove */}
            <button onClick={() => removeItem(item.product)}
              style={{ background: 'none', border: 'none', fontSize: 12, color: '#9B8E82', cursor: 'pointer', letterSpacing: 1 }}>Xoá</button>
          </div>
        )}
      </div>

      {/* Subtotal */}
      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 600, color: '#3A2F25' }}>
          {fmt(item.price * item.quantity)}
        </p>
      </div>
    </div>
  )
}

/* ── ORDER SUMMARY ───────────────────────────────────────── */
export function CartSummary({ subtotal, shippingFee, discountAmount, couponCode, onCoupon }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const total = subtotal + (shippingFee || 0) - (discountAmount || 0)

  const handleApply = async () => {
    if (!code.trim()) return
    setLoading(true)
    try { await onCoupon(code.trim()) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ background: '#FFFDF9', border: '1px solid #E5DDD4', borderRadius: 4, padding: 24 }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 400, color: '#3A2F25', marginBottom: 20 }}>Tóm tắt đơn hàng</h3>

      <Row label="Tạm tính" value={fmt(subtotal)} />
      <Row label="Phí vận chuyển" value={shippingFee === 0 ? 'Miễn phí' : fmt(shippingFee || 30000)} />
      {discountAmount > 0 && <Row label={`Giảm giá (${couponCode})`} value={`−${fmt(discountAmount)}`} colored />}

      <div style={{ borderTop: '1px solid #E5DDD4', margin: '16px 0', paddingTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: '#3A2F25' }}>Tổng cộng</span>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, color: '#B8952A' }}>{fmt(total)}</span>
        </div>
      </div>

      {/* Coupon */}
      {onCoupon && (
        <div style={{ marginTop: 16, marginBottom: 4 }}>
          <p style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#9B8E82', marginBottom: 8 }}>Mã giảm giá</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={code} onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="Nhập mã..."
              style={{ flex: 1, padding: '9px 12px', border: '1px solid #E5DDD4', borderRadius: 2, fontSize: 13, outline: 'none', background: '#FAF7F2' }} />
            <Btn size="sm" onClick={handleApply} loading={loading}>Áp dụng</Btn>
          </div>
        </div>
      )}

      <p style={{ fontSize: 11, color: '#9B8E82', marginTop: 12, lineHeight: 1.6 }}>
        Miễn phí vận chuyển cho đơn hàng từ 1.500.000₫
      </p>
    </div>
  )
}

function Row({ label, value, colored }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
      <span style={{ fontSize: 13, color: '#9B8E82' }}>{label}</span>
      <span style={{ fontSize: 13, color: colored ? '#4A7C59' : '#3A2F25', fontWeight: colored ? 500 : 400 }}>{value}</span>
    </div>
  )
}
