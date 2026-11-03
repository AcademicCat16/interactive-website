/**
 * Cinematic hero illustration (replaces the template's stock video): an open travel jewelry organizer
 * floating in warm light, with necklaces swaying, loose gems and drifting sparkles.
 * Pure SVG + CSS animation; motion is disabled for users who prefer reduced motion.
 */

// deterministic pseudo-random so the scene is identical on every load
const rand = (seed: number) => () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
const r = rand(11)
const SPARKS = Array.from({ length: 34 }, (_, i) => ({ x: 80 + r() * 680, y: 120 + r() * 520, s: 0.8 + r() * 2.2, d: 5 + r() * 7, delay: -r() * 10, k: i }))

const NECKLACES = [
  { x: 300, len: 250, pendant: 'drop', delay: '0s' },
  { x: 336, len: 310, pendant: 'round', delay: '-1.6s' },
  { x: 372, len: 205, pendant: 'gem', delay: '-0.8s' },
  { x: 408, len: 285, pendant: 'drop', delay: '-2.4s' },
  { x: 444, len: 230, pendant: 'round', delay: '-1.1s' },
]

function Gem({ x, y, size, blur = 0, rot = 0, cls = '' }: { x: number; y: number; size: number; blur?: number; rot?: number; cls?: string }) {
  const s = size
  return (
    <g className={cls} style={{ filter: blur ? `blur(${blur}px)` : undefined }} transform={`translate(${x} ${y}) rotate(${rot})`}>
      <polygon points={`${-s},${-s * 0.35} ${-s * 0.55},${-s} ${s * 0.55},${-s} ${s},${-s * 0.35} 0,${s * 1.1}`} fill="url(#gemFill)" />
      <polygon points={`${-s},${-s * 0.35} ${s},${-s * 0.35} 0,${s * 1.1}`} fill="url(#gemShade)" opacity="0.55" />
      <polyline points={`${-s * 0.55},${-s} ${-s * 0.2},${-s * 0.35} 0,${s * 1.1} ${s * 0.2},${-s * 0.35} ${s * 0.55},${-s}`} fill="none" stroke="rgba(255,250,240,0.55)" strokeWidth="1" />
    </g>
  )
}

function Pendant({ kind, y }: { kind: string; y: number }) {
  if (kind === 'round') return <circle cx="0" cy={y + 9} r="9" fill="url(#gold)" stroke="#f6e3b8" strokeWidth="1" />
  if (kind === 'gem') return <Gem x={0} y={y + 12} size={9} />
  return <path d={`M0 ${y} C 9 ${y + 10}, 9 ${y + 22}, 0 ${y + 26} C -9 ${y + 22}, -9 ${y + 10}, 0 ${y} Z`} fill="url(#pearl)" stroke="#f6e3b8" strokeWidth="0.8" />
}

