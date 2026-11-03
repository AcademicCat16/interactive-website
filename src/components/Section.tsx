import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function Section({ id, eyebrow, title, intro, children, className = '' }: { id: string; eyebrow: string; title: ReactNode; intro?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative px-5 sm:px-10 lg:px-16 py-24 sm:py-32 ${className}`} aria-labelledby={`${id}-title`}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={`${id}-title`} className="h2 mt-4 max-w-3xl">{title}</h2>
          {intro && <p className="lede mt-5">{intro}</p>}
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  )
}
