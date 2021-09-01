import { Request, Response } from 'express'
import { MovementAction, Prisma } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import moment from 'moment'

import prisma from '@/lib/prisma-client'
import { PaginationInput } from '@/types'
import { prismaDefaults } from '@/config/defaults'
import { InventoryPondSummary, InventoryFishSummary } from '@/modules/inventory/types'

export default {
  async detail(req: Request, res: Response): Promise<void> {
    const inventoryId = Number(req.params.inventoryId)
    const inventory = await prisma.inventory.findUnique({
      where: {
        id: inventoryId,
      },
      select: {
        id: true,
        quantity: true,
        fish: true,
        pond: true,
      },
    })
    res.status(StatusCodes.OK).json(inventory)
  },
  async list(req: Request, res: Response): Promise<void> {
    const { fishId, fishName, pondId, fishInactive, skip, take } = req.query

    const where: Prisma.InventoryWhereInput = {
      fish: {
        name:
          fishName != null
            ? {
                contains: String(fishName),
              }
            : undefined,
        inactive: fishInactive != null ? Boolean(fishInactive === 'true') : undefined,
      },
      fishId: fishId != null ? Number(fishId) : undefined,
      pondId: pondId != null ? Number(pondId) : undefined,
    }

    const pagination: PaginationInput = {
      skip: skip != null ? Number(skip) : undefined,
      take: take != null ? Number(take) : prismaDefaults.take,
    }

    const inventories = await prisma.inventory.findMany({
      ...pagination,
      where,
      select: {
        id: true,
        quantity: true,
        fish: true,
        pond: true,
      },
      orderBy: [
        {
          pond: {
            name: 'asc',
          },
        },
        {
          fish: {
            name: 'asc',
          },
        },
      ],
    })

    res.status(StatusCodes.OK).json(inventories)
  },
  async listPondsSummary(req: Request, res: Response): Promise<void> {
    const { name } = req.query
    const likeName = name ? Prisma.sql`WHERE p.name LIKE ${'%' + name + '%'}` : Prisma.empty
    const rows = await prisma.$queryRaw<InventoryPondSummary[]>`select pond_id as id,
              p.name,
              sum(quantity) as quantity
        from inventories i
        inner join ponds p
          on i.pond_id = p.id
        ${likeName}
        group by pond_id
        order by p.name`

    const inventories = rows.map((row) => ({
      pond: {
        id: row.id,
        name: row.name,
      },
      quantity: row.quantity,
    }))

    res.status(StatusCodes.OK).json(inventories)
  },
  async listFishesSummary(req: Request, res: Response): Promise<void> {
    const { name } = req.query
    const likeName = name ? Prisma.sql`WHERE f.name LIKE ${'%' + name + '%'}` : Prisma.empty
    const rows = await prisma.$queryRaw<InventoryFishSummary[]>`
      select fish_id as id,
              f.name,
              sum(quantity) as quantity
        from inventories i
        inner join fishes f
          on i.fish_id = f.id
        ${likeName}
        group by fish_id
        order by f.name`

    const inventories = rows.map((row) => ({
      fish: {
        id: row.id,
        name: row.name,
      },
      quantity: row.quantity,
    }))

    res.status(StatusCodes.OK).json(inventories)
  },
  async detailPondSummary(req: Request, res: Response): Promise<void> {
    const pondId = Number(req.params.pondId)
    const pond = await prisma.pond.findUnique({ where: { id: pondId } })
    const aggregations = await prisma.inventory.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        pondId,
      },
    })
    res.status(StatusCodes.OK).json({
      pond,
      quantity: aggregations._sum?.quantity || 0,
    })
  },
  async detailFishSummary(req: Request, res: Response): Promise<void> {
    const fishId = Number(req.params.fishId)
    const fish = await prisma.fish.findUnique({ where: { id: fishId } })
    const aggregations = await prisma.inventory.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        fishId,
      },
    })
    res.status(StatusCodes.OK).json({
      fish,
      quantity: aggregations._sum?.quantity || 0,
    })
  },
  async drainPond(req: Request, res: Response): Promise<void> {
    const pondId = Number(req.params.pondId)
    const inventories = await prisma.inventory.findMany({
      where: {
        pondId,
        quantity: {
          gt: 0,
        },
      },
    })
    const data = inventories.map((record) => ({
      datetime: moment().toDate(),
      fishId: record.fishId,
      pondId: record.pondId,
      action: MovementAction.OUT,
      quantity: record.quantity,
      notes: 'Esvaziamento de açude.',
    }))

    const createdCount = await prisma.movement.createMany({
      data,
    })
    res.status(StatusCodes.OK).json(createdCount)
  },
}
