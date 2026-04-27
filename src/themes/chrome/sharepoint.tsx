import type { ReactNode } from 'react'
import type { Branding, HubMenu, NavEntry } from '../../types'
import styles from './sharepoint.module.css'

interface SharepointChromeProps {
  branding: Branding
  navEntries: NavEntry[]
  hubMenu?: HubMenu
  children: ReactNode
}

const DEFAULT_NAV: NavEntry[] = [
  { id: 'default-1', label: 'Accueil', url: '#' },
  { id: 'default-2', label: 'Qui sommes-nous ?', url: '#' },
  { id: 'default-3', label: 'Événements', url: '#' },
  { id: 'default-4', label: 'Ressources', url: '#' },
]

function initials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
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

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
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

function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function PagesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg width="10" height="7" viewBox="0 0 12 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 1 6 6 11 1" />
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

function HelpIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

export function SharepointChrome({ branding, navEntries, hubMenu, children }: SharepointChromeProps) {
  const nav = navEntries.length > 0 ? navEntries : DEFAULT_NAV
  const userName = 'Alex Dupont'
  const userInitials = initials(userName)
  const siteInitials = initials(branding.name)
  const showHubMenu = Boolean(hubMenu?.enabled && hubMenu.entries.length > 0)

  return (
    <div className={styles.chrome}>
      {/* M365 top bar */}
      <div className={styles.m365Bar}>
        <div className={styles.m365Left}>
          <div className={styles.m365Waffle}>
            <Waffle />
          </div>
          {branding.logo ? (
            <img src={branding.logo} alt="" className={styles.m365Logo} />
          ) : (
            <div className={styles.m365LogoInitials}>{siteInitials}</div>
          )}
          <span className={styles.m365AppName}>SharePoint</span>
        </div>
        <div className={styles.m365Search}>
          <SearchIcon />
          <input className={styles.m365SearchInput} placeholder="Rechercher sur ce site" readOnly />
        </div>
        <div className={styles.m365Right}>
          <div className={styles.m365Icon}><GearIcon /></div>
          <div className={styles.m365Icon}><HelpIcon /></div>
          <div className={styles.m365User}>{userName}</div>
          <div className={styles.m365Av}>{userInitials}</div>
        </div>
      </div>

      {showHubMenu && (
        <div className={styles.hubMenu}>
          {/* Invisible spacer mirroring sidebar + site logo wrap so the first
              hub entry aligns with the first site nav entry below. */}
          <div className={styles.hubMenuLeftPad} aria-hidden="true">
            <div className={styles.hubMenuLogoMirror}>
              {branding.logo ? (
                <img src={branding.logo} alt="" className={styles.siteLogoImg} />
              ) : (
                <div className={styles.siteLogoInitials}>{siteInitials}</div>
              )}
              <span className={styles.siteName}>{branding.name}</span>
            </div>
          </div>
          <nav className={styles.hubMenuNav}>
            {hubMenu!.entries.map((entry) => {
              const hasChildren = Boolean(entry.children && entry.children.length > 0)
              return (
                <div
                  key={entry.id}
                  className={`${styles.hubMenuItem} ${hasChildren ? styles.hubMenuItemHasChildren : ''}`}
                >
                  <span>{entry.label}</span>
                  {hasChildren && <span className={styles.hubMenuChevron}><ChevronDown /></span>}
                  {hasChildren && (
                    <div className={styles.hubMenuDropdown}>
                      {entry.children!.map((child) => (
                        <div key={child.id} className={styles.hubMenuDropdownItem}>{child.label}</div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      )}

      <div className={styles.body}>
        {/* Left sidebar */}
        <div className={styles.sidebar}>
          <div className={`${styles.sidebarIcon} ${styles.sidebarIconActive}`}><HomeIcon /></div>
          <div className={styles.sidebarIcon}><GlobeIcon /></div>
          <div className={styles.sidebarIcon}><FileIcon /></div>
          <div className={styles.sidebarIcon}><PagesIcon /></div>
          <div className={styles.sidebarIcon}><LinkIcon /></div>
          <div className={styles.sidebarIconPlus}><PlusIcon /></div>
        </div>

        <div className={styles.main}>
          {/* Site header bar */}
          <div className={styles.siteHeader}>
            <div className={styles.siteHeaderInner}>
              <div className={styles.siteLogoWrap}>
                {branding.logo ? (
                  <img src={branding.logo} alt="" className={styles.siteLogoImg} />
                ) : (
                  <div className={styles.siteLogoInitials}>{siteInitials}</div>
                )}
                <span className={styles.siteName}>{branding.name}</span>
              </div>

              <nav className={styles.siteNav}>
                {nav.map((entry, idx) => {
                  const hasChildren = Boolean(entry.children && entry.children.length > 0)
                  return (
                    <div
                      key={entry.id}
                      className={`${styles.navItem} ${idx === 0 ? styles.navItemActive : ''}`}
                    >
                      <span>{entry.label}</span>
                      {hasChildren && <span className={styles.navChevron}><ChevronDown /></span>}
                      {hasChildren && (
                        <div className={styles.dropdown}>
                          {entry.children!.map((child) => (
                            <div key={child.id} className={styles.dropdownItem}>{child.label}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </nav>

              <div className={styles.siteActions}>
                <div className={styles.siteAction}>★ Suivi</div>
                <div className={styles.siteAction}><PeopleIcon /> Accès aux sites</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={styles.content}>
            <div className={styles.contentInner}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
