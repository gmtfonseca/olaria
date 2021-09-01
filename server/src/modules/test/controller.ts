import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { MovementAction } from '@prisma/client'

import prisma from '@/lib/prisma-client'
import fixture from '@/modules/test/fixture'

export default {
  async put(req: Request, res: Response): Promise<void> {
    await prisma.movement.deleteMany()
    await prisma.inventory.deleteMany()
    await prisma.pond.deleteMany()
    await prisma.fish.deleteMany()
    await prisma.user.deleteMany()

    await prisma.user.create({ data: fixture.user })
    await prisma.pond.createMany({ data: fixture.ponds })
    await prisma.fish.createMany({ data: fixture.fishes })

    const movementsData = await Promise.all(
      fixture.movements.map(async (movement) => {
        const fish = await prisma.fish.findUnique({ where: { name: movement.fishId } })
        const pond = await prisma.pond.findUnique({ where: { name: movement.pondId } })

        if (!fish) {
          throw new Error('Invalid fish fixture.')
        }
        if (!pond) {
          throw new Error('Invalid pond fixture.')
        }

        return {
          ...movement,
          action: movement.action as MovementAction,
          fishId: fish.id,
          pondId: pond.id,
        }
      }),
    )
    await prisma.movement.createMany({ data: movementsData })

    res.status(StatusCodes.OK).json({ success: true })
  },
}
