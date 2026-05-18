<template>
  <div class="table-wrapper">
    <div class="table-scroll">
      <table class="data-table">
        <thead>
          <tr>
            <th class="th th--select">
              <input type="checkbox" :checked="allSelected" :disabled="!students.length || loading" @change="toggleAll" />
            </th>
            <th class="th th--no" @click="emitSort('id')">
              <div class="th-inner">STT <SortIcon field="id" :sort="sort" /></div>
            </th>
            <th class="th" @click="emitSort('code')">
              <div class="th-inner">Mã sinh viên <SortIcon field="code" :sort="sort" /></div>
            </th>
            <th class="th" @click="emitSort('name')">
              <div class="th-inner">Họ tên <SortIcon field="name" :sort="sort" /></div>
            </th>
            <th class="th" @click="emitSort('birthday')">
              <div class="th-inner">Ngày sinh <SortIcon field="birthday" :sort="sort" /></div>
            </th>
            <th class="th th--address">
              <div class="th-inner">Liên hệ</div>
            </th>
            <th class="th th--score" @click="emitSort('score')">
              <div class="th-inner">Điểm TB <SortIcon field="score" :sort="sort" /></div>
            </th>
            <th class="th th--actions">
              <div class="th-inner">Thao tác</div>
            </th>
          </tr>
        </thead>

        <tbody>
          <template v-if="loading">
            <tr v-for="row in 6" :key="row" class="tr">
              <td v-for="cell in 8" :key="cell" class="td">
                <span class="skeleton"></span>
              </td>
            </tr>
          </template>

          <template v-else-if="students.length > 0">
            <tr v-for="(student, index) in students" :key="student.id" class="tr">
              <td class="td td--select">
                <input type="checkbox" :checked="selectedIds.includes(student.id)" @change="toggleRow(student.id)" />
              </td>
              <td class="td td--no">{{ startIndex + index + 1 }}</td>
              <td class="td">
                <span class="code-badge">{{ student.code }}</span>
              </td>
              <td class="td td--name">
                <div class="student-identity">
                  <span>{{ initials(student.name) }}</span>
                  <div>
                    <strong>{{ student.name }}</strong>
                    <small>Hồ sơ đang hoạt động</small>
                  </div>
                </div>
              </td>
              <td class="td">{{ formatBirthday(student.birthday) }}</td>
              <td class="td td--address">
                <span>{{ formatAddress(student.address) }}</span>
              </td>
              <td class="td td--score">
                <span :class="['score-pill', scoreClass(student.score)]">
                  {{ formatScore(student.score) }}
                </span>
              </td>
              <td class="td td--actions">
                <div class="row-actions">
                  <button class="row-actions__trigger" type="button" title="Mở thao tác" @click="toggleMenu(student.id)">
                    <i class="pi pi-ellipsis-v"></i>
                  </button>
                  <div
                    v-if="openMenuId === student.id"
                    :class="['row-actions__menu', { 'row-actions__menu--up': shouldOpenMenuUp(index) }]"
                  >
                    <button type="button" @click="handleEdit(student.id)">
                      <i class="pi pi-pencil"></i>
                      Chỉnh sửa
                    </button>
                    <button class="row-actions__danger" type="button" @click="handleDelete(student)">
                      <i class="pi pi-trash"></i>
                      Xóa hồ sơ
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </template>

          <tr v-else>
            <td colspan="8" class="empty-cell">
              <div class="empty-state">
                <div class="empty-state__icon">
                  <i class="pi pi-search"></i>
                </div>
                <h3>Không có dữ liệu</h3>
                <p>Thử thay đổi bộ lọc hoặc tạo hồ sơ sinh viên mới.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Student, SortState, StudentSortField } from '../../types/student'
import SortIcon from '../../components/screenList/SortIcon.vue'

const props = withDefaults(defineProps<{
  students: Student[]
  sort: SortState
  startIndex: number
  loading?: boolean
  selectedIds?: number[]
}>(), {
  loading: false,
  selectedIds: () => [],
})

const emit = defineEmits<{
  sort: [field: StudentSortField]
  requestEdit: [id: number]
  requestDelete: [student: Student]
  selectionChange: [ids: number[]]
}>()

const openMenuId = ref<number | null>(null)
const allSelected = computed(() => props.students.length > 0 && props.students.every((student) => props.selectedIds.includes(student.id)))

function emitSort(field: StudentSortField) {
  if (!props.loading) emit('sort', field)
}

function toggleAll(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  emit('selectionChange', checked ? props.students.map((student) => student.id) : [])
}

function toggleRow(id: number) {
  const next = props.selectedIds.includes(id)
    ? props.selectedIds.filter((selectedId) => selectedId !== id)
    : [...props.selectedIds, id]
  emit('selectionChange', next)
}

function toggleMenu(id: number) {
  openMenuId.value = openMenuId.value === id ? null : id
}

function shouldOpenMenuUp(index: number) {
  return index >= Math.max(0, props.students.length - 2)
}

function handleEdit(id: number) {
  openMenuId.value = null
  emit('requestEdit', id)
}

