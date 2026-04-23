import { useState, useEffect, useRef } from 'react'
import type { WidgetRendererProps } from '../../../types'
import styles from './sharepoint.module.css'

type FileType = 'folder' | 'pdf' | 'docx' | 'xlsx' | 'pptx'

interface DocItem {
  name: string
  type: FileType
  modified: string
  modifiedBy: string
  children?: DocItem[]
}

const LIBRARY: DocItem[] = [
  {
    name: 'Ressources Humaines',
    type: 'folder',
    modified: 'Il y a 2 jours',
    modifiedBy: 'Lucas Bernard',
    children: [
      { name: 'Politique de télétravail.pdf', type: 'pdf', modified: 'Il y a 3 jours', modifiedBy: 'Marie Lambert' },
      { name: "Guide d'intégration des nouveaux collaborateurs.docx", type: 'docx', modified: 'Il y a 1 semaine', modifiedBy: 'Marie Lambert' },
      { name: 'Grille de rémunération 2025.xlsx', type: 'xlsx', modified: 'Il y a 2 semaines', modifiedBy: 'Sophie Renard' },
      { name: 'Charte du temps de travail.pdf', type: 'pdf', modified: 'Il y a 1 mois', modifiedBy: 'Lucas Bernard' },
    ],
  },
  {
    name: 'Communication & Marketing',
    type: 'folder',
    modified: 'Il y a 4 jours',
    modifiedBy: 'Jean-Pierre Moreau',
    children: [
      { name: "Charte graphique de l'entreprise.pdf", type: 'pdf', modified: 'Il y a 4 jours', modifiedBy: 'Jean-Pierre Moreau' },
      { name: 'Modèles de présentation.pptx', type: 'pptx', modified: 'Il y a 1 semaine', modifiedBy: 'Jean-Pierre Moreau' },
      { name: 'Plan de communication 2025.docx', type: 'docx', modified: 'Il y a 3 semaines', modifiedBy: 'Sophie Renard' },
      { name: 'Rapport de campagne T1 2026.xlsx', type: 'xlsx', modified: 'Il y a 2 jours', modifiedBy: 'Jean-Pierre Moreau' },
    ],
  },
  {
    name: 'Stratégie & Direction',
    type: 'folder',
    modified: 'Il y a 1 semaine',
    modifiedBy: 'Sophie Renard',
    children: [
      { name: 'Rapport annuel 2024.pdf', type: 'pdf', modified: 'Il y a 1 semaine', modifiedBy: 'Sophie Renard' },
      { name: 'Plan stratégique 2025-2027.pptx', type: 'pptx', modified: 'Il y a 2 semaines', modifiedBy: 'Lucas Bernard' },
      { name: 'Organigramme.xlsx', type: 'xlsx', modified: 'Il y a 1 mois', modifiedBy: 'Marie Lambert' },
      { name: 'Compte-rendu CODIR – Avril 2026.docx', type: 'docx', modified: 'Il y a 2 jours', modifiedBy: 'Lucas Bernard' },
    ],
  },
  { name: "Guide d'utilisation de l'intranet.pdf", type: 'pdf', modified: 'Il y a 5 jours', modifiedBy: 'Lucas Bernard' },
  { name: 'Annuaire des référents métiers.xlsx', type: 'xlsx', modified: 'Il y a 3 jours', modifiedBy: 'Sophie Renard' },
]

function FolderIcon() {
  return (
    <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
      <rect x="0" y="5" width="20" height="13" rx="2" fill="#FFB900" />
      <path d="M0 5V3.5C0 2.67 0.67 2 1.5 2H7.5L9.5 4.5H0Z" fill="#E0A000" />
    </svg>
  )
}

function DocFileIcon({ type }: { type: Exclude<FileType, 'folder'> }) {
  const configs: Record<string, { color: string; label: string }> = {
    pdf:  { color: '#D13438', label: 'PDF' },
    docx: { color: '#185ABD', label: 'W' },
    xlsx: { color: '#107C41', label: 'X' },
    pptx: { color: '#C43E1C', label: 'P' },
  }
  const { color, label } = configs[type] ?? { color: '#666', label: '?' }
  const isSmall = label.length === 1

  return (
    <svg width="16" height="20" viewBox="0 0 16 20">
      <rect x="0" y="0" width="16" height="20" rx="2" fill={color} />
      <path d="M10 0 L10 5 L16 5" fill="rgba(255,255,255,0.25)" />
      <text
        x="8"
        y="14"
        textAnchor="middle"
        fill="white"
        fontSize={isSmall ? '9' : '5.5'}
        fontWeight="bold"
        fontFamily="'Segoe UI', Arial, sans-serif"
      >
        {label}
      </text>
    </svg>
  )
}

function FileIcon({ type }: { type: FileType }) {
  if (type === 'folder') return <FolderIcon />
  return <DocFileIcon type={type} />
}

