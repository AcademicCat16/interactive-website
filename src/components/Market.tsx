import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Section, { Reveal } from './Section'
import { census, segments } from '../data/venture'

// Tile-grid map: [abbr, name, column, row]. Includes D.C. and Puerto Rico, matching the 52 Census rows.
const TILES: [string, string, number, number][] = [
  ['AK', 'Alaska', 0, 0], ['ME', 'Maine', 11, 0],
  ['WI', 'Wisconsin', 6, 1], ['VT', 'Vermont', 10, 1], ['NH', 'New Hampshire', 11, 1],
  ['WA', 'Washington', 1, 2], ['ID', 'Idaho', 2, 2], ['MT', 'Montana', 3, 2], ['ND', 'North Dakota', 4, 2], ['MN', 'Minnesota', 5, 2], ['IL', 'Illinois', 6, 2], ['MI', 'Michigan', 7, 2], ['NY', 'New York', 9, 2], ['MA', 'Massachusetts', 10, 2],
  ['OR', 'Oregon', 1, 3], ['NV', 'Nevada', 2, 3], ['WY', 'Wyoming', 3, 3], ['SD', 'South Dakota', 4, 3], ['IA', 'Iowa', 5, 3], ['IN', 'Indiana', 6, 3], ['OH', 'Ohio', 7, 3], ['PA', 'Pennsylvania', 8, 3], ['NJ', 'New Jersey', 9, 3], ['CT', 'Connecticut', 10, 3], ['RI', 'Rhode Island', 11, 3],
  ['CA', 'California', 1, 4], ['UT', 'Utah', 2, 4], ['CO', 'Colorado', 3, 4], ['NE', 'Nebraska', 4, 4], ['MO', 'Missouri', 5, 4], ['KY', 'Kentucky', 6, 4], ['WV', 'West Virginia', 7, 4], ['VA', 'Virginia', 8, 4], ['MD', 'Maryland', 9, 4], ['DE', 'Delaware', 10, 4],
  ['AZ', 'Arizona', 2, 5], ['NM', 'New Mexico', 3, 5], ['KS', 'Kansas', 4, 5], ['AR', 'Arkansas', 5, 5], ['TN', 'Tennessee', 6, 5], ['NC', 'North Carolina', 7, 5], ['SC', 'South Carolina', 8, 5], ['DC', 'Washington, D.C.', 9, 5],
  ['OK', 'Oklahoma', 4, 6], ['LA', 'Louisiana', 5, 6], ['MS', 'Mississippi', 6, 6], ['AL', 'Alabama', 7, 6], ['GA', 'Georgia', 8, 6],
  ['HI', 'Hawaii', 0, 7], ['TX', 'Texas', 4, 7], ['FL', 'Florida', 9, 7], ['PR', 'Puerto Rico', 11, 7],
]

function TileMap() {
  const [hover, setHover] = useState<string | null>(null)
  const name = TILES.find((t) => t[0] === hover)?.[1]
  const top = (a: string) => census.largest.includes(a)
  const S = 46, G = 5
  return (
    <div>
      <svg viewBox={`0 0 ${12 * (S + G)} ${8 * (S + G)}`} className="w-full h-auto" role="img" aria-label={`Map of the 52 locations in the Census dataset; ${census.largestNames} highlighted as the largest populations of women ages 18 to 54`}>
        {TILES.map(([a, n, c, r]) => (
          <g key={a} onMouseEnter={() => setHover(a)} onMouseLeave={() => setHover(null)} className="cursor-default">
            <title>{n}{top(a) ? ': among the largest populations of women ages 18–54' : ''}</title>
            <motion.rect x={c * (S + G)} y={r * (S + G)} width={S} height={S} rx="9"
              fill={top(a) ? '#d6b67a' : hover === a ? '#3a332c' : '#221e1a'} stroke={top(a) ? '#f1d9a6' : 'rgba(255,244,228,0.08)'}
              initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: (c + r) * 0.025 }}
              style={{ transformOrigin: `${c * (S + G) + S / 2}px ${r * (S + G) + S / 2}px` }} />
            <text x={c * (S + G) + S / 2} y={r * (S + G) + S / 2 + 4.5} textAnchor="middle" fontSize="13" fontWeight={top(a) ? 700 : 500} fill={top(a) ? '#0b0a09' : 'rgba(255,248,238,0.55)'} fontFamily="Inter, sans-serif" pointerEvents="none">{a}</text>
          </g>
        ))}
      </svg>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <span className="inline-flex items-center gap-2 text-white/70"><span className="w-3 h-3 rounded bg-gold" /> Largest populations of women 18–54 · first ad tests</span>
        <span className="text-white/50 min-h-5">{name ?? 'Hover a state'}</span>
      </div>
    </div>
  )
}

