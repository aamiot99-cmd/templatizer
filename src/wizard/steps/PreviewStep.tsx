import { useState } from 'react'
import { useProjectStore } from '../../store/projectStore'
import { getWidget } from '../../widgets/registry'
import { PLATFORM_LABELS, USAGE_CATEGORY_LABELS } from '../../types'
import type { NavEntry, WireframeRow } from '../../types'
import styles from './PreviewStep.module.css'

function flatMockupPages(entries: NavEntry[]): NavEntry[] {
  const result: NavEntry[] = []
  for (const e of entries) {
    if (e.hasMockup) result.push(e)
    if (e.children) {
      for (const c of e.children) {
        if (c.hasMockup) result.push(c)
      }
    }
  }
  return result
}

function ratioLabel(ratios: number[] | undefined, idx: number, count: number): string {
  if (!ratios || count === 1) return 'plein'
  const value = ratios[idx] ?? 1 / count
  if (Math.abs(value - 1 / 3) < 0.02) return '1/3'
  if (Math.abs(value - 1 / 2) < 0.02) return '1/2'
  if (Math.abs(value - 2 / 3) < 0.02) return '2/3'
  return `${Math.round(value * 100)}%`
}

export function PreviewStep() {
  const platform = useProjectStore((s) => s.platform)
  const branding = useProjectStore((s) => s.branding)
  const wireframes = useProjectStore((s) => s.wireframes)
  const navEntries = useProjectStore((s) => s.navEntries)

  const mockupPages = flatMockupPages(navEntries)

  const [selectedPageId, setSelectedPageId] = useState<string>(
    () => mockupPages[0]?.id ?? '',
  )

  // If the selected page is no longer a mockup page, reset to first
  const effectivePageId = mockupPages.some((p) => p.id === selectedPageId)
    ? selectedPageId
    : (mockupPages[0]?.id ?? '')

  const selectedRows = wireframes[effectivePageId]?.rows ?? []

  const selectedPageLabel =
    mockupPages.find((p) => p.id === effectivePageId)?.label ?? ''

  const totalNavEntries = navEntries.length
  const totalNavChildren = navEntries.reduce(
    (sum, e) => sum + (e.children?.length ?? 0),
    0,
  )

  return (
    <div className={styles.summary}>
      <IdentityCard platform={platform} branding={branding} />
      <div className={styles.splitRow}>
        <NavCard
          navEntries={navEntries}
          selectedPageId={effectivePageId}
          onSelect={(id) => setSelectedPageId(id)}
        />
        <WireframeCard rows={selectedRows} pageLabel={selectedPageLabel} />
      </div>

      <div className={styles.stats}>
        <span>
          <strong>{mockupPages.length}</strong> page
          {mockupPages.length > 1 ? 's' : ''} maquettée
          {mockupPages.length > 1 ? 's' : ''}
        </span>
        <span>
          <strong>{selectedRows.length}</strong> ligne
          {selectedRows.length > 1 ? 's' : ''}
        </span>
        <span>
          <strong>{totalNavEntries}</strong> entrée
          {totalNavEntries > 1 ? 's' : ''} de nav
        </span>
        {totalNavChildren > 0 && (
          <span>
            <strong>{totalNavChildren}</strong> sous-entrée
            {totalNavChildren > 1 ? 's' : ''}
          </span>
        )}
        <span>
          Plateforme : <strong>{PLATFORM_LABELS[platform]}</strong>
        </span>
      </div>
    </div>
  )
}

function IdentityCard({
  platform,
  branding,
}: {
  platform: keyof typeof PLATFORM_LABELS
  branding: ReturnType<typeof useProjectStore.getState>['branding']
}) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Identité visuelle</h3>
      </div>
      <div className={styles.identityRow}>
        <div className={styles.logoBox}>
          {branding.logo ? (
            <img
              src={branding.logo}
              alt={branding.name}
              className={styles.logoImg}
            />
          ) : (
            <span className={styles.logoPlaceholder}>Pas de logo</span>
          )}
        </div>
        <div>
          <h2 className={styles.identityName}>{branding.name}</h2>
          <div className={styles.identityPlatform}>
            Plateforme cible : <strong>{PLATFORM_LABELS[platform]}</strong>
          </div>
        </div>
        <div className={styles.colorStack}>
          <ColorLine label="Primaire" hex={branding.colors.primary} />
          <ColorLine label="Secondaire" hex={branding.colors.secondary} />
          <ColorLine label="Texte" hex={branding.colors.text} />
        </div>
      </div>
    </section>
  )
}

