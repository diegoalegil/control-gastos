// visual-check.mjs — bucle de verificación visual de control-gastos
// Uso:   node visual-check.mjs [baseURL]
// Setup: npm i -D playwright && npx playwright install chromium
//
// Variante propia del repo: contexto limpio por viewport (IndexedDB vacío),
// pasa bienvenida y asistente, captura las 4 pestañas vacías, siembra datos
// aplicando la configuración personal y vuelve a capturar con datos.
import { chromium } from 'playwright'
import { mkdirSync, rmSync } from 'fs'

const baseURL = process.argv[2] || 'http://localhost:5174/control-gastos/?noanim'

const VIEWPORTS = [
  { name: 'iphone-se', width: 375, height: 667 },
  { name: 'iphone-14', width: 390, height: 844 },
  { name: 'iphone-max', width: 430, height: 932 },
  { name: 'desktop', width: 1280, height: 800 }, // que no se rompa en grande
]

// las vistas no cambian la URL: se navega pulsando la tab bar
const TABS = ['Resumen', 'Movimientos', 'Recurrentes', 'Ajustes']

rmSync('shots', { recursive: true, force: true })
mkdirSync('shots', { recursive: true })

const browser = await chromium.launch()

async function clickIfVisible(page, locator) {
  const el = locator.first()
  if (await el.isVisible().catch(() => false)) {
    await el.click()
    await page.waitForTimeout(350)
    return true
  }
  return false
}

async function captureTabs(page, vpName, suffix) {
  for (const tab of TABS) {
    await page.getByRole('button', { name: tab }).first().click()
    await page.waitForTimeout(400)
    await page.screenshot({ path: `shots/${tab.toLowerCase()}-${suffix}-${vpName}.png`, fullPage: true })
    console.log(`  ✓ ${tab.toLowerCase()}-${suffix}-${vpName}`)
  }
}

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
  const page = await context.newPage()
  try {
    await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 30000 })
  } catch {
    /* networkidle puede no estabilizarse; seguimos */
  }
  await page.waitForTimeout(500)

  // bienvenida (primer arranque) y asistente personal
  await clickIfVisible(page, page.getByRole('button', { name: 'Empezar' }))
  await clickIfVisible(page, page.getByRole('button', { name: 'Ahora no' }))

  await captureTabs(page, vp.name, 'vacio')

  // siembra: aplicar la configuración personal (categorías + fijos reales)
  await page.getByRole('button', { name: 'Ajustes' }).first().click()
  await page.waitForTimeout(350)
  await clickIfVisible(page, page.getByText('Configuración personal'))
  const applied = await clickIfVisible(page, page.getByRole('button', { name: /Aplicar/ }))
  if (applied) {
    await page.waitForTimeout(900)
    await captureTabs(page, vp.name, 'datos')
  } else {
    console.log(`  ! ${vp.name}: no se pudo sembrar datos`)
  }

  await context.close()
}

await browser.close()
console.log('\n✓ Listo. Capturas en ./shots')
