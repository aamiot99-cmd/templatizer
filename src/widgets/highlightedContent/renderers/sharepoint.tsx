import { useState } from 'react'
import type { WidgetRendererProps } from '../../../types'
import styles from './sharepoint.module.css'

type ContentType = 'documents' | 'pages' | 'actualites' | 'videos' | 'images' | 'evenements' | 'contacts' | 'tout'
type Layout = 'grille' | 'liste' | 'carrousel' | 'compact' | 'pellicule'
type FileType = 'pptx' | 'docx' | 'xlsx' | 'pdf'
type ItemType = 'document' | 'page' | 'actualite' | 'video' | 'image' | 'evenement' | 'contact'

interface ContentItem {
  id: number
  title: string
  source: string
  author: string
  date: string
  itemType: ItemType
  fileType?: FileType
  previewText?: string
  image?: string | null
  duration?: string
  day?: string
  month?: string
  dateText?: string
  initials?: string
  role?: string
}

const DOCUMENTS: ContentItem[] = [
  { id: 1, title: 'Politique de télétravail', source: 'Ressources Humaines', author: 'Marie Lambert', date: '3 avr. 2026', itemType: 'document', fileType: 'pdf', previewText: 'Politique de télétravail' },
  { id: 2, title: 'Plan stratégique 2025–2027', source: 'Stratégie & Direction', author: 'Lucas Bernard', date: '28 mars 2026', itemType: 'document', fileType: 'pptx', previewText: 'Plan stratégique' },
  { id: 3, title: "Guide d'intégration des nouveaux collaborateurs", source: 'Ressources Humaines', author: 'Marie Lambert', date: '15 mars 2026', itemType: 'document', fileType: 'docx' },
  { id: 4, title: 'Rapport annuel 2024', source: 'Stratégie & Direction', author: 'Sophie Renard', date: '10 févr. 2026', itemType: 'document', fileType: 'pdf', previewText: 'Rapport annuel 2024' },
  { id: 5, title: "Charte graphique de l'entreprise", source: 'Communication & Marketing', author: 'Jean-Pierre Moreau', date: '4 févr. 2026', itemType: 'document', fileType: 'pdf' },
  { id: 6, title: 'Organigramme 2026', source: 'Ressources Humaines', author: 'Sophie Renard', date: '1 janv. 2026', itemType: 'document', fileType: 'xlsx' },
  { id: 7, title: 'Bilan social 2025', source: 'Ressources Humaines', author: 'Marie Lambert', date: '15 déc. 2025', itemType: 'document', fileType: 'pdf' },
  { id: 8, title: 'Procédure achat & fournisseurs', source: 'Direction Financière', author: 'Lucas Bernard', date: '10 déc. 2025', itemType: 'document', fileType: 'docx' },
]

const PAGES: ContentItem[] = [
  { id: 1, title: 'Accueil', source: 'sites', author: 'Antoine Lefèvre', date: '24 avr. 2026', itemType: 'page', image: '/focus/pro-meeting.jpg' },
  { id: 2, title: 'Guide des avantages collaborateurs', source: 'SitePages', author: 'Marie Lambert', date: '10 avr. 2026', itemType: 'page', image: null },
  { id: 3, title: 'Notre politique RSE', source: 'SitePages', author: 'Sophie Renard', date: '5 avr. 2026', itemType: 'page', image: '/news/pexels-sevenstormphotography-934351.jpg' },
  { id: 4, title: "L'équipe Direction", source: 'SitePages', author: 'Jean-Pierre Moreau', date: '1 avr. 2026', itemType: 'page', image: '/news/pexels-runffwpu-2530124.jpg' },
  { id: 5, title: 'Procédures internes', source: 'SitePages', author: 'Lucas Bernard', date: '20 mars 2026', itemType: 'page', image: '/focus/teambuilding.jpg' },
  { id: 6, title: 'Nos valeurs', source: 'SitePages', author: 'Antoine Lefèvre', date: '15 mars 2026', itemType: 'page', image: '/focus/handshake.jpg' },
  { id: 7, title: 'Bien-être au travail', source: 'SitePages', author: 'Sophie Renard', date: '10 mars 2026', itemType: 'page', image: '/news/pexels-jibarofoto-2774556.jpg' },
  { id: 8, title: 'Espaces de travail', source: 'SitePages', author: 'Jean-Pierre Moreau', date: '5 mars 2026', itemType: 'page', image: '/news/pexels-brunogobofoto-3861712.jpg' },
]

