import { useCallback, useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas-pro'
import { ThemeProvider } from '../themes'
import { getChrome } from '../themes/chrome'
import { useProjectStore } from '../store/projectStore'
import { getWidget, resolveRenderer } from '../widgets/registry'
import { PLATFORM_LABELS } from '../types'
import { ratioToSize } from '../types'
import type { Branding, ConfigValues, Platform, WidgetSize, WireframeRow } from '../types'
import styles from './PreviewPage.module.css'

type ExportMode = 'rendered' | 'wireframe'

const NEWS_ITEM_H: Record<string, number> = {
  'one-third': 100,
  half: 128,
  'two-thirds': 192,
  full: 192,
}
const NEWS_HEADER_H: Record<string, number> = {
  'one-third': 67,
  half: 63,
  'two-thirds': 59,
  full: 59,
}
const NEWS_SIDEBYSIDE_ROW_H: Record<string, number> = {
  'two-thirds': 163,
  full: 130,
}

const HC_HEADER_H = 54
const HC_GRID_CARD_H = 275
const HC_LIST_ROW_H = 52
const HC_COMPACT_ITEM_H = 72

const SIZE_TO_COLS: Record<string, number> = {
  full: 4,
  'two-thirds': 3,
  half: 2,
  'one-third': 1,
}

/** Returns true if a #rrggbb hex color is dark enough that dark grey text
 *  loses contrast on it. Uses the ITU-R BT.601 luminance weights. */
function isDarkColor(hex: string): boolean {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return false
  const n = parseInt(m[1], 16)
  const r = (n >> 16) & 0xff
  const g = (n >> 8) & 0xff
  const b = n & 0xff
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance < 0.55
}

function computeAdjustedItemCount(
  widgetId: string,
  config: ConfigValues,
  size: WidgetSize,
  targetH: number,
): number | null {
  if (widgetId === 'news') {
    if ((config.countMode as string) === 'manual') return null
    const rawLayout = (config.layout as string) ?? 'featured'
    const layout =
      (rawLayout === 'featured' && size !== 'full') ||
      (rawLayout === 'sidebyside' && size !== 'full' && size !== 'two-thirds')
        ? 'list'
        : rawLayout
    const headerH = NEWS_HEADER_H[size] ?? 63
    if (layout === 'list') {
      const itemH = NEWS_ITEM_H[size] ?? 128
      return Math.max(1, Math.min(8, Math.ceil((targetH - headerH) / itemH)))
    }
    if (layout === 'sidebyside') {
      const rowH = NEWS_SIDEBYSIDE_ROW_H[size] ?? 163
      const count = Math.max(1, Math.ceil((targetH - headerH) / rowH))
      // full = 2-column grid so multiply by 2; two-thirds = single column, round to even
      if (size === 'full') return Math.min(8, count * 2)
      return Math.min(8, Math.ceil(count / 2) * 2)
    }
    return null
  }
  if (widgetId === 'highlightedContent') {
    if ((config.countMode as string) === 'manual') return null
    const rawLayout = (config.layout as string) ?? 'grille'
    if (rawLayout === 'carrousel') return null
    const cols = SIZE_TO_COLS[size] ?? 4
    const layout =
      size === 'one-third' && (rawLayout === 'grille' || rawLayout === 'pellicule')
        ? 'compact'
        : rawLayout
    if (layout === 'grille' || layout === 'pellicule') {
      const rowCount = Math.max(1, Math.round((targetH - HC_HEADER_H) / HC_GRID_CARD_H))
      return Math.min(8, rowCount * cols)
    }
    if (layout === 'liste') {
      return Math.max(1, Math.min(8, Math.round((targetH - HC_HEADER_H) / HC_LIST_ROW_H)))
    }
    if (layout === 'compact') {
      return Math.max(1, Math.min(8, Math.round((targetH - HC_HEADER_H) / HC_COMPACT_ITEM_H)))
    }
  }
  return null
}

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
    document.title = `${branding.name} · ${PLATFORM_LABELS[platform]}`
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
        scale: 1,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      })
      const link = document.createElement('a')
      const slug = branding.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'page'
      const stamp = new Date().toISOString().slice(0, 10)
      const suffix = mode === 'wireframe' ? '-wireframe' : ''
      // JPEG at 0.9 quality keeps the rendered photo-heavy preview compact;
      // wireframe (mostly flat colors + text) stays as PNG for crisp lines.
      const isJpeg = mode === 'rendered'
      const ext = isJpeg ? 'jpg' : 'png'
      link.download = `${slug}-${platform}${suffix}-${stamp}.${ext}`
      link.href = canvas.toDataURL(
        isJpeg ? 'image/jpeg' : 'image/png',
        isJpeg ? 0.9 : undefined,
      )
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

