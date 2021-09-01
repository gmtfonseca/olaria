import { Pagination } from '@/data/types'
import { User } from '@/data/auth/types'

export interface Pond {
  id: number
  name: string
  inactive?: boolean
  createdBy?: User
  modifiedBy?: User
}

export interface GetPondsParams extends Pagination {
  name?: string
}

export type CreatePondParams = Omit<Pond, 'id'>

export type PondForm = Partial<CreatePondParams>
