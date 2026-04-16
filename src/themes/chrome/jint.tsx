import type { ReactNode } from 'react'
import type { Branding, NavEntry } from '../../types'
import styles from './jint.module.css'

interface JintChromeProps {
  branding: Branding
  navEntries: NavEntry[]
  children: ReactNode
}

const DEFAULT_NAV: NavEntry[] = [
  { id: 'default-1', label: 'Accueil', url: '#' },
  { id: 'default-2', label: 'Centre documentaire', url: '#' },
  { id: 'default-3', label: 'Nos directions', url: '#' },
  { id: 'default-4', label: 'Centre de news', url: '#' },
]

function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function Waffle() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="currentColor">
      <rect x="1.4" y="1.4" width="2.8" height="2.8" rx=".3" />
      <rect x="7.8" y="1.4" width="2.8" height="2.8" rx=".3" />
      <rect x="14.2" y="1.4" width="2.8" height="2.8" rx=".3" />
      <rect x="1.4" y="7.8" width="2.8" height="2.8" rx=".3" />
      <rect x="7.8" y="7.8" width="2.8" height="2.8" rx=".3" />
      <rect x="14.2" y="7.8" width="2.8" height="2.8" rx=".3" />
      <rect x="1.4" y="14.2" width="2.8" height="2.8" rx=".3" />
      <rect x="7.8" y="14.2" width="2.8" height="2.8" rx=".3" />
      <rect x="14.2" y="14.2" width="2.8" height="2.8" rx=".3" />
    </svg>
  )
}

function SearchIcon({ stroke = 'currentColor' }: { stroke?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg
      width="10"
      height="7"
      viewBox="0 0 12 7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="1 1 6 6 11 1" />
    </svg>
  )
}

export function JintChrome({ branding, navEntries, children }: JintChromeProps) {
  const nav = navEntries.length > 0 ? navEntries : DEFAULT_NAV
  const userName = 'Alex Dupont'
  const userInitials = initials(userName)

  return (
    <div className={styles.chrome}>
      <div className={styles.m365Bar}>
        <div className={styles.m365Left}>
          <div className={styles.m365Waffle}>
            <Waffle />
          </div>
          <div className={styles.m365LogoWrap}>
            {branding.logo ? (
              <img
                src={branding.logo}
                alt=""
                className={styles.m365LogoImg}
              />
            ) : (
              <span className={styles.m365LogoText}>{branding.name}</span>
            )}
          </div>
          <span className={styles.m365AppName}>SharePoint</span>
        </div>
        <div className={styles.m365Search}>
          <SearchIcon stroke="#e8440a" />
          <input
            className={styles.m365SearchInput}
            placeholder="Rechercher sur ce site"
            readOnly
          />
        </div>
        <div className={styles.m365Right}>
          <div className={styles.m365Icon}>
            <BellIcon />
            <span className={styles.m365Badge}></span>
          </div>
          <div className={styles.m365Icon}>
            <GearIcon />
          </div>
          <div className={styles.m365User}>{userName}</div>
          <div className={styles.m365Av}>{userInitials}</div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.appBar}>
          <div className={styles.appBarPill}>
            <div className={styles.appBarIcon}>
              <GlobeIcon />
            </div>
            <div className={`${styles.appBarIcon} ${styles.appBarIconActive}`}>
              <GridIcon />
            </div>
            <div className={styles.appBarIcon}>
              <PlusIcon />
            </div>
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.siteHeader}>
            <div className={styles.shTop}>
              <div className={styles.shLogoWrap}>
                {branding.logo ? (
                  <img
                    src={branding.logo}
                    alt=""
                    className={styles.shLogoImg}
                  />
                ) : (
                  <span className={styles.shBrand}>{branding.name}</span>
                )}
              </div>
              <div className={styles.shTitle}>
                Intranet {branding.name}
              </div>
              <div className={styles.shBanner}>
                <div className={styles.shBannerBase} />
                <div className={styles.shBannerBlobA} />
                <div className={styles.shBannerBlobB} />
                <div className={styles.shBannerBlobC} />
              </div>
            </div>
            <div className={styles.shSep}></div>
            <nav className={styles.shNav}>
              {nav.map((entry, idx) => {
                const hasChildren = Boolean(
                  entry.children && entry.children.length > 0,
                )
                return (
                  <div
                    key={entry.id}
                    className={`${styles.shNavItem} ${
                      idx === 0 ? styles.shNavItemActive : ''
                    } ${hasChildren ? styles.shNavItemHasChildren : ''}`}
                  >
                    <span>{entry.label}</span>
                    {hasChildren && (
                      <span className={styles.shChevron}>
                        <ChevronDown />
                      </span>
                    )}
                    {hasChildren && (
                      <div className={styles.shDropdown}>
                        {entry.children!.map((child) => (
                          <div
                            key={child.id}
                            className={styles.shDropdownItem}
                          >
                            {child.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
              <div className={styles.shRight}>
                <div className={styles.shAction}>
                  <PeopleIcon /> Accès au site
                </div>
              </div>
            </nav>
          </div>

          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  )
}
