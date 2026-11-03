import Section, { Reveal } from './Section'
import { focusGroup } from '../data/venture'

export default function FocusGroup() {
  return (
    <Section id="focus" eyebrow="AI focus group" title={<>The questions a skeptic <span className="text-gold">would ask.</span></>}
      intro="An OASIS simulated focus group helped stress-test the idea before talking to real customers.">
      <Reveal className="mb-6">
        <div className="inline-flex items-start gap-3 rounded-2xl border border-gold/30 bg-gold-soft px-4 py-3 text-[13.5px] text-white/80 max-w-3xl">
          <span className="text-gold font-bold" aria-hidden="true">!</span>
          <span>{focusGroup.note}</span>
        </div>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-6">
        {focusGroup.quotes.map((q, i) => (
          <Reveal key={q.who} delay={i * 0.1} className="card p-7 sm:p-8 flex flex-col">
            <span className="font-display text-6xl leading-none text-gold/60" aria-hidden="true">“</span>
            <blockquote className="font-display text-[1.3rem] leading-snug text-white/90 -mt-4">{q.quote}</blockquote>
            <p className="mt-4 text-[13px] text-white/55"><b className="text-white/85">{q.who}</b> · {q.persona} · {q.round}</p>
            <div className="mt-6 pt-5 border-t border-line text-[14.5px] text-white/70 leading-relaxed">{q.insight}</div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.15} className="mt-6 card p-7 sm:p-8 grid md:grid-cols-[1fr_1.3fr] gap-6 items-center">
        <div>
          <p className="eyebrow">Themes raised</p>
          <div className="flex flex-wrap gap-2 mt-4">{focusGroup.themes.map((t) => <span key={t} className="chip">{t}</span>)}</div>
        </div>
        <div>
          <p className="eyebrow">What we’ll change</p>
          <p className="mt-3 text-white/85 leading-relaxed">{focusGroup.action} The durability concern echoes the real reviews, where faulty snaps were the top defect. The simulation itself is an idea to test, not proof of demand.</p>
        </div>
      </Reveal>
    </Section>
  )
}
