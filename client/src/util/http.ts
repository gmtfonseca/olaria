import axios, { AxiosResponse } from 'axios'
import store from '@/store'

import { HttpErrorData } from '@/data/types'

export class HttpError extends Error {
  constructor(readonly data: HttpErrorData) {
    super(data.title)
  }
}

export class HttpService {
  readonly url: string
  constructor(readonly host: string) {
    this.url = `${this.host}/api`
  }

  async get<ParamsType, ResponseType>(
    endpoint: string,
    params?: ParamsType
  ): Promise<AxiosResponse<ResponseType>> {
    const fn = async () => {
      const res = await axios.get(`${this.url}/${endpoint}`, {
        params,
        headers: { Authorization: store.getters.token },
      })
      return res as AxiosResponse<ResponseType>
    }
    return handleHttpError(fn)
  }

  async post<DataType, ResponseType>(
    endpoint: string,
    data: DataType
  ): Promise<AxiosResponse<ResponseType>> {
    const fn = async () => {
      const res = await axios.post(`${this.url}/${endpoint}`, data, {
        headers: { Authorization: store.getters.token },
      })
      return res as AxiosResponse<ResponseType>
    }
    return handleHttpError(fn)
  }

  async put<DataType, ResponseType>(
    endpoint: string,
    data: DataType
  ): Promise<AxiosResponse<ResponseType>> {
    const fn = async () => {
      const res = await axios.put(`${this.url}/${endpoint}`, data, {
        headers: { Authorization: store.getters.token },
      })
      return res as AxiosResponse<ResponseType>
    }
    return handleHttpError(fn)
  }

  async patch<DataType, ResponseType>(
    endpoint: string,
    data: DataType
  ): Promise<AxiosResponse<ResponseType>> {
    const fn = async () => {
      const res = await axios.patch(`${this.url}/${endpoint}`, data, {
        headers: { Authorization: store.getters.token },
      })
      return res as AxiosResponse<ResponseType>
    }
    return handleHttpError(fn)
  }

  async delete<ResponseType>(
    endpoint: string
  ): Promise<AxiosResponse<ResponseType>> {
    const fn = async () => {
      const res = await axios.delete(`${this.url}/${endpoint}`, {
        headers: { Authorization: store.getters.token },
      })
      return res as AxiosResponse<ResponseType>
    }
    return handleHttpError(fn)
  }
}

async function handleHttpError<ResponseType>(
  fn: () => Promise<AxiosResponse<ResponseType>>
) {
  try {
    const res = await fn()
    return res
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (!e.response) {
        throw new HttpError({
          title: 'Erro de conexão',
          detail: 'Não foi possível se conectar com o servidor.',
        })
      } else {
        throw new HttpError(e.response.data)
      }
    } else {
      throw e
    }
  }
}

export const httpService = new HttpService(process.env.VUE_APP_URL)
