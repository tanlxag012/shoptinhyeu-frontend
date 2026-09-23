import axios from 'axios'

const api = axios.create({ baseURL: '/api', timeout: 30000 })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('4em_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  res => res.data,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('4em_token')
      localStorage.removeItem('4em_user')
      window.location.href = '/login'
    }
    return Promise.reject(err.response?.data || err)
  }
)

export const authAPI = {
  register:       (data) => api.post('/auth/register', data),
  login:          (data) => api.post('/auth/login', data),
  getMe:          ()     => api.get('/auth/me'),
  updateProfile:  (data) => api.put('/auth/update-profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  addAddress:     (data) => api.post('/auth/addresses', data),
  updateAddress:  (id, data) => api.put(`/auth/addresses/${id}`, data),
  deleteAddress:  (id)   => api.delete(`/auth/addresses/${id}`),
  toggleWishlist: (pid)  => api.post(`/auth/wishlist/${pid}`),
}

export const productAPI = {
  getAll:  (params) => api.get('/products', { params }),
  getOne:  (slug)   => api.get(`/products/${slug}`),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),

  // Admin
  adminGetAll: (params) => api.get('/products/admin/list', { params }),
  create: (formData) => api.post('/products/admin', formData, { headers:{ 'Content-Type':'multipart/form-data' } }),
  update: (id, fd)   => api.put(`/products/admin/${id}`, fd, { headers:{ 'Content-Type':'multipart/form-data' } }),
  delete: (id)       => api.delete(`/products/admin/${id}`),
  deleteMedia:  (id, publicId) => api.delete(`/products/admin/${id}/media/${encodeURIComponent(publicId)}`),
  reorderMedia: (id, order)    => api.put(`/products/admin/${id}/media/reorder`, { order }),
  approveReview: (id, reviewId) => api.put(`/products/admin/${id}/reviews/${reviewId}/approve`),
}

export const categoryAPI = {
  getAll:      () => api.get('/categories'),
  adminGetAll: () => api.get('/admin/categories'),
  create:  (data)     => api.post('/admin/categories', data),
  update:  (id, data) => api.put(`/admin/categories/${id}`, data),
  delete:  (id)       => api.delete(`/admin/categories/${id}`),
}

export const orderAPI = {
  create:      (data)   => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getOne:      (id)     => api.get(`/orders/${id}`),
  cancel:      (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),

  adminGetAll:   (params) => api.get('/admin/orders', { params }),
  updateStatus:  (id, data) => api.put(`/admin/orders/${id}/status`, data),
  updatePayment: (id, data) => api.put(`/admin/orders/${id}/payment`, data),
  getDashboard:  () => api.get('/admin/stats'),
}

export const couponAPI = {
  validate:    (code, orderTotal) => api.post('/coupons/validate', { code, orderTotal }),
  adminGetAll: () => api.get('/admin/coupons'),
  create:  (data)     => api.post('/admin/coupons', data),
  update:  (id, data) => api.put(`/admin/coupons/${id}`, data),
  delete:  (id)       => api.delete(`/admin/coupons/${id}`),
}

export const userAPI = {
  getAll:  (params)     => api.get('/admin/users', { params }),
  getOne:  (id)         => api.get(`/admin/users/${id}`),
  update:  (id, data)   => api.put(`/admin/users/${id}`, data),
  delete:  (id)         => api.delete(`/admin/users/${id}`),
}

export default api
