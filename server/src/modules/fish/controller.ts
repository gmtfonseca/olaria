import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'

import prisma from '@/lib/prisma-client'
import { PaginationInput } from '@/types'
import { prismaDefaults } from '@/config/defaults'

export default {
  async detail(req: Request, res: Response): Promise<void> {
    const fishId = Number(req.params.fishId)
    const fish = await prisma.fish.findUnique({
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
        id: fishId,
      },
    })
    res.status(StatusCodes.OK).json(fish)
  },
  async list(req: Request, res: Response): Promise<void> {
    const { name, inactive, skip, take } = req.query

    const where: Prisma.FishWhereInput = {
      name: name != null ? { contains: String(name) } : undefined,
      inactive: inactive != null ? Boolean(inactive === 'true') : undefined,
    }

    const pagination: PaginationInput = {
      skip: skip != null ? Number(skip) : undefined,
      take: take != null ? Number(take) : prismaDefaults.take,
    }

    const fishes = await prisma.fish.findMany({
      ...pagination,
      where,
      orderBy: [
        {
          name: 'asc',
        },
      ],
    })
    res.status(StatusCodes.OK).json(fishes)
  },
  async create(req: Request, res: Response): Promise<void> {
    const fish = await prisma.fish.create({ data: { ...req.body, createdById: req.user?.id } })
    res.status(StatusCodes.OK).json(fish)
  },
  async update(req: Request, res: Response): Promise<void> {
    const fishId = Number(req.params.fishId)
    const fish = await prisma.fish.update({ where: { id: fishId }, data: { ...req.body, modifiedById: req.user?.id } })
    res.status(StatusCodes.OK).json(fish)
  },
  async delete(req: Request, res: Response): Promise<void> {
    const fishId = Number(req.params.fishId)
    const fish = await prisma.fish.delete({
      where: { id: fishId },
    })
    res.status(StatusCodes.OK).json(fish)
  },
}
