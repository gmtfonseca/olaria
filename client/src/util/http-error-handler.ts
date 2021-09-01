import { StatusCodes } from 'http-status-codes'

import { HttpErrorData } from '@/data/types'
import { ToastMethods } from '@/util/toast'
import router from '@/router'

export interface HttpErrorHandler {
  handleHttpError: (err: HttpErrorData) => void
}

export const useHttpErrorHandler = (toast: ToastMethods): HttpErrorHandler => {
  const handleHttpError = (err: HttpErrorData) => {
    console.log(err)
    toast.showError(err)

    if (err.status === StatusCodes.UNAUTHORIZED) {
      router.push('/signin')
    }
  }

  return { handleHttpError }
}
