import { useEffect, useMemo } from 'react'
import { Wizard } from './wizard'
import { PreviewPage } from './preview/PreviewPage'
import { AdminView } from './admin/AdminView'
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
            wireframe: state.wireframe,
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

  return (
    <main className="app">
      <header className="app-header">
        <div className="app-userbar">
          <span className="app-user-email">{userEmail}</span>
          <button
            type="button"
            className="app-signout"
            onClick={handleSignOut}
          >
            Se déconnecter
          </button>
        </div>
        {inProject ? (
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
              Édition du projet — vos modifications sont enregistrées
              automatiquement.
            </p>
          </>
        ) : (
          <>
            <img
              src="/templatizer_logo.svg"
              alt="Templatizer"
              className="app-logo"
            />
            <p>
              Concevez la homepage de votre intranet, quelle que soit votre
              plateforme.
            </p>
          </>
        )}
      </header>
      {inProject ? <Wizard /> : <AdminView />}
    </main>
  )
}

export default App
