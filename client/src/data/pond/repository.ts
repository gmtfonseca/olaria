import { GetPondsParams, CreatePondParams, Pond } from '@/data/pond/types'
import { HttpService } from '@/util/http'

export default class {
  constructor(private readonly httpService: HttpService) {}

  async getPonds(params?: GetPondsParams): Promise<Pond[]> {
    const res = await this.httpService.get<GetPondsParams, Pond[]>(
      'ponds',
      params
    )
    return res.data
  }

  async getPond(pondId: number): Promise<Pond> {
    const res = await this.httpService.get<null, Pond>(`ponds/${pondId}`)
    return res.data
  }

  async createPond(params: CreatePondParams): Promise<Pond> {
    const res = await this.httpService.post<CreatePondParams, Pond>(
      'ponds',
      params
    )
    return res.data
  }

  async updatePond(pondId: number, data: Partial<Pond>): Promise<Pond> {
    const res = await this.httpService.patch<Partial<Pond>, Pond>(
      `ponds/${pondId}`,
      data
    )
    return res.data
  }

  async deletePond(pondId: number): Promise<Pond> {
    const res = await this.httpService.delete<Pond>(`ponds/${pondId}`)
    return res.data
  }
}
