export interface Student {
  id: number
  code: string
  name: string
  birthday: string | null
  address: string | null
  score: number | null
}

export interface SearchForm {
  code: string
  name: string
  birthday: string
}

export type StudentSortField = 'id' | 'code' | 'name' | 'birthday' | 'score'

export interface SortState {
  field: StudentSortField | null
  order: 'asc' | 'desc' | null
}
