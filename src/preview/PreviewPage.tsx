import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas-pro'
import { ThemeProvider } from '../themes'
import { getChrome } from '../themes/chrome'
import { useProjectStore } from '../store/projectStore'
import { getWidget, resolveRenderer } from '../widgets/registry'
import { PLATFORM_LABELS } from '../types'
import { ratioToSize } from '../types'
import type { WireframeRow } from '../types'
import styles from './PreviewPage.module.css'

export function PreviewPage() {
  const platform = useProjectStore((s) => s.platform)
  const branding = useProjectStore((s) => s.branding)
  const rows = useProjectStore((s) => s.wireframe.rows)
  const navEntries = useProjectStore((s) => s.navEntries)
  const hubMenu = useProjectStore((s) => s.hubMenu)
  const captureRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    document.title = `${branding.name} — ${PLATFORM_LABELS[platform]}`
  }, [branding.name, platform])

  async function handleExport() {
    if (!captureRef.current || exporting) return
    setExporting(true)
    try {
      const canvas = await html2canvas(captureRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      })
      const link = document.createElement('a')
      const slug = branding.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'page'
      const stamp = new Date().toISOString().slice(0, 10)
      link.download = `${slug}-${platform}-${stamp}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('[export] failed:', err)
    } finally {
      setExporting(false)
    }
  }

  const Chrome = getChrome(platform)
  const pageClass = platform === 'sharepoint' ? styles.pageWhite : styles.page

  if (rows.length === 0) {
    return (
      <div className={pageClass}>
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
      <div className={pageClass}>
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
      <button
        type="button"
        className={styles.exportButton}
        onClick={handleExport}
        disabled={exporting}
      >
        {exporting ? 'Export en cours…' : 'Exporter en PNG'}
      </button>
      <div ref={captureRef}>
        <ThemeProvider platform={platform} branding={branding}>
          <Chrome branding={branding} navEntries={navEntries} hubMenu={hubMenu}>
            {widgetContent}
          </Chrome>
        </ThemeProvider>
      </div>
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

  // A row is "full-bleed" when it contains a widget that opts into it
  // (e.g. SharePoint "Bannière principale"). Such a row spans the full width of
  // the content area, skipping the normal section padding/max-width.
  const isFullBleed = row.cells.some((cell) => {
    const widget = getWidget(cell.widgetId)
    return Boolean(widget?.isFullBleed)
  })

  const sectionClass = isFullBleed
    ? styles.sectionFullBleed
    : platform === 'jint'
      ? index % 2 === 0
        ? styles.sectionEven
        : styles.sectionOdd
      : platform === 'sharepoint'
        ? styles.sectionWhite
        : undefined

  const rowContent = (
    <div className={isFullBleed ? styles.widgetRowFullBleed : styles.widgetRow}>
      {row.cells.map((cell, idx) => {
        const widget = getWidget(cell.widgetId)
        if (!widget) return null
        const Renderer = resolveRenderer(widget, platform)
        if (!Renderer) return null
        const flex = ratios[idx] ?? 1 / row.cells.length
        const size = ratioToSize(flex)
        return (
          <div
            key={cell.id}
            className={styles.widgetCell}
            style={{ flex: `${flex} 1 0` }}
          >
            <div className={styles.widgetCellInner}>
              <Renderer
                config={cell.config}
                size={size}
                branding={branding}
              />
            </div>
          </div>
        )
      })}
    </div>
  )

  // For SharePoint, non-full-bleed rows are centered in a 1200px inner wrapper
  // (mirroring native SharePoint section chrome). Full-bleed rows skip it.
  const needsSpInner = platform === 'sharepoint' && !isFullBleed

  return (
    <div className={sectionClass}>
      {needsSpInner ? (
        <div className={styles.spSectionInner}>{rowContent}</div>
      ) : (
        rowContent
      )}
    </div>
  )
}
