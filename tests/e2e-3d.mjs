/**
 * Mission 3 checks: the confirmed 3D model in the hero, plus regression checks that the existing site still works.
 * Local: npm run build && node tests/e2e-3d.mjs     Live: BASE_URL=https://academiccat16.github.io/interactive-website/ node tests/e2e-3d.mjs
 * HANDOFF (optional) = path to Venture_3D_Confirmed_Handoff.zip, to compare the served model with the confirmed one.
 */
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { inflateRawSync } from 'node:zlib'
import { chromium } from 'playwright-core'

const here = dirname(fileURLToPath(import.meta.url)), root = join(here, '..'), OUT = join(here, 'output')
mkdirSync(OUT, { recursive: true })
const LIVE = process.env.BASE_URL
const BASE = LIVE ?? 'http://localhost:4210/interactive-website/'
let server
if (!LIVE) {
  server = spawn('npx vite preview --port 4210 --strictPort', { cwd: root, shell: true, stdio: 'ignore' })
  for (let i = 0; ; i++) { try { if ((await fetch(BASE)).ok) break } catch { /* not up */ } if (i > 60) throw new Error('preview did not start'); await new Promise((r) => setTimeout(r, 500)) }
}
let passed = 0; const fails = []
const check = (c, l) => { if (c) { passed++; console.log('  ✓', l) } else { fails.push(l); console.log('  ✗', l) } }
const GL = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']

/** Minimal ZIP reader (stored/deflated) so the test has no extra dependencies. */
function readZip(buf) {
  const files = {}; let i = buf.length - 22
  while (buf.readUInt32LE(i) !== 0x06054b50) i--
  let p = buf.readUInt32LE(i + 16)
  for (let n = buf.readUInt16LE(i + 10); n > 0; n--) {
    const method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20), nl = buf.readUInt16LE(p + 28), el = buf.readUInt16LE(p + 30), cl = buf.readUInt16LE(p + 32), off = buf.readUInt32LE(p + 42)
    const name = buf.subarray(p + 46, p + 46 + nl).toString()
    const lnl = buf.readUInt16LE(off + 26), lel = buf.readUInt16LE(off + 28), data = buf.subarray(off + 30 + lnl + lel, off + 30 + lnl + lel + csize)
    files[name] = method === 8 ? inflateRawSync(data) : data
    p += 46 + nl + el + cl
  }
  return files
}
const stageShot = async (page) => (await page.locator('[data-testid="product-3d"]').screenshot())
const diff = async (page, a, b) => page.evaluate(async ([x, y]) => {
  const load = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + s })
  const [ia, ib] = await Promise.all([load(x), load(y)]); const w = 200, h = 140
  const g = (i) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const k = c.getContext('2d'); k.drawImage(i, 0, 0, w, h); return k.getImageData(0, 0, w, h).data }
  const da = g(ia), db = g(ib); let s = 0; for (let i = 0; i < da.length; i += 4) s += Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2])
  return s / (w * h * 3)
}, [a.toString('base64'), b.toString('base64')])

