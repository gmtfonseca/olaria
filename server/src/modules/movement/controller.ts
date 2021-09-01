import { Request, Response } from 'express'
import { Prisma, MovementAction } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import moment from 'moment'

import prisma from '@/lib/prisma-client'
import { PaginationInput } from '@/types'
import { prismaDefaults } from '@/config/defaults'
import { isPopulated, unpopulate } from '@/modules/movement/lib'

export default {
  async detail(req: Request, res: Response): Promise<void> {
    const movementId = Number(req.params.movementId)
    const movement = await prisma.movement.findUnique({
      select: {
        id: true,
        datetime: true,
        quantity: true,
        action: true,
        notes: true,
        fish: true,
        pond: true,
        createdBy: {
          select: { id: true, name: true },
        },
        modifiedBy: {
          select: { id: true, name: true },
        },
      },
      where: {
        id: movementId,
      },
    })
    res.status(StatusCodes.OK).json(movement)
  },
  async list(req: Request, res: Response): Promise<void> {
    const { date, action, fishId, fishName, pondId, skip, take } = req.query
    const where: Prisma.MovementWhereInput = {
      fish:
        fishName != null
          ? {
              name: {
                contains: String(fishName),
              },
            }
          : undefined,
      action: action != null ? (action as MovementAction) : undefined,
      fishId: fishId != null ? Number(fishId) : undefined,
      pondId: pondId != null ? Number(pondId) : undefined,
    }
    if (date) {
      const parsedDate = moment(String(date))
      const gte = parsedDate.startOf('day').toDate()
      const lte = parsedDate.endOf('day').toDate()
      where.datetime = { gte, lte }
    }

    const pagination: PaginationInput = {
      skip: skip != null ? Number(skip) : undefined,
      take: take != null ? Number(take) : prismaDefaults.take,
    }

    const movements = await prisma.movement.findMany({
      ...pagination,
      where,
      select: {
        id: true,
        datetime: true,
        quantity: true,
        action: true,
        fish: true,
        pond: true,
        notes: true,
      },
      orderBy: [
        {
          datetime: 'desc',
        },
      ],
    })

    res.status(StatusCodes.OK).json(movements)
  },
  async create(req: Request, res: Response): Promise<void> {
    let data = req.body
    if (isPopulated(req.body)) {
      data = unpopulate(req.body)
    }
    const movement = await prisma.movement.create({ data: { ...data, createdById: req.user?.id } })
    res.status(StatusCodes.OK).json(movement)
  },
  async update(req: Request, res: Response): Promise<void> {
    const movementId = Number(req.params.movementId)
    let data = req.body
    if (isPopulated(req.body)) {
      data = unpopulate(req.body)
    }
    const movement = await prisma.movement.update({
      where: { id: movementId },
      data: { ...data, modifiedById: req.user?.id },
    })
    res.status(StatusCodes.OK).json(movement)
  },
  async delete(req: Request, res: Response): Promise<void> {
    const movementId = Number(req.params.movementId)
    const movement = await prisma.movement.delete({
      where: { id: movementId },
    })
    res.status(StatusCodes.OK).json(movement)
  },
}