const ACTUALITES: ContentItem[] = [
  { id: 1, title: 'Le nouveau portail intranet est en ligne', source: 'SitePages', author: 'Antoine Lefèvre', date: '22 avr. 2026', itemType: 'actualite', image: '/news/pexels-jibarofoto-2774556.jpg' },
  { id: 2, title: 'Résultats T1 2026 – cap sur la croissance', source: 'SitePages', author: 'Lucas Bernard', date: '14 avr. 2026', itemType: 'actualite', image: '/news/pexels-sevenstormphotography-934351.jpg' },
  { id: 3, title: 'Nouveaux avantages collaborateurs dès mai', source: 'SitePages', author: 'Marie Lambert', date: '8 avr. 2026', itemType: 'actualite', image: '/news/pexels-brunogobofoto-3861712.jpg' },
  { id: 4, title: 'Innovation & transformation digitale', source: 'SitePages', author: 'Sophie Renard', date: '2 avr. 2026', itemType: 'actualite', image: '/news/pexels-runffwpu-2530124.jpg' },
  { id: 5, title: 'Retour sur le séminaire des managers', source: 'SitePages', author: 'Jean-Pierre Moreau', date: '28 mars 2026', itemType: 'actualite', image: '/focus/pro-meeting.jpg' },
  { id: 6, title: 'Lancement du programme RSE 2026', source: 'SitePages', author: 'Sophie Renard', date: '20 mars 2026', itemType: 'actualite', image: '/focus/handshake.jpg' },
  { id: 7, title: 'Ouverture du nouveau campus', source: 'SitePages', author: 'Antoine Lefèvre', date: '15 mars 2026', itemType: 'actualite', image: '/focus/teambuilding.jpg' },
  { id: 8, title: 'Partenariat avec une ONG internationale', source: 'SitePages', author: 'Marie Lambert', date: '10 mars 2026', itemType: 'actualite', image: '/news/pexels-runffwpu-2530124.jpg' },
]

const VIDEOS: ContentItem[] = [
  { id: 1, title: 'Message de la Direction Générale', source: 'Bibliothèque vidéos', author: 'Lucas Bernard', date: '15 avr. 2026', itemType: 'video', image: '/news/pexels-jibarofoto-2774556.jpg', duration: '2:34' },
  { id: 2, title: 'Formation : Prévention des risques', source: 'Bibliothèque vidéos', author: 'Marie Lambert', date: '7 avr. 2026', itemType: 'video', image: '/news/pexels-brunogobofoto-3861712.jpg', duration: '12:05' },
  { id: 3, title: 'Présentation des résultats annuels', source: 'Bibliothèque vidéos', author: 'Sophie Renard', date: '12 mars 2026', itemType: 'video', image: '/focus/pro-meeting.jpg', duration: '18:42' },
  { id: 4, title: "Onboarding : Bienvenue dans l'équipe", source: 'Bibliothèque vidéos', author: 'Jean-Pierre Moreau', date: '28 févr. 2026', itemType: 'video', image: '/focus/teambuilding.jpg', duration: '6:17' },
  { id: 5, title: 'Tutoriel : Prise en main du nouvel intranet', source: 'Bibliothèque vidéos', author: 'Camille Leroy', date: '14 févr. 2026', itemType: 'video', image: '/news/pexels-runffwpu-2530124.jpg', duration: '4:52' },
  { id: 6, title: "Témoignage : 10 ans d'aventure collaborative", source: 'Bibliothèque vidéos', author: 'Marie Lambert', date: '3 févr. 2026', itemType: 'video', image: '/news/pexels-sevenstormphotography-934351.jpg', duration: '8:30' },
  { id: 7, title: 'Interview : La transformation RH en 2026', source: 'Bibliothèque vidéos', author: 'Sophie Renard', date: '20 janv. 2026', itemType: 'video', image: '/focus/pro-meeting.jpg', duration: '11:15' },
  { id: 8, title: 'Webinaire : Sécurité informatique', source: 'Bibliothèque vidéos', author: 'Lucas Bernard', date: '10 janv. 2026', itemType: 'video', image: '/news/pexels-brunogobofoto-3861712.jpg', duration: '45:00' },
]

