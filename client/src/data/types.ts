export interface Pagination {
  skip?: number
  take?: number
}

export interface HttpErrorData {
  title: string
  detail?: string
  status?: number
  type?: string
  code?: string
  meta?: Record<string, unknown>
}

export type NavigationOpts = 'menu' | 'back' | 'none'

export interface Focusable {
  focus: () => void
}

export interface SearchNavBarMethods {
  closeSearch: () => void
}

export interface VueComponent {
  $el: HTMLElement
}

export interface AutoCompleteEvent extends Event {
  query: string
}

export interface InfiniteLoadingStateChanger {
  loaded: () => void
  complete: () => void
  error: () => void
}
