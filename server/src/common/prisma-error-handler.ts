import express from 'express'
import { Prisma } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import { PrismaError, PrismaErrorType, Metadata } from '../types'

const prismaErrorCodesUrl = 'https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes'

export function isPrismaError(error: express.Errback): boolean {
  const prismaErrorTypes = [
    Prisma.PrismaClientKnownRequestError,
    Prisma.PrismaClientUnknownRequestError,
    Prisma.PrismaClientValidationError,
    Prisma.PrismaClientInitializationError,
    Prisma.PrismaClientRustPanicError,
  ]
  const result = prismaErrorTypes.some((prismaErrorType) => error instanceof prismaErrorType)
  return result
}

export function buildPrismaError(error: PrismaErrorType): PrismaError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    let titleDetail: { title: string; detail?: string } = { title: 'Não foi possível processar a requisição.' }
    if (error.code === 'P2002') {
      titleDetail = {
        title: 'Não foi possível criar o registro.',
        detail: `Violação do(s) campo(s) "${(error.meta as Metadata).target}".`,
      }
    } else if (error.code === 'P2014') {
      titleDetail = {
        title: 'Existem dados que utilizam este registro.',
      }
    }
    return {
      type: prismaErrorCodesUrl,
      status: StatusCodes.BAD_REQUEST,
      code: error.code,
      ...titleDetail,
    }
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return {
      status: StatusCodes.UNPROCESSABLE_ENTITY,
      title: 'Banco de dados falhou ao processar requisição.',
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      status: StatusCodes.BAD_REQUEST,
      title: 'Ocorreu um erro de validação.',
    }
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      type: prismaErrorCodesUrl,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      title: 'Não foi possível se conectar com o banco de dados.',
      code: error.errorCode,
    }
  } else {
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      title: 'Ocorreu um erro inesperado com o banco de dados.',
    }
  }
}
