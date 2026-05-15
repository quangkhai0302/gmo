<template>
  <div class="table-wrapper">
    <div class="table-scroll">
      <table class="data-table">
        <thead>
          <tr>
            <th class="th th--no" @click="emitSort('id')">
              <div class="th-inner">No <SortIcon field="id" :sort="sort" /></div>
            </th>
            <th class="th" @click="emitSort('code')">
              <div class="th-inner">Student Code <SortIcon field="code" :sort="sort" /></div>
            </th>
            <th class="th" @click="emitSort('name')">
              <div class="th-inner">Name <SortIcon field="name" :sort="sort" /></div>
            </th>
            <th class="th" @click="emitSort('birthday')">
              <div class="th-inner">Birthday <SortIcon field="birthday" :sort="sort" /></div>
            </th>
            <th class="th th--address">
              <div class="th-inner">Address</div>
            </th>
            <th class="th th--score" @click="emitSort('score')">
              <div class="th-inner">Score <SortIcon field="score" :sort="sort" /></div>
            </th>
            <th class="th th--actions">
              <div class="th-inner">Actions</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="students.length > 0">
            <tr v-for="(student, index) in students" :key="student.id" class="tr">
              <td class="td td--no">{{ startIndex + index + 1 }}</td>
              <td class="td">
                <span class="code-badge">{{ student.code }}</span>
              </td>
              <td class="td td--name">
                <div class="student-name">{{ student.name }}</div>
              </td>
              <td class="td">{{ formatBirthday(student.birthday) }}</td>
              <td class="td td--address">
                <div class="address-text">
                  {{ formatAddress(student.address) }}
                </div>
              </td>
              <td class="td td--center td--score">
                <span :class="['score-pill', scoreClass(student.score)]">
                  {{ formatScore(student.score) }}
                </span>
              </td>
              <td class="td td--actions">
                <button class="action-btn action-btn--edit" @click="handleEdit(student.id)">
                  <i class="pi pi-pencil"></i>
                  Edit
                </button>
                <button class="action-btn action-btn--delete" @click="handleDelete(student)">
                  <i class="pi pi-trash"></i>
                  Delete
                </button>
              </td>
            </tr>
          </template>

          <tr v-else>
            <td colspan="7" class="empty-cell">
              <div class="empty-state">
                <div class="empty-state__icon">
                  <i class="pi pi-search"></i>
                </div>
                <p class="empty-state__title">Không có dữ liệu</p>
                <span class="empty-state__hint">Thử thay đổi điều kiện tìm kiếm</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Student, SortState, StudentSortField } from '../../types/student'
import SortIcon from '../../components/screenList/SortIcon.vue'

defineProps<{
  students: Student[]
  sort: SortState
  startIndex: number
}>()

const emit = defineEmits<{
  sort: [field: StudentSortField]
  requestEdit: [id: number]
  requestDelete: [student: Student]
}>()

function emitSort(field: StudentSortField) { emit('sort', field) }
function handleEdit(id: number) { emit('requestEdit', id) }
function handleDelete(student: Student) { emit('requestDelete', student) }

function scoreClass(score: number | null | undefined) {
  if (score == null) return 'score-pill--unknown'
  if (score >= 8.5) return 'score-pill--excellent'
  if (score >= 7.0) return 'score-pill--good'
  if (score >= 5.5) return 'score-pill--average'
  return 'score-pill--poor'
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
  return value?.trim() ? value : 'N/A'
}

function formatScore(score: number | null | undefined) {
  return score == null ? 'N/A' : score.toFixed(1)
}
</script>

<style scoped>
.table-wrapper {
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  overflow: hidden;
  background: var(--color-surface-card);
}

.table-scroll {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 780px;
}

/* ── Table Head ── */
.th {
  padding: 13px 16px;
  font-size: 0.72rem;
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  background: var(--color-primary-bg);
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-fast);
  user-select: none;
}

.th:hover {
  background: rgba(43, 168, 162, 0.12);
  color: var(--color-primary-dark);
}

.th--no { width: 60px; }
.th--score { width: 240px; text-align: center; }
.th--actions {
  width: 155px;
  cursor: default;
  text-align: center;
}
.th--actions:hover {
  background: var(--color-primary-bg);
  color: var(--color-text-secondary);
}
.th--address { width: 160px; }

