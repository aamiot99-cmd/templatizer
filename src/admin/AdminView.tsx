import { useMemo, useState } from 'react'
import { useProjectsRegistry } from '../store/projectsRegistry'
import { useAuthSession } from '../auth/useAuthSession'
import { PLATFORMS, PLATFORM_LABELS } from '../types'
import type { Platform } from '../types'
import type { ProjectLock } from './types'
import { AiWizard } from './AiWizard'
import styles from './AdminView.module.css'

type PlatformFilter = Platform | 'all'
type SortMode = 'recent' | 'oldest' | 'name-asc' | 'name-desc' | 'updated'

const SORT_LABELS: Record<SortMode, string> = {
  recent: 'Plus récents',
  oldest: 'Plus anciens',
  updated: 'Récemment modifiés',
  'name-asc': 'Nom (A→Z)',
  'name-desc': 'Nom (Z→A)',
}

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
  const [search, setSearch] = useState('')
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('all')
  const [creatorFilter, setCreatorFilter] = useState<string>('all')
  const [sortMode, setSortMode] = useState<SortMode>('recent')

  const sectionProjects = useMemo(() => {
    if (activeSection === 'mine') {
      return currentUserId
        ? projects.filter((p) => p.ownerId === currentUserId)
        : []
    }
    return projects
  }, [projects, activeSection, currentUserId])

  // Distinct creators present in the current section, for the creator filter dropdown.
  const creators = useMemo(() => {
    const map = new Map<string, { id: string; email: string | null }>()
    for (const p of sectionProjects) {
      if (!map.has(p.ownerId)) {
        map.set(p.ownerId, { id: p.ownerId, email: p.ownerEmail })
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      (a.email ?? '').localeCompare(b.email ?? ''),
    )
  }, [sectionProjects])

  const visibleProjects = useMemo(() => {
    let list = sectionProjects
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }
    if (platformFilter !== 'all') {
      list = list.filter((p) => p.snapshot.platform === platformFilter)
    }
    if (creatorFilter !== 'all') {
      list = list.filter((p) => p.ownerId === creatorFilter)
    }
    list = [...list].sort((a, b) => {
      switch (sortMode) {
        case 'recent':
          return b.createdAt - a.createdAt
        case 'oldest':
          return a.createdAt - b.createdAt
        case 'updated':
          return b.updatedAt - a.updatedAt
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
      }
    })
    return list
  }, [sectionProjects, search, platformFilter, creatorFilter, sortMode])

  const hasActiveFilters =
    search.trim() !== '' ||
    platformFilter !== 'all' ||
    creatorFilter !== 'all' ||
    sortMode !== 'recent'

  const resetFilters = () => {
    setSearch('')
    setPlatformFilter('all')
    setCreatorFilter('all')
    setSortMode('recent')
  }

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
  const noProjectsAtAll = sectionProjects.length === 0
  const emptyMessage = noProjectsAtAll
    ? showingMine
      ? "Vous n'avez encore créé aucun projet. Cliquez sur « + Nouveau projet » pour démarrer."
      : 'Aucun projet pour le moment. Créez votre premier projet pour commencer.'
    : 'Aucun projet ne correspond aux filtres actuels.'

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

        {!noProjectsAtAll && (
          <div className={styles.filterBar}>
            <div className={styles.searchWrap}>
              <svg
                className={styles.searchIcon}
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Rechercher par nom…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <label className={styles.filterField}>
              <span className={styles.filterLabel}>Plateforme</span>
              <select
                className={styles.filterSelect}
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value as PlatformFilter)}
              >
                <option value="all">Toutes</option>
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {PLATFORM_LABELS[p]}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.filterField}>
              <span className={styles.filterLabel}>Créé par</span>
              <select
                className={styles.filterSelect}
                value={creatorFilter}
                onChange={(e) => setCreatorFilter(e.target.value)}
              >
                <option value="all">Tous</option>
                {creators.map((c) => (
                  <option key={c.id} value={c.id}>
                    {formatUserName(c.email) || c.id.slice(0, 8)}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.filterField}>
              <span className={styles.filterLabel}>Trier par</span>
              <select
                className={styles.filterSelect}
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
              >
                {(Object.keys(SORT_LABELS) as SortMode[]).map((mode) => (
                  <option key={mode} value={mode}>
                    {SORT_LABELS[mode]}
                  </option>
                ))}
              </select>
            </label>

            {hasActiveFilters && (
              <button
                type="button"
                className={styles.resetFilters}
                onClick={resetFilters}
              >
                Réinitialiser
              </button>
            )}
          </div>
        )}

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