const IMAGES: ContentItem[] = [
  { id: 1, title: 'Conférence annuelle 2026', source: 'Médiathèque', author: 'Antoine Lefèvre', date: '18 avr. 2026', itemType: 'image', image: '/news/pexels-jibarofoto-2774556.jpg' },
  { id: 2, title: 'Atelier collaboratif', source: 'Médiathèque', author: 'Marie Lambert', date: '12 avr. 2026', itemType: 'image', image: '/focus/pro-meeting.jpg' },
  { id: 3, title: 'Partenariat stratégique', source: 'Médiathèque', author: 'Lucas Bernard', date: '5 avr. 2026', itemType: 'image', image: '/focus/handshake.jpg' },
  { id: 4, title: 'Team building printemps 2026', source: 'Médiathèque', author: 'Sophie Renard', date: '28 mars 2026', itemType: 'image', image: '/focus/teambuilding.jpg' },
  { id: 5, title: 'Journée RSE', source: 'Médiathèque', author: 'Jean-Pierre Moreau', date: '20 mars 2026', itemType: 'image', image: '/news/pexels-sevenstormphotography-934351.jpg' },
  { id: 6, title: 'Rencontre clients 2026', source: 'Médiathèque', author: 'Camille Leroy', date: '15 mars 2026', itemType: 'image', image: '/news/pexels-runffwpu-2530124.jpg' },
  { id: 7, title: 'Inauguration des nouveaux locaux', source: 'Médiathèque', author: 'Antoine Lefèvre', date: '10 mars 2026', itemType: 'image', image: '/focus/handshake.jpg' },
  { id: 8, title: 'Prix innovation interne 2026', source: 'Médiathèque', author: 'Marie Lambert', date: '5 mars 2026', itemType: 'image', image: '/news/pexels-jibarofoto-2774556.jpg' },
]

const EVENEMENTS: ContentItem[] = [
  { id: 1, title: 'Séminaire annuel des managers', source: 'Événements', author: 'Antoine Lefèvre', date: '28 avr. 2026', itemType: 'evenement', image: '/focus/pro-meeting.jpg', day: '28', month: 'AVR.', dateText: 'lun. 28 avr., Journée entière' },
  { id: 2, title: 'Formation : Prévention des risques', source: 'Événements', author: 'Marie Dupont', date: '5 mai 2026', itemType: 'evenement', image: '/news/pexels-brunogobofoto-3861712.jpg', day: '5', month: 'MAI', dateText: 'lun. 5 mai, 09:00' },
  { id: 3, title: 'Journée portes ouvertes', source: 'Événements', author: 'Lucas Martin', date: '15 mai 2026', itemType: 'evenement', image: '/focus/handshake.jpg', day: '15', month: 'MAI', dateText: 'ven. 15 mai, Journée entière' },
  { id: 4, title: 'Conférence RSE & Innovation', source: 'Événements', author: 'Sophie Bernard', date: '22 mai 2026', itemType: 'evenement', image: '/news/pexels-jibarofoto-2774556.jpg', day: '22', month: 'MAI', dateText: 'ven. 22 mai, 14:00' },
  { id: 5, title: 'Team building – Marketing', source: 'Événements', author: 'Camille Leroy', date: '11 juin 2026', itemType: 'evenement', image: '/focus/teambuilding.jpg', day: '11', month: 'JUIN', dateText: 'jeu. 11 juin – ven. 12 juin' },
  { id: 6, title: 'Assemblée générale', source: 'Événements', author: 'Jean-Pierre Moreau', date: '18 juin 2026', itemType: 'evenement', image: '/news/pexels-sevenstormphotography-934351.jpg', day: '18', month: 'JUIN', dateText: 'jeu. 18 juin, 14:00' },
  { id: 7, title: 'Forum des métiers', source: 'Événements', author: 'Marie Lambert', date: '2 juil. 2026', itemType: 'evenement', image: '/focus/pro-meeting.jpg', day: '2', month: 'JUIL.', dateText: 'jeu. 2 juil., 09:00' },
  { id: 8, title: 'Convention commerciale', source: 'Événements', author: 'Antoine Lefèvre', date: '10 sept. 2026', itemType: 'evenement', image: '/news/pexels-runffwpu-2530124.jpg', day: '10', month: 'SEPT.', dateText: 'jeu. 10 sept., Journée entière' },
]