.th-inner {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
}

.th--score .th-inner,
.th--actions .th-inner {
  justify-content: center;
}

/* ── Table Rows ── */
.tr {
  border-bottom: 1px solid var(--color-border-light);
  transition: background var(--transition-fast);
}

.tr:hover {
  background: rgba(43, 168, 162, 0.04);
}

.tr:last-child {
  border-bottom: none;
}

/* ── Table Cells ── */
.td {
  padding: 13px 16px;
  font-size: 0.875rem;
  color: var(--color-text-primary);
  vertical-align: middle;
  text-align: left;
}

.td--center { text-align: center; }

.td--no {
  text-align: left;
  color: var(--color-text-muted);
  font-size: 0.8rem;
  font-weight: var(--font-weight-semibold);
}

.student-name {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.address-text {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--color-text-secondary);
  font-size: 0.835rem;
}

/* ── Student Code Badge — Teal themed ── */
.code-badge {
  display: inline-block;
  padding: 3px 10px;
  background: var(--color-primary-bg);
  border: 1px solid rgba(43, 168, 162, 0.25);
  border-radius: var(--radius-md);
  font-size: 0.78rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-dark);
  font-family: monospace;
  letter-spacing: 0.03em;
}

/* ── Score Pills ── */
.score-pill {
  display: inline-block;
  padding: 3px 11px;
  border-radius: var(--radius-round);
  font-size: 0.8rem;
  font-weight: var(--font-weight-bold);
}

.score-pill--excellent {
  background: rgba(39, 174, 96, 0.12);
  color: #1a7a42;
  border: 1px solid rgba(39, 174, 96, 0.25);
}

.score-pill--good {
  background: rgba(93, 173, 226, 0.12);
  color: #2471a3;
  border: 1px solid rgba(93, 173, 226, 0.25);
}

.score-pill--average {
  background: rgba(255, 210, 63, 0.15);
  color: #9a7d0a;
  border: 1px solid rgba(255, 210, 63, 0.3);
}

.score-pill--poor {
  background: rgba(239, 108, 74, 0.1);
  color: var(--color-coral-dark);
  border: 1px solid rgba(239, 108, 74, 0.25);
}

.score-pill--unknown {
  background: rgba(138, 155, 174, 0.1);
  color: var(--color-text-muted);
  border: 1px solid rgba(138, 155, 174, 0.2);
}

/* ── Action Buttons ── */
.td--actions {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 90px;
  height: 34px;
  padding: 0 10px;
  border: 1.5px solid transparent;
  border-radius: var(--radius-round);
  font-size: 0.78rem;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-bounce);
  font-family: var(--font-family);
}

/* Edit — Teal */
.action-btn--edit {
  background: var(--color-primary-bg);
  color: var(--color-primary-dark);
  border-color: rgba(43, 168, 162, 0.25);
}

.action-btn--edit:hover {
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  border-color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-teal-glow);
}

.action-btn--edit:active {
  transform: scale(0.95);
}

/* Delete — Coral */
.action-btn--delete {
  background: rgba(239, 108, 74, 0.08);
  color: var(--color-coral);
  border-color: rgba(239, 108, 74, 0.2);
}

.action-btn--delete:hover {
  background: var(--color-coral);
  color: var(--color-text-on-primary);
  border-color: var(--color-coral);
  transform: translateY(-1px);
  box-shadow: var(--shadow-coral-glow);
}

.action-btn--delete:active {
  transform: scale(0.95);
}

.th:hover :deep(.sl-sort-icon) {
  opacity: 1 !important;
}

/* ── Empty State ── */
.empty-cell {
  padding: 56px 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.empty-state__icon {
  width: 70px;
  height: 70px;
  border-radius: var(--radius-round);
  background: var(--color-primary-bg);
  border: 1.5px solid rgba(43, 168, 162, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-light);
  margin-bottom: 4px;
  font-size: 1.3rem;
}

.empty-state__title {
  font-size: 1rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin: 0;
}

.empty-state__hint {
  font-size: 0.825rem;
  color: var(--color-text-muted);
}
</style>
