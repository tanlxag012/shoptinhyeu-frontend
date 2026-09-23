import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../api'

// ── AUTH CONTEXT ─────────────────────────────────────────
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('4em_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password })
    localStorage.setItem('4em_token', res.token)
    localStorage.setItem('4em_user', JSON.stringify(res.user))
    setUser(res.user)
    return res
  }

  const register = async (data) => {
    const res = await authAPI.register(data)
    localStorage.setItem('4em_token', res.token)
    localStorage.setItem('4em_user', JSON.stringify(res.user))
    setUser(res.user)
    return res
  }

  const logout = () => {
    localStorage.removeItem('4em_token')
    localStorage.removeItem('4em_user')
    setUser(null)
  }

  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem('4em_token')) return
    try {
      const res = await authAPI.getMe()
      setUser(res.user)
      localStorage.setItem('4em_user', JSON.stringify(res.user))
    } catch { logout() }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

// ── CART CONTEXT ─────────────────────────────────────────
const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('4em_cart')) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('4em_cart', JSON.stringify(items))
  }, [items])

  const addItem = (product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product === product._id)
      if (existing) {
        return prev.map(i => i.product === product._id
          ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
          : i
        )
      }
      return [...prev, {
        product: product._id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.images?.[0]?.url || '',
        stock: product.stock,
        quantity,
      }]
    })
  }

  const updateQty = (productId, quantity) => {
    if (quantity < 1) return removeItem(productId)
    setItems(prev => prev.map(i => i.product === productId ? { ...i, quantity } : i))
  }

  const removeItem = (productId) => {
    setItems(prev => prev.filter(i => i.product !== productId))
  }

  const clearCart = () => setItems([])

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const count    = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clearCart, subtotal, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
