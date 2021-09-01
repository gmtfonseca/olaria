import { Prisma } from '@prisma/client'

export interface PaginationInput {
  skip?: number
  take?: number
}

export interface BaseError {
  status: number
  title: string
  detail?: string
}

export type Metadata = Record<string, unknown>

export interface PrismaError extends BaseError {
  type?: string
  code?: string
  meta?: Metadata
}

export type PrismaErrorType =
  | Prisma.PrismaClientKnownRequestError
  | Prisma.PrismaClientUnknownRequestError
  | Prisma.PrismaClientValidationError
  | Prisma.PrismaClientInitializationError
  | Prisma.PrismaClientRustPanicError

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface User {
      id: number
      name: string
    }
  }
}