function Toolbar({ size }: { size: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const toggle = () => setMenuOpen(o => !o)

  if (size === 'one-third') {
    return (
      <div className={styles.toolbar}>
        <div className={styles.moreWrapper} ref={wrapperRef}>
          <button className={styles.btnMore} onClick={toggle}>···</button>
          {menuOpen && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem}>+ Nouveau</button>
              <button className={styles.dropdownItem}>↑ Charger</button>
              <button className={styles.dropdownItem}>⊞ Modifier en mode grille</button>
              <button className={styles.dropdownItem}>Exporter vers Excel</button>
              <button className={styles.dropdownItem}>↻ Synchroniser</button>
            </div>
          )}
        </div>
        <div className={styles.toolbarSpacer} />
        <button className={styles.btnSecondary}>≡ Tous les documents ▾</button>
        <button className={styles.btnInfo}>ⓘ</button>
      </div>
    )
  }

  if (size === 'half') {
    return (
      <div className={styles.toolbar}>
        <button className={styles.btnPrimary}>+ Nouveau ▾</button>
        <button className={styles.btnSecondary}>↑ Charger ▾</button>
        <div className={styles.moreWrapper} ref={wrapperRef}>
          <button className={styles.btnMore} onClick={toggle}>···</button>
          {menuOpen && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem}>⊞ Modifier en mode grille</button>
              <button className={styles.dropdownItem}>Exporter vers Excel</button>
              <button className={styles.dropdownItem}>↻ Synchroniser</button>
            </div>
          )}
        </div>
        <div className={styles.toolbarSpacer} />
        <button className={styles.btnSecondary}>≡ Tous les documents ▾</button>
        <button className={styles.btnInfo}>ⓘ</button>
      </div>
    )
  }

  if (size === 'two-thirds') {
    return (
      <div className={styles.toolbar}>
        <button className={styles.btnPrimary}>+ Nouveau ▾</button>
        <button className={styles.btnSecondary}>↑ Charger ▾</button>
        <button className={styles.btnSecondary}>⊞ Modifier en mode grille</button>
        <div className={styles.moreWrapper} ref={wrapperRef}>
          <button className={styles.btnMore} onClick={toggle}>···</button>
          {menuOpen && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem}>Exporter vers Excel</button>
              <button className={styles.dropdownItem}>↻ Synchroniser</button>
            </div>
          )}
        </div>
        <div className={styles.toolbarSpacer} />
        <button className={styles.btnSecondary}>≡ Tous les documents ▾</button>
        <button className={styles.btnInfo}>ⓘ</button>
      </div>
    )
  }

  return (
    <div className={styles.toolbar}>
      <button className={styles.btnPrimary}>+ Nouveau ▾</button>
      <button className={styles.btnSecondary}>↑ Charger ▾</button>
      <button className={styles.btnSecondary}>⊞ Modifier en mode grille</button>
      <button className={styles.btnSecondary}>Exporter vers Excel</button>
      <button className={styles.btnSecondary}>↻ Synchroniser</button>
      <div className={styles.toolbarSpacer} />
      <button className={styles.btnSecondary}>≡ Tous les documents ▾</button>
      <button className={styles.btnInfo}>ⓘ</button>
    </div>
  )
}

export function SharepointDocumentLibrary({ config, size }: WidgetRendererProps) {
  const [currentFolder, setCurrentFolder] = useState<DocItem | null>(null)

  const title = (config.title as string) || 'Documents'
  const showTitle = (config.showTitle as boolean) ?? true
  const tableSize = (config.tableSize as string) || 'auto'

  const items = currentFolder ? (currentFolder.children ?? []) : LIBRARY
  const isNarrow = size === 'half' || size === 'one-third'

  const containerClass = [
    styles.tableContainer,
    isNarrow ? styles.narrowScroll : '',
    tableSize === 'small' ? styles.sizeSmall : '',
    tableSize === 'medium' ? styles.sizeMedium : '',
    tableSize === 'large' ? styles.sizeLarge : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          {currentFolder ? (
            <>
              <span
                className={styles.breadcrumbRoot}
                onClick={() => setCurrentFolder(null)}
                role="button"
                tabIndex={0}
              >
                {title}
              </span>
              <span className={styles.breadcrumbSep}>›</span>
              <span className={styles.breadcrumbCurrent}>{currentFolder.name}</span>
            </>
          ) : (
            showTitle && <span className={styles.breadcrumbCurrent}>{title}</span>
          )}
        </div>
        <a className={styles.viewAll} href="#">Afficher tout</a>
      </div>

      <Toolbar size={size} />

      <div className={containerClass}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.colIcon} />
              <th>Nom ↑</th>
              <th className={styles.colModified}>Modifié ⓘ</th>
              <th className={styles.colAuthor}>Modifié par ↑</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr
                key={i}
                className={styles.row}
                onClick={item.type === 'folder' ? () => setCurrentFolder(item) : undefined}
                style={item.type === 'folder' ? { cursor: 'pointer' } : undefined}
              >
                <td className={styles.cellIcon}>
                  <FileIcon type={item.type} />
                </td>
                <td className={styles.cellName}>{item.name}</td>
                <td className={styles.cellModified}>{item.modified}</td>
                <td className={styles.cellAuthor}>
                  <span className={styles.authorBadge}>{item.modifiedBy}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
