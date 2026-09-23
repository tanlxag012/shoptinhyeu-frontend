import { useState, useEffect, useCallback } from 'react'

/**
 * MediaGallery – hiển thị ảnh + video cho trang chi tiết sản phẩm
 * Props:
 *   media  – array [{ type:'image'|'video', url, thumbnail, alt }]
 */
export default function MediaGallery({ media = [] }) {
  const [current, setCurrent]     = useState(0)
  const [lightbox, setLightbox]   = useState(false)
  const [lbIndex, setLbIndex]     = useState(0)

  const sorted = [...media].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
  const item   = sorted[current]

  // Keyboard navigation trong lightbox
  const handleKey = useCallback(e => {
    if (!lightbox) return
    if (e.key === 'ArrowRight') setLbIndex(i => (i + 1) % sorted.length)
    if (e.key === 'ArrowLeft')  setLbIndex(i => (i - 1 + sorted.length) % sorted.length)
    if (e.key === 'Escape')     setLightbox(false)
  }, [lightbox, sorted.length])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  const openLightbox = (idx) => { setLbIndex(idx); setLightbox(true) }

  if (!sorted.length) return (
    <div style={{ aspectRatio:1, borderRadius:4, background:'#EDD5C0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:64 }}>📿</div>
  )

  return (
    <>
      {/* ── Main display ── */}
      <div>
        <div className="gallery-main" onClick={() => openLightbox(current)}>
          {item?.type === 'video' ? (
            <video
              key={item.url}
              src={item.url}
              poster={item.thumbnail}
              controls
              playsInline
              style={{ width:'100%', height:'100%', objectFit:'contain', background:'#1C1814' }}
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <img
              src={item?.url}
              alt={item?.alt || '4EM product'}
              style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .4s' }}
            />
          )}

          {/* Zoom hint */}
          {item?.type !== 'video' && (
            <div style={{ position:'absolute', bottom:10, right:10, background:'rgba(28,24,20,.5)', color:'white', fontSize:11, padding:'4px 10px', borderRadius:20, backdropFilter:'blur(4px)', pointerEvents:'none' }}>
              🔍 Nhấn để phóng to
            </div>
          )}

          {/* Video badge */}
          {item?.type === 'video' && (
            <div style={{ position:'absolute', top:10, left:10, background:'rgba(28,24,20,.6)', color:'white', fontSize:10, padding:'4px 10px', borderRadius:20, letterSpacing:1, textTransform:'uppercase' }}>
              ▶ Video
            </div>
          )}
        </div>

        {/* ── Thumbnails ── */}
        {sorted.length > 1 && (
          <div className="gallery-thumb-list">
            {sorted.map((m, i) => (
              <div key={i} className={`gallery-thumb ${current === i ? 'active' : ''}`}
                onClick={() => setCurrent(i)}>
                {m.type === 'video' ? (
                  <>
                    {m.thumbnail
                      ? <img src={m.thumbnail} alt="video thumb" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                      : <div style={{ width:'100%', height:'100%', background:'#2C1F14', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🎬</div>
                    }
                    <div className="gallery-thumb-video-icon">▶</div>
                  </>
                ) : (
                  <img src={m.url} alt={m.alt || `Ảnh ${i+1}`} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Dot indicators (mobile) ── */}
        {sorted.length > 1 && (
          <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:12 }} className="show-mobile">
            {sorted.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                style={{ width: i===current ? 20 : 6, height:6, borderRadius:3, border:'none', background: i===current ? '#B8952A' : '#E5DDD4', transition:'all .25s', cursor:'pointer', padding:0 }}/>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(false)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(false)}>✕</button>
            {sorted[lbIndex]?.type === 'video' ? (
              <video src={sorted[lbIndex].url} controls autoPlay playsInline
                style={{ maxWidth:'90vw', maxHeight:'88vh', borderRadius:4 }}/>
            ) : (
              <img src={sorted[lbIndex]?.url} alt={sorted[lbIndex]?.alt}
                style={{ maxWidth:'90vw', maxHeight:'88vh', objectFit:'contain', borderRadius:4 }}/>
            )}
          </div>

          {sorted.length > 1 && (
            <>
              <button className="lightbox-prev" onClick={e => { e.stopPropagation(); setLbIndex(i => (i-1+sorted.length)%sorted.length) }}>‹</button>
              <button className="lightbox-next" onClick={e => { e.stopPropagation(); setLbIndex(i => (i+1)%sorted.length) }}>›</button>
              <div className="lightbox-counter">{lbIndex+1} / {sorted.length}</div>
            </>
          )}
        </div>
      )}
    </>
  )
}
