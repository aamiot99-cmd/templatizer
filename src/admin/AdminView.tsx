import { useMemo, useState } from 'react'
import { useProjectsRegistry } from '../store/projectsRegistry'
import { useAuthSession } from '../auth/useAuthSession'
import { PLATFORM_LABELS } from '../types'
import type { ProjectLock } from './types'
import { AiWizard } from './AiWizard'
import styles from './AdminView.module.css'

export type NavSection = 'all' | 'mine' | 'settings'

type ProjectsSection = Exclude<NavSection, 'settings'>

const SECTION_LABELS: Record<ProjectsSection, string> = {
  all: 'Tous les projets',
  mine: 'Mes projets',
}

const SECTION_SUBTITLES: Record<ProjectsSection, string> = {
  all: 'Espace partagé : tous les administrateurs accèdent aux mêmes projets.',
  mine: 'Les projets dont vous êtes propriétaire.',
}

interface AdminViewProps {
  activeSection: ProjectsSection
}

function formatUserName(email: string | null | undefined): string {
  if (!email) return ''
  const at = email.indexOf('@')
  return at > 0 ? email.slice(0, at) : email
}

function userInitials(name: string): string {
  if (!name) return '?'
  return name.slice(0, 2).toUpperCase()
}

function UserChip({
  email,
  avatarUrl,
}: {
  email: string | null | undefined
  avatarUrl: string | null | undefined
}) {
  const name = formatUserName(email)
  if (!name) return null
  return (
    <span className={styles.userChip}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt=""
          className={styles.userAvatar}
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className={styles.userAvatarFallback} aria-hidden="true">
          {userInitials(name)}
        </span>
      )}
      <span className={styles.userName}>{name}</span>
    </span>
  )
}

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

function formatLockMessage(lock: ProjectLock): string {
  const who = formatUserName(lock.lockedByEmail) || 'un autre administrateur'
  return `En cours d'édition par ${who} (${formatRelativeDate(lock.lockedAt)})`
}

