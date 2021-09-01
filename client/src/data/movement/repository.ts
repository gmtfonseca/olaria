import {
  GetMovementsParams,
  CreateMovementParams,
  Movement,
  MovementPopulated,
  MovementJSON,
  MovementPopulatedJSON,
} from '@/data/movement/types'
import movementDeserializer from '@/data/movement/deserializer'
import { HttpService } from '@/util/http'

export default class {
  constructor(private readonly httpService: HttpService) {}

  async getMovements(
    params?: GetMovementsParams
  ): Promise<MovementPopulated[]> {
    const res = await this.httpService.get<
      GetMovementsParams,
      MovementPopulatedJSON[]
    >('movements', params)
    return res.data.map((json) => movementDeserializer.fromPopulatedJSON(json))
  }

  async getMovement(movementId: number): Promise<MovementPopulated> {
    const res = await this.httpService.get<null, MovementPopulatedJSON>(
      `movements/${movementId}`
    )
    return movementDeserializer.fromPopulatedJSON(res.data)
  }

  async createMovement(params: CreateMovementParams): Promise<Movement> {
    const res = await this.httpService.post<CreateMovementParams, MovementJSON>(
      'movements',
      params
    )
    return movementDeserializer.fromJSON(res.data)
  }

  async updateMovement(
    movementId: number,
    data: Partial<Movement>
  ): Promise<Movement> {
    const res = await this.httpService.patch<Partial<Movement>, MovementJSON>(
      `movements/${movementId}`,
      data
    )
    return movementDeserializer.fromJSON(res.data)
  }

  async deleteMovement(movementId: number): Promise<Movement> {
    const res = await this.httpService.delete<MovementJSON>(
      `movements/${movementId}`
    )
    return movementDeserializer.fromJSON(res.data)
  }
}
