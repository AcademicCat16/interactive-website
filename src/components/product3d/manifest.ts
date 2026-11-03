/** Reads the confirmed Mission 2 handoff manifest shipped in public/model/. */
export interface Hotspot { id: string; name: string; description: string; position: [number, number, number] }
export interface Manifest {
  schema: string
  schemaVersion: string
  modelName: string
  description: string
  confirmedAt: string
  dimensions: { measured: { width: number; height: number; depth: number; units: string } }
  camera: { fov: number; position: [number, number, number]; target: [number, number, number] }
  hotspots: Hotspot[]
  files: { model: string; preview: string }
  integrity: { model: { sha256: string; bytes: number } }
}

export const MODEL_DIR = `${import.meta.env.BASE_URL}model/`

export async function loadManifest(): Promise<Manifest> {
  const r = await fetch(`${MODEL_DIR}model-manifest.json`)
  if (!r.ok) throw new Error(`manifest ${r.status}`)
  const m = (await r.json()) as Manifest
  if (m.schema !== 'venture-3d-handoff' || !m.schemaVersion?.startsWith('1.')) throw new Error('unsupported manifest schema')
  return m
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}
