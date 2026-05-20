import { create } from 'zustand'
import type { ProjectLock, ProjectRecord } from '../admin/types'
import type { Platform, ProjectState } from '../types'
import { THEMES } from '../themes'
import { requireSupabase } from '../lib/supabase'
import { defaultHubMenu, defaultNavEntries } from './projectStore'

const STALE_LOCK_MS = 3 * 60 * 1000

function blankProjectState(): ProjectState {
  const platform: Platform = 'jint'
  const theme = THEMES[platform]
  return {
    platform,
    branding: {
      name: 'Mon entreprise',
      logo: null,
      colors: {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        text: theme.colors.text,
      },
    },
    wireframe: { rows: [] },
    navEntries: defaultNavEntries(),
    hubMenu: defaultHubMenu(),
  }
}

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

interface RegistryState {
  projects: ProjectRecord[]
  activeProjectId: string | null
  status: LoadStatus
  error: string | null
}

interface OpenAttemptResult {
  acquired: boolean
  lock: ProjectLock | null
}

interface RegistryActions {
  fetchProjects: () => Promise<void>
  createProject: (name: string, snapshot?: ProjectState) => Promise<string>
  deleteProject: (id: string) => Promise<void>
  renameProject: (id: string, name: string) => Promise<void>
  saveSnapshot: (id: string, snapshot: ProjectState) => Promise<void>
  tryOpenProject: (id: string) => Promise<OpenAttemptResult>
  closeProject: () => Promise<void>
  heartbeatActive: () => Promise<void>
  reset: () => void
}

export type ProjectsRegistry = RegistryState & RegistryActions

interface ProjectRow {
  id: string
  owner_id: string
  name: string
  snapshot: ProjectState
  created_at: string
  updated_at: string
  locked_by: string | null
  locked_at: string | null
  last_edited_by: string | null
  locker?: { email: string | null; avatar_url: string | null } | null
  editor?: { email: string | null; avatar_url: string | null } | null
  owner?: { email: string | null; avatar_url: string | null } | null
}

function rowToRecord(row: ProjectRow): ProjectRecord {
  const lockTimestamp = row.locked_at ? new Date(row.locked_at).getTime() : null
  const isStale =
    lockTimestamp !== null && Date.now() - lockTimestamp > STALE_LOCK_MS
  const hasActiveLock =
    row.locked_by !== null && lockTimestamp !== null && !isStale
  const lock: ProjectLock | null = hasActiveLock
    ? {
        lockedBy: row.locked_by!,
        lockedByEmail: row.locker?.email ?? null,
        lockedByAvatarUrl: row.locker?.avatar_url ?? null,
        lockedAt: lockTimestamp!,
      }
    : null
  return {
    id: row.id,
    name: row.name,
    ownerId: row.owner_id,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
    snapshot: row.snapshot,
    lock,
    lastEditedBy: row.last_edited_by,
    lastEditedByEmail: row.editor?.email ?? null,
    lastEditedByAvatarUrl: row.editor?.avatar_url ?? null,
    ownerEmail: row.owner?.email ?? null,
    ownerAvatarUrl: row.owner?.avatar_url ?? null,
  }
}

const PROJECT_SELECT =
  '*, locker:profiles!projects_locked_by_fkey(email, avatar_url), editor:profiles!projects_last_edited_by_fkey(email, avatar_url), owner:profiles!projects_owner_id_fkey(email, avatar_url)'

async function getCurrentUserId(): Promise<string> {
  const supabase = requireSupabase()
  const { data } = await supabase.auth.getSession()
  if (!data.session?.user) throw new Error('Not authenticated')
  return data.session.user.id
}

let fetchInFlight = false

