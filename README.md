# 4EM Frontend

React + React Router + Axios frontend cho website bán vòng đá phong thủy.

---

## 🚀 Cài đặt & Chạy

```bash
# 1. Cài dependencies
npm install

# 2. Chạy dev (backend phải đang chạy ở port 5000)
npm run dev

# 3. Build production
npm run build
```

> Vite proxy tự forward `/api/*` → `http://localhost:5000` khi dev.

---

## 📁 Cấu trúc

```
src/
├── api/
│   └── index.js          # Axios instance + tất cả API calls
├── context/
│   └── index.jsx         # AuthContext + CartContext
├── hooks/
│   └── index.js          # useScrollReveal, useFetch, useDebounce, useSticky...
├── utils/
│   └── index.js          # fmt, fmtDate, ORDER_STATUS, MENH_COLORS...
├── components/
│   ├── common/
│   │   └── index.jsx     # Btn, Input, Select, Modal, Pagination, Spinner...
│   ├── layout/
│   │   ├── Header.jsx    # Sticky header, search, user menu, cart badge
│   │   └── Footer.jsx    # Footer với links + showroom
│   ├── product/
│   │   └── index.jsx     # ProductCard, ProductGrid, FilterSidebar, SortBar
│   └── cart/
│       └── index.jsx     # CartItem, CartSummary (coupon)
├── pages/
│   ├── CustomerPages.jsx # Home, Products, ProductDetail, Cart, Checkout, Login, Account, Orders
│   └── AdminPages.jsx    # AdminLayout, Dashboard, Products, Orders, Categories, Users, Coupons
├── App.jsx               # Routes + Guards (PrivateRoute, AdminRoute)
├── main.jsx
└── index.css             # Global styles, CSS vars, animations
```

---

## 🔐 Phân quyền

| Route | Yêu cầu |
|-------|---------|
| `/` `/products` `/cart` `/login` | Public |
| `/checkout` `/account/*` `/order-success` | Đăng nhập |
| `/admin/*` | Role = `admin` |

---

## 🛒 Customer Features

- **Trang chủ**: Hero, featured products, categories, ngũ hành, new arrivals
- **Danh sách sản phẩm**: Lọc theo mệnh / giới tính / giá / danh mục, sort, phân trang
- **Chi tiết sản phẩm**: Gallery ảnh, thông tin phong thuỷ, mệnh, đánh giá, sản phẩm liên quan
- **Giỏ hàng**: Thêm/xoá/sửa số lượng, áp mã giảm giá
- **Đặt hàng**: Form giao hàng, chọn phương thức thanh toán, xác nhận đơn
- **Tài khoản**: Cập nhật profile, xem lịch sử đơn hàng

---

## ⚙️ Admin Features

| Trang | Tính năng |
|-------|-----------|
| **Dashboard** | Thống kê doanh thu, đơn hàng, top sản phẩm, biểu đồ 6 tháng |
| **Sản phẩm** | CRUD, upload ảnh Cloudinary, set mệnh/giới tính/tags |
| **Đơn hàng** | Xem tất cả, lọc status, cập nhật trạng thái + ghi chú |
| **Danh mục** | CRUD, sort order, bật/tắt hiển thị |
| **Người dùng** | Xem danh sách, khoá/mở khoá tài khoản |
| **Mã giảm giá** | Tạo mã %, cố định; giới hạn lượt dùng, ngày hết hạn |

---

## 🔗 Kết nối Backend

Đảm bảo backend đang chạy tại `http://localhost:5000` trước khi `npm run dev`.

Nếu deploy production, sửa `vite.config.js`:
```js
proxy: {
  '/api': { target: 'https://your-api-domain.com', changeOrigin: true }
}
```
