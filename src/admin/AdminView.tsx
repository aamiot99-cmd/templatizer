import { useState } from 'react'
import { useProjectsRegistry } from '../store/projectsRegistry'
import { PLATFORM_LABELS } from '../types'
import styles from './AdminView.module.css'

function formatRelativeDate(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  if (diff < minute) return "à l'instant"
  if (diff < hour) return `il y a ${Math.floor(diff / minute)} min`
  if (diff < day) return `il y a ${Math.floor(diff / hour)} h`
  if (diff < 7 * day) return `il y a ${Math.floor(diff / day)} j`
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function AdminView() {
  const projects = useProjectsRegistry((s) => s.projects)
  const createProject = useProjectsRegistry((s) => s.createProject)
  const openProject = useProjectsRegistry((s) => s.openProject)
  const deleteProject = useProjectsRegistry((s) => s.deleteProject)
  const renameProject = useProjectsRegistry((s) => s.renameProject)

  const [draftName, setDraftName] = useState('')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const name = draftName.trim()
    if (!name) return
    const id = createProject(name)
    setDraftName('')
    openProject(id)
  }

  const handleRename = (id: string, currentName: string) => {
    const next = window.prompt('Nouveau nom du projet :', currentName)
    if (next === null) return
    const trimmed = next.trim()
    if (!trimmed || trimmed === currentName) return
    renameProject(id, trimmed)
  }

  const handleDelete = (id: string, name: string) => {
    const confirmed = window.confirm(
      `Supprimer définitivement le projet "${name}" ? Cette action est irréversible.`,
    )
    if (!confirmed) return
    deleteProject(id)
  }

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <div>
          <h2 className={styles.heading}>Mes projets</h2>
          <p className={styles.subheading}>
            Créez et gérez plusieurs projets d'intranet en parallèle.
          </p>
        </div>
        <form className={styles.createForm} onSubmit={handleCreate}>
          <input
            type="text"
            className={styles.createInput}
            placeholder="Nom du nouveau projet"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
          />
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={!draftName.trim()}
          >
            + Nouveau projet
          </button>
        </form>
      </div>

      {projects.length === 0 ? (
        <div className={styles.empty}>
          <p>
            Aucun projet pour le moment. Créez votre premier projet pour
            commencer.
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {projects.map((project) => {
            const platformLabel =
              PLATFORM_LABELS[project.snapshot.platform] ?? project.snapshot.platform
            return (
              <article key={project.id} className={styles.card}>
                <header className={styles.cardHeader}>
                  <span className={styles.cardName}>{project.name}</span>
                  <div className={styles.cardMeta}>
                    <span className={styles.platformBadge}>{platformLabel}</span>
                    <span>Modifié {formatRelativeDate(project.updatedAt)}</span>
                  </div>
                </header>
                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={`${styles.cardButton} ${styles.cardButtonPrimary}`}
                    onClick={() => openProject(project.id)}
                  >
                    Ouvrir
                  </button>
                  <button
                    type="button"
                    className={styles.cardButton}
                    onClick={() => handleRename(project.id, project.name)}
                  >
                    Renommer
                  </button>
                  <button
                    type="button"
                    className={`${styles.cardButton} ${styles.cardButtonDanger}`}
                    onClick={() => handleDelete(project.id, project.name)}
                  >
                    Suppr.
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
