import type { ProjectState } from '../types'

export interface ProjectRecord {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  snapshot: ProjectState
}
