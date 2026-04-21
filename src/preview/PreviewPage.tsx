import { useEffect } from 'react'
import { ThemeProvider } from '../themes'
import { getChrome } from '../themes/chrome'
import { useProjectStore } from '../store/projectStore'
import { getWidget } from '../widgets/registry'
import { PLATFORM_LABELS } from '../types'
import type { WireframeRow } from '../types'
import styles from './PreviewPage.module.css'

export function PreviewPage() {
  const platform = useProjectStore((s) => s.platform)
  const branding = useProjectStore((s) => s.branding)
  const rows = useProjectStore((s) => s.wireframe.rows)
  const navEntries = useProjectStore((s) => s.navEntries)

  useEffect(() => {
    document.title = `${branding.name} — ${PLATFORM_LABELS[platform]}`
  }, [branding.name, platform])

  const Chrome = getChrome(platform)

  if (rows.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <h2>Aucun widget placé</h2>
          <p>
            Retournez dans l'éditeur, composez votre wireframe à l'étape
            "Wireframe" puis relancez la génération.
          </p>
        </div>
      </div>
    )
  }

  const widgetContent = (
    <div className={styles.widgetRows}>
      {rows.map((row, idx) => (
        <RenderedRow key={row.id} row={row} index={idx} />
      ))}
    </div>
  )

  if (!Chrome) {
    return (
      <div className={styles.page}>
        <ThemeProvider platform={platform} branding={branding}>
          <div className={styles.fallback}>
            La plateforme {PLATFORM_LABELS[platform]} n'a pas encore de chrome
            dédié. Seul le contenu des widgets est rendu ci-dessous.
          </div>
          {widgetContent}
        </ThemeProvider>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <ThemeProvider platform={platform} branding={branding}>
        <Chrome branding={branding} navEntries={navEntries}>
          {widgetContent}
        </Chrome>
      </ThemeProvider>
    </div>
  )
}

function RenderedRow({ row, index }: { row: WireframeRow; index: number }) {
  const platform = useProjectStore((s) => s.platform)
  const branding = useProjectStore((s) => s.branding)

  if (row.cells.length === 0) return null

  const ratios =
    row.columnRatios && row.columnRatios.length === row.cells.length
      ? row.columnRatios
      : new Array(row.cells.length).fill(1 / row.cells.length)

  const sectionClass = index % 2 === 0 ? styles.sectionEven : styles.sectionOdd

  return (
    <div className={sectionClass}>
      <div className={styles.widgetRow}>
      {row.cells.map((cell, idx) => {
        const widget = getWidget(cell.widgetId)
        if (!widget) return null
        const Renderer = widget.renderers[platform]
        if (!Renderer) return null
        const flex = ratios[idx] ?? 1 / row.cells.length
        return (
          <div
            key={cell.id}
            className={styles.widgetCell}
            style={{ flex: `${flex} 1 0` }}
          >
            <div className={styles.widgetCellInner}>
              <Renderer
                config={cell.config}
                size={flex <= 0.34 ? 'compact' : flex <= 0.51 ? 'medium' : 'large'}
                branding={branding}
              />
            </div>
          </div>
        )
      })}
      </div>
    </div>
  )
}