const CONTACTS: ContentItem[] = [
  { id: 1, title: 'Antoine Lefèvre', source: 'Contacts', author: 'Antoine Lefèvre', date: '24 avr. 2026', itemType: 'contact', initials: 'AL', role: 'Chef de projet digital' },
  { id: 2, title: 'Marie Dupont', source: 'Contacts', author: 'Marie Dupont', date: '17 avr. 2026', itemType: 'contact', initials: 'MD', role: 'DRH' },
  { id: 3, title: 'Lucas Martin', source: 'Contacts', author: 'Lucas Martin', date: '15 avr. 2026', itemType: 'contact', initials: 'LM', role: 'Responsable Communication' },
  { id: 4, title: 'Sophie Bernard', source: 'Contacts', author: 'Sophie Bernard', date: '10 avr. 2026', itemType: 'contact', initials: 'SB', role: 'Directrice Stratégie' },
  { id: 5, title: 'Jean-Pierre Moreau', source: 'Contacts', author: 'Jean-Pierre Moreau', date: '8 avr. 2026', itemType: 'contact', initials: 'JM', role: 'Responsable Marketing' },
  { id: 6, title: 'Camille Leroy', source: 'Contacts', author: 'Camille Leroy', date: '1 avr. 2026', itemType: 'contact', initials: 'CL', role: 'Chargée de mission RSE' },
  { id: 7, title: 'Thomas Girard', source: 'Contacts', author: 'Thomas Girard', date: '28 mars 2026', itemType: 'contact', initials: 'TG', role: 'DSI' },
  { id: 8, title: 'Isabelle Fontaine', source: 'Contacts', author: 'Isabelle Fontaine', date: '20 mars 2026', itemType: 'contact', initials: 'IF', role: 'Directrice Commerciale' },
]

function getItems(type: ContentType): ContentItem[] {
  switch (type) {
    case 'documents': return DOCUMENTS
    case 'pages': return PAGES
    case 'actualites': return ACTUALITES
    case 'videos': return VIDEOS
    case 'images': return IMAGES
    case 'evenements': return EVENEMENTS
    case 'contacts': return CONTACTS
    case 'tout': return [DOCUMENTS[0], PAGES[2], ACTUALITES[0], VIDEOS[0], IMAGES[0], EVENEMENTS[1]]
    default: return DOCUMENTS
  }
}

function defaultTitle(type: ContentType): string {
  switch (type) {
    case 'documents': return 'Documents les plus récent(e)s'
    case 'pages': return 'Pages les plus récent(e)s'
    case 'actualites': return 'Actualités les plus récent(e)s'
    case 'videos': return 'Vidéos les plus récent(e)s'
    case 'images': return 'Images les plus récent(e)s'
    case 'evenements': return 'Événements les plus récent(e)s'
    case 'contacts': return 'Contacts'
    default: return 'Contenu mis en évidence'
  }
}

function getEffectiveItemType(item: ContentItem, contentType: ContentType): ItemType {
  if (contentType === 'tout') return item.itemType
  const map: Record<ContentType, ItemType> = {
    documents: 'document', pages: 'page', actualites: 'actualite',
    videos: 'video', images: 'image', evenements: 'evenement',
    contacts: 'contact', tout: 'page',
  }
  return map[contentType]
}

// ─── SVG Icons ─────────────────────────────────────────────────────────────

function FileTypeIcon({ type }: { type: FileType }) {
  const cfg: Record<FileType, { color: string; label: string }> = {
    pptx: { color: '#C43E1C', label: 'P' },
    docx: { color: '#185ABD', label: 'W' },
    xlsx: { color: '#107C41', label: 'X' },
    pdf:  { color: '#D13438', label: 'PDF' },
  }
  const { color, label } = cfg[type]
  return (
    <svg width="16" height="20" viewBox="0 0 16 20">
      <rect width="16" height="20" rx="2" fill={color} />
      <path d="M10 0 L10 5 L16 5" fill="rgba(255,255,255,0.25)" />
      <text x="8" y="14" textAnchor="middle" fill="white" fontSize={label.length === 1 ? '9' : '5.5'} fontWeight="bold" fontFamily="'Segoe UI', Arial, sans-serif">{label}</text>
    </svg>
  )
}

function SpPageIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20">
      <rect width="20" height="20" rx="3" fill="#0078D4" />
      <rect x="5" y="3" width="9" height="11" rx="1" fill="none" stroke="white" strokeWidth="1.5" />
      <line x1="7" y1="7" x2="12" y2="7" stroke="white" strokeWidth="1" />
      <line x1="7" y1="9.5" x2="12" y2="9.5" stroke="white" strokeWidth="1" />
      <line x1="7" y1="12" x2="10" y2="12" stroke="white" strokeWidth="1" />
    </svg>
  )
}

function PlayIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="20" fill="rgba(0,0,0,0.55)" />
      <path d="M16 12l14 8-14 8V12z" fill="white" />
    </svg>
  )
}

function VideoListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <rect width="16" height="16" rx="2" fill="#5C5F62" />
      <path d="M6 4.5l6 3.5-6 3.5V4.5z" fill="white" />
    </svg>
  )
}

function CalendarListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="2" width="14" height="13" rx="1.5" stroke="#0078D4" strokeWidth="1.5" />
      <path d="M1 6h14" stroke="#0078D4" strokeWidth="1.5" />
      <rect x="4" y="0" width="1.5" height="4" rx="0.75" fill="#0078D4" />
      <rect x="10.5" y="0" width="1.5" height="4" rx="0.75" fill="#0078D4" />
    </svg>
  )
}

function PersonListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <rect width="16" height="16" rx="2" fill="#0078D4" />
      <circle cx="8" cy="5.5" r="2.5" fill="white" />
      <path d="M2 13.5c0-2.8 2.7-4.5 6-4.5s6 1.7 6 4.5" stroke="white" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

function ImageListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <rect width="16" height="16" rx="2" fill="#107C41" />
      <rect x="2" y="2" width="12" height="12" rx="1" fill="none" stroke="white" strokeWidth="1" />
      <circle cx="5.5" cy="5.5" r="1.5" fill="white" />
      <path d="M2 11l3-3 2 2 3-3 4 4H2z" fill="white" />
    </svg>
  )
}