const browser = await chromium.launch({ channel: 'chrome', args: GL })
const errors = []
try {
  console.log('1–3. Loads, shows the confirmed GLB, and it matches the Mission 2 handoff')
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => errors.push(String(e))); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  const glbResp = page.waitForResponse((r) => r.url().endsWith('/interactive-website/model/model.glb'))
  await page.goto(BASE, { waitUntil: 'networkidle' })
  const gr = await glbResp
  check(gr.status() === 200, `model served from the Pages subpath: ${new URL(gr.url()).pathname}`)
  await page.waitForFunction(() => window.__hero3d?.ready, null, { timeout: 60000 }); await page.waitForTimeout(1500)
  check(await page.locator('[data-testid="product-canvas"]').count() === 1, 'interactive 3D canvas present in the hero')
  const glb = await (await fetch(new URL('model/model.glb', BASE))).arrayBuffer()
  const served = createHash('sha256').update(Buffer.from(glb)).digest('hex')
  const manifest = await (await fetch(new URL('model/model-manifest.json', BASE))).json()
  check(served === manifest.integrity.model.sha256, 'served model.glb matches the manifest checksum')
  const zipPath = process.env.HANDOFF ?? join(root, '..', '..', 'Mission_2_3D_Studio', 'deliverables', 'Venture_3D_Confirmed_Handoff.zip')
  if (existsSync(zipPath)) { const z = readZip(readFileSync(zipPath)); check(createHash('sha256').update(z['model.glb']).digest('hex') === served, 'identical to model.glb in the confirmed Venture_3D_Confirmed_Handoff.zip') }
  const base0 = await stageShot(page)
  await page.screenshot({ path: join(OUT, 'desktop-hero.png') })

  console.log('4–7. Rotate, zoom, reset, features, framing')
  const box = await page.locator('[data-testid="product-3d"]').boundingBox()
  const cx = box.x + box.width * 0.6, cy = box.y + box.height * 0.5
  await page.mouse.move(cx, cy); await page.mouse.down(); await page.mouse.move(cx + 220, cy + 10, { steps: 12 }); await page.mouse.up(); await page.waitForTimeout(800)
  const rotated = await stageShot(page); const dRot = await diff(page, base0, rotated)
  check(dRot > 3, `drag rotates the model (mean pixel change ${dRot.toFixed(1)})`)
  await page.click('[data-testid="reset-view"]'); await page.waitForTimeout(800)
  const dReset = await diff(page, base0, await stageShot(page))
  check(dReset < dRot / 3, `reset returns to the starting view (change ${dReset.toFixed(1)})`)
  await page.click('[data-testid="zoom-in"]'); await page.click('[data-testid="zoom-in"]'); await page.waitForTimeout(800)
  const dZoom = await diff(page, base0, await stageShot(page)); check(dZoom > 3, `zoom-in button works (change ${dZoom.toFixed(1)})`)
  await page.click('[data-testid="reset-view"]'); await page.waitForTimeout(600)
  await page.click('[data-testid="explore-features"]'); await page.waitForTimeout(800)
  const hs = await page.locator('[data-testid^="hotspot-"]').count()
  check(hs === manifest.hotspots.length, `${hs} feature hotspots from the manifest`)
  check((await page.locator('[data-testid="feature-card"]').innerText()).includes(manifest.hotspots[0].name), 'feature card shows the first feature')
  await page.click('[data-testid="feature-next"]'); await page.waitForTimeout(500)
  check((await page.locator('[data-testid="feature-card"]').innerText()).includes(manifest.hotspots[1].name), 'next feature navigates and moves the camera')
  await page.screenshot({ path: join(OUT, 'desktop-features.png') })
  await page.click('[data-testid="explore-features"]'); await page.waitForTimeout(600)
  const coverage = await page.evaluate(() => { const c = document.querySelector('[data-testid="product-canvas"] canvas'); const t = document.createElement('canvas'); t.width = 120; t.height = 90; const g = t.getContext('2d'); g.drawImage(c, 0, 0, 120, 90); const d = g.getImageData(0, 0, 120, 90).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 200) n++; return n / (120 * 90) })
  check(coverage > 0.12 && coverage < 0.75, `model is well framed: covers ${(coverage * 100).toFixed(0)}% of the 3D area (not tiny, not clipped)`)

  console.log('8–10. Text readable, navigation and existing features still work')
  const h1 = await page.locator('h1').boundingBox()
  const topEl = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.closest('h1') != null, [h1.x + 40, h1.y + h1.height / 2])
  check(topEl, 'headline is on top and readable')
  for (const [label, id] of [['Concept', 'concept'], ['Research', 'research'], ['Market', 'market'], ['Pricing', 'pricing'], ['Plan', 'plan']]) {
    await page.click(`nav a:has-text("${label}")`); await page.waitForTimeout(500)
    const inView = await page.evaluate((s) => { const r = document.getElementById(s).getBoundingClientRect(); return r.top < 200 && r.bottom > 0 }, id)
    check(inView, `nav “${label}” scrolls to its section`)
  }
  await page.click('nav a:has-text("Concept")'); await page.waitForTimeout(700)
  await page.click('#concept svg g[aria-label="2. Tested closures"]'); await page.waitForTimeout(600)
  const waitText = (sel, re) => page.waitForFunction(([s, r]) => new RegExp(r).test(document.querySelector(s)?.innerText ?? ''), [sel, re.source], { timeout: 5000 }).then(() => true, () => false)
  check(await waitText('#concept [role=tabpanel]', /7 of 80 Amazon reviews/), 'Concept feature diagram still interactive')
  await page.click('nav a:has-text("Market")'); await page.waitForTimeout(700)
  await page.click('#market button:has-text("Behavioral")'); await page.waitForTimeout(600)
  check(await waitText('#market [role=tabpanel]', /weddings/), 'Market segmentation tabs still work')
  await page.locator('#pricing input[type=range]').fill('40'); await page.waitForTimeout(300)
  check(/Comparable band: \$34–\$46/.test(await page.innerText('#pricing')), 'Pricing slider still works (prices unchanged)')
  check(/\$49/.test(await page.innerText('#pricing')) && /Quince leather case/.test(await page.innerText('#pricing')), 'pricing content preserved')
  await page.click('#swot button:has-text("Threats")'); check(await page.getAttribute('#swot button:has-text("Threats")', 'aria-pressed') === 'true', 'SWOT still works')
  await ctx.close()

  console.log('11. Mobile')
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
  const m = await mctx.newPage(); m.on('pageerror', (e) => errors.push(String(e)))
  await m.goto(BASE, { waitUntil: 'networkidle' }); await m.waitForFunction(() => window.__hero3d?.ready, null, { timeout: 60000 }); await m.waitForTimeout(1500)
  check(await m.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 0, 'no horizontal scroll on a phone')
  const mh1 = await m.locator('h1').boundingBox(), mstage = await m.locator('[data-testid="product-3d"]').boundingBox()
  check(mstage.y >= mh1.y + mh1.height, 'on phones the 3D model sits below the headline, not behind it')
  await m.screenshot({ path: join(OUT, 'mobile-hero.png') })
  await m.locator('[data-testid="product-3d"]').scrollIntoViewIfNeeded(); await m.waitForTimeout(500)
  check(await m.locator('[data-testid="explore-features"]').isVisible(), 'mobile 3D controls visible')
  await m.screenshot({ path: join(OUT, 'mobile-stage.png') })
  await m.click('nav button[aria-label="Toggle menu"]'); await m.waitForTimeout(400); check(await m.locator('nav a:visible:has-text("Pricing")').count() === 1, 'mobile menu still works')
  await mctx.close()

  console.log('12. Reduced motion')
  const rctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); const r = await rctx.newPage()
  await r.goto(BASE, { waitUntil: 'networkidle' }); await r.waitForFunction(() => window.__hero3d?.ready, null, { timeout: 60000 }); await r.waitForTimeout(2000)
  const a1 = await stageShot(r); await r.waitForTimeout(2000); const a2 = await stageShot(r)
  const still = await diff(r, a1, a2); check(still < 0.5, `no idle rotation or float with reduced motion (change ${still.toFixed(2)})`)
  const nctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const nm = await nctx.newPage()
  await nm.goto(BASE, { waitUntil: 'networkidle' }); await nm.waitForFunction(() => window.__hero3d?.ready, null, { timeout: 60000 }); await nm.waitForTimeout(2500)
  const b1 = await stageShot(nm); await nm.waitForTimeout(2000); const b2 = await stageShot(nm)
  const moving = await diff(nm, b1, b2); check(moving > still, `gentle idle rotation without reduced motion (change ${moving.toFixed(2)})`)
  await rctx.close(); await nctx.close()
} catch (e) { fails.push(String(e)); console.error(e) }
finally { await browser.close() }

console.log('13. WebGL unavailable → honest static fallback')
const nb = await chromium.launch({ channel: 'chrome', args: ['--disable-webgl', '--disable-webgl2', '--disable-3d-apis'] })
try {
  const p = await nb.newPage({ viewport: { width: 1440, height: 900 } })
  await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500)
  const fb = p.locator('[data-testid="product-fallback"]')
  check(await fb.isVisible(), 'fallback shown when WebGL is disabled')
  check(/Static preview image/.test(await fb.innerText()) && !(await p.locator('[data-testid="product-canvas"]').count()), 'fallback is labelled as a static preview (not interactive)')
  const imgOk = await p.evaluate(() => { const i = document.querySelector('[data-testid="product-fallback"] img'); return i.complete && i.naturalWidth > 0 })
  check(imgOk, 'confirmed preview.png loads')
  await p.screenshot({ path: join(OUT, 'fallback-no-webgl.png') })
} finally { await nb.close(); server?.kill() }
check(errors.length === 0, `no page errors${errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''}`)
console.log(`\n${passed} passed, ${fails.length} failed`)
if (fails.length) { console.log(fails.map((f) => ' - ' + f).join('\n')); process.exit(1) }
