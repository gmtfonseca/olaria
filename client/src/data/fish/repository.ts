import { GetFishesParams, CreateFishParams, Fish } from '@/data/fish/types'
import { HttpService } from '@/util/http'

export default class {
  constructor(private readonly httpService: HttpService) {}

  async getFishes(params?: GetFishesParams): Promise<Fish[]> {
    const res = await this.httpService.get<GetFishesParams, Fish[]>(
      'fishes',
      params
    )
    return res.data
  }

  async getFish(fishId: number): Promise<Fish> {
    const res = await this.httpService.get<null, Fish>(`fishes/${fishId}`)
    return res.data
  }

  async createFish(params: CreateFishParams): Promise<Fish> {
    const res = await this.httpService.post<CreateFishParams, Fish>(
      'fishes',
      params
    )
    return res.data
  }

  async updateFish(fishId: number, data: Partial<Fish>): Promise<Fish> {
    const res = await this.httpService.patch<Partial<Fish>, Fish>(
      `fishes/${fishId}`,
      data
    )
    return res.data
  }

  async deleteFish(fishId: number): Promise<Fish> {
    const res = await this.httpService.delete<Fish>(`fishes/${fishId}`)
    return res.data
  }
}
