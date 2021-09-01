import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'

import prisma from '@/lib/prisma-client'
import { PaginationInput } from '@/types'
import { prismaDefaults } from '@/config/defaults'

export default {
  async detail(req: Request, res: Response): Promise<void> {
    const pondId = Number(req.params.pondId)
    const pond = await prisma.pond.findUnique({
      select: {
        id: true,
        name: true,
        inactive: true,
        createdBy: {
          select: { id: true, name: true },
        },
        modifiedBy: {
          select: { id: true, name: true },
        },
      },
      where: {
        id: pondId,
      },
    })
    res.status(StatusCodes.OK).json(pond)
  },
  async list(req: Request, res: Response): Promise<void> {
    const { name, inactive, skip, take } = req.query

    const where: Prisma.PondWhereInput = {
      name: name != null ? { contains: String(name) } : undefined,
      inactive: inactive != null ? Boolean(inactive === 'true') : undefined,
    }

    const pagination: PaginationInput = {
      skip: skip != null ? Number(skip) : undefined,
      take: take != null ? Number(take) : prismaDefaults.take,
    }

    const ponds = await prisma.pond.findMany({
      ...pagination,
      where,
      orderBy: [
        {
          name: 'asc',
        },
      ],
    })

    res.status(StatusCodes.OK).json(ponds)
  },
  async create(req: Request, res: Response): Promise<void> {
    const pond = await prisma.pond.create({ data: { ...req.body, createdById: req.user?.id } })
    res.status(StatusCodes.OK).json(pond)
  },
  async update(req: Request, res: Response): Promise<void> {
    const pondId = Number(req.params.pondId)
    const pond = await prisma.pond.update({ where: { id: pondId }, data: { ...req.body, modifiedById: req.user?.id } })
    res.status(StatusCodes.OK).json(pond)
  },
  async delete(req: Request, res: Response): Promise<void> {
    const pondId = Number(req.params.pondId)
    const pond = await prisma.pond.delete({
      where: { id: pondId },
    })
    res.status(StatusCodes.OK).json(pond)
  },
}
