import { type ReactNode } from 'react'
import type { Branding, NavEntry } from '../../types'
import { useAuthSession } from '../../auth/useAuthSession'
import styles from './lumapps.module.css'

interface LumappsChromeProps {
  branding: Branding
  navEntries: NavEntry[]
  children: ReactNode
  onNavClick?: (entryId: string) => void
  activeEntryId?: string
}

const DEFAULT_NAV: NavEntry[] = [
  { id: '_d1', label: 'Le Groupe', url: '#', children: [
    { id: '_d1a', label: 'Notre histoire', url: '#' },
    { id: '_d1b', label: 'Nos engagements', url: '#' },
  ] },
  { id: '_d2', label: 'Nos sites', url: '#', children: [
    { id: '_d2a', label: 'Paris', url: '#' },
    { id: '_d2b', label: 'Lyon', url: '#' },
    { id: '_d2c', label: 'Marseille', url: '#' },
  ] },
  { id: '_d3', label: 'All news', url: '#' },
  { id: '_d4', label: 'Mon espace RH', url: '#' },
  { id: '_d5', label: 'Mes communautés', url: '#' },
  { id: '_d6', label: 'Micro App Gr33t', url: '#' },
]

function initials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((s) => s[0]?.toUpperCase() ?? '').join('') || '?'
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function BookmarkFilledIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function AppsGridIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="5" r="1.6" /><circle cx="12" cy="5" r="1.6" /><circle cx="19" cy="5" r="1.6" />
      <circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" />
      <circle cx="5" cy="19" r="1.6" /><circle cx="12" cy="19" r="1.6" /><circle cx="19" cy="19" r="1.6" />
    </svg>
  )
}

function LayersIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M12 3 2 12h3v8h5v-6h4v6h5v-8h3z" />
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function LumappsChrome({ branding, navEntries, children, onNavClick, activeEntryId }: LumappsChromeProps) {
  const nav = navEntries.length > 0 ? navEntries : DEFAULT_NAV
  const tenantInitials = initials(branding.name)

  // The home page is the first nav entry (its mockup is always enabled).
  const homeId = nav[0]?.id
  const homeClickable = Boolean(homeId && onNavClick && nav[0]?.hasMockup)
  const homeActive = activeEntryId ? activeEntryId === homeId : true

  // Pull the current Google avatar of the admin building the page.
  const { session } = useAuthSession()
  const metadata = session?.user.user_metadata ?? {}
  const userAvatarUrl = (metadata.avatar_url as string | undefined) || undefined
  const userFullName =
    (metadata.full_name as string | undefined)?.trim() ||
    session?.user.email ||
    ''
  const userInitials =
    userFullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('') || '?'

  return (
    <div className={styles.chrome}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div className={styles.logoWrap}>
            {branding.logo ? (
              <img src={branding.logo} alt="" className={styles.logoImg} />
            ) : (
              <div className={styles.logoInitials}>{tenantInitials}</div>
            )}
          </div>

          <div className={styles.searchBox}>
            <input className={styles.searchInput} placeholder="Search" readOnly />
            <span className={styles.searchIconBtn}>
              <SearchIcon />
            </span>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.iconBtn}><BookmarkIcon /></button>
            <button type="button" className={styles.iconBtn}><BookmarkFilledIcon /></button>
            <button type="button" className={styles.iconBtn}><AppsGridIcon /></button>
            <button type="button" className={styles.iconBtn}><LayersIcon /></button>
            <button type="button" className={styles.iconBtn}><PlayIcon /></button>
            <button type="button" className={styles.iconBtn}><BellIcon /></button>
            <div className={styles.avatar} aria-label="Mon profil">
              {userAvatarUrl ? (
                <img
                  src={userAvatarUrl}
                  alt=""
                  className={styles.avatarImg}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className={styles.avatarFallback}>{userInitials}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div className={styles.navBar}>
        <div className={styles.navBarInner}>
          <button
            type="button"
            className={`${styles.navHome} ${homeActive ? styles.navHomeActive : ''}`}
            aria-label="Accueil"
            style={homeClickable ? { cursor: 'pointer' } : undefined}
            onClick={homeClickable ? () => onNavClick!(homeId!) : undefined}
          >
            <HomeIcon />
          </button>
          <nav className={styles.nav}>
            {nav.map((entry) => {
              const hasChildren = Boolean(entry.children && entry.children.length > 0)
              const isActive = entry.id === activeEntryId
              const isClickable = Boolean(entry.hasMockup && onNavClick)
              return (
                <div
                  key={entry.id}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ''} ${hasChildren ? styles.navItemHasChildren : ''}`}
                  style={isClickable ? { cursor: 'pointer' } : undefined}
                  onClick={isClickable ? () => onNavClick!(entry.id) : undefined}
                >
                  <span>{entry.label}</span>
                  {hasChildren && (
                    <span className={styles.navChevron}>
                      <ChevronDown />
                    </span>
                  )}
                  {hasChildren && (
                    <div className={styles.dropdown}>
                      {entry.children!.map((child) => (
                        <div
                          key={child.id}
                          className={styles.dropdownItem}
                          style={child.hasMockup && onNavClick ? { cursor: 'pointer' } : undefined}
                          onClick={child.hasMockup && onNavClick ? (e) => { e.stopPropagation(); onNavClick(child.id) } : undefined}
                        >
                          {child.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>{children}</div>
    </div>
  )
}
