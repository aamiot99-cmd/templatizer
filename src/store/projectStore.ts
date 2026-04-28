import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Branding,
  ConfigValues,
  HubMenu,
  NavEntry,
  Platform,
  ProjectState,
  WidgetSize,
  Wireframe,
  WireframeCell,
  WireframeRow,
} from '../types'
import { THEMES } from '../themes'

const STORAGE_KEY = 'templatizer_state'
const SCHEMA_VERSION = 1

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

function defaultBranding(platform: Platform): Branding {
  const theme = THEMES[platform]
  return {
    name: 'Mon entreprise',
    logo: null,
    colors: {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      text: theme.colors.text,
    },
  }
}

export function defaultNavEntries(): NavEntry[] {
  return [
    { id: 'nav-1', label: 'Accueil', url: '#' },
    {
      id: 'nav-2',
      label: 'Centre documentaire',
      url: '#',
      children: [
        { id: 'nav-2-1', label: 'Procédures', url: '#' },
        { id: 'nav-2-2', label: 'Modèles', url: '#' },
        { id: 'nav-2-3', label: 'Guides & tutoriels', url: '#' },
      ],
    },
    {
      id: 'nav-3',
      label: 'Nos directions',
      url: '#',
      children: [
        { id: 'nav-3-1', label: 'Direction générale', url: '#' },
        { id: 'nav-3-2', label: 'Direction technique', url: '#' },
        { id: 'nav-3-3', label: 'Ressources humaines', url: '#' },
        { id: 'nav-3-4', label: 'Communication', url: '#' },
      ],
    },
    { id: 'nav-4', label: 'Centre de news', url: '#' },
  ]
}

export function defaultHubMenu(): HubMenu {
  return {
    enabled: false,
    entries: [
      { id: 'hub-1', label: 'GLE - Multisite de communication', url: '#' },
      { id: 'hub-2', label: 'Espace RH', url: '#' },
      { id: 'hub-3', label: 'Communication', url: '#' },
      {
        id: 'hub-4',
        label: 'Associated child hubs',
        url: '#',
        children: [
          { id: 'hub-4-1', label: 'Hub enfant 1', url: '#' },
          { id: 'hub-4-2', label: 'Hub enfant 2', url: '#' },
        ],
      },
      { id: 'hub-5', label: 'Associated hubs', url: '#' },
    ],
  }
}

function initialProjectState(): ProjectState {
  const platform: Platform = 'jint'
  return {
    platform,
    branding: defaultBranding(platform),
    wireframe: { rows: [] },
    navEntries: defaultNavEntries(),
    hubMenu: defaultHubMenu(),
  }
}

interface ProjectActions {
  loadSnapshot: (snapshot: ProjectState) => void

  setPlatform: (platform: Platform) => void
  updateBranding: (patch: Partial<Branding>) => void
  updateBrandingColors: (patch: Partial<Branding['colors']>) => void

  addRow: (index?: number) => string
  removeRow: (rowId: string) => void
  reorderRows: (fromIndex: number, toIndex: number) => void
  setRowColumnRatios: (rowId: string, ratios: number[]) => void
  cycleRowLayout: (rowId: string) => void

  addCell: (
    rowId: string,
    widgetId: string,
    config: ConfigValues,
    size?: WidgetSize,
    index?: number,
  ) => string
  removeCell: (rowId: string, cellId: string) => void
  updateCellConfig: (
    rowId: string,
    cellId: string,
    patch: ConfigValues,
  ) => void
  updateCellSize: (rowId: string, cellId: string, size: WidgetSize) => void
  moveCell: (
    fromRowId: string,
    cellId: string,
    toRowId: string,
    toIndex: number,
  ) => void

  setNavEntries: (entries: NavEntry[]) => void

  setHubMenuEnabled: (enabled: boolean) => void
  setHubMenuEntries: (entries: NavEntry[]) => void

  resetProject: () => void
}

export type ProjectStore = ProjectState & ProjectActions

function cloneWireframe(wireframe: Wireframe): Wireframe {
  return {
    rows: wireframe.rows.map((row) => ({
      ...row,
      cells: row.cells.map((cell) => ({ ...cell, config: { ...cell.config } })),
    })),
  }
}

export const MAX_CELLS_PER_ROW = 3

const TWO_CELL_LAYOUTS: number[][] = [
  [1 / 2, 1 / 2],
  [1 / 3, 2 / 3],
  [2 / 3, 1 / 3],
]

function approxEqual(a: number, b: number, eps = 0.02): boolean {
  return Math.abs(a - b) < eps
}

function normalizeRowRatios(
  cellCount: number,
  current?: number[],
): number[] | undefined {
  if (cellCount <= 1) return undefined
  if (cellCount === 2) {
    if (current && current.length === 2) {
      for (const layout of TWO_CELL_LAYOUTS) {
        if (approxEqual(current[0], layout[0])) return layout
      }
    }
    return [1 / 2, 1 / 2]
  }
  if (cellCount >= 3) return [1 / 3, 1 / 3, 1 / 3]
  return undefined
}

