import { useState } from 'react'
import { motion } from 'framer-motion'
import Section, { Reveal } from './Section'
import { swot } from '../data/venture'

export default function Swot() {
  const [open, setOpen] = useState<string>('O')
  return (
    <Section id="swot" eyebrow="SWOT" title={<>Honest about the <span className="text-gold">road ahead.</span></>}
      intro="Internal strengths and weaknesses, external opportunities and threats. Select a quadrant to focus on it.">
      <div className="grid sm:grid-cols-2 gap-4">
        {swot.map((q, i) => {
          const active = open === q.key
          return (
            <Reveal key={q.key} delay={i * 0.06}>
              <motion.button type="button" onClick={() => setOpen(q.key)} aria-pressed={active} layout
                className={`w-full text-left rounded-[20px] border p-6 sm:p-7 cursor-pointer transition-colors ${active ? 'bg-gold-soft border-gold/50' : 'bg-panel border-line hover:border-white/20'}`}>
                <div className="flex items-center gap-4">
                  <span className={`grid place-items-center w-11 h-11 rounded-xl font-display text-xl font-semibold ${active ? 'bg-gold text-ink' : 'bg-panel-2 text-gold'}`}>{q.key}</span>
                  <div>
                    <h3 className="font-display text-xl">{q.title}</h3>
                    <p className="text-[12px] uppercase tracking-[0.14em] text-white/40">{q.tone}</p>
                  </div>
                </div>
                <ul className={`mt-5 space-y-2.5 text-[14.5px] leading-relaxed transition-opacity ${active ? 'text-white/85' : 'text-white/50'}`}>
                  {q.items.map((it) => <li key={it} className="flex gap-3"><span className="text-gold mt-[2px]">–</span><span>{it}</span></li>)}
                </ul>
              </motion.button>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