/** atmosphereOnly: keep the light, gems and sparkles but omit the drawn organizer (the real 3D model replaces it). */
export default function HeroScene({ atmosphereOnly = false }: { atmosphereOnly?: boolean }) {
  return (
    <svg viewBox="0 0 800 720" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="sky" cx="62%" cy="38%" r="75%">
          <stop offset="0" stopColor="#f3c27a" stopOpacity="0.95" />
          <stop offset="0.18" stopColor="#c98a4a" stopOpacity="0.75" />
          <stop offset="0.45" stopColor="#1f4a4a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#081414" />
        </radialGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b0a09" stopOpacity="0" /><stop offset="1" stopColor="#0b0a09" /></linearGradient>
        <linearGradient id="leather" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5b4636" /><stop offset="0.55" stopColor="#3a2c22" /><stop offset="1" stopColor="#2a1f18" /></linearGradient>
        <linearGradient id="lining" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#efe2cf" /><stop offset="1" stopColor="#cdb89c" /></linearGradient>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff1c7" /><stop offset="0.45" stopColor="#e2b867" /><stop offset="1" stopColor="#9c7232" /></linearGradient>
        <linearGradient id="chain" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6dfa3" /><stop offset="1" stopColor="#c79a4f" /></linearGradient>
        <radialGradient id="pearl" cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#ffffff" /><stop offset="0.6" stopColor="#efe4d6" /><stop offset="1" stopColor="#bfae98" /></radialGradient>
        <linearGradient id="gemFill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d9f2f2" /><stop offset="0.5" stopColor="#7fc6c4" /><stop offset="1" stopColor="#2d7f7d" /></linearGradient>
        <linearGradient id="gemShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity="0" /><stop offset="1" stopColor="#0d3b3a" /></linearGradient>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#ffd998" stopOpacity="0.55" /><stop offset="1" stopColor="#ffd998" stopOpacity="0" /></radialGradient>
        <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="18" /></filter>
        <filter id="drop" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="24" stdDeviation="22" floodColor="#000" floodOpacity="0.55" /></filter>
      </defs>

      <rect width="800" height="720" fill="url(#sky)" />
      {/* light rays */}
      <g opacity="0.22" className="hs-pulse">
        {[-28, -14, 0, 14, 28].map((a) => <polygon key={a} points="496,270 470,-40 522,-40" fill="#ffe2a8" transform={`rotate(${a} 496 270)`} filter="url(#soft)" />)}
      </g>
      <ellipse cx="496" cy="300" rx="260" ry="230" fill="url(#halo)" />

      {/* far, out-of-focus gems */}
      <Gem x={690} y={150} size={14} blur={3} rot={18} cls="hs-float-slow" />
      <Gem x={735} y={470} size={10} blur={2.5} rot={-12} cls="hs-float" />
      <Gem x={150} y={600} size={12} blur={3} rot={30} cls="hs-float-slow" />

      {!atmosphereOnly && (<>
      {/* floating organizer */}
      <g className="hs-float" style={{ transformOrigin: '496px 380px' }}>
        <ellipse cx="496" cy="672" rx="230" ry="20" fill="#000" opacity="0.45" filter="url(#soft)" />
        <g transform="translate(496 370) rotate(-4) skewY(-3) translate(-496 -370)" filter="url(#drop)">
          {/* left panel */}
          <rect x="250" y="150" width="236" height="420" rx="30" fill="url(#leather)" />
          <rect x="266" y="166" width="204" height="388" rx="20" fill="url(#lining)" />
          <rect x="266" y="166" width="204" height="388" rx="20" fill="none" stroke="#b49b7c" strokeDasharray="4 5" />
          {/* right panel */}
          <rect x="506" y="150" width="236" height="420" rx="30" fill="url(#leather)" />
          <rect x="522" y="166" width="204" height="388" rx="20" fill="url(#lining)" />
          <rect x="522" y="166" width="204" height="388" rx="20" fill="none" stroke="#b49b7c" strokeDasharray="4 5" />
          <rect x="484" y="160" width="24" height="400" rx="8" fill="#2a1f18" />

          {/* necklace bar */}
          <rect x="282" y="186" width="172" height="14" rx="7" fill="url(#gold)" />
          {/* earring card */}
          <rect x="540" y="186" width="168" height="118" rx="12" fill="#e6d7c2" stroke="#c8b293" />
          {Array.from({ length: 12 }, (_, k) => {
            const cx = 562 + (k % 6) * 25, cy = 214 + Math.floor(k / 6) * 34
            return <g key={k}><circle cx={cx} cy={cy} r="3" fill="#a88f70" />{k % 3 !== 1 && (k % 2 ? <circle cx={cx} cy={cy + 9} r="5.5" fill="none" stroke="url(#gold)" strokeWidth="2.2" /> : <circle cx={cx} cy={cy + 4} r="4" fill="url(#pearl)" />)}</g>
          })}
          <Gem x={600} y={280} size={7} />
          <Gem x={650} y={280} size={7} />
          {/* ring roll */}
          <rect x="540" y="318" width="168" height="52" rx="26" fill="#d9c8b0" stroke="#c0a888" />
          {[570, 604, 638, 672].map((x, i) => <g key={x}><circle cx={x} cy="344" r="13" fill="none" stroke="url(#gold)" strokeWidth="4.5" />{i % 2 === 0 && <Gem x={x} y={330} size={5} />}</g>)}
          {/* separate storage page / zip pocket */}
          <rect x="540" y="384" width="168" height="152" rx="14" fill="#e3d3bd" stroke="#c8b293" />
          <line x1="554" y1="402" x2="694" y2="402" stroke="#9c8466" strokeWidth="2.5" strokeDasharray="2 3" />
          <rect x="686" y="395" width="10" height="16" rx="3" fill="url(#gold)" />
          <path d="M572 450c18-22 46-22 64 0-18 26-46 26-64 0z" fill="none" stroke="url(#gold)" strokeWidth="3" />
          <circle cx="664" cy="470" r="16" fill="none" stroke="url(#gold)" strokeWidth="3" />
          {/* snaps */}
          <circle cx="258" cy="360" r="11" fill="url(#gold)" /><circle cx="258" cy="360" r="4" fill="#7a5a2a" />
          <circle cx="734" cy="360" r="11" fill="url(#gold)" /><circle cx="734" cy="360" r="4" fill="#7a5a2a" />

          {/* swaying necklaces */}
          {NECKLACES.map((n) => (
            <g key={n.x} transform={`translate(${n.x} 193)`}>
              <g className="hs-sway" style={{ animationDelay: n.delay }}>
                <circle cx="0" cy="0" r="4.5" fill="url(#gold)" />
                <path d={`M0 0 C -7 ${n.len * 0.35}, 7 ${n.len * 0.7}, 0 ${n.len}`} fill="none" stroke="url(#chain)" strokeWidth="2.4" strokeDasharray="2.2 2.6" strokeLinecap="round" />
                <Pendant kind={n.pendant} y={n.len} />
              </g>
            </g>
          ))}
        </g>
      </g>

      </>)}
      {/* near gems */}
      <Gem x={150} y={250} size={20} rot={-15} cls="hs-float" />
      <Gem x={772} y={300} size={16} rot={22} cls="hs-float-slow" />

      {/* sparkles */}
      {SPARKS.map((p) => (
        <circle key={p.k} cx={p.x} cy={p.y} r={p.s} fill="#ffe7b5" className="hs-rise" style={{ animationDuration: `${p.d}s`, animationDelay: `${p.delay}s` }} />
      ))}
      <rect y="470" width="800" height="250" fill="url(#floor)" />
    </svg>
  )
}
