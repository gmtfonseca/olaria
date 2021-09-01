import { Pagination } from '@/data/types'
import { Pond } from '@/data/pond/types'
import { Fish } from '@/data/fish/types'
import { User } from '@/data/auth/types'

export interface BaseMovement {
  id: number
  datetime: Date
  action: MovementAction
  quantity: number
  description?: string
  createdBy?: User
  modifiedBy?: User
}

export interface Movement extends BaseMovement {
  fishId: number
  pondId: number
}

export interface MovementPopulated extends BaseMovement {
  fish: Fish
  pond: Pond
}

export interface BaseMovementJSON {
  id: number
  datetime: string
  action: MovementAction
  quantity: number
  description?: string
}

export interface MovementJSON extends BaseMovementJSON {
  fishId: number
  pondId: number
}

export interface MovementPopulatedJSON extends MovementJSON {
  fish: Fish
  pond: Pond
}

export type MovementAction = 'OUT' | 'IN'

export interface GetMovementsParams extends Pagination {
  date?: Date
  fishId?: number
  pondId?: number
  fishName?: string
}

export type CreateMovementParams =
  | Omit<Movement, 'id'>
  | Omit<MovementPopulated, 'id'>

export type MovementForm = Partial<CreateMovementParams>

export interface MovementListFilters {
  date?: Date
  fishOrId?: Fish | number
  pondOrId?: Pond | number
}
