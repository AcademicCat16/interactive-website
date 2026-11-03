/**
 * Interactive 3D stage for the confirmed Mission 2 model (model.glb). Loaded lazily from Hero.
 * The camera starts at the manifest's preferred framing; the visitor can rotate, zoom (buttons), reset,
 * and fly to the manifest's feature hotspots.
 */
import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Html, Lightformer, OrbitControls, useGLTF } from '@react-three/drei'
import type { OrbitControls as OrbitImpl } from 'three-stdlib'
import { MODEL_DIR } from './manifest'
import type { Manifest } from './manifest'

export interface StageController {
  zoom?: (factor: number) => void
  reset?: () => void
  focus?: (index: number | null) => void
}

interface Props {
  manifest: Manifest
  onController: (c: StageController) => void
  reduceMotion: boolean
  showHotspots: boolean
  activeHotspot: number | null
  onHotspot: (i: number) => void
  onReady: () => void
  onInteract: () => void
}

function Lighting() {
  return (
    <>
      {/* offline studio environment for reflections on gold and pearls (no downloaded HDR files) */}
      <Environment resolution={256} environmentIntensity={0.6}>
        <Lightformer form="rect" intensity={2.2} color="#ffe6c4" position={[0, 3, 0]} rotation-x={Math.PI / 2} scale={[4, 4, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#fff4e6" position={[-3, 1, 1]} rotation-y={Math.PI / 2} scale={[3, 1.2, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#cfe6e6" position={[3, 0.8, 2]} rotation-y={-Math.PI / 2} scale={[3, 1, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#ffd59a" position={[0, 1.5, -3]} scale={2} />
      </Environment>
      {/* warm key light from the glowing "sky" behind the product, matching the hero's amber halo */}
      <directionalLight position={[-0.35, 0.6, 0.25]} intensity={3.1} color="#ffe2b8" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} />
      <directionalLight position={[0.45, 0.25, 0.5]} intensity={0.55} color="#cfe6e6" />
      <directionalLight position={[0.1, 0.35, -0.6]} intensity={1.4} color="#ffcf8a" />
      <hemisphereLight args={['#fff1dc', '#16302f', 0.35]} />
    </>
  )
}

function Rig({ manifest, onController, reduceMotion, activeHotspot, center }: Pick<Props, 'manifest' | 'onController' | 'reduceMotion' | 'activeHotspot'> & { center: THREE.Vector3 }) {
  const { camera, controls, size } = useThree()
  const aspect = size.width / Math.max(1, size.height)
  const home = useMemo(() => {
    const target = new THREE.Vector3(...manifest.camera.target).sub(center)
    const raw = new THREE.Vector3(...manifest.camera.position).sub(center)
    const dir = raw.clone().sub(target).normalize()
    // a little breathing room around the manifest framing, more on narrow (portrait) stages such as phones
    const dist = raw.distanceTo(target) * 1.12 * (aspect < 1 ? 1.08 / Math.sqrt(aspect) : 1)
    return { target, pos: target.clone().addScaledVector(dir, dist), dir, dist }
  }, [manifest, center, aspect])
  const goal = useRef({ pos: home.pos.clone(), target: home.target.clone(), animating: true })

  useEffect(() => {
    camera.position.copy(home.pos).addScaledVector(home.dir, reduceMotion ? 0 : home.dist * 0.6) // entrance: start further away
    camera.lookAt(home.target)
    const oc = controls as unknown as OrbitImpl | null
    if (oc) { oc.target.copy(home.target); oc.update() }
    goal.current = { pos: home.pos.clone(), target: home.target.clone(), animating: true }
  }, [camera, controls, home]) // eslint-disable-line react-hooks/exhaustive-deps

  const api = useMemo<StageController>(() => {
    const reset = () => { goal.current = { pos: home.pos.clone(), target: home.target.clone(), animating: true } }
    return {
      zoom: (f) => {
        const oc = controls as unknown as OrbitImpl | null; if (!oc) return
        const t = oc.target.clone(), d = camera.position.distanceTo(t)
        const nd = THREE.MathUtils.clamp(d * f, home.dist * 0.4, home.dist * 1.7)
        goal.current = { pos: t.clone().add(camera.position.clone().sub(t).normalize().multiplyScalar(nd)), target: t, animating: true }
      },
      reset,
      focus: (i) => {
        if (i == null) return reset()
        const h = manifest.hotspots[i]; if (!h) return
        const p = new THREE.Vector3(...h.position).sub(center)
        goal.current = { pos: p.clone().addScaledVector(home.dir, home.dist * 0.82), target: p, animating: true }
      },
    }
  }, [camera, controls, home, manifest, center])
  useEffect(() => { onController(api) }, [api, onController])
  useEffect(() => { if (activeHotspot != null) api.focus?.(activeHotspot) }, [activeHotspot, api])

  useFrame((_, dt) => {
    const g = goal.current; if (!g.animating) return
    const oc = controls as unknown as OrbitImpl | null
    const k = reduceMotion ? 1 : 1 - Math.pow(0.0015, dt)
    camera.position.lerp(g.pos, k)
    if (oc) { oc.target.lerp(g.target, k); oc.update() }
    if (camera.position.distanceTo(g.pos) < 1e-4) g.animating = false
  })
  return null
}

function Model({ center, reduceMotion, onReady }: { center: THREE.Vector3; reduceMotion: boolean; onReady: () => void }) {
  const { scene } = useGLTF(`${MODEL_DIR}model.glb`)
  useEffect(() => { onReady() }, [scene]) // eslint-disable-line react-hooks/exhaustive-deps
  const group = useRef<THREE.Group>(null)
  const t0 = useRef<number | null>(null)
  useMemo(() => scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.castShadow = true; m.receiveShadow = true } }), [scene])
  useFrame(({ clock }) => {
    const g = group.current; if (!g) return
    if (t0.current == null) t0.current = clock.elapsedTime
    const t = clock.elapsedTime - t0.current
    const intro = reduceMotion ? 1 : Math.min(1, t / 1.4), ease = 1 - Math.pow(1 - intro, 3)
    g.scale.setScalar(0.9 + 0.1 * ease)
    g.position.y = reduceMotion ? 0 : (1 - ease) * -0.04 + Math.sin(t * 0.9) * 0.003 // gentle float after the entrance
  })
  return <group ref={group}><primitive object={scene} position={[-center.x, -center.y, -center.z]} /></group>
}

