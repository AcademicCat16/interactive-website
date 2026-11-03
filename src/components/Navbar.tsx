import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { brand } from '../data/venture'

const navLinks = [
  { label: 'Concept', href: '#concept' },
  { label: 'Research', href: '#research' },
  { label: 'Market', href: '#market' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Plan', href: '#plan' },
]

export function GemIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3h12l3 5-9 13L3 8z" />
      <path d="M3 8h18M9 3l3 5 3-5M12 8v13M7.5 8 12 21M16.5 8 12 21" />
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40)
    f(); window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled || open ? 'bg-ink/85 backdrop-blur-md border-b border-line' : ''}`}
      aria-label="Main"
    >
      <div className="flex items-center justify-between px-5 sm:px-10 lg:px-11 py-4 sm:py-5">
        <div className="flex items-center gap-10">
          <a href="#top" className="flex items-center gap-3 text-[#fff8ee] no-underline" aria-label={`${brand.name} home`}>
            <GemIcon />
            <span className="font-display text-[15px] font-semibold tracking-tight hidden sm:inline">{brand.name}</span>
          </a>
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-[14px] font-medium text-white/80 hover:text-white no-underline transition-colors">{l.label}</a>
            ))}
          </div>
        </div>
        <motion.a href="#plan" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="btn-light hidden md:inline-flex !py-[11px] shadow-[0_4px_18px_rgba(0,0,0,0.25)]">
          See the plan
        </motion.a>
        <button className="md:hidden text-white p-2 -mr-2" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden px-5 pb-5 flex flex-col gap-1">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-3 text-[15px] text-white/85 no-underline border-b border-line">{l.label}</a>
          ))}
        </div>
      )}
    </motion.nav>
  )
}
