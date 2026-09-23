import { useState, useEffect } from 'react'

/**
 * AddressSelect – chọn Tỉnh / Quận / Phường từ API provinces.open-api.vn
 * Props:
 *   value   = { province, district, ward }
 *   onChange = (field, value, label) => void
 *   errors  = { province, district, ward }
 */
export default function AddressSelect({ value = {}, onChange, errors = {} }) {
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards,     setWards]     = useState([])

  const [loadingP, setLoadingP] = useState(false)
  const [loadingD, setLoadingD] = useState(false)
  const [loadingW, setLoadingW] = useState(false)

  // Load danh sách tỉnh khi mount
  useEffect(() => {
    setLoadingP(true)
    fetch('https://provinces.open-api.vn/api/p/')
      .then(r => r.json())
      .then(data => setProvinces(data || []))
      .catch(() => setProvinces([]))
      .finally(() => setLoadingP(false))
  }, [])

  // Load quận khi chọn tỉnh
  useEffect(() => {
    if (!value.provinceCode) { setDistricts([]); setWards([]); return }
    setLoadingD(true)
    fetch(`https://provinces.open-api.vn/api/p/${value.provinceCode}?depth=2`)
      .then(r => r.json())
      .then(data => setDistricts(data.districts || []))
      .catch(() => setDistricts([]))
      .finally(() => setLoadingD(false))
  }, [value.provinceCode])

  // Load phường khi chọn quận
  useEffect(() => {
    if (!value.districtCode) { setWards([]); return }
    setLoadingW(true)
    fetch(`https://provinces.open-api.vn/api/d/${value.districtCode}?depth=2`)
      .then(r => r.json())
      .then(data => setWards(data.wards || []))
      .catch(() => setWards([]))
      .finally(() => setLoadingW(false))
  }, [value.districtCode])

  const handleProvince = (e) => {
    const code = e.target.value
    const name = e.target.options[e.target.selectedIndex].text
    onChange('provinceCode', code)
    onChange('province',     code ? name : '')
    onChange('districtCode', '')
    onChange('district',     '')
    onChange('wardCode',     '')
    onChange('ward',         '')
  }

  const handleDistrict = (e) => {
    const code = e.target.value
    const name = e.target.options[e.target.selectedIndex].text
    onChange('districtCode', code)
    onChange('district',     code ? name : '')
    onChange('wardCode',     '')
    onChange('ward',         '')
  }

  const handleWard = (e) => {
    const code = e.target.value
    const name = e.target.options[e.target.selectedIndex].text
    onChange('wardCode', code)
    onChange('ward',     code ? name : '')
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '0 16px' }}>

      {/* Tỉnh / Thành phố */}
      <SelectField
        label="Tỉnh / Thành phố *"
        value={value.provinceCode || ''}
        onChange={handleProvince}
        loading={loadingP}
        error={errors.province}
        placeholder="Chọn tỉnh / thành phố"
      >
        {provinces.map(p => (
          <option key={p.code} value={p.code}>{p.name}</option>
        ))}
      </SelectField>

      {/* Quận / Huyện */}
      <SelectField
        label="Quận / Huyện *"
        value={value.districtCode || ''}
        onChange={handleDistrict}
        loading={loadingD}
        error={errors.district}
        placeholder="Chọn quận / huyện"
        disabled={!value.provinceCode}
      >
        {districts.map(d => (
          <option key={d.code} value={d.code}>{d.name}</option>
        ))}
      </SelectField>

      {/* Phường / Xã */}
      <SelectField
        label="Phường / Xã *"
        value={value.wardCode || ''}
        onChange={handleWard}
        loading={loadingW}
        error={errors.ward}
        placeholder="Chọn phường / xã"
        disabled={!value.districtCode}
      >
        {wards.map(w => (
          <option key={w.code} value={w.code}>{w.name}</option>
        ))}
      </SelectField>

    </div>
  )
}

/* ── Internal select field ── */
function SelectField({ label, value, onChange, loading, error, placeholder, disabled, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, color: '#8B7D6B', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={onChange}
          disabled={disabled || loading}
          style={{
            width: '100%',
            padding: '11px 36px 11px 14px',
            border: `1px solid ${error ? '#C44A4A' : '#E5DDD4'}`,
            borderRadius: 2,
            background: disabled ? '#F5F0E8' : '#FFFDF9',
            fontSize: 14,
            color: value ? '#3A2F25' : '#9B8E82',
            outline: 'none',
            appearance: 'none',
            WebkitAppearance: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'border .2s',
          }}
          onFocus={e => { if (!error) e.target.style.borderColor = '#B8952A' }}
          onBlur={e  => { e.target.style.borderColor = error ? '#C44A4A' : '#E5DDD4' }}
        >
          <option value="" disabled>{loading ? 'Đang tải...' : placeholder}</option>
          {children}
        </select>

        {/* Chevron icon */}
        <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 11, color: disabled ? '#C9B99A' : '#9B8E82' }}>
          {loading ? '⟳' : '▾'}
        </span>
      </div>
      {error && <p style={{ color: '#C44A4A', fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  )
}