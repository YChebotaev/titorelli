import { PaginatedItems as IPaginatedItems } from '@/types/paginated-items'

export class PaginatedItems<T> implements IPaginatedItems<T> {
  constructor(
    public items: T[],
    public total: number,
    public page: number,
    public size: number
  ) { }

  get length() {
    return this.items.length
  }

  toJSON() {
    return {
      items: this.items,
      total: this.total,
      page: this.page,
      size: this.size,
      length: this.items.length
    }
  }
}