function handleDelete(student: Student) {
  openMenuId.value = null
  emit('requestDelete', student)
}

function scoreClass(score: number | null | undefined) {
  if (score == null) return 'score-pill--unknown'
  if (score >= 8.5) return 'score-pill--excellent'
  if (score >= 7.0) return 'score-pill--good'
  if (score >= 5.5) return 'score-pill--average'
  return 'score-pill--poor'
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function formatBirthday(value: string | null | undefined) {
  if (!value) return '--/--/----'
  const parts = value.split(/[/-]/)
  if (parts.length !== 3) return value
  const [year, month, day] = parts
  if (year.length === 4) return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
  return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[2]}`
}

function formatAddress(value: string | null | undefined) {
  return value?.trim() ? value : 'Chưa cập nhật'
}

function formatScore(score: number | null | undefined) {
  return score == null ? 'N/A' : score.toFixed(1)
}
</script>

<style scoped>
.table-wrapper {
  background: var(--color-surface);
}

.table-scroll {
  max-height: 680px;
  overflow: auto;
}

.data-table {
  width: 100%;
  min-width: 1040px;
  border-collapse: separate;
  border-spacing: 0;
}

.th {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 13px 16px;
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: var(--font-weight-bold);
  text-align: left;
  text-transform: uppercase;
  cursor: pointer;
  user-select: none;
}

.th:hover {
  color: var(--color-text);
  background: #f1f5f9;
}

.th--select,
.td--select {
  width: 48px;
  text-align: center;
}

.th--no {
  width: 76px;
}

.th--address {
  width: 240px;
}

.th--score {
  width: 116px;
}

.th--actions {
  width: 96px;
  text-align: center;
  cursor: default;
}

.th--actions:hover {
  color: var(--color-text-muted);
  background: var(--color-background);
}

.th-inner {
  display: flex;
  align-items: center;
  gap: 6px;
}

.th--actions .th-inner {
  justify-content: center;
}

.tr {
  transition: background var(--transition-fast);
}

.tr:hover {
  background: var(--color-primary-subtle);
}

.td {
  height: 64px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 14px;
  vertical-align: middle;
}

.td--no {
  color: var(--color-text-muted);
  font-weight: var(--font-weight-semibold);
}

.td--score,
.td--actions {
  text-align: center;
}

input[type='checkbox'] {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary);
  cursor: pointer;
}

.student-identity {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.student-identity > span {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-round);
  background: var(--color-primary-subtle);
  color: var(--color-primary-hover);
  font-size: 12px;
  font-weight: var(--font-weight-bold);
  flex: 0 0 auto;
}

.student-identity strong,
.student-identity small {
  display: block;
}

.student-identity strong {
  color: var(--color-text);
  font-size: 14px;
}

.student-identity small {
  margin-top: 2px;
  color: var(--color-text-muted);
  font-size: 12px;
}

.code-badge {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: var(--radius-md);
  background: var(--color-surface-muted);
  color: var(--color-primary-hover);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  font-weight: var(--font-weight-bold);
}

.td--address span {
  display: -webkit-box;
  overflow: hidden;
  color: var(--color-text-secondary);
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.score-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 54px;
  min-height: 28px;
  padding: 0 10px;
  border-radius: var(--radius-round);
  font-size: 12px;
  font-weight: var(--font-weight-bold);
}

.score-pill--excellent,
.score-pill--good {
  background: var(--color-success-soft);
  color: #15803d;
}

.score-pill--average {
  background: var(--color-info-soft);
  color: #2563eb;
}

.score-pill--poor {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.score-pill--unknown {
  background: var(--color-surface-muted);
  color: var(--color-text-muted);
}

.row-actions {
  position: relative;
  display: inline-flex;
  justify-content: center;
}

.row-actions__trigger {
  width: 34px;
  height: 34px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.row-actions__trigger:hover {
  background: var(--color-surface-muted);
  color: var(--color-text);
}

.row-actions__menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 5;
  min-width: 154px;
  padding: var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-md);
}

.row-actions__menu--up {
  top: auto;
  bottom: calc(100% + 6px);
}

.row-actions__menu button {
  width: 100%;
  min-height: 36px;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 0 var(--space-md);
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text);
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
}

.row-actions__menu button:hover {
  background: var(--color-surface-muted);
}

.row-actions__menu .row-actions__danger {
  color: var(--color-danger);
}

.empty-cell {
  padding: var(--space-3xl) var(--space-xl);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  text-align: center;
}

.empty-state__icon {
  width: 64px;
  height: 64px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);
  background: var(--color-primary-subtle);
  color: var(--color-primary-hover);
  font-size: 22px;
}

.empty-state h3 {
  margin: var(--space-sm) 0 0;
  font-size: 16px;
}

.empty-state p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.skeleton {
  display: block;
  width: 100%;
  height: 14px;
  border-radius: var(--radius-round);
  background: linear-gradient(90deg, #f1f5f9, #e2e8f0, #f1f5f9);
  background-size: 200% 100%;
  animation: skeleton 1.2s ease-in-out infinite;
}

@keyframes skeleton {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>
