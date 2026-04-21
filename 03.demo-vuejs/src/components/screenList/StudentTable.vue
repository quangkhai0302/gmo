<template>
  <div class="sl-table-wrapper">
    <div class="sl-table-scroll">
      <table class="sl-table">
        <thead>
          <tr>
            <th class="sl-th sl-th--no" @click="emitSort('id')">
              <div class="sl-th-inner">No <SortIcon field="id" :sort="sort" /></div>
            </th>
            <th class="sl-th" @click="emitSort('code')">
              <div class="sl-th-inner">Student Code <SortIcon field="code" :sort="sort" /></div>
            </th>
            <th class="sl-th" @click="emitSort('name')">
              <div class="sl-th-inner">Name <SortIcon field="name" :sort="sort" /></div>
            </th>
            <th class="sl-th" @click="emitSort('birthday')">
              <div class="sl-th-inner">Birthday <SortIcon field="birthday" :sort="sort" /></div>
            </th>
            <th class="sl-th sl-th--address">
              <div class="sl-th-inner">Address</div>
            </th>
            <th class="sl-th sl-th--score" @click="emitSort('score')">
              <div class="sl-th-inner">Score <SortIcon field="score" :sort="sort" /></div>
            </th>
            <th class="sl-th sl-th--actions">
              <div class="sl-th-inner">Actions</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="students.length > 0">
            <tr v-for="(student, index) in students" :key="student.id" class="sl-tr">
              <td class="sl-td sl-td--no">{{ startIndex + index + 1 }}</td>
              <td class="sl-td">
                <span class="sl-badge">{{ student.code }}</span>
              </td>
              <td class="sl-td sl-td--name">
                <div class="sl-student-name">{{ student.name }}</div>
              </td>
              <td class="sl-td">{{ formatBirthday(student.birthday) }}</td>
              <td class="sl-td sl-td--address">
                <div class="sl-address">
                  {{ student.address }}
                </div>
              </td>
              <td class="sl-td sl-td--center sl-td--score">
                <span :class="['sl-score', scoreClass(student.score)]">
                  {{ student.score.toFixed(1) }}
                </span>
              </td>
              <td class="sl-td sl-td--actions">
                <button class="sl-action sl-action--edit" @click="handleEdit(student.code)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
                <button class="sl-action sl-action--delete" @click="handleDelete(student)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                  Delete
                </button>
              </td>
            </tr>
          </template>

          <tr v-else>
            <td colspan="7" class="sl-empty">
              <div class="sl-empty__content">
                <div class="sl-empty__icon">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </div>
                <p>Không có dữ liệu</p>
                <span>Thử thay đổi điều kiện tìm kiếm</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Student, SortState } from '../../types/student'
import SortIcon from '../../components/screenList/SortIcon.vue'

const props = defineProps<{
  students: Student[]
  sort: SortState
  startIndex: number
}>()

const emit = defineEmits<{
  sort: [field: keyof Student]
  requestEdit: [code: string]
  requestDelete: [student: Student]
}>()

function emitSort(field: keyof Student) { emit('sort', field) }
function handleEdit(code: string) { emit('requestEdit', code) }
function handleDelete(student: Student) { emit('requestDelete', student) }

function scoreClass(score: number) {
  if (score >= 8.5) return 'sl-score--excellent'
  if (score >= 7.0) return 'sl-score--good'
  if (score >= 5.5) return 'sl-score--average'
  return 'sl-score--poor'
}

function formatBirthday(value: string) {
  const parts = value.split(/[/-]/)
  if (parts.length !== 3) return value

  const [year, month, day] = parts
  if (year.length === 4) return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`

  return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[2]}`
}
</script>

<style scoped>
.sl-table-wrapper {
  border-radius: 0 0 18px 18px;
  overflow: hidden;
  background: #ffffff;
}

.sl-table-scroll { overflow-x: auto; }

.sl-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 780px;
}

/* Head */
.sl-th {
  padding: 13px 16px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #6b7280;
  background: #f9fafb;
  text-align: left;
}
.sl-th:hover { background: #eef2ff; color: #4f46e5; }
.sl-th--no      { width: 60px; }
.sl-th--score   { width: 240px; text-align: center; }
.sl-th--actions { width: 155px; cursor: default; text-align: center; }
.sl-th--actions:hover { background: #f9fafb; color: #6b7280; }
.sl-th--address { width: 160px; }

.sl-th-inner {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
}
.sl-th--score .sl-th-inner,
.sl-th--actions .sl-th-inner {
  justify-content: center;
}

/* Body */
.sl-tr {
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.12s;
}
.sl-tr:hover { background: #f5f7ff; }
.sl-tr:last-child { border-bottom: none; }

.sl-td {
  padding: 13px 16px;
  font-size: 0.875rem;
  color: #374151;
  vertical-align: middle;
  text-align: left;
}
.sl-td--center { text-align: center; }
.sl-td--no {
  text-align: left;
  color: #9ca3af;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Student name row */
.sl-student-name {
  font-weight: 600;
  color: #111827;
}

/* Address */
.sl-address {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  color: #6b7280;
  font-size: 0.835rem;
}

/* Student Code badge */
.sl-badge {
  display: inline-block;
  padding: 3px 10px;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #4f46e5;
  font-family: monospace;
  letter-spacing: 0.03em;
}

/* Score badges */
.sl-score {
  display: inline-block;
  padding: 3px 11px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
}
.sl-score--excellent { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
.sl-score--good      { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
.sl-score--average   { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
.sl-score--poor      { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

/* Action buttons */
.sl-td--actions {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.sl-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 92px;
  height: 34px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
  font-family: inherit;
}

/* Edit: indigo accent — khớp với màu primary của Auth */
.sl-action--edit {
  background: #eef2ff;
  color: #4f46e5;
  border-color: #c7d2fe;
}
.sl-action--edit:hover {
  background: #4f46e5;
  color: #ffffff;
  border-color: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(79, 70, 229, 0.3);
}

/* Delete: red */
.sl-action--delete {
  background: #fef2f2;
  color: #ef4444;
  border-color: #fecaca;
}
.sl-action--delete:hover {
  background: #ef4444;
  color: #ffffff;
  border-color: #ef4444;
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(239, 68, 68, 0.3);
}

/* Sort icon hover override */
.sl-th:hover :deep(.sl-sort-icon) { opacity: 1 !important; }

/* Empty state */
.sl-empty { padding: 56px 16px; }
.sl-empty__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.sl-empty__icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d1d5db;
  margin-bottom: 4px;
}
.sl-empty__content p    { font-size: 1rem; font-weight: 600; color: #6b7280; margin: 0; }
.sl-empty__content span { font-size: 0.825rem; color: #9ca3af; }
</style>
