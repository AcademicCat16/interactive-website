/**
 * Hero product centerpiece: the confirmed Mission 2 GLB as an interactive 3D model,
 * with an honest static fallback (the confirmed preview.png) when WebGL is unavailable or the model fails to load.
 */
import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { MODEL_DIR, hasWebGL, loadManifest } from './manifest'
import type { Manifest } from './manifest'
import type { StageController } from './ProductStage'

const ProductStage = lazy(() => import('./ProductStage'))

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

function StaticPreview({ reason }: { reason: string }) {
  return (
    <figure className="p3d-fallback" data-testid="product-fallback">
      <img src={`${MODEL_DIR}preview.png`} alt="Static preview image of the Travel Jewelry Organizer model" />
      <figcaption>Static preview image. {reason}</figcaption>
    </figure>
  )
}

const Icon = ({ d }: { d: string }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>

export default function HeroProduct() {
  const reduce = !!useReducedMotion()
  const [webgl] = useState(hasWebGL)
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)
  const [features, setFeatures] = useState(false)
  const [active, setActive] = useState<number | null>(null)
  const [hint, setHint] = useState(true)
  const controller = useRef<StageController>({})
  const onController = useCallback((c: StageController) => { controller.current = c }, [])

  useEffect(() => { loadManifest().then(setManifest).catch(() => setFailed(true)) }, [])
  useEffect(() => { (window as unknown as { __hero3d: unknown }).__hero3d = { ready, webgl, features, active } }, [ready, webgl, features, active])

  if (!webgl) return <StaticPreview reason="Interactive 3D isn't available in this browser." />
  if (failed) return <StaticPreview reason="The interactive 3D model could not be loaded." />

  const toggleFeatures = () => { const on = !features; setFeatures(on); setActive(on ? 0 : null); if (!on) controller.current.reset?.() }
  const step = (d: number) => manifest && setActive((a) => ((a ?? 0) + d + manifest.hotspots.length) % manifest.hotspots.length)
  const h = manifest && active != null ? manifest.hotspots[active] : null

  return (
    <div className="p3d" data-testid="product-3d">
      <Boundary fallback={<StaticPreview reason="The interactive 3D model could not be displayed." />}>
        {!ready && <div className="p3d-loading" aria-live="polite"><span className="p3d-spinner" />Loading interactive 3D model…</div>}
        {manifest && (
          <Suspense fallback={null}>
            <ProductStage manifest={manifest} onController={onController} reduceMotion={reduce} showHotspots={features} activeHotspot={active}
              onHotspot={(i) => setActive(i)} onReady={() => setReady(true)} onInteract={() => setHint(false)} />
          </Suspense>
        )}
      </Boundary>

      {ready && manifest && (
        <>
          <AnimatePresence>
            {hint && !features && (
              <motion.div className="p3d-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: reduce ? 0 : 1.2 }} aria-hidden="true">
                <Icon d="M12 3a9 9 0 1 0 9 9M21 3v6h-6" /> Drag to rotate
              </motion.div>
            )}
          </AnimatePresence>
          <div className="p3d-controls" role="toolbar" aria-label="3D model controls">
            <button onClick={() => controller.current.zoom?.(0.8)} aria-label="Zoom in" title="Zoom in" data-testid="zoom-in"><Icon d="M11 5v12M5 11h12M20 20l-4-4" /></button>
            <button onClick={() => controller.current.zoom?.(1.25)} aria-label="Zoom out" title="Zoom out" data-testid="zoom-out"><Icon d="M5 11h12M20 20l-4-4" /></button>
            <button onClick={() => { setActive(null); setFeatures(false); controller.current.reset?.() }} aria-label="Reset view" title="Reset view" data-testid="reset-view"><Icon d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" /></button>
            <button className={`p3d-feat ${features ? 'on' : ''}`} onClick={toggleFeatures} aria-pressed={features} data-testid="explore-features">
              <Icon d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />{features ? 'Hide features' : 'Explore features'}
            </button>
          </div>
          <AnimatePresence mode="wait">
            {features && h && (
              <motion.div key={active} className="p3d-card" role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: reduce ? 0 : 0.25 }} data-testid="feature-card">
                <div className="p3d-card-top"><span className="p3d-num">{(active ?? 0) + 1}/{manifest.hotspots.length}</span><b>{h.name}</b></div>
                <p>{h.description}</p>
                <div className="p3d-card-nav">
                  <button onClick={() => step(-1)} aria-label="Previous feature">←</button>
                  <button onClick={() => step(1)} aria-label="Next feature" data-testid="feature-next">→</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
