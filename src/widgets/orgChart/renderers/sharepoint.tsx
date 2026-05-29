import { useState, useRef } from 'react'
import type { WidgetRendererProps, WidgetSize } from '../../../types'
import { initials } from '../../_shared/utils'
import styles from './sharepoint.module.css'

interface Person {
  name: string
  title: string
  color: string | null
  department: string
  email: string
  phone: string
  location: string
}

const MANAGER: Person = {
  name: 'Sophie Moreau',
  title: 'Directrice des Opérations',
  color: '#0284c7',
  department: 'Direction Générale',
  email: 's.moreau@entreprise.com',
  phone: '+33 1 42 00 10 01',
  location: 'Paris – Siège',
}

const REPORTS: Person[] = [
  {
    name: 'Thomas Bernard',
    title: 'Responsable Logistique',
    color: '#e8440a',
    department: 'Supply Chain',
    email: 't.bernard@entreprise.com',
    phone: '+33 1 42 00 10 12',
    location: 'Lyon – Entrepôt Central',
  },
  {
    name: 'Marie Dupont',
    title: 'Chargée de Projet',
    color: '#7c3aed',
    department: 'Direction des Opérations',
    email: 'm.dupont@entreprise.com',
    phone: '+33 1 42 00 10 08',
    location: 'Paris – Siège',
  },
  {
    name: 'Julie Petit',
    title: 'Analyste Performance',
    color: '#0891b2',
    department: 'Direction des Opérations',
    email: 'j.petit@entreprise.com',
    phone: '+33 1 42 00 10 15',
    location: 'Paris – Siège',
  },
  {
    name: 'Camille Martin',
    title: 'Assistante de Direction',
    color: null,
    department: 'Direction Générale',
    email: 'c.martin@entreprise.com',
    phone: '+33 1 42 00 10 03',
    location: 'Paris – Siège',
  },
]

const COLS: Record<WidgetSize, number> = {
  full: 3,
  'two-thirds': 3,
  half: 2,
  'one-third': 1,
}

function Avatar({ person, cls }: { person: Person; cls: string }) {
  if (!person.color) {
    return (
      <div className={`${styles.avatar} ${cls} ${styles.avatarGrey}`}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8.5" r="4" fill="#bbb" />
          <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="#bbb" />
        </svg>
      </div>
    )
  }
  return (
    <div className={`${styles.avatar} ${cls}`} style={{ backgroundColor: person.color }}>
      {initials(person.name)}
    </div>
  )
}

interface PopupData {
  person: Person
  manager: Person | null
  top: number
  left: number
  alignRight: boolean
}

