import { InjectionKey } from 'vue'

import { HttpService } from '@/util/http'

import FishRepository from '@/data/fish/repository'
import PondRepository from '@/data/pond/repository'
import MovementRepository from '@/data/movement/repository'
import InventoryRepository from '@/data/inventory/repository'
import TransferRepository from '@/data/transfer/repository'

export const HttpServiceKey: InjectionKey<HttpService> = Symbol('HttpService')

export const FishRepositoryKey: InjectionKey<FishRepository> =
  Symbol('FishRepository')
export const PondRepositoryKey: InjectionKey<PondRepository> =
  Symbol('PondRepository')
export const MovementRepositoryKey: InjectionKey<MovementRepository> =
  Symbol('MovementRepository')
export const InventoryRepositoryKey: InjectionKey<InventoryRepository> = Symbol(
  'InventoryRepository'
)
export const TransferRepositoryKey: InjectionKey<TransferRepository> =
  Symbol('TransferRepository')
