import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas-pro'
import { ThemeProvider } from '../themes'
import { getChrome } from '../themes/chrome'
import { useProjectStore } from '../store/projectStore'
import { getWidget, resolveRenderer } from '../widgets/registry'
import { PLATFORM_LABELS } from '../types'
import { ratioToSize } from '../types'
import type { Branding, Platform, WireframeRow } from '../types'
import styles from './PreviewPage.module.css'

type ExportMode = 'rendered' | 'wireframe'

export function PreviewPage() {
  const platform = useProjectStore((s) => s.platform)
  const branding = useProjectStore((s) => s.branding)
  const rows = useProjectStore((s) => s.wireframe.rows)
  const navEntries = useProjectStore((s) => s.navEntries)
  const hubMenu = useProjectStore((s) => s.hubMenu)
  const renderedRef = useRef<HTMLDivElement>(null)
  const wireframeRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.title = `${branding.name} — ${PLATFORM_LABELS[platform]}`
  }, [branding.name, platform])

  useEffect(() => {
    if (!menuOpen) return
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [menuOpen])

  async function handleExport(mode: ExportMode) {
    setMenuOpen(false)
    const target = mode === 'wireframe' ? wireframeRef.current : renderedRef.current
    if (!target || exporting) return
    setExporting(true)
    try {
      const canvas = await html2canvas(target, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      })
      const link = document.createElement('a')
      const slug = branding.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'page'
      const stamp = new Date().toISOString().slice(0, 10)
      const suffix = mode === 'wireframe' ? '-wireframe' : ''
      link.download = `${slug}-${platform}${suffix}-${stamp}.png`
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
      <div className={styles.exportControls} ref={menuRef}>
        {menuOpen && !exporting && (
          <div className={styles.exportMenu}>
            <button
              type="button"
              className={styles.exportMenuItem}
              onClick={() => handleExport('rendered')}
            >
              <span className={styles.exportMenuTitle}>Rendu</span>
              <span className={styles.exportMenuDesc}>
                Capture stylée de la page
              </span>
            </button>
            <button
              type="button"
              className={styles.exportMenuItem}
              onClick={() => handleExport('wireframe')}
            >
              <span className={styles.exportMenuTitle}>Wireframe</span>
              <span className={styles.exportMenuDesc}>
                Blocs vides à annoter en atelier
              </span>
            </button>
          </div>
        )}
        <button
          type="button"
          className={styles.exportButton}
          onClick={() => setMenuOpen((v) => !v)}
          disabled={exporting}
        >
          <span>{exporting ? 'Export en cours…' : 'Exporter en PNG'}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="6 13 12 19 18 13" />
          </svg>
        </button>
      </div>
      <div ref={renderedRef}>
        <ThemeProvider platform={platform} branding={branding}>
          <Chrome branding={branding} navEntries={navEntries} hubMenu={hubMenu}>
            {widgetContent}
          </Chrome>
        </ThemeProvider>
      </div>
      <div className={styles.offscreen} aria-hidden="true">
        <WireframeCapture
          ref={wireframeRef}
          rows={rows}
          branding={branding}
          platform={platform}
        />
      </div>
    </div>
  )
}

interface WireframeCaptureProps {
  rows: WireframeRow[]
  branding: Branding
  platform: Platform
}

function WireframeCapture({
  ref,
  rows,
  branding,
  platform,
}: WireframeCaptureProps & { ref: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className={styles.wfPage}>
      <header className={styles.wfHeader}>
        <div className={styles.wfBrand}>{branding.name}</div>
        <div className={styles.wfMeta}>
          {PLATFORM_LABELS[platform]} · Wireframe atelier
        </div>
      </header>
      <div className={styles.wfRows}>
        {rows.map((row, rowIdx) => {
          if (row.cells.length === 0) return null
          const ratios =
            row.columnRatios && row.columnRatios.length === row.cells.length
              ? row.columnRatios
              : new Array(row.cells.length).fill(1 / row.cells.length)
          return (
            <div key={row.id} className={styles.wfRow}>
              {row.cells.map((cell, idx) => {
                const widget = getWidget(cell.widgetId)
                const label =
                  widget?.platformLabels[platform] ??
                  widget?.purpose.label ??
                  cell.widgetId
                const flex = ratios[idx] ?? 1 / row.cells.length
                return (
                  <div
                    key={cell.id}
                    className={styles.wfCell}
                    style={{ flex: `${flex} 1 0` }}
                  >
                    <div className={styles.wfCellIndex}>
                      {rowIdx + 1}.{idx + 1}
                    </div>
                    <div className={styles.wfCellLabel}>{label}</div>
                  </div>
                )
              })}
            </div>
          )
        })}
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
