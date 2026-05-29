import type { WidgetRendererProps, WidgetSize } from '../../../types'
import { initials } from '../../_shared/utils'
import styles from './sharepoint.module.css'

interface Contact {
  name: string
  sub: string
  color: string | null
}

const CONTACTS: Contact[] = [
  { name: 'Marie Dupont',       sub: 'marie.dupont@entreprise.fr',   color: '#e8440a' },
  { name: 'Thomas Bernard',     sub: 'CDP',                          color: '#7c3aed' },
  { name: 'Sophie Moreau',      sub: 'Directrice Marketing',         color: '#0284c7' },
  { name: 'Nicolas Laurent',    sub: 'n.laurent@entreprise.fr',      color: '#16a34a' },
  { name: 'Camille Martin',     sub: 'Chef de Projet',               color: null      },
  { name: 'Antoine Leroy',      sub: 'CEO',                          color: '#dc2626' },
  { name: 'Julie Petit',        sub: 'j.petit@entreprise.fr',        color: '#0891b2' },
  { name: 'Pierre Dubois',      sub: 'DSI',                          color: null      },
  { name: 'Amélie Roux',        sub: 'a.roux@entreprise.fr',         color: '#059669' },
  { name: 'Maxime Garnier',     sub: 'Analyste Data',                color: '#b45309' },
  { name: 'Clara Simon',        sub: 'c.simon@entreprise.fr',        color: '#be185d' },
  { name: 'Éric Fontaine',      sub: 'DRH',                          color: null      },
  { name: 'Lucie Morel',        sub: 'l.morel@entreprise.fr',        color: '#047857' },
  { name: 'Stéphane Robert',    sub: 'Ingénieur DevOps',             color: '#9333ea' },
  { name: 'Isabelle Chevalier', sub: 'Resp. Communication',          color: '#c2410c' },
]

const COLS: Record<WidgetSize, number> = {
  full: 4,
  'two-thirds': 3,
  half: 2,
  'one-third': 1,
}

const isEmail = (s: string) => s.includes('@')

function Avatar({ contact, cls }: { contact: Contact; cls: string }) {
  if (!contact.color) {
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
    <div className={`${styles.avatar} ${cls}`} style={{ backgroundColor: contact.color }}>
      {initials(contact.name)}
    </div>
  )
}

function Sub({ text }: { text: string }) {
  return <div className={isEmail(text) ? styles.subLink : styles.subMuted}>{text}</div>
}

function CardPetit({ contact }: { contact: Contact }) {
  return (
    <div className={styles.cardPetit}>
      <Avatar contact={contact} cls={styles.avatarSm} />
      <div className={styles.cardText}>
        <div className={styles.name}>{contact.name}</div>
        <Sub text={contact.sub} />
      </div>
    </div>
  )
}

function CardMoyen({ contact }: { contact: Contact }) {
  return (
    <div className={styles.cardMoyen}>
      <Avatar contact={contact} cls={styles.avatarMd} />
      <div className={styles.cardText}>
        <div className={styles.name}>{contact.name}</div>
        <Sub text={contact.sub} />
      </div>
    </div>
  )
}

function CardGrande({ contact }: { contact: Contact }) {
  return (
    <div className={styles.cardGrande}>
      <Avatar contact={contact} cls={styles.avatarLg} />
      <div className={styles.cardGrandeText}>
        <div className={styles.name}>{contact.name}</div>
        <Sub text={contact.sub} />
      </div>
    </div>
  )
}

export function SharepointContacts({ config, size }: WidgetRendererProps) {
  const title = (config.title as string) || 'Contacts'
  const layout = (config.layout as string) || 'moyen'
  const count = Math.min(15, Math.max(1, Number(config.itemCount) || 5))
  const cols = COLS[size] ?? 4
  const visible = CONTACTS.slice(0, count)

  const Card = layout === 'petit' ? CardPetit : layout === 'grande' ? CardGrande : CardMoyen

  return (
    <div className={styles.widget}>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {visible.map((contact) => (
          <Card key={contact.name} contact={contact} />
        ))}
      </div>
    </div>
  )
}
