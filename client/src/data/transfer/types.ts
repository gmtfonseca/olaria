import { Pond } from '@/data/pond/types'
import { Fish } from '@/data/fish/types'

export interface CreateTransferParams {
  datetime: Date
  pondOrigin: Pond | number
  pondDest: Pond | number
  fish: Fish | number
  quantity: number
  notes?: string
}

export interface CreateTransferResponse {
  count: number
}

export type TransferForm = Partial<CreateTransferParams>
