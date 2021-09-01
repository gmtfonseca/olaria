import { Fish, Pond } from '@prisma/client'

export interface TransferBase {
  datetime: Date
  description: string
}

export interface Transfer extends TransferBase {
  datetime: Date
  description: string
  fishId: number
  pondOriginId: number
  pondDestId: number
}

export interface TransferPopulated extends TransferBase {
  fish: Fish
  pondOrigin: Pond
  pondDest: Pond
}
