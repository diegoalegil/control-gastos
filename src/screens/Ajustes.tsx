import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { AnimatePresence } from 'motion/react'
import { ConfirmSheet } from '../components/ConfirmSheet'
import { FadeCard } from '../components/FadeCard'
import { IconChevronRight, IconDownload, IconPlus, IconShare } from '../components/Icons'
import { Segmented } from '../components/Segmented'
import { exportBackup, parseBackup, restoreBackup } from '../lib/backup'
import { exportCsv } from '../lib/export'
import { formatCents } from '../lib/money'
import { useTheme } from '../state/theme'
import type { BackupFile, Category, Theme } from '../lib/types'

export function Ajustes({
  categories,
  notify,
  onEditCategory,
  onAddCategory,
  onOpenPersonal,
}: {
  categories: Category[]
  notify: (msg: string) => void
  onEditCategory: (c: Category) => void
  onAddCategory: () => void
  onOpenPersonal: () => void
}) {
  const [theme, setTheme] = useTheme()
  const fileRef = useRef<HTMLInputElement>(null)
  const [pendingRestore, setPendingRestore] = useState<BackupFile | null>(null)
  const [persisted, setPersisted] = useState<boolean | null>(null)

  useEffect(() => {
    navigator.storage?.persisted?.().then(setPersisted).catch(() => setPersisted(null))
  }, [])

  const pickBackup = async (file: File | undefined) => {
    if (!file) return
    try {
      setPendingRestore(parseBackup(await file.text()))
    } catch (err) {
      notify(err instanceof Error ? err.message : 'No se pudo leer el archivo.')
    }
  }

  const confirmRestore = async () => {
    if (!pendingRestore) return
    await restoreBackup(pendingRestore)
    setPendingRestore(null)
    notify('Copia restaurada')
  }

  const catGroup = (type: 'gasto' | 'ingreso', title: string, index: number) => {
    const list = categories
      .filter((c) => c.type === type)
      .sort((a, b) => Number(a.archived) - Number(b.archived) || a.order - b.order)
    return (
      <>
        <div className="card-title" style={{ margin: '0 6px 8px' }}>
          {title}
        </div>
        <FadeCard className="settings-group" index={index}>
          {list.map((c) => (
            <button
              key={c.id}
              type="button"
              className="row row-divided"
              style={c.archived ? { opacity: 0.45 } : undefined}
              onClick={() => onEditCategory(c)}
            >
              <span
                className="cat-bubble"
                style={{ '--bubble': `var(--cat-${c.color})` } as CSSProperties}
              >
                {c.icon}
              </span>
              <span className="row-body">
                <span className="row-title">{c.name}</span>
                <span className="row-sub">
                  {c.archived
                    ? 'Archivada'
                    : c.type === 'gasto'
                      ? c.monthlyBudgetCents
                        ? `Presupuesto: ${formatCents(c.monthlyBudgetCents)} al mes`
                        : 'Sin presupuesto'
                      : 'Ingreso'}
                </span>
              </span>
              <IconChevronRight size={18} style={{ color: 'var(--ink-3)' }} />
            </button>
          ))}
        </FadeCard>
      </>
    )
  }

  return (
    <div className="screen">
      <h1 className="screen-title">Ajustes</h1>

      <div className="card-title" style={{ margin: '0 6px 8px' }}>
        Apariencia
      </div>
      <FadeCard style={{ padding: 12 }}>
        <Segmented<Theme>
          options={[
            { value: 'system', label: 'Sistema' },
            { value: 'light', label: 'Claro' },
            { value: 'dark', label: 'Oscuro' },
          ]}
          value={theme}
          onChange={setTheme}
        />
      </FadeCard>

      {catGroup('gasto', 'Categorías de gasto', 1)}
      {catGroup('ingreso', 'Categorías de ingreso', 2)}

      <button
        type="button"
        className="btn btn-secondary"
        style={{ marginBottom: 22 }}
        onClick={onAddCategory}
      >
        <IconPlus size={19} /> Añadir categoría
      </button>

      <div className="card-title" style={{ margin: '0 6px 8px' }}>
        Hecha para ti
      </div>
      <FadeCard className="settings-group" index={3}>
        <button type="button" className="row row-divided" onClick={onOpenPersonal}>
          <span className="row-body">
            <span className="row-title">Configuración personal</span>
            <span className="row-sub">Tus categorías, fijos y presupuestos de un toque</span>
          </span>
          <IconChevronRight size={18} style={{ color: 'var(--ink-3)' }} />
        </button>
      </FadeCard>

      <div className="card-title" style={{ margin: '0 6px 8px' }}>
        Tus datos
      </div>
      <FadeCard className="settings-group" index={4}>
        <button type="button" className="row row-divided" onClick={() => void exportCsv()}>
          <span className="row-body">
            <span className="row-title">Exportar CSV</span>
            <span className="row-sub">Todos los movimientos, para Excel o Numbers</span>
          </span>
          <IconShare size={20} style={{ color: 'var(--accent)' }} />
        </button>
        <button type="button" className="row row-divided" onClick={() => void exportBackup()}>
          <span className="row-body">
            <span className="row-title">Copia de seguridad</span>
            <span className="row-sub">Guarda un archivo con todo (JSON)</span>
          </span>
          <IconShare size={20} style={{ color: 'var(--accent)' }} />
        </button>
        <button type="button" className="row row-divided" onClick={() => fileRef.current?.click()}>
          <span className="row-body">
            <span className="row-title">Restaurar copia</span>
            <span className="row-sub">Reemplaza los datos actuales</span>
          </span>
          <IconDownload size={20} style={{ color: 'var(--accent)' }} />
        </button>
      </FadeCard>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => {
          void pickBackup(e.target.files?.[0])
          e.target.value = ''
        }}
      />

      <p className="settings-note">
        Tus datos viven solo en este dispositivo: no hay cuentas ni servidores.
        {persisted === true && ' Almacenamiento persistente activado.'}
        {persisted === false &&
          ' Consejo: guarda una copia de seguridad de vez en cuando por si iOS libera espacio.'}
      </p>
      <p className="settings-note">Control de Gastos · v1.7</p>

      <AnimatePresence>
        {pendingRestore && (
          <ConfirmSheet
            message={`La copia tiene ${pendingRestore.transactions.length} movimientos. Se reemplazará TODO lo que hay ahora en la app.`}
            confirmLabel="Restaurar y reemplazar"
            onConfirm={() => void confirmRestore()}
            onCancel={() => setPendingRestore(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
