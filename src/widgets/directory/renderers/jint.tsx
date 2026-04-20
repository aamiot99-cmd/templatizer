import type { WidgetRendererProps } from '../../../types'
import styles from './jint.module.css'

interface Person {
  name: string
  role: string
}

const DEFAULT_PEOPLE: Person[] = [
  { name: 'Dimitrios Bampas', role: 'Chief Executive Officer' },
  { name: 'Kaouther Benmebarek', role: 'Directrice technique' },
  { name: 'Julie Bernot', role: 'Microsoft 365 Administrator' },
  { name: 'Steve Charlosse', role: 'Responsable Communication' },
]

const CHIPS = [
  'Direction',
  'Technique',
  'Communication',
  'RH',
]

function AvatarIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill="#d5d5d5" />
      <circle cx="24" cy="18" r="10" fill="#b0b0b0" />
      <ellipse cx="24" cy="42" rx="15" ry="10" fill="#b0b0b0" />
    </svg>
  )
}

export function JintDirectory({ config, size }: WidgetRendererProps) {
  const title = (config.title as string) ?? 'Annuaire'
  const searchPlaceholder =
    (config.searchPlaceholder as string) ?? 'Rechercher une personne...'
  const showSearch = (config.showSearch as boolean) ?? true
  const showChips = (config.showChips as boolean) ?? true
  const isCompact = size === 'compact'
  const isMedium = size === 'medium'
  const people = isCompact
    ? DEFAULT_PEOPLE.slice(0, 1)
    : isMedium
      ? DEFAULT_PEOPLE.slice(0, 3)
      : DEFAULT_PEOPLE

  return (
    <div className={`${styles.widget} ${isCompact ? styles.widgetCompact : ''}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <button type="button" className={styles.viewAll}>
          Voir tout →
        </button>
      </div>

      {showSearch && (
        <div className={styles.search}>
          <input
            type="text"
            placeholder={searchPlaceholder}
            className={styles.searchInput}
            readOnly
          />
        </div>
      )}

      {showChips && (
        <div className={styles.chips}>
          {CHIPS.map((chip) => (
            <button key={chip} type="button" className={styles.chip}>
              {chip}
            </button>
          ))}
        </div>
      )}

      <div className={styles.count}>
        {people.length} personnes trouvées
      </div>

      <div className={`${styles.grid} ${isCompact ? styles.gridCompact : isMedium ? styles.gridMedium : ''}`}>
        {people.map((person) => (
          <div key={person.name} className={styles.card}>
            <div className={styles.avatar}>
              <AvatarIcon />
            </div>
            <div className={styles.info}>
              <div className={styles.name}>{person.name}</div>
              <div className={styles.role}>{person.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
