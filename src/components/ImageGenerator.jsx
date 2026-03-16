import { useState, useRef, useEffect } from 'react'

// ── SmartBiz watermark overlay on canvas ──────────────────────────────────
function addWatermark(imgUrl, callback) {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width  = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')

    // Draw original image
    ctx.drawImage(img, 0, 0)

    // Watermark background pill — bottom left
    const pad   = 12
    const fSize = Math.max(14, img.width * 0.022)
    const text  = '⚡ SmartBiz'
    ctx.font    = `700 ${fSize}px Syne, sans-serif`
    const tw    = ctx.measureText(text).width
    const bw    = tw + pad * 2
    const bh    = fSize + pad * 1.4
    const bx    = 16
    const by    = img.height - bh - 16

    // Pill background
    ctx.fillStyle = 'rgba(224, 48, 48, 0.92)'
    ctx.beginPath()
    ctx.roundRect(bx, by, bw, bh, bh / 2)
    ctx.fill()

    // Text
    ctx.fillStyle = '#ffffff'
    ctx.fillText(text, bx + pad, by + bh - pad * 0.85)

    callback(canvas.toDataURL('image/jpeg', 0.92))
  }
  img.onerror = () => callback(imgUrl) // fallback — no watermark
  img.src = imgUrl
}

// ── Main component ────────────────────────────────────────────────────────
export default function ImageGenerator({ prompt, headline, autoGenerate = false }) {
  const [status,   setStatus]   = useState('idle')
  const [imgUrl,   setImgUrl]   = useState(null)
  const [wmarkUrl, setWmarkUrl] = useState(null)
  const [errMsg,   setErrMsg]   = useState('')
  const [seed,     setSeed]     = useState(Math.floor(Math.random() * 9999))
  const imgRef  = useRef(null)
  const autoRan = useRef(false)

  useEffect(() => {
    if (autoGenerate && prompt && !autoRan.current) {
      autoRan.current = true
      setTimeout(() => generate(), 600)
    }
  }, [prompt])

  // Build Pollinations URL
  function buildUrl(p, s) {
    const encoded = encodeURIComponent(
      p + ', high quality, photorealistic, 8k, dramatic lighting, professional photography'
    )
    return `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=576&seed=${s}&nologo=true&enhance=true`
  }

  async function generate() {
    if (!prompt) return
    setStatus('loading')
    setImgUrl(null)
    setWmarkUrl(null)
    setErrMsg('')

    const newSeed = Math.floor(Math.random() * 99999)
    setSeed(newSeed)
    const url = buildUrl(prompt, newSeed)

    // Preload image
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      setImgUrl(url)
      addWatermark(url, (wm) => {
        setWmarkUrl(wm)
        setStatus('done')
      })
    }
    img.onerror = () => {
      setErrMsg('Image generation failed. Try again.')
      setStatus('error')
    }
    img.src = url
  }

  function regenerate() {
    generate()
  }

  function downloadImg() {
    const a = document.createElement('a')
    a.href     = wmarkUrl || imgUrl
    a.download = `smartbiz-${Date.now()}.jpg`
    a.click()
  }

  // Styles
  const card = {
    background: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  }

  const head = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 14px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    background: 'rgba(255,255,255,0.02)',
  }

  const lbl = {
    fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
    textTransform: 'uppercase', color: '#4a4a60',
  }

  const btn = (variant = 'red', sm = false) => ({
    padding: sm ? '6px 14px' : '13px',
    borderRadius: sm ? 22 : 10,
    border: 'none', cursor: 'pointer',
    fontFamily: 'Syne, sans-serif',
    fontSize: sm ? 11 : 13, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    transition: 'opacity 0.15s',
    width: sm ? 'auto' : '100%',
    ...(variant === 'red'     && { background: '#e03030', color: '#fff' }),
    ...(variant === 'outline' && { background: 'transparent', border: '1.5px solid rgba(255,255,255,0.12)', color: '#8888a0' }),
    ...(variant === 'ghost'   && { background: 'rgba(255,255,255,0.05)', color: '#8888a0', border: 'none' }),
    ...(variant === 'green'   && { background: '#22c55e', color: '#fff' }),
  })

  return (
    <div style={card}>
      {/* Header */}
      <div style={head}>
        <span style={lbl}>🖼 AI Image · Pollinations</span>
        {status === 'done' && (
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={btn('outline', true)} onClick={regenerate}>↺ Redo</button>
            <button style={btn('ghost', true)}   onClick={downloadImg}>⬇ Save</button>
          </div>
        )}
      </div>

      {/* Image prompt display */}
      <div style={{ padding: '10px 14px 0', fontSize: 11, color: '#555570', lineHeight: 1.6, fontStyle: 'italic' }}>
        {prompt?.slice(0, 120)}{prompt?.length > 120 ? '...' : ''}
      </div>

      {/* Image area */}
      <div style={{ padding: 14 }}>

        {/* IDLE state */}
        {status === 'idle' && (
          <button style={btn('red')} onClick={generate}>
            🎨 Generate Image
          </button>
        )}

        {/* LOADING state */}
        {status === 'loading' && (
          <div style={{
            background: '#111114', borderRadius: 10,
            height: 200, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36,
              border: '3px solid rgba(224,48,48,0.2)',
              borderTopColor: '#e03030',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <div style={{ fontSize: 12, color: '#4a4a60' }}>Generating image...</div>
            <div style={{ fontSize: 10, color: '#3a3a50' }}>Powered by Pollinations.ai</div>
          </div>
        )}

        {/* ERROR state */}
        {status === 'error' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 13, color: '#ff6060', marginBottom: 12 }}>⚠️ {errMsg}</div>
            <button style={btn('red')} onClick={generate}>Try Again</button>
          </div>
        )}

        {/* DONE state — show watermarked image */}
        {status === 'done' && wmarkUrl && (
          <div style={{ position: 'relative' }}>
            <img
              ref={imgRef}
              src={wmarkUrl}
              alt={headline || 'SmartBiz News Image'}
              style={{
                width: '100%',
                borderRadius: 10,
                display: 'block',
                animation: 'fadeUp 0.3s ease',
              }}
            />
            {/* Headline overlay */}
            {headline && (
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                padding: '24px 12px 12px',
                borderRadius: '0 0 10px 10px',
              }}>
                <div style={{
                  fontFamily: 'Noto Sans Sinhala, Syne, sans-serif',
                  fontSize: 13, fontWeight: 700,
                  color: '#fff', lineHeight: 1.4,
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                }}>
                  {headline.length > 80 ? headline.slice(0, 80) + '...' : headline}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action buttons after generation */}
        {status === 'done' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
            <button style={btn('outline')} onClick={regenerate}>↺ Regenerate</button>
            <button style={btn('green')}   onClick={downloadImg}>⬇ Download</button>
          </div>
        )}

      </div>
    </div>
  )
}
