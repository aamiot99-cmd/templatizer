import type { WidgetRendererProps } from '../../../types'
import styles from './jint.module.css'

interface MockResult {
  title: string
  type: 'PDF' | 'DOCX' | 'XLSX' | 'PPTX' | 'PAGE'
  date: string
  author: string
}

const MOCK_RESULTS: MockResult[] = [
  { title: 'Rapport annuel 2025', type: 'PDF', date: '12 mars 2026', author: 'M. Dupont' },
  { title: 'Procédure onboarding RH', type: 'DOCX', date: '5 mars 2026', author: 'C. Martin' },
  { title: 'Budget Q1 2026 (synthèse)', type: 'XLSX', date: '28 fév. 2026', author: 'L. Bernard' },
  { title: 'Présentation client Alpha', type: 'PPTX', date: '21 fév. 2026', author: 'S. Leroy' },
  { title: 'Politique de sécurité', type: 'PAGE', date: '14 fév. 2026', author: 'A. Roussel' },
  { title: "Charte d'utilisation", type: 'PDF', date: '2 fév. 2026', author: 'M. Dupont' },
]

function typeBadgeColor(type: MockResult['type']): string {
  switch (type) {
    case 'PDF': return '#e11d48'
    case 'DOCX': return '#2563eb'
    case 'XLSX': return '#16a34a'
    case 'PPTX': return '#ea580c'
    case 'PAGE': return '#7c3aed'
  }
}

export function JintDocumentCenter({ config, branding }: WidgetRendererProps) {
  const title = (config.title as string) || 'Centre documentaire'
  const searchPlaceholder =
    (config.searchPlaceholder as string) || 'Rechercher des documents…'
  const resultsLayout = (config.resultsLayout as 'table' | 'tile' | 'card') || 'tile'
  const showFilterDate = config.showFilterDate !== false
  const showFilterType = config.showFilterType !== false
  const showFilterAuthor = Boolean(config.showFilterAuthor)

  // Contributors is always shown, so the filters aside always renders.

  return (
    <div className={styles.root}>
      {title && <h2 className={styles.title}>{title}</h2>}

      <div
        className={styles.searchBar}
        style={{ background: branding.colors.primary }}
      >
        <span className={styles.searchLabel}>Rechercher</span>
        <div className={styles.searchInput}>
          <svg
            className={styles.searchIcon}
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className={styles.searchPlaceholder}>{searchPlaceholder}</span>
        </div>
      </div>

      <div className={styles.layout} data-layout={resultsLayout}>
        <aside className={styles.filters}>
          <div className={styles.filtersTitle}>Filtres</div>
          {showFilterDate && (
            <FilterGroup
              label="Date"
              options={['Aujourd\'hui', '7 derniers jours', '30 derniers jours', 'Personnalisée']}
            />
          )}
          {showFilterType && (
            <FilterGroup
              label="Type de contenu"
              options={['Documents', 'Pages', 'Images', 'Vidéos']}
            />
          )}
          {showFilterAuthor && (
            <FilterGroup label="Auteur" options={['M. Dupont', 'C. Martin', 'L. Bernard']} />
          )}
          <FilterGroup label="Contributeurs" options={['aamiot', 'tdumont']} />
        </aside>

        <section className={styles.results}>
          <div className={styles.resultsHeader}>
            <div className={styles.formatPills}>
              {(['Tout', 'PDF', 'Excel', 'PPT', 'DOC'] as const).map((fmt) => {
                const isActive = fmt === 'Tout'
                return (
                  <span
                    key={fmt}
                    className={`${styles.formatPill} ${isActive ? styles.formatPillActive : ''}`}
                    style={
                      isActive
                        ? {
                            background: `color-mix(in srgb, ${branding.colors.primary} 15%, transparent)`,
                            color: branding.colors.primary,
                          }
                        : undefined
                    }
                  >
                    {fmt}
                  </span>
                )
              })}
            </div>
            <div className={styles.layoutSwitcher} aria-hidden="true">
              <LayoutIcon kind="table" active={resultsLayout === 'table'} />
              <LayoutIcon kind="tile" active={resultsLayout === 'tile'} />
              <LayoutIcon kind="card" active={resultsLayout === 'card'} />
            </div>
          </div>
          <div className={styles.resultsCount}>{MOCK_RESULTS.length} résultats</div>

          {resultsLayout === 'table' && <ResultsTable items={MOCK_RESULTS} />}
          {resultsLayout === 'tile' && <ResultsTile items={MOCK_RESULTS} />}
          {resultsLayout === 'card' && <ResultsCard items={MOCK_RESULTS} />}
        </section>
      </div>
    </div>
  )
}