function normalizeRow(row: WireframeRow): WireframeRow {
  return {
    ...row,
    columnRatios: normalizeRowRatios(row.cells.length, row.columnRatios),
  }
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      ...initialProjectState(),

      loadSnapshot: (snapshot) =>
        set({
          platform: snapshot.platform,
          branding: snapshot.branding,
          wireframe: snapshot.wireframe,
          navEntries: snapshot.navEntries,
          hubMenu: snapshot.hubMenu,
        }),

      setPlatform: (platform) =>
        set((state) => {
          const theme = THEMES[platform]
          return {
            platform,
            branding: {
              ...state.branding,
              colors: {
                primary: theme.colors.primary,
                secondary: theme.colors.secondary,
                text: theme.colors.text,
              },
            },
          }
        }),

      updateBranding: (patch) =>
        set((state) => ({ branding: { ...state.branding, ...patch } })),

      updateBrandingColors: (patch) =>
        set((state) => ({
          branding: {
            ...state.branding,
            colors: { ...state.branding.colors, ...patch },
          },
        })),

      addRow: (index) => {
        const newRow: WireframeRow = { id: uid(), cells: [] }
        set((state) => {
          const rows = [...state.wireframe.rows]
          const at = index ?? rows.length
          rows.splice(at, 0, newRow)
          return { wireframe: { rows } }
        })
        return newRow.id
      },

      removeRow: (rowId) =>
        set((state) => ({
          wireframe: {
            rows: state.wireframe.rows.filter((r) => r.id !== rowId),
          },
        })),

      reorderRows: (fromIndex, toIndex) =>
        set((state) => {
          const rows = [...state.wireframe.rows]
          const [moved] = rows.splice(fromIndex, 1)
          rows.splice(toIndex, 0, moved)
          return { wireframe: { rows } }
        }),

      setRowColumnRatios: (rowId, ratios) =>
        set((state) => ({
          wireframe: {
            rows: state.wireframe.rows.map((r) => {
              if (r.id !== rowId) return r
              return normalizeRow({ ...r, columnRatios: ratios })
            }),
          },
        })),

      cycleRowLayout: (rowId) =>
        set((state) => ({
          wireframe: {
            rows: state.wireframe.rows.map((r) => {
              if (r.id !== rowId) return r
              if (r.cells.length !== 2) return r
              const current = r.columnRatios ?? [0.5, 0.5]
              const idx = TWO_CELL_LAYOUTS.findIndex((layout) =>
                approxEqual(layout[0], current[0]),
              )
              const next =
                TWO_CELL_LAYOUTS[(idx + 1) % TWO_CELL_LAYOUTS.length]
              return { ...r, columnRatios: next }
            }),
          },
        })),

      addCell: (rowId, widgetId, config, size = 'full', index) => {
        const newCell: WireframeCell = {
          id: uid(),
          widgetId,
          config,
          size,
        }
        set((state) => ({
          wireframe: {
            rows: state.wireframe.rows.map((r) => {
              if (r.id !== rowId) return r
              if (r.cells.length >= MAX_CELLS_PER_ROW) return r
              const cells = [...r.cells]
              const at = index ?? cells.length
              cells.splice(at, 0, newCell)
              return normalizeRow({ ...r, cells })
            }),
          },
        }))
        return newCell.id
      },

      removeCell: (rowId, cellId) =>
        set((state) => ({
          wireframe: {
            rows: state.wireframe.rows.map((r) =>
              r.id === rowId
                ? normalizeRow({
                    ...r,
                    cells: r.cells.filter((c) => c.id !== cellId),
                  })
                : r,
            ),
          },
        })),

      updateCellConfig: (rowId, cellId, patch) =>
        set((state) => ({
          wireframe: {
            rows: state.wireframe.rows.map((r) =>
              r.id === rowId
                ? {
                    ...r,
                    cells: r.cells.map((c) =>
                      c.id === cellId
                        ? { ...c, config: { ...c.config, ...patch } }
                        : c,
                    ),
                  }
                : r,
            ),
          },
        })),

      updateCellSize: (rowId, cellId, size) =>
        set((state) => ({
          wireframe: {
            rows: state.wireframe.rows.map((r) =>
              r.id === rowId
                ? {
                    ...r,
                    cells: r.cells.map((c) =>
                      c.id === cellId ? { ...c, size } : c,
                    ),
                  }
                : r,
            ),
          },
        })),

      moveCell: (fromRowId, cellId, toRowId, toIndex) =>
        set((state) => {
          const wireframe = cloneWireframe(state.wireframe)
          const fromRow = wireframe.rows.find((r) => r.id === fromRowId)
          const toRow = wireframe.rows.find((r) => r.id === toRowId)
          if (!fromRow || !toRow) return state
          const cellIndex = fromRow.cells.findIndex((c) => c.id === cellId)
          if (cellIndex === -1) return state
          if (fromRowId !== toRowId && toRow.cells.length >= MAX_CELLS_PER_ROW)
            return state
          const [moved] = fromRow.cells.splice(cellIndex, 1)
          toRow.cells.splice(toIndex, 0, moved)
          wireframe.rows = wireframe.rows.map((r) =>
            r.id === fromRowId || r.id === toRowId ? normalizeRow(r) : r,
          )
          return { wireframe }
        }),

      setNavEntries: (entries) => set({ navEntries: entries }),

      setHubMenuEnabled: (enabled) =>
        set((state) => ({ hubMenu: { ...state.hubMenu, enabled } })),

      setHubMenuEntries: (entries) =>
        set((state) => ({ hubMenu: { ...state.hubMenu, entries } })),

      resetProject: () => set(initialProjectState()),
    }),
    {
      name: STORAGE_KEY,
      version: SCHEMA_VERSION,
      partialize: (state) => ({
        platform: state.platform,
        branding: state.branding,
        wireframe: state.wireframe,
        navEntries: state.navEntries,
        hubMenu: state.hubMenu,
      }),
    },
  ),
)
