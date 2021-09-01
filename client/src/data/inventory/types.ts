import { Pagination } from '@/data/types'
import { Pond } from '@/data/pond/types'
import { Fish } from '@/data/fish/types'

export interface BaseInventory {
  id: number
  quantity: number
}

export interface Inventory extends BaseInventory {
  fishId: number
  pondId: number
}

export interface InventoryPopulated extends BaseInventory {
  fish: Fish
  pond: Pond
}

export interface InventoryPondSummary {
  pond: Pond
  quantity: number
}

export interface InventoryFishSummary {
  fish: Fish
  quantity: number
}

export interface GetInventoriesParams extends Pagination {
  fishId?: number
  fishName?: string
  pondId?: number
  fishInactive?: boolean
  gtZero?: boolean
}

export interface GetInventoryParams {
  inventoryId: string
}

export interface GetInventorySummaryParams {
  name: string
}

export interface InventoryListFilters {
  fish?: Fish
  pond?: Pond
  showInactive?: boolean
}

export interface InventoryListRecord {
  id: number
  name: string
  quantity: number
}