function LayoutIcon({
  kind,
  active,
}: {
  kind: 'table' | 'tile' | 'card'
  active: boolean
}) {
  const cls = `${styles.layoutIconBtn} ${active ? styles.layoutIconBtnActive : ''}`
  return (
    <span className={cls}>
      <svg
        viewBox="0 0 16 16"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {kind === 'table' && (
          <>
            <line x1="2.5" y1="4" x2="13.5" y2="4" />
            <line x1="2.5" y1="8" x2="13.5" y2="8" />
            <line x1="2.5" y1="12" x2="13.5" y2="12" />
          </>
        )}
        {kind === 'tile' && (
          <>
            <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="0.5" />
            <rect x="9" y="2.5" width="4.5" height="4.5" rx="0.5" />
            <rect x="2.5" y="9" width="4.5" height="4.5" rx="0.5" />
            <rect x="9" y="9" width="4.5" height="4.5" rx="0.5" />
          </>
        )}
        {kind === 'card' && (
          <>
            <rect x="2.5" y="3" width="11" height="10" rx="1" />
            <line x1="2.5" y1="8" x2="13.5" y2="8" />
          </>
        )}
      </svg>
    </span>
  )
}

function FilterGroup({ label, options }: { label: string; options: string[] }) {
  return (
    <div className={styles.filterGroup}>
      <div className={styles.filterLabel}>{label}</div>
      <div className={styles.filterOptions}>
        {options.map((opt) => (
          <label key={opt} className={styles.filterOption}>
            <input type="checkbox" disabled />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function ResultsTable({ items }: { items: MockResult[] }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Titre</th>
          <th>Type</th>
          <th>Modifié le</th>
          <th>Auteur</th>
        </tr>
      </thead>
      <tbody>
        {items.map((it) => (
          <tr key={it.title}>
            <td className={styles.tableTitle}>{it.title}</td>
            <td>
              <span
                className={styles.typeBadge}
                style={{ background: typeBadgeColor(it.type) }}
              >
                {it.type}
              </span>
            </td>
            <td>{it.date}</td>
            <td>{it.author}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function ResultsTile({ items }: { items: MockResult[] }) {
  return (
    <div className={styles.tileGrid}>
      {items.map((it) => (
        <article key={it.title} className={styles.tile}>
          <div
            className={styles.tileThumb}
            style={{ background: typeBadgeColor(it.type) }}
          >
            {it.type}
          </div>
          <div className={styles.tileBody}>
            <div className={styles.tileTitle}>{it.title}</div>
            <div className={styles.tileMeta}>
              {it.author} · {it.date}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function ResultsCard({ items }: { items: MockResult[] }) {
  return (
    <div className={styles.cardList}>
      {items.slice(0, 4).map((it) => (
        <article key={it.title} className={styles.card}>
          <div
            className={styles.cardPreview}
            style={{ background: typeBadgeColor(it.type) }}
          >
            <span>{it.type}</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.cardTitle}>{it.title}</div>
            <div className={styles.cardMeta}>
              {it.author} · {it.date}
            </div>
            <p className={styles.cardSnippet}>
              Aperçu du contenu : extrait représentatif du document pour
              identifier rapidement la pertinence du résultat.
            </p>
          </div>
        </article>
      ))}
    </div>
  )
}
