/**
 * Logo 4EM — số "4" dùng DM Sans (không bị lệch baseline),
 * "EM" dùng Cormorant Garamond serif cho đẹp.
 * Dùng font-variant-numeric: lining-nums để số luôn ngang hàng.
 */
export default function Logo({ size = 24, color = '#61401e', dotColor = '#B8952A', dotSize = 7 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, lineHeight: 1 }}>
      {/* Dot */}
      <span style={{
        width: dotSize, height: dotSize,
        borderRadius: '50%',
        background: dotColor,
        display: 'inline-block',
        flexShrink: 0,
      }} />
      {/* "4" – DM Sans, lining nums, không bị lệch */}
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: size,
        fontWeight: 300,
        letterSpacing: 4,
        color,
        fontVariantNumeric: 'lining-nums',
        lineHeight: 1,
      }}>4</span>
      {/* "EM" – Cormorant Garamond serif */}
      <span style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: size,
        fontWeight: 600,
        letterSpacing: 4,
        color,
        lineHeight: 1,
        marginLeft: -10,   // kéo sát số 4 lại
      }}>EM</span>
    </span>
  )
}