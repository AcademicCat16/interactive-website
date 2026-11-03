import Section, { Reveal } from './Section'
import { census, nextSteps, reviews } from '../data/venture'

export default function Plan() {
  return (
    <Section id="plan" eyebrow="The plan" title={<>What we keep, what we change, <span className="text-gold">what we test next.</span></>}
      intro="Turning the research into decisions, with the limits of each study in plain view.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {nextSteps.map((s, i) => (
          <Reveal key={s.title} delay={(i % 3) * 0.08} className="card p-6 sm:p-7 h-full">
            <span className="font-display text-sm text-gold">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="font-display text-xl mt-3">{s.title}</h3>
            <p className="text-white/65 mt-2 leading-relaxed text-[14.5px]">{s.text}</p>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.1} className="mt-6 card p-6 sm:p-8">
        <p className="eyebrow">Limitations</p>
        <ul className="mt-4 grid md:grid-cols-3 gap-5 text-[14px] text-white/65 leading-relaxed">
          <li><b className="text-white/90 block mb-1">Reviews</b>{reviews.limitation}</li>
          <li><b className="text-white/90 block mb-1">Census</b>{census.limitation}</li>
          <li><b className="text-white/90 block mb-1">AI focus group & pricing</b>Simulated participants generate ideas, not evidence of demand. Break-even results rest on an assumed 100 sales per month that has not been verified.</li>
        </ul>
      </Reveal>
    </Section>
  )
}
