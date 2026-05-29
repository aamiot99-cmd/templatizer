import { useEffect, useMemo, useState } from 'react'
import { Wizard } from './wizard'
import { PreviewPage } from './preview/PreviewPage'
import { AdminView, type NavSection } from './admin/AdminView'
import { SettingsView } from './admin/SettingsView'
import { LoginScreen } from './auth/LoginScreen'
import { useAuthSession } from './auth/useAuthSession'
import { useProjectsRegistry } from './store/projectsRegistry'
import { useProjectStore } from './store/projectStore'
import { supabase } from './lib/supabase'
import './App.css'

const HEARTBEAT_MS = 30 * 1000

function isPreviewMode(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('preview') === '1'
}

function App() {
  const { session, status: authStatus } = useAuthSession()

  const activeProjectId = useProjectsRegistry((s) => s.activeProjectId)
  const projects = useProjectsRegistry((s) => s.projects)
  const closeProject = useProjectsRegistry((s) => s.closeProject)
  const fetchProjects = useProjectsRegistry((s) => s.fetchProjects)
  const heartbeatActive = useProjectsRegistry((s) => s.heartbeatActive)
  const resetRegistry = useProjectsRegistry((s) => s.reset)

  const [activeSection, setActiveSection] = useState<NavSection>('all')
  const currentUserId = session?.user.id ?? null
  const mineCount = useMemo(
    () =>
      currentUserId
        ? projects.filter((p) => p.ownerId === currentUserId).length
        : 0,
    [projects, currentUserId],
  )

  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeProjectId) ?? null,
    [projects, activeProjectId],
  )

  // Fetch projects when authenticated; clear on sign-out.
  useEffect(() => {
    if (authStatus === 'authenticated') {
      fetchProjects()
    } else if (authStatus === 'unauthenticated') {
      resetRegistry()
    }
  }, [authStatus, fetchProjects, resetRegistry])

  // Refetch project list when window regains focus (so locks held by other
  // admins surface without a manual reload).
  useEffect(() => {
    if (authStatus !== 'authenticated') return
    const handleFocus = () => {
      if (!useProjectsRegistry.getState().activeProjectId) {
        fetchProjects()
      }
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [authStatus, fetchProjects])

  // Load snapshot into projectStore when switching active project.
  useEffect(() => {
    if (!activeProjectId) return
    const project = useProjectsRegistry
      .getState()
      .projects.find((p) => p.id === activeProjectId)
    if (project) {
      useProjectStore.getState().loadSnapshot(project.snapshot)
    }
  }, [activeProjectId])

  // Heartbeat the lock while a project is open.
  useEffect(() => {
    if (!activeProjectId) return
    const interval = setInterval(() => {
      heartbeatActive()
    }, HEARTBEAT_MS)
    return () => clearInterval(interval)
  }, [activeProjectId, heartbeatActive])

  // Best-effort lock release on tab/window close.
  useEffect(() => {
    if (!activeProjectId) return
    const client = supabase
    if (!client) return
    const id = activeProjectId
    const handleUnload = () => {
      client.rpc('release_project_lock', { p_id: id })
    }
    window.addEventListener('pagehide', handleUnload)
    return () => window.removeEventListener('pagehide', handleUnload)
  }, [activeProjectId])

  // Mirror projectStore changes back into Supabase via saveSnapshot, debounced.
  useEffect(() => {
    if (!activeProjectId) return
    const id = activeProjectId
    let timer: ReturnType<typeof setTimeout> | null = null
    const unsubscribe = useProjectStore.subscribe((state) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        useProjectsRegistry
          .getState()
          .saveSnapshot(id, {
            platform: state.platform,
            branding: state.branding,
            wireframes: state.wireframes,
            activePageId: state.activePageId,
            navEntries: state.navEntries,
            hubMenu: state.hubMenu,
          })
          .catch((err) => {
            console.error('Failed to save snapshot:', err)
          })
      }, 1200)
    })
    return () => {
      unsubscribe()
      if (timer) clearTimeout(timer)
    }
  }, [activeProjectId])

  const handleSignOut = async () => {
    if (!supabase) return
    if (useProjectsRegistry.getState().activeProjectId) {
      await closeProject()
    }
    await supabase.auth.signOut()
  }

  if (isPreviewMode()) {
    return <PreviewPage />
  }

  if (authStatus === 'loading') {
    return (
      <main className="app">
        <p style={{ color: 'var(--text-muted)' }}>Chargement…</p>
      </main>
    )
  }

  if (authStatus === 'unauthenticated' || !session) {
    return <LoginScreen />
  }

  // Stale activeProjectId pointing to a deleted project: fall back to admin.
  if (activeProjectId && !activeProject) {
    closeProject()
  }

  const inProject = Boolean(activeProjectId && activeProject)
  const userEmail = session.user.email ?? ''
  const metadata = session.user.user_metadata ?? {}
  const fullName = (metadata.full_name as string | undefined)?.trim() || userEmail
  const avatarUrl = metadata.avatar_url as string | undefined
  const initials = fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || (userEmail[0]?.toUpperCase() ?? '?')

  const handleNavClick = (section: NavSection) => {
    if (activeProjectId) {
      void closeProject()
    }
    setActiveSection(section)
  }

  const collapsed = inProject

  return (
    <div className={`app-shell ${collapsed ? 'app-shell-collapsed' : ''}`}>
      <aside className={`app-sidebar ${collapsed ? 'app-sidebar-collapsed' : ''}`}>
        <div className="app-sidebar-brand-block">
          <img
            src="/Logo lecko/logolecko.png"
            alt="Lecko"
            className="app-sidebar-lecko"
          />
          <div className="app-sidebar-logo">
            <span className="app-sidebar-brand">Templatizer</span>
            <span className="app-sidebar-brand-tag">
              by <span className="app-sidebar-brand-tag-name">lecko</span>
            </span>
          </div>
        </div>
        <nav className="app-sidebar-nav" aria-label="Navigation projets">
          <button
            type="button"
            className={`app-sidebar-item ${activeSection === 'all' && !inProject ? 'app-sidebar-item-active' : ''}`}
            onClick={() => handleNavClick('all')}
            title="Tous les projets"
            aria-label="Tous les projets"
          >
            <svg
              className="app-sidebar-icon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className="app-sidebar-label">Tous les projets</span>
            <span className="app-sidebar-count">{projects.length}</span>
          </button>
          <button
            type="button"
            className={`app-sidebar-item ${activeSection === 'mine' && !inProject ? 'app-sidebar-item-active' : ''}`}
            onClick={() => handleNavClick('mine')}
            title="Mes projets"
            aria-label="Mes projets"
          >
            <svg
              className="app-sidebar-icon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="app-sidebar-label">Mes projets</span>
            <span className="app-sidebar-count">{mineCount}</span>
          </button>
        </nav>
        <div className="app-sidebar-footer">
          <button
            type="button"
            className={`app-sidebar-icon-button ${activeSection === 'settings' && !inProject ? 'app-sidebar-icon-button-active' : ''}`}
            onClick={() => handleNavClick('settings')}
            aria-label="Paramètres"
            title="Paramètres"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </aside>

      <main className="app-main">
        <header className="app-header">
          <div className="app-userbar">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="app-user-avatar"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="app-user-avatar app-user-avatar-fallback" aria-hidden="true">
                {initials}
              </span>
            )}
            <span className="app-user-name">{fullName}</span>
            <button
              type="button"
              className="app-signout"
              onClick={handleSignOut}
            >
              Se déconnecter
            </button>
          </div>
          {inProject && (
            <>
              <button
                type="button"
                className="app-back"
                onClick={() => closeProject()}
              >
                ← Retour aux projets
              </button>
              <h1>{activeProject!.name}</h1>
              <p>
                Édition du projet. Vos modifications sont enregistrées
                automatiquement.
              </p>
            </>
          )}
        </header>
        {inProject ? (
          <Wizard />
        ) : activeSection === 'settings' ? (
          <SettingsView />
        ) : (
          <AdminView activeSection={activeSection} />
        )}
      </main>
    </div>
  )
}

export default App
