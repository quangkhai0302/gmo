export interface Student {
  id: number
  code: string
  name: string
  birthday: string // format: YYYY/MM/DD
  address: string
  score: number
}

export interface SearchForm {
  code: string
  name: string
  birthday: string
}

export interface SortState {
  field: keyof Student | null
  order: 'asc' | 'desc' | null
}
