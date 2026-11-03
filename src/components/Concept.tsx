import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Section, { Reveal } from './Section'
import { features } from '../data/venture'

type FeatureId = (typeof features)[number]['id']
const HOTSPOTS: Record<FeatureId, { x: number; y: number }> = {
  necklace: { x: 110, y: 52 },
  snaps: { x: 600, y: 168 },
  page: { x: 470, y: 300 },
  small: { x: 455, y: 150 },
  compact: { x: 320, y: 372 },
}

/** Concept illustration of the open organizer (not a product photo). */
function OrganizerArt({ active, onPick }: { active: FeatureId; onPick: (id: FeatureId) => void }) {
  const on = (id: FeatureId) => active === id
  const glow = (id: FeatureId) => (on(id) ? { stroke: '#d6b67a', strokeWidth: 2.2, filter: 'url(#glow)' } : { stroke: 'rgba(255,244,228,0.28)', strokeWidth: 1.4 })
  return (
    <svg viewBox="0 0 640 400" className="w-full h-auto" role="group" aria-label="Concept illustration of the open organizer with five numbered features">
      <defs>
        <linearGradient id="fabric" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2a2420" /><stop offset="1" stopColor="#1a1714" /></linearGradient>
        <linearGradient id="chain" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f1d9a6" /><stop offset="1" stopColor="#b8935a" /></linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {/* panels */}
      <rect x="18" y="22" width="296" height="346" rx="26" fill="url(#fabric)" stroke="rgba(255,244,228,0.16)" />
      <rect x="326" y="22" width="296" height="346" rx="26" fill="url(#fabric)" stroke="rgba(255,244,228,0.16)" />
      <line x1="320" y1="34" x2="320" y2="356" strokeDasharray="5 7" {...glow('compact')} />

      {/* necklace bar + long pockets */}
      <g>
        <rect x="44" y="44" width="244" height="14" rx="7" fill="#3a322b" {...glow('necklace')} />
        {[70, 130, 190, 250].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy="51" r="4" fill="url(#chain)" />
            <rect x={x - 22} y="70" width="44" height={i % 2 ? 230 : 270} rx="12" fill="rgba(255,255,255,0.035)" {...glow('necklace')} />
            <path d={`M${x} 55 C ${x - 12} 120, ${x + 12} 170, ${x} ${i % 2 ? 230 : 280}`} fill="none" stroke="url(#chain)" strokeWidth="2" strokeDasharray="1.5 3.2" strokeLinecap="round" />
            <circle cx={x} cy={i % 2 ? 236 : 286} r="6" fill="none" stroke="url(#chain)" strokeWidth="2" />
          </g>
        ))}
      </g>

      {/* earrings grid + ring roll */}
      <g>
        <rect x="350" y="46" width="248" height="120" rx="16" fill="rgba(255,255,255,0.03)" {...glow('small')} />
        {Array.from({ length: 12 }, (_, k) => <circle key={k} cx={378 + (k % 6) * 22} cy={78 + Math.floor(k / 6) * 26} r="3.5" fill="#5a4e43" />)}
        {[0, 1, 2].map((k) => <circle key={k} cx={386 + k * 22} cy={78} r="5" fill="none" stroke="url(#chain)" strokeWidth="1.8" />)}
        <rect x="520" y="62" width="62" height="88" rx="31" fill="#2f2924" stroke="rgba(255,244,228,0.2)" />
        {[82, 106, 130].map((y) => <circle key={y} cx="551" cy={y} r="9" fill="none" stroke="url(#chain)" strokeWidth="3" />)}
      </g>

      {/* separate storage page */}
      <g>
        <rect x="350" y="186" width="248" height="160" rx="16" fill="rgba(255,255,255,0.04)" {...glow('page')} />
        <line x1="368" y1="206" x2="580" y2="206" stroke="#7a6a58" strokeWidth="2" strokeDasharray="3 3" />
        <rect x="574" y="200" width="10" height="12" rx="3" fill="url(#chain)" />
        <rect x="372" y="226" width="96" height="100" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,244,228,0.14)" />
        <rect x="480" y="226" width="96" height="100" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,244,228,0.14)" />
        <path d="M398 260c12-18 32-18 44 0-12 22-32 22-44 0z" fill="none" stroke="url(#chain)" strokeWidth="2" />
        <rect x="508" y="252" width="40" height="40" rx="8" fill="none" stroke="url(#chain)" strokeWidth="2" />
      </g>

      {/* snaps */}
      <g>
        {[[30, 200], [610, 200]].map(([x, y]) => (
          <g key={x}>
            <circle cx={x} cy={y} r="11" fill="#2a241f" {...glow('snaps')} />
            <circle cx={x} cy={y} r="5" fill="url(#chain)" />
          </g>
        ))}
      </g>

      {/* hotspots */}
      {features.map((f) => {
        const p = HOTSPOTS[f.id]
        const sel = on(f.id)
        return (
          <g key={f.id} role="button" tabIndex={0} aria-label={`${f.n}. ${f.title}`} aria-pressed={sel} className="cursor-pointer outline-none"
            onClick={() => onPick(f.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(f.id) } }}>
            {sel && <circle cx={p.x} cy={p.y} r="22" fill="rgba(214,182,122,0.18)"><animate attributeName="r" values="16;24;16" dur="2s" repeatCount="indefinite" /></circle>}
            <circle cx={p.x} cy={p.y} r="14" fill={sel ? '#d6b67a' : '#0b0a09'} stroke="#d6b67a" strokeWidth="1.6" />
            <text x={p.x} y={p.y + 4.5} textAnchor="middle" fontSize="13" fontWeight="700" fill={sel ? '#0b0a09' : '#d6b67a'} fontFamily="Inter, sans-serif">{f.n}</text>
          </g>
        )
      })}
    </svg>
  )
}

export default function Concept() {
  const [active, setActive] = useState<FeatureId>('necklace')
  const f = features.find((x) => x.id === active)!
  return (
    <Section id="concept" eyebrow="The concept" title={<>Every piece in its place, <span className="text-gold">nothing tangled.</span></>}
      intro="A compact, fold-out organizer designed around the frustrations travelers already report. Tap a number to explore each feature and the evidence behind it.">
      <div className="grid lg:grid-cols-[1.35fr_1fr] gap-8 items-start">
        <Reveal className="card p-4 sm:p-6">
          <OrganizerArt active={active} onPick={setActive} />
          <p className="note mt-3 text-center">Concept illustration, not a final product photo.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-5" role="tablist" aria-label="Features">
            {features.map((x) => (
              <button key={x.id} role="tab" aria-selected={x.id === active} onClick={() => setActive(x.id)}
                className={`chip cursor-pointer transition-colors ${x.id === active ? '!border-gold !text-ink !bg-gold font-semibold' : 'hover:!text-white'}`}>
                {x.n}. {x.title}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={f.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="card p-7" role="tabpanel">
              <p className="eyebrow">Feature {f.n}</p>
              <h3 className="font-display text-2xl mt-2">{f.title}</h3>
              <p className="text-gold/90 mt-1 text-[15px]">{f.short}</p>
              <p className="text-white/75 mt-4 leading-relaxed">{f.detail}</p>
              <div className="mt-6 rounded-2xl bg-gold-soft border border-gold/25 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-gold font-semibold">Why it matters</p>
                <p className="text-[14px] text-white/80 mt-1.5 leading-relaxed">{f.why}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>
    </Section>
  )
}
