import {
  GetInventoriesParams,
  GetInventorySummaryParams,
  InventoryFishSummary,
  InventoryPondSummary,
  InventoryPopulated,
} from '@/data/inventory/types'
import { HttpService } from '@/util/http'

export default class {
  constructor(private readonly httpService: HttpService) {}

  async getInventories(
    params?: GetInventoriesParams
  ): Promise<InventoryPopulated[]> {
    const res = await this.httpService.get<
      GetInventoriesParams,
      InventoryPopulated[]
    >('inventories', params)
    return res.data
  }

  async getPondsSummary(
    params?: GetInventorySummaryParams
  ): Promise<InventoryPondSummary[]> {
    const res = await this.httpService.get<
      GetInventorySummaryParams,
      InventoryPondSummary[]
    >('inventories/summary/ponds', params)
    return res.data
  }

  async getPondSummary(pondId: number): Promise<InventoryPondSummary> {
    const res = await this.httpService.get<number, InventoryPondSummary>(
      `inventories/summary/ponds/${pondId}`
    )
    return res.data
  }

  async getFishesSummary(
    params?: GetInventorySummaryParams
  ): Promise<InventoryFishSummary[]> {
    const res = await this.httpService.get<
      GetInventorySummaryParams,
      InventoryFishSummary[]
    >('inventories/summary/fishes', params)
    return res.data
  }

  async getFishSummary(fishId: number): Promise<InventoryFishSummary> {
    const res = await this.httpService.get<number, InventoryFishSummary>(
      `inventories/summary/fishes/${fishId}`
    )
    return res.data
  }

  async getInventory(inventoryId: number): Promise<InventoryPopulated> {
    const res = await this.httpService.get<null, InventoryPopulated>(
      `inventories/${inventoryId}`
    )
    return res.data
  }

  async drainPond(pondId: number): Promise<number> {
    const res = await this.httpService.put<null, number>(
      `inventories/drain/${pondId}`,
      null
    )
    return res.data
  }
}
