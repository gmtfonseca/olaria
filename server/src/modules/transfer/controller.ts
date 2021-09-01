import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import prisma from '@/lib/prisma-client'

import { isPopulated, unpopulate } from '@/modules/transfer/lib'

export default {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    let unpopulatedBody = req.body
    if (isPopulated(req.body)) {
      unpopulatedBody = unpopulate(req.body)
    }

    const { datetime, fishId, pondOriginId, pondDestId, quantity, notes } = unpopulatedBody

    if (pondOriginId === pondDestId) {
      return next({
        title: 'Erro ao criar transferência',
        detail: 'Açude de origem deve ser diferente de destino.',
      })
    }

    const count = await prisma.movement.createMany({
      data: [
        { datetime, fishId, pondId: pondOriginId, action: 'OUT', quantity, notes },
        { datetime, fishId, pondId: pondDestId, action: 'IN', quantity, notes },
      ],
    })
    res.status(StatusCodes.OK).json({ count })
  },
}