function ProfileCard({
  data,
  containerRef,
  onMouseLeave,
}: {
  data: PopupData
  containerRef: React.MutableRefObject<HTMLDivElement | null>
  onMouseLeave: () => void
}) {
  const { person, manager, top, left, alignRight } = data

  const style: React.CSSProperties = {
    top,
    ...(alignRight ? { right: left } : { left }),
  }

  return (
    <div
      ref={containerRef}
      className={styles.profileCard}
      style={style}
      onMouseLeave={onMouseLeave}
    >
      {/* En-tête */}
      <div className={styles.pcHeader}>
        <Avatar person={person} cls={styles.avatarLg} />
        <div className={styles.pcHeaderInfo}>
          <div className={styles.pcName}>{person.name}</div>
          <div className={styles.pcTitle}>{person.title}</div>
          <div className={styles.pcDept}>{person.department}</div>
          <div className={styles.pcAvailability}>
            <span className={styles.availDot} />
            Disponible
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.pcActions}>
        <button className={styles.pcAction} title="Message">
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M2 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6l-4 3V4z" stroke="#0078d4" strokeWidth="1.5"/>
          </svg>
          <span>Message</span>
        </button>
        <button className={styles.pcAction} title="E-mail">
          <svg viewBox="0 0 20 20" fill="none">
            <rect x="2" y="4" width="16" height="12" rx="1.5" stroke="#0078d4" strokeWidth="1.5"/>
            <path d="M2 6l8 5 8-5" stroke="#0078d4" strokeWidth="1.5"/>
          </svg>
          <span>E-mail</span>
        </button>
        <button className={styles.pcAction} title="Appel">
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M4 3h3.5l1.5 4-2 1.5a11 11 0 0 0 4.5 4.5L13 11l4 1.5V16a1 1 0 0 1-1 1C7.16 17 3 12.84 3 8a1 1 0 0 1 1-5z" stroke="#0078d4" strokeWidth="1.5"/>
          </svg>
          <span>Appel</span>
        </button>
        <button className={styles.pcAction} title="Organigramme">
          <svg viewBox="0 0 20 20" fill="none">
            <rect x="7" y="2" width="6" height="4" rx="1" stroke="#0078d4" strokeWidth="1.5"/>
            <rect x="1" y="13" width="5" height="4" rx="1" stroke="#0078d4" strokeWidth="1.5"/>
            <rect x="7.5" y="13" width="5" height="4" rx="1" stroke="#0078d4" strokeWidth="1.5"/>
            <rect x="14" y="13" width="5" height="4" rx="1" stroke="#0078d4" strokeWidth="1.5"/>
            <path d="M10 6v3M10 9H3.5v4M10 9h6.5v4M10 9v4" stroke="#0078d4" strokeWidth="1.5"/>
          </svg>
          <span>Org</span>
        </button>
        <button className={styles.pcAction} title="Plus">
          <svg viewBox="0 0 20 20" fill="#0078d4">
            <circle cx="4" cy="10" r="1.5"/>
            <circle cx="10" cy="10" r="1.5"/>
            <circle cx="16" cy="10" r="1.5"/>
          </svg>
          <span>Plus</span>
        </button>
      </div>

      {/* Statut */}
      <div className={styles.pcStatus}>
        <div className={styles.pcStatusRow}>
          <svg className={styles.pcStatusIcon} viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="#107c10" strokeWidth="1.5"/>
            <path d="M5 8l2 2 4-4" stroke="#107c10" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span>Disponible · Libre toute la journée</span>
        </div>
        <div className={styles.pcStatusRow}>
          <svg className={styles.pcStatusIcon} viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="#605e5c" strokeWidth="1.5"/>
            <path d="M8 4v4l3 2" stroke="#605e5c" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span>Heures de travail : 8:00 – 18:00</span>
        </div>
        <div className={styles.pcStatusRow}>
          <svg className={styles.pcStatusIcon} viewBox="0 0 16 16" fill="none">
            <path d="M8 1a5 5 0 0 1 5 5c0 3-5 9-5 9S3 9 3 6a5 5 0 0 1 5-5z" stroke="#605e5c" strokeWidth="1.5"/>
            <circle cx="8" cy="6" r="1.5" stroke="#605e5c" strokeWidth="1.2"/>
          </svg>
          <span>Fuseau identique au vôtre · Paris</span>
        </div>
      </div>

      {/* Contact */}
      <div className={styles.pcSection}>
        <div className={styles.pcSectionTitle}>Contact</div>
        <div className={styles.pcSectionRow}>
          <svg className={styles.pcRowIcon} viewBox="0 0 16 16" fill="none">
            <rect x="1.5" y="3" width="13" height="10" rx="1" stroke="#605e5c" strokeWidth="1.3"/>
            <path d="M1.5 5l6.5 4.5L14.5 5" stroke="#605e5c" strokeWidth="1.3"/>
          </svg>
          <span>{person.email}</span>
        </div>
        <div className={styles.pcSectionRow}>
          <svg className={styles.pcRowIcon} viewBox="0 0 16 16" fill="none">
            <path d="M3 2h2.8l1.2 3.2-1.6 1.2a8.8 8.8 0 0 0 3.6 3.6L10.2 9l3.2 1.2v2.8a.8.8 0 0 1-.8.8C6.1 13.8 2.2 9.9 2.2 5a.8.8 0 0 1 .8-.8" stroke="#605e5c" strokeWidth="1.3"/>
          </svg>
          <span>{person.phone}</span>
        </div>
        <div className={styles.pcSectionRow}>
          <svg className={styles.pcRowIcon} viewBox="0 0 16 16" fill="none">
            <path d="M8 1a4 4 0 0 1 4 4c0 2.4-4 9-4 9S4 7.4 4 5a4 4 0 0 1 4-4z" stroke="#605e5c" strokeWidth="1.3"/>
            <circle cx="8" cy="5" r="1.2" stroke="#605e5c" strokeWidth="1.1"/>
          </svg>
          <span>{person.location}</span>
        </div>
        <button className={styles.pcShowMore}>Afficher plus</button>
      </div>

      {/* Responsable */}
      {manager && (
        <div className={styles.pcSection}>
          <div className={styles.pcSectionTitle}>Responsable</div>
          <div className={styles.pcManagerRow}>
            <Avatar person={manager} cls={styles.avatarXs} />
            <div className={styles.pcManagerInfo}>
              <div className={styles.pcManagerName}>{manager.name}</div>
              <div className={styles.pcManagerTitle}>{manager.title}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function SharepointOrgChart({ config, size }: WidgetRendererProps) {
  const title = (config.title as string) || 'Organigramme'
  const cols = COLS[size] ?? 3

  const [popup, setPopup] = useState<PopupData | null>(null)
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingPerson = useRef<{ person: Person; manager: Person | null } | null>(null)
  const mousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const popupRef = useRef<HTMLDivElement | null>(null)

  function trackMouse(e: React.MouseEvent) {
    mousePos.current = { x: e.clientX, y: e.clientY }
  }

  function handleCardEnter(person: Person, manager: Person | null, e: React.MouseEvent) {
    if (openTimer.current) { clearTimeout(openTimer.current); openTimer.current = null }
    mousePos.current = { x: e.clientX, y: e.clientY }
    pendingPerson.current = { person, manager }

    openTimer.current = setTimeout(() => {
      if (!pendingPerson.current) return
      const { x, y } = mousePos.current
      const vw = window.innerWidth
      const alignRight = vw - x < 316
      setPopup({
        person: pendingPerson.current.person,
        manager: pendingPerson.current.manager,
        top: y + 12,
        left: alignRight ? vw - x + 12 : x + 12,
        alignRight,
      })
    }, 900)
  }

  function handleCardLeave(e: React.MouseEvent) {
    if (openTimer.current) { clearTimeout(openTimer.current); openTimer.current = null }
    pendingPerson.current = null
    // Garde la popup ouverte si le curseur va vers elle
    const related = e.relatedTarget as Element | null
    if (related && popupRef.current && popupRef.current.contains(related)) return
    setPopup(null)
  }

  return (
    <div className={styles.widget}>
      <div className={styles.title}>{title}</div>

      {/* Nœud racine */}
      <div className={styles.rootWrap}>
        <div
          className={styles.rootBox}
          onMouseEnter={(e) => handleCardEnter(MANAGER, null, e)}
          onMouseMove={trackMouse}
          onMouseLeave={handleCardLeave}
        >
          <Avatar person={MANAGER} cls={styles.avatarMd} />
          <div className={styles.rootInfo}>
            <div className={styles.rootName}>{MANAGER.name}</div>
            <div className={styles.rootRole}>{MANAGER.title}</div>
          </div>
          <span className={styles.chevron}>›</span>
        </div>
      </div>

      {/* Trait de connexion */}
      <div className={styles.connector} />

      {/* Box subordonnés */}
      <div className={styles.reportsBox}>
        <div className={styles.reportsHeader}>
          Collaborateurs sous l'autorité de {MANAGER.name} ({REPORTS.length})
        </div>
        <div
          className={styles.reportsGrid}
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {REPORTS.map((person) => (
            <div
              key={person.name}
              className={styles.reportItem}
              onMouseEnter={(e) => handleCardEnter(person, MANAGER, e)}
              onMouseMove={trackMouse}
              onMouseLeave={handleCardLeave}
            >
              <Avatar person={person} cls={styles.avatarSm} />
              <div className={styles.reportText}>
                <div className={styles.reportName}>{person.name}</div>
                <div className={styles.reportRole}>{person.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {popup && (
        <ProfileCard
          data={popup}
          containerRef={popupRef}
          onMouseLeave={() => setPopup(null)}
        />
      )}
    </div>
  )
}
