import type { ProjectState } from '../types'

export interface ProjectLock {
  lockedBy: string
  lockedByEmail: string | null
  lockedAt: number
}

export interface ProjectRecord {
  id: string
  name: string
  ownerId: string
  createdAt: number
  updatedAt: number
  snapshot: ProjectState
  lock: ProjectLock | null
}