export function AdminView({ activeSection }: AdminViewProps) {
  const { session } = useAuthSession()
  const currentUserId = session?.user.id ?? null

  const projects = useProjectsRegistry((s) => s.projects)
  const status = useProjectsRegistry((s) => s.status)
  const error = useProjectsRegistry((s) => s.error)
  const createProject = useProjectsRegistry((s) => s.createProject)
  const tryOpenProject = useProjectsRegistry((s) => s.tryOpenProject)
  const deleteProject = useProjectsRegistry((s) => s.deleteProject)
  const renameProject = useProjectsRegistry((s) => s.renameProject)

  const [draftName, setDraftName] = useState('')
  const [busy, setBusy] = useState(false)
  const [openingId, setOpeningId] = useState<string | null>(null)
  const [aiOpen, setAiOpen] = useState(false)

  const visibleProjects = useMemo(() => {
    if (activeSection === 'mine') {
      return currentUserId
        ? projects.filter((p) => p.ownerId === currentUserId)
        : []
    }
    return projects
  }, [projects, activeSection, currentUserId])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = draftName.trim()
    if (!name || busy) return
    setBusy(true)
    try {
      const id = await createProject(name)
      setDraftName('')
      const result = await tryOpenProject(id)
      if (!result.acquired && result.lock) {
        window.alert(formatLockMessage(result.lock))
      }
    } catch (err) {
      window.alert(
        `Création impossible : ${err instanceof Error ? err.message : String(err)}`,
      )
    } finally {
      setBusy(false)
    }
  }

  const handleOpen = async (id: string) => {
    if (openingId) return
    setOpeningId(id)
    try {
      const result = await tryOpenProject(id)
      if (!result.acquired && result.lock) {
        window.alert(formatLockMessage(result.lock))
      }
    } catch (err) {
      window.alert(
        `Ouverture impossible : ${err instanceof Error ? err.message : String(err)}`,
      )
    } finally {
      setOpeningId(null)
    }
  }

  const handleRename = async (id: string, currentName: string) => {
    const next = window.prompt('Nouveau nom du projet :', currentName)
    if (next === null) return
    const trimmed = next.trim()
    if (!trimmed || trimmed === currentName) return
    try {
      await renameProject(id, trimmed)
    } catch (err) {
      window.alert(
        `Renommage impossible : ${err instanceof Error ? err.message : String(err)}`,
      )
    }
  }

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `Supprimer définitivement le projet "${name}" ? Cette action est irréversible.`,
    )
    if (!confirmed) return
    try {
      await deleteProject(id)
    } catch (err) {
      window.alert(
        `Suppression impossible : ${err instanceof Error ? err.message : String(err)}`,
      )
    }
  }

  const showingMine = activeSection === 'mine'
  const emptyMessage = showingMine
    ? 'Vous n\'avez encore créé aucun projet. Cliquez sur « + Nouveau projet » pour démarrer.'
    : 'Aucun projet pour le moment. Créez votre premier projet pour commencer.'

  return (
    <div className={styles.root}>
      <section className={styles.main}>
        <div className={styles.toolbar}>
          <div>
            <h2 className={styles.heading}>{SECTION_LABELS[activeSection]}</h2>
            <p className={styles.subheading}>{SECTION_SUBTITLES[activeSection]}</p>
          </div>
          <form className={styles.createForm} onSubmit={handleCreate}>
            <input
              type="text"
              className={styles.createInput}
              placeholder="Nom du nouveau projet"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              disabled={busy}
            />
            <button
              type="button"
              className={styles.aiButton}
              onClick={() => setAiOpen(true)}
              disabled={busy}
              title="Créer un projet généré par l'IA"
            >
              ✨ Créer avec IA
            </button>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={!draftName.trim() || busy}
            >
              {busy ? 'Création…' : '+ Nouveau projet'}
            </button>
          </form>
        </div>

        {status === 'error' && error && (
          <div className={styles.errorBanner}>
            Erreur lors du chargement des projets : {error}
          </div>
        )}

        {status === 'loading' ? (
          <div className={styles.empty}>
            <p>Chargement des projets…</p>
          </div>
        ) : visibleProjects.length === 0 ? (
          <div className={styles.empty}>
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <ul className={styles.list}>
            {visibleProjects.map((project) => {
              const platformLabel =
                PLATFORM_LABELS[project.snapshot.platform] ??
                project.snapshot.platform
              const lockedByOther =
                project.lock !== null && project.lock.lockedBy !== currentUserId
              return (
                <li key={project.id} className={styles.listItem}>
                  <article
                    className={`${styles.card} ${lockedByOther ? styles.cardLocked : ''}`}
                  >
                    <header className={styles.cardHeader}>
                      <span className={styles.cardName}>{project.name}</span>
                      <div className={styles.cardMeta}>
                        <span className={styles.platformBadge}>
                          {platformLabel}
                        </span>
                        {project.ownerEmail && (
                          <span className={styles.metaLine}>
                            Créé par{' '}
                            <UserChip
                              email={project.ownerEmail}
                              avatarUrl={project.ownerAvatarUrl}
                            />
                          </span>
                        )}
                        <span className={styles.metaLine}>
                          Modifié {formatRelativeDate(project.updatedAt)}
                          {project.lastEditedByEmail ? (
                            <>
                              {' '}par{' '}
                              <UserChip
                                email={project.lastEditedByEmail}
                                avatarUrl={project.lastEditedByAvatarUrl}
                              />
                            </>
                          ) : null}
                        </span>
                      </div>
                      {lockedByOther && (
                        <div className={styles.lockBadge}>
                          <span aria-hidden="true">🔒</span>
                          <span>
                            En cours d'édition par{' '}
                            <UserChip
                              email={project.lock!.lockedByEmail}
                              avatarUrl={project.lock!.lockedByAvatarUrl}
                            />{' '}
                            ({formatRelativeDate(project.lock!.lockedAt)})
                          </span>
                        </div>
                      )}
                    </header>
                    <div className={styles.cardActions}>
                      <button
                        type="button"
                        className={`${styles.cardButton} ${styles.cardButtonPrimary}`}
                        onClick={() => handleOpen(project.id)}
                        disabled={lockedByOther || openingId === project.id}
                      >
                        {openingId === project.id
                          ? 'Ouverture…'
                          : lockedByOther
                            ? 'Verrouillé'
                            : 'Ouvrir'}
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
                        disabled={lockedByOther}
                      >
                        Suppr.
                      </button>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <AiWizard open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  )
}
