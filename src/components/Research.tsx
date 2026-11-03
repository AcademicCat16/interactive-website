import { useState } from 'react'
import { motion } from 'framer-motion'
import Section, { Reveal } from './Section'
import { reviews } from '../data/venture'

export default function Research() {
  const [hover, setHover] = useState<string | null>(null)
  const total = reviews.total
  const shown = reviews.sentiment.find((s) => s.label === hover) ?? reviews.sentiment[0]
  return (
    <Section id="research" eyebrow="Listening to consumers" title={<>What {total} Amazon reviews <span className="text-gold">taught us.</span></>}
      intro={<>We collected {total} reviews of a competing jewelry travel organizer on Amazon, classified each one with AI-assisted analysis, and checked {reviews.checked} classifications against the original reviews by hand.</>}>
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
        <Reveal className="card p-7 sm:p-8">
          <div className="flex items-baseline justify-between flex-wrap gap-3">
            <h3 className="font-display text-xl">Sentiment of the review sample</h3>
            <span className="note">n = {total} reviews</span>
          </div>
          <div className="mt-8 flex items-end gap-4">
            <span className="font-display text-6xl sm:text-7xl font-medium" style={{ color: shown.color }}>{Math.round((shown.value / total) * 100)}%</span>
            <span className="pb-3 text-white/70">{shown.label.toLowerCase()}<br /><span className="note">{shown.value} of {total} reviews</span></span>
          </div>
          <div className="mt-7 flex h-14 w-full overflow-hidden rounded-2xl" role="img" aria-label={reviews.sentiment.map((s) => `${s.label} ${s.value}`).join(', ')}>
            {reviews.sentiment.map((s, i) => (
              <motion.button key={s.label} type="button" onMouseEnter={() => setHover(s.label)} onFocus={() => setHover(s.label)} onClick={() => setHover(s.label)}
                initial={{ width: 0 }} whileInView={{ width: `${(s.value / total) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 + i * 0.15, ease: 'easeOut' }}
                className="h-full cursor-pointer transition-opacity border-r border-ink last:border-0" style={{ background: s.color, opacity: hover && hover !== s.label ? 0.45 : 1 }}
                aria-label={`${s.label}: ${s.value} reviews`} />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-5 text-sm text-white/70">
            {reviews.sentiment.map((s) => <span key={s.label} className="inline-flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />{s.label} <b className="text-white">{s.value}</b></span>)}
          </div>
          <p className="note mt-6">Hover or tap a segment. Counts describe only this collected sample, not all consumers.</p>
        </Reveal>

        <Reveal delay={0.1} className="card p-7 sm:p-8 flex flex-col">
          <p className="eyebrow">Top defect</p>
          <div className="mt-4 flex items-center gap-5">
            <svg viewBox="0 0 80 80" className="w-24 h-24 shrink-0" role="img" aria-label={`${reviews.snapDefects} of ${total} reviews reported faulty snaps`}>
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,244,228,0.1)" strokeWidth="9" />
              <motion.circle cx="40" cy="40" r="32" fill="none" stroke="#b5564a" strokeWidth="9" strokeLinecap="round" transform="rotate(-90 40 40)"
                strokeDasharray={2 * Math.PI * 32} initial={{ strokeDashoffset: 2 * Math.PI * 32 }} whileInView={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - reviews.snapDefects / total) }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.3 }} />
              <text x="40" y="46" textAnchor="middle" fontSize="18" fontWeight="600" fill="#fff8ee" fontFamily="Plus Jakarta Sans, sans-serif">{reviews.snapDefects}</text>
            </svg>
            <div>
              <h3 className="font-display text-2xl">Faulty snaps</h3>
              <p className="text-white/70 mt-1">{reviews.snapDefects} of {total} reviews reported snaps that failed, making closures our first design priority.</p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {reviews.themes.map((t) => (
              <div key={t.title} className="rounded-2xl bg-panel-2 border border-line p-4">
                <p className="font-semibold text-[14px]">{t.title}</p>
                <p className="text-[13px] text-white/60 mt-1 leading-snug">{t.text}</p>
              </div>
            ))}
          </div>
          <p className="note mt-auto pt-6">Limitation: {reviews.limitation}</p>
        </Reveal>
      </div>
    </Section>
  )
}
