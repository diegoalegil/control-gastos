// visual-check.mjs — bucle de verificación visual de control-gastos
// Uso:   node visual-check.mjs [baseURL]
// Setup: npm i -D playwright && npx playwright install chromium
//
// Cobertura: 4 viewports en claro + 2 en oscuro; bienvenida; 4 pestañas en
// vacío y con datos (siembra aplicando la configuración personal); sheets
// (nuevo, categoría, asistente, edición); estado presupuesto-excedido.
import { chromium } from 'playwright'
import { mkdirSync, rmSync } from 'fs'

const baseURL = process.argv[2] || 'http://localhost:5174/control-gastos/?noanim'

const LIGHT = [
  { name: 'iphone-se', width: 375, height: 667 },
  { name: 'iphone-14', width: 390, height: 844 },
  { name: 'iphone-max', width: 430, height: 932 },
  { name: 'desktop', width: 1280, height: 800 },
]
const DARK = [
  { name: 'iphone-se', width: 375, height: 667 },
  { name: 'iphone-14', width: 390, height: 844 },
]

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

async function run(vp, scheme) {
  const tag = scheme === 'dark' ? `${vp.name}-dark` : vp.name
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    colorScheme: scheme,
  })
  const page = await context.newPage()
  try {
    await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 30000 })
  } catch {}
  await page.waitForTimeout(500)

  const shoot = async (name, fullPage = true) => {
    await page.screenshot({ path: `shots/${name}-${tag}.png`, fullPage })
    console.log(`  ✓ ${name}-${tag}`)
  }
  const captureTabs = async (suffix) => {
    for (const t of TABS) {
      await page.getByRole('button', { name: t }).first().click()
      await page.waitForTimeout(400)
      await shoot(`${t.toLowerCase()}-${suffix}`)
    }
  }

  // bienvenida (solo una vez por esquema, en el viewport canónico)
  if (vp.name === 'iphone-14') await shoot('welcome', false)
  await clickIfVisible(page, page.getByRole('button', { name: 'Empezar' }))
  await clickIfVisible(page, page.getByRole('button', { name: 'Ahora no' }))

  await captureTabs('vacio')

  // siembra: aplicar la configuración personal
  await page.getByRole('button', { name: 'Ajustes' }).first().click()
  await page.waitForTimeout(350)
  await clickIfVisible(page, page.getByText('Configuración personal'))
  const applied = await clickIfVisible(page, page.getByRole('button', { name: /Aplicar/ }))
  if (!applied) {
    console.log(`  ! ${tag}: no se pudo sembrar datos`)
    await context.close()
    return
  }
  await page.waitForTimeout(900)
  await captureTabs('datos')

  // estados y sheets, solo en los iPhone
  if (vp.name === 'iphone-se' || vp.name === 'iphone-14') {
    await page.waitForTimeout(4300) // dejar morir la toast

    // presupuesto excedido: 250 € en Comida fuera (presupuesto 60 €)
    await page.getByRole('button', { name: 'Añadir movimiento' }).first().click()
    await page.waitForTimeout(450)
    for (const d of ['2', '5', '0', '0', '0']) {
      await page.locator('.keypad .key', { hasText: new RegExp(`^${d}$`) }).click()
    }
    await page.locator('.cat-chip', { hasText: 'Comida fuera' }).click()
    await shoot('sheet-nuevo', false)
    await page.getByRole('button', { name: 'Guardar' }).click()
    await page.waitForTimeout(600)
    await page.getByRole('button', { name: 'Resumen' }).first().click()
    await page.waitForTimeout(400)
    await shoot('resumen-overbudget')

    // sheet de edición: abrir el movimiento recién creado
    await page.getByRole('button', { name: 'Movimientos' }).first().click()
    await page.waitForTimeout(400)
    await page.locator('.row', { hasText: 'Comida fuera' }).first().click()
    await page.waitForTimeout(450)
    await shoot('sheet-editar', false)
    await page.mouse.click(vp.width / 2, 40)
    await page.waitForTimeout(350)

    // sheet nueva categoría (selector de iconos)
    await page.getByRole('button', { name: 'Ajustes' }).first().click()
    await page.waitForTimeout(350)
    await page.getByRole('button', { name: /Añadir categoría/ }).click()
    await page.waitForTimeout(450)
    await shoot('sheet-categoria', false)
    await page.mouse.click(vp.width / 2, 40)
    await page.waitForTimeout(350)

    // asistente
    await clickIfVisible(page, page.getByText('Configuración personal'))
    await page.waitForTimeout(450)
    await shoot('sheet-asistente', false)
  }

  await context.close()
}

for (const vp of LIGHT) await run(vp, 'light')
for (const vp of DARK) await run(vp, 'dark')

await browser.close()
console.log('\n✓ Listo. Capturas en ./shots')
