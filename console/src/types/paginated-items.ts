export type PaginatedItems<T> = {
  items: T[],
  length: number
  total: number
  page: number
  size: number
}