function R2Ring() {
  const r = 52, c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 140 140" className="w-36 h-36 shrink-0" role="img" aria-label={`Income explains ${Math.round(census.r2 * 1000) / 10} percent of the variation`}>
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,244,228,0.1)" strokeWidth="14" />
      <motion.circle cx="70" cy="70" r={r} fill="none" stroke="#d6b67a" strokeWidth="14" strokeLinecap="round" transform="rotate(-90 70 70)"
        strokeDasharray={c} initial={{ strokeDashoffset: c }} whileInView={{ strokeDashoffset: c * (1 - census.r2) }} viewport={{ once: true }} transition={{ duration: 1.3, delay: 0.2 }} />
      <text x="70" y="74" textAnchor="middle" fontSize="26" fontWeight="600" fill="#fff8ee" fontFamily="Plus Jakarta Sans, sans-serif">{(census.r2 * 100).toFixed(1)}%</text>
      <text x="70" y="94" textAnchor="middle" fontSize="10" fill="rgba(255,248,238,0.55)" fontFamily="Inter, sans-serif">R²</text>
    </svg>
  )
}

export default function Market() {
  const [seg, setSeg] = useState(segments[1].id)
  const s = segments.find((x) => x.id === seg)!
  return (
    <Section id="market" eyebrow="Who it’s for" title={<>A clear customer, <span className="text-gold">tested market by market.</span></>}
      intro="The proposed target market starts with U.S. online shoppers, and the Census analysis shows where to test first.">
      <Reveal className="card p-3 sm:p-4">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Segmentation">
          {segments.map((x) => (
            <button key={x.id} role="tab" aria-selected={x.id === seg} onClick={() => setSeg(x.id)}
              className={`px-4 py-2.5 rounded-xl text-[14px] font-medium cursor-pointer transition-colors ${x.id === seg ? 'bg-gold text-ink' : 'text-white/65 hover:text-white hover:bg-white/5'}`}>{x.label}</button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={s.id} role="tabpanel" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}
            className="px-3 sm:px-4 pt-6 pb-5 font-display text-[clamp(1.15rem,2vw,1.5rem)] leading-snug text-white/90 max-w-4xl">{s.text}</motion.p>
        </AnimatePresence>
      </Reveal>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 mt-6">
        <Reveal className="card p-6 sm:p-8">
          <h3 className="font-display text-xl">Where the audience is largest</h3>
          <p className="text-white/60 text-[14px] mt-1 mb-6">{census.largestNames} have the largest populations of women ages 18–54 among the {census.rows} locations analysed.</p>
          <TileMap />
        </Reveal>
        <Reveal delay={0.1} className="card p-6 sm:p-8 flex flex-col">
          <h3 className="font-display text-xl">Does income predict the audience?</h3>
          <div className="flex items-center gap-5 mt-6">
            <R2Ring />
            <p className="text-white/75 leading-relaxed text-[15px]">Only a little. Higher-income states tend to have a slightly larger share of women 18–54, but income explains just <b className="text-gold">18.8%</b> of the variation.</p>
          </div>
          <div className="mt-6 rounded-2xl bg-panel-2 border border-line p-4 text-[14px] text-white/75 leading-relaxed">
            <b className="text-white">So what:</b> choose test markets by audience size first and use income as supporting context. Lead with practical benefits and test price points rather than assume a premium buyer.
          </div>
          <p className="note mt-auto pt-6">Linear regression across {census.rows} rows ({census.locations}). Source: {census.source}. {census.limitation} Correlation does not prove causation.</p>
        </Reveal>
      </div>
    </Section>
  )
}
