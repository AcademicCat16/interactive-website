import { motion, useReducedMotion } from 'framer-motion'
import { brand } from '../data/venture'
import HeroScene from './HeroScene'

export default function Hero() {
  const reduce = useReducedMotion()
  const rise = (delay: number, y = 16) => ({ initial: reduce ? false : { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: 'easeOut' as const } })
  return (
    <section id="top" className="relative w-full h-[100svh] min-h-[620px] overflow-hidden">
      <div className="absolute inset-0 max-md:opacity-40 md:left-[18%]"><HeroScene /></div>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 25%, transparent 55%, rgba(11,10,9,0.95) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(8,20,20,0.92) 0%, rgba(8,20,20,0.55) 32%, transparent 58%)' }} />

      <div className="relative z-10 flex flex-col h-full justify-start pt-[22vh] px-5 sm:pl-16 sm:pr-6">
        <motion.div {...rise(0.1, 14)} className="inline-flex items-center gap-2.5 w-fit rounded-full py-1.5 pl-1.5 pr-4 bg-white/[0.07] border border-white/15 backdrop-blur-md">
          <span className="grid place-items-center w-[22px] h-[22px] rounded-full bg-gold text-ink text-[11px] font-bold" aria-hidden="true">✦</span>
          <span className="text-[12.5px] text-white/75">Principles of Marketing · <strong className="text-white font-semibold">Venture Project</strong></span>
        </motion.div>

        <motion.h1 {...rise(0.25, 22)} className="font-display font-medium text-[clamp(2.5rem,5vw,4.4rem)] leading-[1.05] tracking-[-0.02em] mt-6 max-w-[620px]">
          Pack your jewelry.<br />
          <span className="text-gold">Not the tangles.</span>
        </motion.h1>

        <motion.p {...rise(0.42)} className="mt-5 text-[15.5px] leading-relaxed text-white/70 max-w-[440px]">
          {brand.mission}
        </motion.p>

        <motion.div {...rise(0.58)} className="flex flex-wrap items-center gap-3.5 mt-8">
          <motion.a href="#concept" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-light">Explore the concept</motion.a>
          <motion.a href="#research" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-dark">What travelers said</motion.a>
        </motion.div>
      </div>

      <a href="#concept" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60 no-underline text-[11px] tracking-[0.2em] uppercase" aria-label="Scroll to the concept">
        Scroll
        <motion.span animate={reduce ? undefined : { y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} className="block w-px h-8 bg-white/40" />
      </a>
    </section>
  )
}
