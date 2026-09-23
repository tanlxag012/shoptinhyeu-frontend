import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, CartProvider } from './context'
import { useAuth } from './context'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import {
  HomePage, ProductsPage, ProductDetailPage,
  CartPage, CheckoutPage, OrderSuccessPage,
  LoginPage, AccountPage, OrdersPage,
} from './pages/CustomerPages'
import {
  AdminLayout, AdminDashboard, AdminProducts,
  AdminOrders, AdminCategories, AdminUsers, AdminCoupons,
} from './pages/AdminPages'

/* ── Route guards ── */
function PrivateRoute({ children }) {
  // const { user } = useAuth()
  // return user ? children : <Navigate to="/login" replace />
}
function AdminRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

/* ── Customer layout wrapper ── */
function CustomerLayout({ children }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh' }}>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                background: '#1C1814',
                color: '#FAF7F2',
                borderRadius: 2,
              },
            }}
          />
          <Routes>
            {/* Customer */}
            <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
            <Route path="/products" element={<CustomerLayout><ProductsPage /></CustomerLayout>} />
            <Route path="/products/:slug" element={<CustomerLayout><ProductDetailPage /></CustomerLayout>} />
            <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/checkout" element={<CustomerLayout><CheckoutPage /></CustomerLayout>} />
            <Route path="/order-success/:id" element={<CustomerLayout><OrderSuccessPage /></CustomerLayout>} />
            <Route path="/account" element={<CustomerLayout><AccountPage /></CustomerLayout>} />
            <Route path="/account/orders" element={<CustomerLayout><OrdersPage /></CustomerLayout>} />

            {/* Admin */}
            <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><AdminLayout><AdminCategories /></AdminLayout></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
            <Route path="/admin/coupons" element={<AdminRoute><AdminLayout><AdminCoupons /></AdminLayout></AdminRoute>} />

            {/* 404 */}
            <Route path="*" element={<CustomerLayout><div style={{ paddingTop: 68, minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}><div style={{ fontSize: 64 }}>🔍</div><h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 40, fontWeight: 300, color: '#3A2F25' }}>404 – Không tìm thấy</h1></div></CustomerLayout>} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
