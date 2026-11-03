import { brand } from '../data/venture'
import { GemIcon } from './Navbar'

export default function Footer() {
  return (
    <footer className="border-t border-line px-5 sm:px-10 lg:px-16 py-12">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3 text-white/85">
          <GemIcon size={24} />
          <div>
            <p className="font-display font-semibold">{brand.name}</p>
            <p className="text-[13px] text-white/50">A Principles of Marketing venture project</p>
          </div>
        </div>
        <p className="note max-w-xl md:text-right">Research figures describe the collected samples only, not all consumers. AI focus-group participants are fictional. The product shown is a concept illustration.</p>
      </div>
    </footer>
  )
}