export const useProjectsRegistry = create<ProjectsRegistry>()((set, get) => ({
  projects: [],
  activeProjectId: null,
  status: 'idle',
  error: null,

  fetchProjects: async () => {
    if (fetchInFlight) return
    fetchInFlight = true
    const hasData = get().projects.length > 0
    if (!hasData) {
      set({ status: 'loading', error: null })
    } else {
      set({ error: null })
    }
    try {
      const supabase = requireSupabase()
      const { data, error } = await supabase
        .from('projects')
        .select(PROJECT_SELECT)
        .order('updated_at', { ascending: false })
      if (error) throw error
      const projects = (data ?? []).map((row) =>
        rowToRecord(row as unknown as ProjectRow),
      )
      set({ projects, status: 'ready', error: null })
    } catch (e) {
      console.error('fetchProjects failed:', e)
      set({ status: 'error', error: errorMessage(e) })
    } finally {
      fetchInFlight = false
    }
  },

  createProject: async (name, initialSnapshot) => {
    const supabase = requireSupabase()
    const userId = await getCurrentUserId()
    const trimmed = name.trim() || 'Projet sans titre'
    const snapshot = initialSnapshot ?? blankProjectState()
    const { data, error } = await supabase
      .from('projects')
      .insert({
        owner_id: userId,
        name: trimmed,
        snapshot,
        last_edited_by: userId,
      })
      .select(PROJECT_SELECT)
      .single()
    if (error) throw error
    const record = rowToRecord(data as unknown as ProjectRow)
    set((state) => ({ projects: [record, ...state.projects] }))
    return record.id
  },

  deleteProject: async (id) => {
    const supabase = requireSupabase()
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      activeProjectId:
        state.activeProjectId === id ? null : state.activeProjectId,
    }))
  },

  renameProject: async (id, name) => {
    const supabase = requireSupabase()
    const trimmed = name.trim()
    if (!trimmed) return
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('projects')
      .update({
        name: trimmed,
        updated_at: new Date().toISOString(),
        last_edited_by: userId,
      })
      .eq('id', id)
      .select(PROJECT_SELECT)
      .single()
    if (error) throw error
    const record = rowToRecord(data as unknown as ProjectRow)
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? record : p)),
    }))
  },

  saveSnapshot: async (id, snapshot) => {
    const supabase = requireSupabase()
    const userId = await getCurrentUserId()
    const { data, error } = await supabase
      .from('projects')
      .update({
        snapshot,
        updated_at: new Date().toISOString(),
        last_edited_by: userId,
      })
      .eq('id', id)
      .select(PROJECT_SELECT)
      .single()
    if (error) throw error
    const record = rowToRecord(data as unknown as ProjectRow)
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? record : p)),
    }))
  },

  tryOpenProject: async (id) => {
    const supabase = requireSupabase()
    const { data, error } = await supabase.rpc('try_lock_project', { p_id: id })
    if (error) throw error
    const row = Array.isArray(data) ? data[0] : data
    if (!row) {
      return { acquired: false, lock: null }
    }
    const acquired = Boolean(row.acquired)
    const lockTimestamp = row.locked_at
      ? new Date(row.locked_at).getTime()
      : null
    const lock: ProjectLock | null =
      row.locked_by && lockTimestamp !== null
        ? {
            lockedBy: row.locked_by,
            lockedByEmail: row.locked_by_email ?? null,
            lockedByAvatarUrl: null,
            lockedAt: lockTimestamp,
          }
        : null
    if (acquired) {
      set((state) => ({
        activeProjectId: id,
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, lock } : p,
        ),
      }))
    } else {
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, lock } : p,
        ),
      }))
    }
    return { acquired, lock }
  },

  closeProject: async () => {
    const id = get().activeProjectId
    set({ activeProjectId: null })
    if (!id) return
    try {
      const supabase = requireSupabase()
      await supabase.rpc('release_project_lock', { p_id: id })
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, lock: null } : p,
        ),
      }))
    } catch (e) {
      console.warn('Failed to release lock:', e)
    }
  },

  heartbeatActive: async () => {
    const id = get().activeProjectId
    if (!id) return
    try {
      const supabase = requireSupabase()
      await supabase.rpc('heartbeat_project', { p_id: id })
    } catch (e) {
      console.warn('Heartbeat failed:', e)
    }
  },

  reset: () =>
    set({ projects: [], activeProjectId: null, status: 'idle', error: null }),
}))

function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message
  if (e && typeof e === 'object') {
    const obj = e as Record<string, unknown>
    if (typeof obj.message === 'string') {
      const parts = [obj.message]
      if (typeof obj.details === 'string') parts.push(obj.details)
      if (typeof obj.hint === 'string') parts.push(`(${obj.hint})`)
      if (typeof obj.code === 'string') parts.push(`[${obj.code}]`)
      return parts.join(' — ')
    }
    try {
      return JSON.stringify(e)
    } catch {
      return String(e)
    }
  }
  return String(e)
}
