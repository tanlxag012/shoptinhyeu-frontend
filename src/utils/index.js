export const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n) + '₫'

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' })

export const fmtDateTime = (d) =>
  new Date(d).toLocaleString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })

export const ORDER_STATUS = {
  pending:    { label:'Chờ xác nhận',  color:'status-pending' },
  confirmed:  { label:'Đã xác nhận',   color:'status-confirmed' },
  processing: { label:'Đang chuẩn bị', color:'status-processing' },
  shipping:   { label:'Đang giao',     color:'status-shipping' },
  delivered:  { label:'Đã giao',       color:'status-delivered' },
  cancelled:  { label:'Đã huỷ',        color:'status-cancelled' },
  returned:   { label:'Trả hàng',      color:'status-returned' },
}

export const PAYMENT_STATUS = {
  pending:  { label:'Chưa thanh toán', color:'status-pending' },
  paid:     { label:'Đã thanh toán',   color:'status-delivered' },
  failed:   { label:'Thất bại',        color:'status-cancelled' },
  refunded: { label:'Đã hoàn tiền',    color:'status-returned' },
}

export const MENH_COLORS = {
  Kim:  '#D4AF5A',
  Mộc:  '#5A8A6A',
  Thuỷ: '#4A8AAA',
  Hoả:  '#C44A4A',
  Thổ:  '#C4A882',
}

export const PAYMENT_METHODS = {
  COD:           'Thanh toán khi nhận hàng',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng'
}

export const truncate = (str, n=60) => str?.length > n ? str.slice(0,n)+'...' : str

// Lấy thumbnail đầu tiên từ media array
export const getImgUrl = (media) => {
  if (!media?.length) return 'https://via.placeholder.com/400x400?text=4EM'
  const img = media.find(m => m.type === 'image') || media[0]
  return img?.type === 'video' ? (img.thumbnail || 'https://via.placeholder.com/400x400?text=Video') : img.url
}

// Cũ: backward compat cho code dùng product.images
export const getFirstImage = (product) => getImgUrl(product?.media || product?.images)
