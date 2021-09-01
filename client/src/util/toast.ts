import { useToast as usePrimeToast } from 'primevue/usetoast'

const DEFAULT_LIFE = 3000

export interface ToastParams {
  title: string
  detail?: string
  life?: number
}

export interface ToastMethods {
  showSuccess: (params: ToastParams) => void
  showInfo: (params: ToastParams) => void
  showError: (params: ToastParams) => void
  showWarning: (params: ToastParams) => void
}

export const useToast = (): ToastMethods => {
  const toast = usePrimeToast()

  const showSuccess = ({ title, detail, life = DEFAULT_LIFE }: ToastParams) => {
    toast.add({
      severity: 'success',
      summary: title,
      detail,
      life,
    })
  }

  const showInfo = ({ title, detail, life = DEFAULT_LIFE }: ToastParams) => {
    toast.add({
      severity: 'info',
      summary: title,
      detail,
      life,
    })
  }

  const showError = ({ title, detail, life = DEFAULT_LIFE }: ToastParams) => {
    toast.add({
      severity: 'error',
      summary: title,
      detail,
      life,
    })
  }

  const showWarning = ({ title, detail, life = DEFAULT_LIFE }: ToastParams) => {
    toast.add({
      severity: 'warning',
      summary: title,
      detail,
      life,
    })
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  }
}
