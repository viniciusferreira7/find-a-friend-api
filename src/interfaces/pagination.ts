export interface PaginationRequest {
  page?: number
  perPage?: number
  paginationDisabled?: boolean
}

export interface PaginationResponse<T> {
  count: number
  next: number | null
  previous: number | null
  page: number
  totalPages: number
  perPage: number
  paginationDisabled: boolean
  results: T[]
}
