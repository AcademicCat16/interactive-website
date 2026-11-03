import { useState } from 'react'
import { motion } from 'framer-motion'
import Section, { Reveal } from './Section'
import { pricing } from '../data/venture'

const money = (x: number) => `$${x.toFixed(2).replace(/\.00$/, '')}`
const MIN = 10, MAX = 82
const pos = (x: number) => `${((x - MIN) / (MAX - MIN)) * 100}%`

function PriceExplorer() {
  const [price, setPrice] = useState(pricing.price)
  const lo = price * (1 - pricing.band), hi = price * (1 + pricing.band)
  const regular = pricing.competitors.filter((c) => !c.promo)
  const cheaper = regular.filter((c) => c.price < lo).length
  const comparable = regular.filter((c) => c.price >= lo && c.price <= hi).length
  const pricier = regular.filter((c) => c.price > hi).length
  const position = price < 40 ? 'Value position: at or below the ~$40 alternatives' : price <= 59 ? 'Middle position: above ~$40 alternatives, below premium cases' : 'Premium position: competing with higher-priced brands'
  return (
    <div className="card p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-xl">Price position explorer</h3>
          <p className="text-white/60 text-[14px] mt-1">Drag to test a price against real competitor prices. Comparable means within ±15%.</p>
        </div>
        <div className="text-right">
          <span className="font-display text-5xl font-medium text-gold">{money(price)}</span>
          {price === pricing.price && <span className="block text-[12px] text-white/50">chosen price</span>}
        </div>
      </div>

      <div className="relative mt-10 mb-4 h-32 select-none" aria-hidden="true">
        <div className="absolute top-14 inset-x-0 h-1.5 rounded-full bg-white/10" />
        <div className="absolute top-12 h-5 rounded-full bg-gold/20 border border-gold/40 transition-all" style={{ left: pos(lo), width: `calc(${pos(hi)} - ${pos(lo)})` }} />
        {[20, 30, 40, 50, 60, 70, 80].map((t) => <span key={t} className="absolute top-[104px] -translate-x-1/2 text-[11px] text-white/35" style={{ left: pos(t) }}>${t}</span>)}
        {pricing.competitors.map((c, i) => (
          <div key={c.name} className={`absolute -translate-x-1/2 flex items-center ${c.promo ? 'flex-col-reverse' : 'flex-col'}`} style={{ left: pos(c.price), top: c.promo ? 59 : i % 2 ? 0 : 26 }}>
            <span className={`whitespace-nowrap text-[11px] px-2 py-0.5 rounded-full border ${c.promo ? 'border-white/15 text-white/40 border-dashed' : 'border-line text-white/75 bg-panel-2'}`}>{c.short} {money(c.price)}{c.promo ? ' promo' : ''}</span>
            <span className={`w-px ${c.promo ? 'h-3' : i % 2 ? 'h-[38px]' : 'h-3'} ${c.promo ? 'bg-white/20' : 'bg-white/45'}`} />
          </div>
        ))}
        <motion.div className="absolute top-[42px] -translate-x-1/2 w-6 h-6 rounded-full bg-gold border-4 border-ink shadow-[0_0_0_2px_#d6b67a]" animate={{ left: pos(price) }} transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
      </div>
      <input type="range" min={20} max={75} step={1} value={price} onChange={(e) => setPrice(+e.target.value)} className="w-full accent-[#d6b67a]" aria-label="Test price in dollars" />

      <div className="grid grid-cols-3 gap-3 mt-6">
        {[['Cheaper', cheaper], ['Comparable', comparable], ['More expensive', pricier]].map(([l, n]) => (
          <div key={l} className="rounded-2xl bg-panel-2 border border-line p-4 text-center">
            <div className="font-display text-3xl">{n}</div>
            <div className="text-[12.5px] text-white/55 mt-1">{l}</div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[14px] text-white/75">{position}. Comparable band: {money(lo)}–{money(hi)}.</p>
      <p className="note mt-3">Counts use the three regular-price products shown. BAGSMART Dazzling ($22.99) was a promotional price on an unavailable variant, so it is shown dashed and excluded. In the Mission 2 comparison of four representative products, $49 had 2 cheaper, 0 comparable and 2 more expensive; the fourth product is not listed in the write-up.</p>
    </div>
  )
}

function UnitEconomics() {
  const [key, setKey] = useState<'base' | 'up20'>('base')
  const s = pricing.scenarios[key]
  const other = +(pricing.price - pricing.unit.contribution - pricing.unit.manufacturing - pricing.unit.shipping).toFixed(2)
  const parts = [
    { label: 'Manufacturing', value: s.manufacturing, color: '#8a7a64' },
    { label: 'Outbound shipping', value: pricing.unit.shipping, color: '#5f564b' },
    { label: 'Other variable costs', value: other, color: '#423b34' },
    { label: 'Contribution', value: s.contribution, color: '#d6b67a' },
  ]
  return (
    <div className="card p-6 sm:p-8 flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-xl">Where $49 goes</h3>
        <div className="flex rounded-full bg-panel-2 border border-line p-1" role="tablist" aria-label="Cost scenario">
          {(['base', 'up20'] as const).map((k) => (
            <button key={k} role="tab" aria-selected={k === key} onClick={() => setKey(k)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] cursor-pointer transition-colors ${k === key ? 'bg-gold text-ink font-semibold' : 'text-white/60 hover:text-white'}`}>{pricing.scenarios[k].label}</button>
          ))}
        </div>
      </div>
      <div className="mt-7 flex h-12 w-full overflow-hidden rounded-xl" role="img" aria-label={parts.map((p) => `${p.label} ${money(p.value)}`).join(', ')}>
        {parts.map((p) => (
          <motion.div key={p.label} className="h-full flex items-center justify-center text-[12px] font-semibold overflow-hidden" style={{ background: p.color, color: p.label === 'Contribution' ? '#0b0a09' : 'rgba(255,248,238,0.85)' }}
            animate={{ width: `${(p.value / pricing.price) * 100}%` }} transition={{ type: 'spring', stiffness: 200, damping: 28 }}>
            {money(p.value)}
          </motion.div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[13px] text-white/65">
        {parts.map((p) => <span key={p.label} className="inline-flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: p.color }} />{p.label}</span>)}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-panel-2 border border-line p-4">
          <div className="text-[12.5px] text-white/55">Monthly break-even</div>
          <div className="font-display text-3xl mt-1">{s.breakEven} <span className="text-base text-white/50">units</span></div>
        </div>
        <div className="rounded-2xl bg-panel-2 border border-line p-4">
          <div className="text-[12.5px] text-white/55">Annual manufacturing at {pricing.assumedMonthlySales}/mo</div>
          <div className="font-display text-3xl mt-1">${s.annualManufacturing.toLocaleString()}</div>
        </div>
      </div>
      <div className="mt-5">
        <div className="flex justify-between text-[12px] text-white/50 mb-1.5"><span>Break-even vs. assumed sales</span><span>{s.breakEven} / {pricing.assumedMonthlySales} units per month</span></div>
        <div className="h-2.5 rounded-full bg-white/10 overflow-hidden"><motion.div className="h-full rounded-full bg-gold" animate={{ width: `${(s.breakEven / pricing.assumedMonthlySales) * 100}%` }} /></div>
      </div>
      <p className="note mt-6">From the Pricing &amp; Cost Laboratory model. “Other variable costs” is derived as price − contribution − manufacturing − shipping. A 20% rise in manufacturing cost ($16 → $19.20) cuts contribution to $12.78 and raises break-even from 50 to 63 units. The 100 sales per month is a model assumption; actual demand has not been verified.</p>
    </div>
  )
}

export default function Pricing() {
  return (
    <Section id="pricing" eyebrow="Pricing" title={<>$49: above the basics, <span className="text-gold">below the luxury cases.</span></>}
      intro={`A feature-focused middle position within the preliminary $${pricing.range[0]}–$${pricing.range[1]} range. The extra necklace supports and separate storage page must earn the $9 premium over the ~$40 alternatives.`}>
      <div className="grid lg:grid-cols-2 gap-6">
        <Reveal><PriceExplorer /></Reveal>
        <Reveal delay={0.1} className="flex"><UnitEconomics /></Reveal>
      </div>
      <Reveal delay={0.1} className="mt-6 card p-6 sm:p-8">
        <h3 className="font-display text-xl">Competitor reference prices</h3>
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {pricing.competitors.map((c) => (
            <li key={c.name} className="py-3.5 grid sm:grid-cols-[220px_110px_1fr] gap-x-4 gap-y-1 text-[14px]">
              <span className="font-medium">{c.name}</span>
              <span className="font-display">{money(c.price)}{c.promo && <span className="ml-2 text-[11px] text-white/45">promo</span>}</span>
              <span className="text-white/60">{c.note}</span>
            </li>
          ))}
        </ul>
        <p className="note mt-4">Quince’s $40 regular price is the most reliable benchmark: it was verified on the official product page, available to buy and not on promotion. Prices were recorded during the Mission 2 research and may have changed.</p>
      </Reveal>
    </Section>
  )
}