function AuthorAvatar({ name }: { name: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return <div className={styles.authorAvatar}>{initials}</div>
}

// ─── Card Preview (used in Grille & Pellicule) ─────────────────────────────

function CardPreview({ item, effectiveType }: { item: ContentItem; effectiveType: ItemType }) {
  if (effectiveType === 'document') {
    return (
      <div className={styles.cardPreviewDoc}>
        {item.previewText ? (
          <div className={styles.docPreviewContent}>
            <div className={styles.docPreviewTitle}>{item.previewText}</div>
            <div className={styles.docPreviewSub}>{item.previewText}</div>
          </div>
        ) : item.fileType === 'xlsx' ? (
          <div className={styles.docPreviewGrid} />
        ) : (
          <div className={styles.docPreviewBlank} />
        )}
        {item.fileType && (
          <div className={styles.cardIconBadge}><FileTypeIcon type={item.fileType} /></div>
        )}
      </div>
    )
  }

  if (effectiveType === 'video') {
    return (
      <div className={styles.cardPreviewImg}>
        {item.image && <img src={item.image} alt="" className={styles.coverImg} />}
        <div className={styles.playOverlay}><PlayIcon size={32} /></div>
        {item.duration && <div className={styles.durationBadge}>{item.duration}</div>}
      </div>
    )
  }

  if (effectiveType === 'contact') {
    return (
      <div className={styles.cardPreviewContact}>
        <div className={styles.contactAvatarLarge}>{item.initials}</div>
      </div>
    )
  }

  // page, actualite, image, evenement
  return (
    <div className={styles.cardPreviewImg}>
      {item.image ? (
        <img src={item.image} alt="" className={styles.coverImg} />
      ) : (
        <div className={styles.cardPreviewPlaceholder}><SpPageIcon size={40} /></div>
      )}
      {effectiveType === 'evenement' && item.day && item.month && (
        <div className={styles.eventDateBadge}>
          <span className={styles.eventMonth}>{item.month}</span>
          <span className={styles.eventDay}>{item.day}</span>
        </div>
      )}
      {effectiveType !== 'image' && effectiveType !== 'evenement' && (
        <div className={styles.cardIconBadge}><SpPageIcon size={20} /></div>
      )}
    </div>
  )
}

// ─── Card Body ──────────────────────────────────────────────────────────────

function CardBody({ item, effectiveType }: { item: ContentItem; effectiveType: ItemType }) {
  return (
    <div className={styles.cardBody}>
      <div className={styles.cardSource}>{item.source}</div>
      <div className={styles.cardTitle}>{item.title}</div>
      {effectiveType === 'contact' ? (
        <div className={styles.metaText}>{item.role}</div>
      ) : effectiveType === 'evenement' ? (
        <div className={styles.metaText}>{item.dateText}</div>
      ) : (
        <div className={styles.cardMeta}>
          <AuthorAvatar name={item.author} />
          <div>
            <div className={styles.authorName}>{item.author}</div>
            <div className={styles.metaText}>Modifié le {item.date}</div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Grid Card ──────────────────────────────────────────────────────────────

function GridCard({ item, contentType }: { item: ContentItem; contentType: ContentType }) {
  const effectiveType = getEffectiveItemType(item, contentType)
  return (
    <div className={styles.gridCard}>
      <CardPreview item={item} effectiveType={effectiveType} />
      <CardBody item={item} effectiveType={effectiveType} />
    </div>
  )
}

// ─── Grille Layout ──────────────────────────────────────────────────────────

function GrilleLayout({ items, contentType, cols }: { items: ContentItem[]; contentType: ContentType; cols: number }) {
  return (
    <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {items.map(item => <GridCard key={`${item.itemType}-${item.id}`} item={item} contentType={contentType} />)}
    </div>
  )
}

// ─── Liste Layout ───────────────────────────────────────────────────────────

function ListIcon({ item, contentType }: { item: ContentItem; contentType: ContentType }) {
  const effectiveType = getEffectiveItemType(item, contentType)
  if (effectiveType === 'document' && item.fileType) return <FileTypeIcon type={item.fileType} />
  if (effectiveType === 'video') return <VideoListIcon />
  if (effectiveType === 'evenement') return <CalendarListIcon />
  if (effectiveType === 'contact') return <PersonListIcon />
  if (effectiveType === 'image') return <ImageListIcon />
  return <SpPageIcon size={16} />
}

function ListeLayout({ items, contentType }: { items: ContentItem[]; contentType: ContentType }) {
  return (
    <div className={styles.listTable}>
      <div className={styles.listHeaderRow}>
        <div className={styles.listHeaderTitle}>Titre</div>
        <div className={styles.listHeaderDate}>Date de modification</div>
        <div className={styles.listHeaderAuthor}>Modifié par</div>
      </div>
      {items.map(item => (
        <div key={`${item.itemType}-${item.id}`} className={styles.listRow}>
          <div className={styles.listTitleCell}>
            <div className={styles.listIconBox}><ListIcon item={item} contentType={contentType} /></div>
            <span className={styles.listTitle}>{item.title}</span>
          </div>
          <div className={styles.listDate}>{item.date}</div>
          <div className={styles.listAuthor}>{item.author}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Carousel Layout ────────────────────────────────────────────────────────

function DocCarouselSlide({ item, areaHeight }: { item: ContentItem; areaHeight: number }) {
  return (
    <>
      <div className={styles.carouselDocArea} style={{ height: areaHeight }}>
        {item.previewText ? (
          <div className={styles.carouselDocContent}>
            <div className={styles.carouselDocTitle}>{item.previewText}</div>
            <div className={styles.carouselDocSub}>{item.previewText}</div>
          </div>
        ) : item.fileType === 'xlsx' ? (
          <div className={styles.docPreviewGrid} />
        ) : (
          <div className={styles.docPreviewBlank} />
        )}
      </div>
      <div className={styles.carouselBottom}>
        <div className={styles.carouselBottomIcon}>
          {item.fileType && <FileTypeIcon type={item.fileType} />}
        </div>
        <div className={styles.carouselBottomInfo}>
          <div className={styles.carouselBottomTitle}>{item.title}</div>
          <div className={styles.carouselBottomSource}>{item.source}</div>
        </div>
      </div>
    </>
  )
}

function ImageCarouselSlide({ item, effectiveType, areaHeight }: { item: ContentItem; effectiveType: ItemType; areaHeight: number }) {
  return (
    <>
      <div className={styles.carouselImageArea} style={{ height: areaHeight }}>
        {item.image ? (
          <img src={item.image} alt="" className={styles.coverImg} />
        ) : (
          <div className={styles.cardPreviewPlaceholder}><SpPageIcon size={60} /></div>
        )}
        {effectiveType === 'evenement' && item.day && item.month && (
          <div className={styles.carouselEventDate}>
            <span className={styles.eventMonth}>{item.month}</span>
            <span className={styles.carouselEventDay}>{item.day}</span>
          </div>
        )}
      </div>
      <div className={styles.carouselBottom}>
        <div className={styles.carouselBottomIcon}>
          {effectiveType === 'evenement' ? <CalendarListIcon /> : <SpPageIcon size={20} />}
        </div>
        <div className={styles.carouselBottomInfo}>
          <div className={styles.carouselBottomTitle}>{item.title}</div>
          <div className={styles.carouselBottomSource}>
            {effectiveType === 'evenement' ? item.dateText : item.source}
          </div>
        </div>
      </div>
    </>
  )
}

function VideoCarouselSlide({ item, areaHeight }: { item: ContentItem; areaHeight: number }) {
  return (
    <div className={styles.carouselVideoArea} style={{ height: areaHeight }}>
      {item.image && <img src={item.image} alt="" className={styles.coverImg} />}
      <div className={styles.carouselVideoTitle}>{item.title}</div>
      <div className={styles.playOverlay}><PlayIcon size={56} /></div>
      {item.duration && <div className={styles.durationBadge}>{item.duration}</div>}
    </div>
  )
}

function ContactCarouselSlide({ item, areaHeight }: { item: ContentItem; areaHeight: number }) {
  return (
    <>
      <div className={styles.carouselContactArea} style={{ height: areaHeight }}>
        <div className={styles.contactAvatarXL}>{item.initials}</div>
      </div>
      <div className={styles.carouselBottom}>
        <div className={styles.carouselBottomInfo}>
          <div className={styles.carouselBottomTitle}>{item.title}</div>
          <div className={styles.carouselBottomSource}>{item.role}</div>
        </div>
      </div>
    </>
  )
}

function CarrouselLayout({ items, contentType, size }: { items: ContentItem[]; contentType: ContentType; size: string }) {
  const [idx, setIdx] = useState(0)
  const total = items.length
  const safeIdx = total > 0 ? Math.min(idx, total - 1) : 0
  const item = items[safeIdx]
  if (!item) return null
  const areaHeight = size === 'half' || size === 'one-third' ? 240 : 380
  const effectiveType = getEffectiveItemType(item, contentType)

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carouselSlide}>
        {effectiveType === 'document' && <DocCarouselSlide item={item} areaHeight={areaHeight} />}
        {effectiveType === 'video' && <VideoCarouselSlide item={item} areaHeight={areaHeight} />}
        {effectiveType === 'contact' && <ContactCarouselSlide item={item} areaHeight={areaHeight} />}
        {(effectiveType === 'page' || effectiveType === 'actualite' || effectiveType === 'image' || effectiveType === 'evenement') && (
          <ImageCarouselSlide item={item} effectiveType={effectiveType} areaHeight={areaHeight} />
        )}
        <button
          className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
          onClick={() => setIdx(i => i - 1)}
          disabled={idx === 0}
          aria-label="Précédent"
        >‹</button>
        <button
          className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
          onClick={() => setIdx(i => i + 1)}
          disabled={idx >= total - 1}
          aria-label="Suivant"
        >›</button>
      </div>
      <div className={styles.carouselCounterRow}>
        <span className={styles.carouselCounter}>{idx + 1} sur {total}</span>
      </div>
    </div>
  )
}

// ─── Compact Layout ─────────────────────────────────────────────────────────

function CompactThumb({ item, effectiveType }: { item: ContentItem; effectiveType: ItemType }) {
  if (effectiveType === 'document') {
    return (
      <div className={styles.compactThumbDoc}>
        {item.previewText ? (
          <div className={styles.compactDocText}>{item.previewText}</div>
        ) : item.fileType === 'xlsx' ? (
          <div className={styles.docPreviewGrid} />
        ) : (
          <div className={styles.docPreviewBlank} />
        )}
        {item.fileType && (
          <div className={styles.cardIconBadge}><FileTypeIcon type={item.fileType} /></div>
        )}
      </div>
    )
  }

  if (effectiveType === 'contact') {
    return (
      <div className={styles.compactThumbContact}>
        <div className={styles.compactContactAvatar}>{item.initials}</div>
      </div>
    )
  }

  if (effectiveType === 'video') {
    return (
      <div className={styles.compactThumb}>
        {item.image && <img src={item.image} alt="" className={styles.coverImg} />}
        <div className={styles.playOverlaySmall}><PlayIcon size={22} /></div>
        {item.duration && <div className={styles.durationBadgeSmall}>{item.duration}</div>}
      </div>
    )
  }

  return (
    <div className={styles.compactThumb}>
      {item.image ? (
        <img src={item.image} alt="" className={styles.coverImg} />
      ) : (
        <div className={styles.cardPreviewPlaceholder}><SpPageIcon size={24} /></div>
      )}
      {effectiveType === 'evenement' && item.day && item.month ? (
        <div className={styles.eventDateBadgeSmall}>
          <span className={styles.eventMonth}>{item.month}</span>
          <span className={styles.eventDay}>{item.day}</span>
        </div>
      ) : effectiveType !== 'image' ? (
        <div className={styles.cardIconBadgeSmall}><SpPageIcon size={14} /></div>
      ) : null}
    </div>
  )
}

function CompactItem({ item, contentType }: { item: ContentItem; contentType: ContentType }) {
  const effectiveType = getEffectiveItemType(item, contentType)
  return (
    <div className={styles.compactItem}>
      <CompactThumb item={item} effectiveType={effectiveType} />
      <div className={styles.compactBody}>
        <div className={styles.compactSource}>{item.source}</div>
        <div className={styles.compactTitle}>{item.title}</div>
        {effectiveType === 'contact' ? (
          <div className={styles.compactMetaText}>{item.role}</div>
        ) : effectiveType === 'evenement' ? (
          <div className={styles.compactMetaText}>{item.dateText}</div>
        ) : (
          <div className={styles.compactMeta}>
            <AuthorAvatar name={item.author} />
            <span className={styles.compactMetaText}>{item.author}&nbsp;&nbsp;Modifié le {item.date}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function CompactLayout({ items, contentType }: { items: ContentItem[]; contentType: ContentType }) {
  return (
    <div className={styles.compactList}>
      {items.map(item => <CompactItem key={`${item.itemType}-${item.id}`} item={item} contentType={contentType} />)}
    </div>
  )
}

// ─── Pellicule Layout ───────────────────────────────────────────────────────

function PelliculeLayout({ items, contentType, cols }: { items: ContentItem[]; contentType: ContentType; cols: number }) {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(items.length / cols)
  const visible = items.slice(page * cols, page * cols + cols)

  return (
    <div className={styles.pellicule}>
      <div className={styles.pelliculeCardsWrapper}>
        <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {visible.map(item => <GridCard key={`${item.itemType}-${item.id}`} item={item} contentType={contentType} />)}
        </div>
        <button
          className={`${styles.pelliculeArrow} ${styles.pelliculeArrowLeft}`}
          onClick={() => setPage(p => p - 1)}
          disabled={page === 0}
          aria-label="Précédent"
        >‹</button>
        <button
          className={`${styles.pelliculeArrow} ${styles.pelliculeArrowRight}`}
          onClick={() => setPage(p => p + 1)}
          disabled={page >= totalPages - 1}
          aria-label="Suivant"
        >›</button>
      </div>
      <div className={styles.dots}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={[styles.dot, i === page ? styles.dotActive : ''].filter(Boolean).join(' ')}
            onClick={() => setPage(i)}
            aria-label={`Page ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

const COLS: Record<string, number> = { full: 4, 'two-thirds': 3, half: 2, 'one-third': 1 }

export function SharepointHighlightedContent({ config, size }: WidgetRendererProps) {
  const contentType = (config.contentType as ContentType) || 'documents'
  const rawLayout = (config.layout as Layout) || 'grille'
  const showTitle = (config.showTitle as boolean) ?? true
  const title = (config.title as string) || defaultTitle(contentType)

  const cols = COLS[size] ?? 4

  const layout: Layout =
    size === 'one-third' && (rawLayout === 'grille' || rawLayout === 'pellicule')
      ? 'compact'
      : rawLayout

  const countMode = (config.countMode as string) ?? 'auto'
  const autoCount = (layout === 'grille' || layout === 'pellicule') ? cols : 4
  const itemCount = countMode === 'manual'
    ? Math.min(Math.max(1, (config.itemCount as number) ?? 4), 8)
    : (config.itemCount as number) ?? autoCount

  const items = getItems(contentType).slice(0, itemCount)

  return (
    <div className={styles.widget}>
      {showTitle && (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <a className={styles.viewAll} href="#">Afficher tout</a>
        </div>
      )}
      {layout === 'grille'    && <GrilleLayout    items={items} contentType={contentType} cols={cols} />}
      {layout === 'liste'     && <ListeLayout     items={items} contentType={contentType} />}
      {layout === 'carrousel' && <CarrouselLayout items={items} contentType={contentType} size={size} />}
      {layout === 'compact'   && <CompactLayout   items={items} contentType={contentType} />}
      {layout === 'pellicule' && <PelliculeLayout items={items} contentType={contentType} cols={cols} />}
    </div>
  )
}
