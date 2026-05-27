import type { WidgetRendererProps } from '../../../types'
import styles from './lumapps.module.css'

interface FileItem {
  name: string
  type: 'pdf' | 'doc' | 'sheet' | 'slide' | 'image'
  owner: string
  date: string
}

const FILES: FileItem[] = [
  { name: 'Rapport annuel 2025.pdf',           type: 'pdf',   owner: 'Camille Vasseur',      date: 'Aujourd\'hui' },
  { name: 'Stratégie produit Q3.pptx',         type: 'slide', owner: 'Lucas Berthier',       date: 'Hier' },
  { name: 'Charte graphique 2026.pdf',         type: 'pdf',   owner: 'Inès Moreau',          date: 'Hier' },
  { name: 'Budget projet Alpha.xlsx',          type: 'sheet', owner: 'Hugo Lefranc',         date: 'Il y a 2 j' },
  { name: 'Notes de version - Mai.docx',       type: 'doc',   owner: 'Émilie Saint-Pierre',  date: 'Il y a 3 j' },
  { name: 'Visuel campagne Été.png',           type: 'image', owner: 'Romain Caron',         date: 'Il y a 4 j' },
  { name: 'Tableau de bord financier.xlsx',    type: 'sheet', owner: 'Anaïs Delahaye',       date: 'Il y a 5 j' },
]

const TYPE_META: Record<FileItem['type'], { label: string; color: string; bg: string }> = {
  pdf:   { label: 'PDF',  color: '#ffffff', bg: '#dc2626' },
  doc:   { label: 'DOC',  color: '#ffffff', bg: '#2563eb' },
  sheet: { label: 'XLS',  color: '#ffffff', bg: '#16a34a' },
  slide: { label: 'PPT',  color: '#ffffff', bg: '#ea580c' },
  image: { label: 'IMG',  color: '#ffffff', bg: '#9334e6' },
}

function FileIcon({ type }: { type: FileItem['type'] }) {
  const meta = TYPE_META[type]
  return (
    <span className={styles.fileIcon} style={{ background: meta.bg, color: meta.color }}>
      {meta.label}
    </span>
  )
}

export function LumappsFilesList({ config }: WidgetRendererProps) {
  const title = (config.title as string) || 'Documents récents'
  const maxItems = Math.max(2, Math.min(10, (config.maxItems as number) || 5))
  const showOwner = config.showOwner !== false
  const items = FILES.slice(0, maxItems)

  return (
    <div className={styles.root}>
      <h3 className={styles.title}>{title}</h3>
      <ul className={styles.list}>
        {items.map((file, i) => (
          <li key={i} className={styles.item}>
            <FileIcon type={file.type} />
            <div className={styles.body}>
              <div className={styles.name}>{file.name}</div>
              <div className={styles.meta}>
                {showOwner && (
                  <>
                    <span>{file.owner}</span>
                    <span className={styles.dot}>·</span>
                  </>
                )}
                <span>{file.date}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
