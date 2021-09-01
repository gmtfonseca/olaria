import { HttpService } from '@/util/http'
import { CreateSessionParams } from '@/data/session/types'

export default class {
  constructor(private readonly httpService: HttpService) {}

  async createSession(params: CreateSessionParams): Promise<string> {
    const res = await this.httpService.put<CreateSessionParams, string>(
      'sessions',
      params
    )
    return res.data
  }
}
