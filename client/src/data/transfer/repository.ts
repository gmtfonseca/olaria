import {
  CreateTransferParams,
  CreateTransferResponse,
} from '@/data/transfer/types'
import { HttpService } from '@/util/http'

export default class {
  constructor(private readonly httpService: HttpService) {}

  async create(params: CreateTransferParams): Promise<number> {
    const res = await this.httpService.post<
      CreateTransferParams,
      CreateTransferResponse
    >('transfers', params)
    return res.data.count
  }
}
