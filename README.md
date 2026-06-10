# Control de Gastos

PWA de finanzas personales para iPhone: ingresos y gastos del mes, **privada y sin conexión**.

**App:** https://diegoalegil.github.io/control-gastos/

## Instalación en iPhone

1. Abre la URL en **Safari**.
2. Botón compartir → **«Añadir a pantalla de inicio»**.
3. Ábrela desde el icono: pantalla completa y funciona offline.

## Qué hace

- **Movimientos**: gastos e ingresos con categoría, fecha y nota. Teclado de importe estilo cajero, búsqueda, filtros y deslizar para borrar (con deshacer).
- **Categorías con presupuesto**: límite mensual por categoría y barra de progreso.
- **Recurrentes**: nómina, alquiler, suscripciones… se apuntan solos cada mes al abrir la app.
- **Resumen**: balance del mes, donut de gasto por categoría y comparativa de los últimos 6 meses. Navegación libre de meses (pasado y futuro, sin límite de año).
- **Tus datos, tuyos**: todo vive en IndexedDB en el dispositivo. Exportación CSV y copia de seguridad/restauración en JSON.
- Modo claro/oscuro siguiendo al sistema, en una paleta cálida con ilustraciones propias.

## Stack

Vite + React + TypeScript · Dexie (IndexedDB) · motion (animaciones spring) · vite-plugin-pwa · gráficas SVG hechas a mano · CSS vanilla con design tokens ([DESIGN.md](DESIGN.md)).

## Desarrollo

```bash
npm install
npm run dev      # abre /control-gastos/
npm run build    # type-check + build + service worker
```

`?noanim` en la URL desactiva las animaciones (útil para capturas y tests).
