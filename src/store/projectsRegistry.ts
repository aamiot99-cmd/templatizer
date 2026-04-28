import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProjectRecord } from '../admin/types'
import type { Platform, ProjectState } from '../types'
import { THEMES } from '../themes'
import { defaultHubMenu, defaultNavEntries } from './projectStore'

const STORAGE_KEY = 'templatizer_registry'
const SCHEMA_VERSION = 1

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

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

interface RegistryState {
  projects: ProjectRecord[]
  activeProjectId: string | null
}

interface RegistryActions {
  createProject: (name: string) => string
  deleteProject: (id: string) => void
  renameProject: (id: string, name: string) => void
  openProject: (id: string) => void
  closeProject: () => void
  saveSnapshot: (id: string, snapshot: ProjectState) => void
}

export type ProjectsRegistry = RegistryState & RegistryActions

export const useProjectsRegistry = create<ProjectsRegistry>()(
  persist(
    (set) => ({
      projects: [],
      activeProjectId: null,

      createProject: (name) => {
        const id = uid()
        const now = Date.now()
        const record: ProjectRecord = {
          id,
          name: name.trim() || 'Projet sans titre',
          createdAt: now,
          updatedAt: now,
          snapshot: blankProjectState(),
        }
        set((state) => ({ projects: [record, ...state.projects] }))
        return id
      },

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          activeProjectId:
            state.activeProjectId === id ? null : state.activeProjectId,
        })),

      renameProject: (id, name) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? { ...p, name: name.trim() || p.name, updatedAt: Date.now() }
              : p,
          ),
        })),

      openProject: (id) => set({ activeProjectId: id }),

      closeProject: () => set({ activeProjectId: null }),

      saveSnapshot: (id, snapshot) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, snapshot, updatedAt: Date.now() } : p,
          ),
        })),
    }),
    {
      name: STORAGE_KEY,
      version: SCHEMA_VERSION,
    },
  ),
)
