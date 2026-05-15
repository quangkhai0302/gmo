import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref, watch } from 'vue'
import StudentTable from './StudentTable.vue'
import type { SortState, Student, StudentSortField } from '../../types/student'

const sampleStudents: Student[] = [
  { id: 1, code: 'STU001', name: 'Nguyen Van A', birthday: '2002-03-21', address: 'Ha Noi', score: 8.7 },
  { id: 2, code: 'STU002', name: 'Tran Thi B', birthday: '2001-11-05', address: 'Da Nang', score: 7.4 },
  { id: 3, code: 'STU003', name: 'Le Quang C', birthday: '2003-08-17', address: null, score: 5.8 },
  { id: 4, code: 'STU004', name: 'Pham Minh D', birthday: null, address: 'Ho Chi Minh', score: 4.9 },
  { id: 5, code: 'STU005', name: 'Vo Thu E', birthday: '2002-01-30', address: 'Can Tho', score: null },
]

const meta = {
  title: 'ScreenList/StudentTable',
  component: StudentTable,
  tags: ['autodocs'],
  args: {
    students: sampleStudents,
    sort: {
      field: null,
      order: null,
    } as SortState,
    startIndex: 0,
  },
  parameters: {
    layout: 'padded',
  },
  render: (args) => ({
    components: { StudentTable },
    setup() {
      const currentSort = ref<SortState>({ ...args.sort })
      const latestAction = ref('No action yet')

      watch(
        () => args.sort,
        (value) => {
          currentSort.value = { ...value }
        },
        { deep: true }
      )

      const sortedStudents = computed(() => {
        const rows = [...args.students]
        const { field, order } = currentSort.value

        if (!field || !order) {
          return rows
        }

        rows.sort((a, b) => {
          const left = normalizeValue(a, field)
          const right = normalizeValue(b, field)
          const result = left > right ? 1 : left < right ? -1 : 0
          return order === 'asc' ? result : -result
        })

        return rows
      })

      const onSort = (field: StudentSortField) => {
        const current = currentSort.value
        if (current.field !== field) {
          currentSort.value = { field, order: 'asc' }
          return
        }

        if (current.order === 'asc') {
          currentSort.value = { field, order: 'desc' }
          return
        }

        if (current.order === 'desc') {
          currentSort.value = { field: null, order: null }
          return
        }

        currentSort.value = { field, order: 'asc' }
      }

      const onRequestEdit = (id: number) => {
        latestAction.value = `Edit student id: ${id}`
      }

      const onRequestDelete = (student: Student) => {
        latestAction.value = `Delete student: ${student.name} (${student.code})`
      }

      return { args, currentSort, sortedStudents, latestAction, onSort, onRequestEdit, onRequestDelete }
    },
    template: `
      <div style="width: 1080px; max-width: 100%;">
        <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px;">{{ latestAction }}</p>
        <StudentTable
          :students="sortedStudents"
          :sort="currentSort"
          :startIndex="args.startIndex"
          @sort="onSort"
          @request-edit="onRequestEdit"
          @request-delete="onRequestDelete"
        />
      </div>
    `,
  }),
} satisfies Meta<typeof StudentTable>

function normalizeValue(student: Student, field: StudentSortField): number | string {
  if (field === 'id') return student.id
  if (field === 'score') return student.score ?? -1
  if (field === 'birthday') return student.birthday ?? ''
  if (field === 'code') return student.code
  return student.name
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: {
    students: [],
  },
}