// ── Wireframe export canvas ──────────────────────────────────────────────────

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
                  (cell.widgetId === '' ? 'Emplacement vide' : cell.widgetId)
                const flex = ratios[idx] ?? 1 / row.cells.length
                const stackedCells = cell.stackedCells ?? []
                return (
                  <div
                    key={cell.id}
                    className={styles.wfColumnContainer}
                    style={{ flex: `${flex} 1 0` }}
                  >
                    <div className={styles.wfCell}>
                      <div className={styles.wfCellIndex}>
                        {rowIdx + 1}.{idx + 1}
                      </div>
                      <div className={styles.wfCellLabel}>{label}</div>
                    </div>
                    {stackedCells.map((sc, scIdx) => {
                      const sw = getWidget(sc.widgetId)
                      const scLabel =
                        sw?.platformLabels[platform] ??
                        sw?.purpose.label ??
                        sc.widgetId
                      return (
                        <div key={sc.id} className={styles.wfCell}>
                          <div className={styles.wfCellIndex}>
                            {rowIdx + 1}.{idx + 1}.{scIdx + 1}
                          </div>
                          <div className={styles.wfCellLabel}>{scLabel}</div>
                        </div>
                      )
                    })}
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

// ── Rendered row with ResizeObserver-based height adjustment ─────────────────

function RenderedRow({ row, index }: { row: WireframeRow; index: number }) {
  const platform = useProjectStore((s) => s.platform)
  const branding = useProjectStore((s) => s.branding)

  // Calculs dérivés avant les hooks - safe même si row.cells est vide
  const ratios =
    row.columnRatios && row.columnRatios.length === row.cells.length
      ? row.columnRatios
      : new Array(row.cells.length).fill(1 / row.cells.length)

  const isFullBleed = row.cells.some((cell) => {
    const widget = getWidget(cell.widgetId)
    return Boolean(widget?.isFullBleed)
  })

  const forceWhite = row.cells.some((cell) => {
    const widget = getWidget(cell.widgetId)
    return Boolean(widget?.forceWhiteSection)
  })

  const hasStacked = row.cells.some((c) => c.stackedCells && c.stackedCells.length > 0)

  // Tous les hooks avant tout early return (règle des Hooks React)
  const [_itemCountOverrides, setItemCountOverrides] = useState<Record<string, number>>({})
  const cellRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const measure = useCallback(() => {
    if (!hasStacked) return

    const currentRatios =
      row.columnRatios && row.columnRatios.length === row.cells.length
        ? row.columnRatios
        : new Array(row.cells.length).fill(1 / row.cells.length)

    let stackedMaxH = 0
    for (const cell of row.cells) {
      if (!cell.stackedCells?.length) continue
      const el = cellRefs.current.get(cell.id)
      if (el) stackedMaxH = Math.max(stackedMaxH, el.getBoundingClientRect().height)
    }
    if (stackedMaxH === 0) return

    const newOverrides: Record<string, number> = {}
    row.cells.forEach((cell, idx) => {
      if (cell.stackedCells?.length) return
      const s = ratioToSize(currentRatios[idx])
      const adjusted = computeAdjustedItemCount(cell.widgetId, cell.config, s, stackedMaxH)
      if (adjusted !== null) newOverrides[cell.id] = adjusted
    })

    setItemCountOverrides((prev) => {
      const changed =
        Object.keys(newOverrides).length !== Object.keys(prev).length ||
        Object.keys(newOverrides).some((k) => prev[k] !== newOverrides[k])
      return changed ? newOverrides : prev
    })
  }, [row, hasStacked])

  useEffect(() => {
    if (!hasStacked) return

    const observer = new ResizeObserver(measure)
    for (const cell of row.cells) {
      if (!cell.stackedCells?.length) continue
      const el = cellRefs.current.get(cell.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [hasStacked, measure, row.cells])

  const itemCountOverrides = hasStacked ? _itemCountOverrides : {}

  // Early return après tous les hooks
  if (row.cells.length === 0) return null

  const defaultSectionClass = () =>
    platform === 'jint'
      ? index % 2 === 0
        ? styles.sectionEven
        : styles.sectionOdd
      : platform === 'sharepoint'
        ? styles.sectionWhite
        : styles.sectionDefault

  // Normalize the row background config: new model (fill + pattern) takes
  // precedence; legacy `type` is mapped to the new model for backward compat.
  const bg = row.background
  let fill: 'none' | 'white' | 'solid' = 'none'
  let pattern: 'none' | 'dotted' | 'curves' = 'none'
  if (bg) {
    if (bg.fill !== undefined || bg.pattern !== undefined) {
      fill = bg.fill ?? 'none'
      pattern = bg.pattern ?? 'none'
    } else {
      switch (bg.type) {
        case 'white':        fill = 'white'; break
        case 'solid':        fill = 'solid'; break
        case 'dotted':       fill = 'white'; pattern = 'dotted'; break
        case 'dotted-clear': fill = 'none';  pattern = 'dotted'; break
        case 'curves':       fill = 'none';  pattern = 'curves'; break
        default: break
      }
    }
  }
  // Two independent colors: one for the fill, one for the pattern. The
  // legacy single `colorKey` (used by old projects) falls back to both.
  const fillColor =
    branding.colors[bg?.fillColorKey ?? bg?.colorKey ?? 'primary']
  const patternColor =
    branding.colors[bg?.patternColorKey ?? bg?.colorKey ?? 'primary']
  const hasCustomBg = fill !== 'none' || pattern !== 'none'

  // When the fill is solid AND dark, flip text colors of widgets sitting
  // directly on the section background to a light scheme via CSS vars.
  const isDarkSection = fill === 'solid' && isDarkColor(fillColor)

  let sectionClass: string | undefined
  let sectionStyle: React.CSSProperties | undefined = undefined

  if (isFullBleed) {
    sectionClass = styles.sectionFullBleed
  } else if (forceWhite) {
    sectionClass = styles.sectionWhite
  } else if (hasCustomBg) {
    const classes: string[] = [styles.sectionRow]
    if (fill === 'white') classes.push(styles.sectionRowFillWhite)
    else if (fill === 'solid') classes.push(styles.sectionRowFillSolid)
    if (pattern === 'dotted') classes.push(styles.sectionRowPatternDotted)
    sectionClass = classes.join(' ')
    sectionStyle = {
      ['--row-bg-color' as string]: fillColor,
      ['--dot-color' as string]: patternColor,
      ...(isDarkSection
        ? {
            ['--text-on-bg' as string]: '#ffffff',
            ['--text-on-bg-muted' as string]: 'rgba(255, 255, 255, 0.78)',
          }
        : {}),
    } as React.CSSProperties
  } else {
    sectionClass = defaultSectionClass()
  }

  const alignItems =
    row.alignment === 'center' ? 'center'
    : row.alignment === 'bottom' ? 'flex-end'
    : 'flex-start'

  const rowContent = (
    <div className={styles.widgetRow} style={{ alignItems }}>
      {row.cells.map((cell, idx) => {
        const flex = ratios[idx] ?? 1 / row.cells.length
        const widget = getWidget(cell.widgetId)
        if (!widget) {
          return <div key={cell.id} className={styles.widgetCell} style={{ flex: `${flex} 1 0` }} />
        }
        const Renderer = resolveRenderer(widget, platform)
        if (!Renderer) return null
        const size = ratioToSize(flex)

        const override = itemCountOverrides[cell.id]
        const config: ConfigValues =
          override != null ? { ...cell.config, itemCount: override } : cell.config

        const stackedCells = cell.stackedCells ?? []

        // Per-widget background override. 'default' = let the widget's own
        // CSS render its natural look. Otherwise inject CSS vars consumed
        // by each widget's .root.
        const widgetBg = (cell.config.widgetBg as string | undefined) ?? 'default'
        const widgetCellStyle = buildWidgetCellStyle(widgetBg, branding.colors)

        return (
          <div
            key={cell.id}
            ref={(el) => {
              if (el) cellRefs.current.set(cell.id, el)
              else cellRefs.current.delete(cell.id)
            }}
            className={styles.widgetCell}
            style={{ flex: `${flex} 1 0` }}
          >
            <div className={styles.widgetCellInner} style={widgetCellStyle}>
              <Renderer config={config} size={size} branding={branding} />
              {stackedCells.map((sc) => {
                const sw = getWidget(sc.widgetId)
                if (!sw) return null
                const SR = resolveRenderer(sw, platform)
                if (!SR) return null
                return (
                  <div key={sc.id} className={styles.stackedWidgetWrapper}>
                    <SR config={sc.config} size={size} branding={branding} />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )

  const needsSpInner = (platform === 'sharepoint' || platform === 'jint') && !isFullBleed

  const curvesColor = pattern === 'curves' ? patternColor : null

  return (
    <div className={sectionClass} style={sectionStyle}>
      {curvesColor && (
        <svg
          className={styles.curvesLayer}
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M 0 90 C 200 30 400 180 600 110 S 1000 40 1200 100"
            stroke={curvesColor}
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            opacity="0.22"
          />
          <path
            d="M 0 220 C 200 280 400 150 600 210 S 1000 270 1200 200"
            stroke={curvesColor}
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            opacity="0.16"
          />
          <path
            d="M 0 40 C 300 110 500 -20 800 60 S 1100 120 1200 50"
            stroke={curvesColor}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.1"
          />
        </svg>
      )}
      {needsSpInner ? (
        <div className={styles.spSectionInner}>{rowContent}</div>
      ) : (
        rowContent
      )}
    </div>
  )
}