function Hotspots({ manifest, center, active, onPick }: { manifest: Manifest; center: THREE.Vector3; active: number | null; onPick: (i: number) => void }) {
  return <>{manifest.hotspots.map((h, i) => (
    <Html key={h.id} position={[h.position[0] - center.x, h.position[1] - center.y, h.position[2] - center.z]} center zIndexRange={[30, 0]}>
      <button className={`p3d-hotspot ${active === i ? 'on' : ''}`} onClick={() => onPick(i)} aria-label={`Feature ${i + 1}: ${h.name}`} data-testid={`hotspot-${i}`}>{i + 1}</button>
    </Html>
  ))}</>
}

export default function ProductStage(p: Props) {
  // centre the model on its measured bounds (manifest dimensions are in cm; positions in metres)
  const center = useMemo(() => {
    const [tx, ty, tz] = p.manifest.camera.target
    return new THREE.Vector3(tx, ty, tz)
  }, [p.manifest])
  const ctrl = useRef<OrbitImpl>(null)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(idleTimer.current), [])
  const dims = p.manifest.dimensions.measured
  const radius = Math.hypot(dims.width, dims.height, dims.depth) / 200

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05, preserveDrawingBuffer: true }}
      camera={{ fov: p.manifest.camera.fov, near: 0.005, far: 20 }}
      data-testid="product-canvas"
      aria-label={`Interactive 3D model of the ${p.manifest.modelName}. Drag to rotate.`}
      role="img"
    >
      <Lighting />
      <Suspense fallback={null}>
        <Model center={center} reduceMotion={p.reduceMotion} onReady={p.onReady} />
        <ContactShadows position={[0, -dims.height / 200 - 0.002, 0]} scale={radius * 4} blur={2.6} opacity={0.55} far={radius} color="#0a1414" />
      </Suspense>
      {p.showHotspots && <Hotspots manifest={p.manifest} center={center} active={p.activeHotspot} onPick={p.onHotspot} />}
      <OrbitControls
        ref={ctrl}
        makeDefault
        enablePan={false}
        enableZoom={false /* zoom via buttons so the page still scrolls normally */}
        enableDamping
        dampingFactor={0.1}
        rotateSpeed={0.7}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI * 0.47}
        autoRotate={!p.reduceMotion && !p.showHotspots}
        autoRotateSpeed={0.45}
        onStart={() => { p.onInteract(); if (ctrl.current) ctrl.current.autoRotate = false; clearTimeout(idleTimer.current) }}
        onEnd={() => { clearTimeout(idleTimer.current); idleTimer.current = setTimeout(() => { if (ctrl.current && !p.reduceMotion && !p.showHotspots) ctrl.current.autoRotate = true }, 6000) }}
      />
      <Rig manifest={p.manifest} onController={p.onController} reduceMotion={p.reduceMotion} activeHotspot={p.activeHotspot} center={center} />
    </Canvas>
  )
}

useGLTF.preload(`${MODEL_DIR}model.glb`)
