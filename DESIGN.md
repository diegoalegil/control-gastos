# DESIGN.md — Control de Gastos

Reglas de diseño de esta app. Toda pantalla, componente o cambio visual debe cumplirlas.

## Prohibido (los cuatro jinetes + extras)

1. **Bordes laterales de color** en cards o listas (left-border accent stripe).
2. **Letter-spacing exagerado** en etiquetas mayúsculas. `letter-spacing` se queda en `normal` (máximo `0.01em` en casos puntuales).
3. **Badges tipo "Live"** con puntito de estado dentro de píldoras translúcidas.
4. **Gradientes radiales morados/índigo** de fondo. Nada de morado como ambiente.
5. Glassmorphism genérico (blur + transparencia como decoración).
6. Sombras dramáticas. Elevación con cambio de fondo y bordes sutiles, no con sombras de 40px.

## Paleta

Neutros cálidos, papel y arcilla. **Un solo acento**: terracota.

- Claro: fondo `#F6F4EE` (papel), superficies `#FFFDF9`, tinta `#2A2722`.
- Oscuro: fondo `#1B1A17` (carbón cálido), superficies `#26241F`, tinta `#EDEAE3`.
- Acento: terracota `#C96342` (claro) / `#D97757` (oscuro). Solo para marca, acciones y selección.
- Semántica: verde sobrio solo para ingresos (`+`), rojo sobrio solo para presupuesto excedido y acciones destructivas. Los gastos van en tinta normal con signo `−`: la semántica no se decora.
- Categorías: 10 tonos apagados (arcilla, ocre, mostaza, oliva, salvia, petróleo, lavanda gris, malva, rosa palo, topo) usados solo en chips de categoría y segmentos del donut.

## Tipografía

- System font stack: `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif`.
- Jerarquía por **tamaño y peso**, nunca por decoración. Cifras grandes en peso 700, etiquetas en `--ink-2`.
- Importes siempre con `font-variant-numeric: tabular-nums`.

## Movimiento (tipo Apple)

- Springs interrumpibles (motion): `stiffness 260–420`, `damping 28–38`. Nada de `ease-in-out` largos.
- Sheets que suben con spring y se cierran arrastrando hacia abajo.
- Cifras que cuentan (count-up) al cambiar de mes.
- Micro-feedback al pulsar: `scale 0.96` con spring.
- Respetar `prefers-reduced-motion`: las animaciones se reducen a fundidos instantáneos.

## Ilustraciones

SVG propios de estilo artesanal: trazo orgánico tipo lápiz, formas suaves, paleta cálida (crema, terracota, oliva), sin caras detalladas ni clipart. Se usan en estados vacíos y en la bienvenida. Misma familia visual en todas.

## Táctil / iPhone

- Targets ≥ 44 px. Una columna. Tab bar inferior con `env(safe-area-inset-bottom)`.
- `viewport-fit=cover`, `100dvh`, sin zoom accidental (inputs ≥ 16 px).
- Modo claro/oscuro siguiendo al sistema, con override en Ajustes.

## Futuro ("mínimo 2050")

Sin límites artificiales de fecha: navegación de meses, recurrentes y selectores funcionan para cualquier año. El dinero se guarda en céntimos enteros; las fechas como strings locales `YYYY-MM-DD`.