function ColorLine({ label, hex }: { label: string; hex: string }) {
  return (
    <div className={styles.colorItem}>
      <div className={styles.colorDot} style={{ background: hex }} />
      <div className={styles.colorMeta}>
        <span className={styles.colorLabel}>{label}</span>
        <span className={styles.colorHex}>{hex.toUpperCase()}</span>
      </div>
    </div>
  )
}

function NavCard({
  navEntries,
  selectedPageId,
  onSelect,
}: {
  navEntries: NavEntry[]
  selectedPageId: string
  onSelect: (id: string) => void
}) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Navigation</h3>
      </div>
      {navEntries.length === 0 ? (
        <div className={styles.navEmpty}>Aucune entrée définie.</div>
      ) : (
        <div className={styles.navTree}>
          {navEntries.map((entry) => (
            <div key={entry.id}>
              <div
                className={`${styles.navTop} ${entry.hasMockup ? styles.navTopMockup : ''} ${entry.id === selectedPageId ? styles.navTopSelected : ''}`}
                onClick={entry.hasMockup ? () => onSelect(entry.id) : undefined}
              >
                <span className={styles.navBullet} />
                <span>{entry.label}</span>
                {entry.hasMockup && (
                  <span className={styles.mockupBadge}>Maquette</span>
                )}
              </div>
              {entry.children && entry.children.length > 0 && (
                <div className={styles.navChildren}>
                  {entry.children.map((child) => (
                    <div
                      key={child.id}
                      className={`${styles.navChild} ${child.hasMockup ? styles.navChildMockup : ''} ${child.id === selectedPageId ? styles.navChildSelected : ''}`}
                      onClick={child.hasMockup ? () => onSelect(child.id) : undefined}
                    >
                      {child.label}
                      {child.hasMockup && (
                        <span className={styles.mockupBadge}>Maquette</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function WireframeCard({ rows, pageLabel }: { rows: WireframeRow[]; pageLabel: string }) {
  return (
    <section className={styles.card}>
      <div className={styles.wireframeCardHeader}>
        <h3 className={styles.cardTitle}>Structure du wireframe</h3>
        {pageLabel && (
          <span className={styles.wireframePageName}>{pageLabel}</span>
        )}
      </div>
      {rows.length === 0 ? (
        <div className={styles.schemaEmpty}>
          Aucun widget placé pour cette page. Retournez à l'étape "Wireframe"
          pour composer votre page.
        </div>
      ) : (
        <div className={styles.wireframeSchema}>
          {rows.map((row) => (
            <SchemaRow key={row.id} row={row} />
          ))}
        </div>
      )}
    </section>
  )
}

function SchemaRow({ row }: { row: WireframeRow }) {
  const platform = useProjectStore((s) => s.platform)

  if (row.cells.length === 0) return null

  const ratios =
    row.columnRatios && row.columnRatios.length === row.cells.length
      ? row.columnRatios
      : new Array(row.cells.length).fill(1 / row.cells.length)

  return (
    <div className={styles.schemaRow}>
      {row.cells.map((cell, idx) => {
        const widget = getWidget(cell.widgetId)
        const flex = ratios[idx] ?? 1 / row.cells.length
        const label = widget?.platformLabels[platform] ?? cell.widgetId
        const category = widget
          ? USAGE_CATEGORY_LABELS[widget.purpose.category]
          : ''
        const stackedCells = cell.stackedCells ?? []
        return (
          <div
            key={cell.id}
            className={styles.schemaCell}
            style={{ flex: `${flex} 1 0` }}
          >
            <div>
              {category && (
                <div className={styles.schemaCellCategory}>{category}</div>
              )}
              <div className={styles.schemaCellLabel}>{label}</div>
              {stackedCells.map((sc) => {
                const sw = getWidget(sc.widgetId)
                return (
                  <div key={sc.id} className={styles.schemaCellStacked}>
                    {sw?.platformLabels[platform] ?? sc.widgetId}
                  </div>
                )
              })}
            </div>
            <div className={styles.schemaCellRatio}>
              {ratioLabel(row.columnRatios, idx, row.cells.length)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
