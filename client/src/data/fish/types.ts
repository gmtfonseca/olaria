import { Pagination } from '@/data/types'
import { User } from '@/data/auth/types'

export interface Fish {
  id: number
  name: string
  inactive?: boolean
  createdBy?: User
  modifiedBy?: User
}

export interface GetFishesParams extends Pagination {
  name?: string
  inactive?: boolean
}

export type CreateFishParams = Omit<Fish, 'id'>

export type FishForm = Partial<CreateFishParams>
