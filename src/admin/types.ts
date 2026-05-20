import type { ProjectState } from '../types'

export interface ProjectLock {
  lockedBy: string
  lockedByEmail: string | null
  lockedByAvatarUrl: string | null
  lockedAt: number
}

export interface ProjectRecord {
  id: string
  name: string
  ownerId: string
  ownerEmail: string | null
  ownerAvatarUrl: string | null
  createdAt: number
  updatedAt: number
  snapshot: ProjectState
  lock: ProjectLock | null
  lastEditedBy: string | null
  lastEditedByEmail: string | null
  lastEditedByAvatarUrl: string | null
}
