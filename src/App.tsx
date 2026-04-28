import { useEffect, useMemo } from 'react'
import { Wizard } from './wizard'
import { PreviewPage } from './preview/PreviewPage'
import { AdminView } from './admin/AdminView'
import { useProjectsRegistry } from './store/projectsRegistry'
import { useProjectStore } from './store/projectStore'
import './App.css'

function isPreviewMode(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('preview') === '1'
}

function App() {
  const activeProjectId = useProjectsRegistry((s) => s.activeProjectId)
  const projects = useProjectsRegistry((s) => s.projects)
  const closeProject = useProjectsRegistry((s) => s.closeProject)

  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeProjectId) ?? null,
    [projects, activeProjectId],
  )

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

  // Mirror projectStore changes back into the active project's slot.
  useEffect(() => {
    if (!activeProjectId) return
    const id = activeProjectId
    let timer: ReturnType<typeof setTimeout> | null = null
    const unsubscribe = useProjectStore.subscribe((state) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        useProjectsRegistry.getState().saveSnapshot(id, {
          platform: state.platform,
          branding: state.branding,
          wireframe: state.wireframe,
          navEntries: state.navEntries,
          hubMenu: state.hubMenu,
        })
      }, 400)
    })
    return () => {
      unsubscribe()
      if (timer) clearTimeout(timer)
    }
  }, [activeProjectId])

  if (isPreviewMode()) {
    return <PreviewPage />
  }

  // Stale activeProjectId pointing to a deleted project: fall back to admin.
  if (activeProjectId && !activeProject) {
    closeProject()
  }

  const inProject = Boolean(activeProjectId && activeProject)

  return (
    <main className="app">
      <header className="app-header">
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
            <p>Édition du projet — vos modifications sont enregistrées automatiquement.</p>
          </>
        ) : (
          <>
            <h1>Templatizer</h1>
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
