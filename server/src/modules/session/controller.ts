import { Request, Response } from 'express'

import { StatusCodes } from 'http-status-codes'
import * as jwt from 'jsonwebtoken'

import prisma from '@/lib/prisma-client'
import { JWT_SECRET } from '@/config/env'

export default {
  async put(req: Request, res: Response): Promise<void> {
    const status = StatusCodes.UNAUTHORIZED
    const { name, password } = req.body
    const title = 'Erro de autenticação'
    if (!name) {
      return Promise.reject({ status, title, detail: 'Nome é obrigatório.' })
    }

    if (!password) {
      return Promise.reject({ status, title, detail: 'Senha é obrigatória.' })
    }

    const user = await prisma.user.findFirst({ where: { name, inactive: false } })
    if (!user) {
      return Promise.reject({ status, title, detail: 'Usuário não cadastrado.' })
    }

    if (user.password !== password) {
      return Promise.reject({ status, title, detail: 'Senha inválida.' })
    }

    const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET)
    res.status(StatusCodes.OK).json(token)
  },
}
