import { httpService } from '@/util/http'
import FishRepository from '@/data/fish/repository'
import PondRepository from '@/data/pond/repository'
import MovementRepository from '@/data/movement/repository'
import InventoryRepository from '@/data/inventory/repository'
import TransferRepository from '@/data/transfer/repository'
import { focus, uppercase } from '@/directives'

import {
  HttpServiceKey,
  FishRepositoryKey,
  PondRepositoryKey,
  MovementRepositoryKey,
  InventoryRepositoryKey,
  TransferRepositoryKey,
} from '@/data/injectables'

import { App } from 'vue'
import { MovementAction } from '@/data/movement/types'

export default {
  install: (app: App<Element>): void => {
    app.provide(HttpServiceKey, httpService)
    app.provide(FishRepositoryKey, new FishRepository(httpService))
    app.provide(PondRepositoryKey, new PondRepository(httpService))
    app.provide(MovementRepositoryKey, new MovementRepository(httpService))
    app.provide(InventoryRepositoryKey, new InventoryRepository(httpService))
    app.provide(TransferRepositoryKey, new TransferRepository(httpService))

    app.directive('focus', focus)
    app.directive('uppercase', uppercase)

    app.config.globalProperties.$filters = {
      date(date: Date, locale = 'pt-BR') {
        return date.toLocaleDateString(locale)
      },
      movementAction(action: MovementAction) {
        return action === 'IN' ? 'Entrada' : 'Saída'
      },
    }
  },
}
