<template>
  <DashboardLayout
    title="Tổng quan"
    breadcrumb="Tổng quan"
    eyebrow="Student Operations"
    subtitle="Theo dõi chất lượng dữ liệu sinh viên, điểm học tập và các hoạt động cần quản lý."
  >
    <section class="overview-grid" aria-label="Chỉ số vận hành chính">
      <article v-for="card in overviewCards" :key="card.label" class="metric-card" :class="card.tone ? `metric-card--${card.tone}` : ''">
        <div class="metric-card__header">
          <span>{{ card.label }}</span>
          <i :class="card.icon"></i>
        </div>
        <strong>{{ card.value }}</strong>
        <small>{{ card.helper }}</small>
      </article>
    </section>

    <section v-if="errorMessage" class="notice-panel notice-panel--danger">
      <i class="pi pi-exclamation-triangle"></i>
      <span>{{ errorMessage }}</span>
    </section>

    <section v-if="!hasAuditMetadata && !loading" class="notice-panel">
      <i class="pi pi-info-circle"></i>
      <span>Chưa có dữ liệu.</span>
    </section>

    <section class="analytics-grid">
      <article class="dashboard-panel dashboard-panel--wide">
        <div class="panel-heading">
          <div>
            <h2>Tăng trưởng sinh viên</h2>
            <p>Số hồ sơ được tạo trong 6 tháng gần nhất.</p>
          </div>
        </div>

        <div v-if="hasAuditMetadata" class="growth-chart" aria-label="Biểu đồ tăng trưởng sinh viên">
          <div v-for="month in growthMonths" :key="month.key" class="growth-chart__bar">
            <span class="growth-chart__value">{{ month.count }}</span>
            <div class="growth-chart__track" :title="`${month.label}: ${month.count} sinh viên mới`">
              <span :style="{ height: `${month.height}%` }"></span>
            </div>
            <small>{{ month.shortLabel }}</small>
          </div>
        </div>

        <div v-else class="empty-insight">
          <i class="pi pi-calendar-clock"></i>
          <strong>Chưa có dữ liệu ngày thêm</strong>
          <span>Cần field `createdAt` trong response `GET /api/students` để tính tăng trưởng theo tháng.</span>
        </div>
      </article>

      <article class="dashboard-panel">
        <div class="panel-heading">
          <div>
            <h2>Phân loại học lực</h2>
            <p>Tính trực tiếp từ điểm trung bình hiện tại.</p>
          </div>
        </div>

        <div v-if="scoreDistributionTotal" class="score-analytics">
          <div class="doughnut" :style="{ background: scoreDistributionGradient }">
            <div>
              <strong>{{ scoreDistributionTotal }}</strong>
              <span>sinh viên<br>có điểm</span>
            </div>
          </div>

          <div class="legend-list">
            <div v-for="segment in scoreDistribution" :key="segment.label" class="legend-item">
              <span :style="{ background: segment.color }"></span>
              <div>
                <strong>{{ segment.label }}</strong>
                <small>{{ segment.count }} sinh viên · {{ segment.percent }}%</small>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-insight empty-insight--compact">
          <i class="pi pi-chart-pie"></i>
          <strong>Chưa có điểm để phân loại</strong>
          <span>Cập nhật điểm trung bình để dashboard hiển thị phân bố học lực.</span>
        </div>
      </article>
    </section>

    <section class="insights-grid">
      <article class="dashboard-panel">
        <div class="panel-heading">
          <div>
            <h2>Sinh viên mới thêm</h2>
            <p>Các hồ sơ mới nhất trong hệ thống.</p>
          </div>
          <RouterLink class="panel-link" to="/students/new">Thêm sinh viên</RouterLink>
        </div>

        <div class="data-table-wrap">
          <table class="insight-table">
            <thead>
              <tr>
                <th>Mã SV</th>
                <th>Họ tên</th>
                <th>Ngày sinh</th>
                <th>Điểm</th>
                <th>Ngày thêm</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="row in 4" :key="row">
                  <td colspan="5"><span class="table-skeleton"></span></td>
                </tr>
              </template>
              <tr v-for="student in newestStudents" v-else :key="student.id">
                <td><span class="mono">{{ student.code }}</span></td>
                <td><strong>{{ student.name }}</strong></td>
                <td>{{ formatBirthday(student.birthday) }}</td>
                <td>{{ formatScore(student.score) }}</td>
                <td>{{ formatDateTime(student.createdAt) }}</td>
              </tr>
              <tr v-if="!loading && !newestStudents.length">
                <td colspan="5">
                  <div class="table-empty">Chưa có sinh viên để hiển thị.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article class="dashboard-panel">
        <div class="panel-heading">
          <div>
            <h2>Sinh viên cần chú ý</h2>
            <p>Điểm dưới {{ LOW_SCORE_THRESHOLD }} cần được theo dõi học vụ.</p>
          </div>
          <span class="panel-badge panel-badge--danger">{{ attentionStudents.length }} cảnh báo</span>
        </div>

        <div class="data-table-wrap">
          <table class="insight-table">
            <thead>
              <tr>
                <th>Mã SV</th>
                <th>Họ tên</th>
                <th>Điểm</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="row in 4" :key="row">
                  <td colspan="4"><span class="table-skeleton"></span></td>
                </tr>
              </template>
              <tr v-for="student in attentionStudents" v-else :key="student.id">
                <td><span class="mono">{{ student.code }}</span></td>
                <td><strong>{{ student.name }}</strong></td>
                <td>{{ formatScore(student.score) }}</td>
                <td><span :class="['risk-badge', student.score != null && student.score < 4 ? 'risk-badge--high' : '']">{{ riskLabel(student.score) }}</span></td>
              </tr>
              <tr v-if="!loading && !attentionStudents.length">
                <td colspan="4">
                  <div class="table-empty">Không có sinh viên dưới ngưỡng cảnh báo.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>

    <section class="activity-section">
      <article class="dashboard-panel dashboard-panel--wide">
        <div class="panel-heading">
          <div>
            <h2>Các hoạt động gần đây</h2>
            <p>Các thay đổi dữ liệu gần đây.</p>
          </div>
          <span class="panel-badge">{{ activities.length }} hoạt động</span>
        </div>

        <div v-if="activities.length" class="activity-list">
          <div v-for="activity in activities" :key="activity.id" class="activity-item">
            <span :class="['activity-dot', `activity-dot--${activityTone(activity.type)}`]"></span>
            <div>
              <strong>{{ activity.title }}</strong>
              <p>{{ activity.description || activity.referenceType || 'Thay đổi dữ liệu hệ thống' }}</p>
            </div>
            <time>{{ formatRelativeTime(activity.createdAt) }}</time>
          </div>
        </div>

        <div v-else class="empty-insight empty-insight--compact">
          <i class="pi pi-history"></i>
          <strong>Chưa có thay đổi</strong>
          <span>Các thao tác thêm, cập nhật, xóa sinh viên và export CSV sẽ xuất hiện tại đây.</span>
        </div>
      </article>
    </section>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { getActivityLogsApi, getStudentsApi, type ActivityLogResponse } from '@/api/axios'
import type { Student } from '@/types/student'

const LOW_SCORE_THRESHOLD = 5.5
const DASHBOARD_PAGE_SIZE = 500
const ACTIVITY_LIMIT = 10
const GROWTH_MONTH_COUNT = 6

const students = ref<Student[]>([])
const activities = ref<ActivityLogResponse[]>([])
const loading = ref(true)
const errorMessage = ref('')

const hasAuditMetadata = computed(() => students.value.some((student) => !!parseDateTime(student.createdAt)))
const scoredStudents = computed(() => students.value.filter((student) => student.score != null))
const totalStudents = computed(() => students.value.length)
const currentMonthStudents = computed(() => students.value.filter((student) => isCurrentMonth(student.createdAt)).length)
const attentionStudents = computed(() =>
  scoredStudents.value
    .filter((student) => (student.score ?? 0) < LOW_SCORE_THRESHOLD)
    .sort((left, right) => (left.score ?? 0) - (right.score ?? 0))
    .slice(0, 8),
)

const averageScore = computed(() => {
  if (!scoredStudents.value.length) return null
  const total = scoredStudents.value.reduce((sum, student) => sum + (student.score ?? 0), 0)
  return total / scoredStudents.value.length
})

const newestStudents = computed(() =>
  [...students.value]
    .sort((left, right) => sortByCreatedAtDesc(left, right))
    .slice(0, 8),
)

const overviewCards = computed(() => [
  {
    label: 'Tổng số sinh viên',
    value: formatNumber(totalStudents.value),
    helper: loading.value ? 'Đang đồng bộ dữ liệu' : `${formatNumber(scoredStudents.value.length)} sinh viên đã có điểm`,
    icon: 'pi pi-users',
  },
  {
    label: 'Sinh viên mới tháng này',
    value: hasAuditMetadata.value ? formatNumber(currentMonthStudents.value) : 'N/A',
    helper: hasAuditMetadata.value ? 'Tính theo ngày tạo hồ sơ' : 'Cần dữ liệu createdAt',
    icon: 'pi pi-user-plus',
  },
  {
    label: 'Điểm trung bình hệ thống',
    value: averageScore.value == null ? 'N/A' : averageScore.value.toFixed(1),
    helper: `${formatNumber(scoredStudents.value.length)} / ${formatNumber(totalStudents.value)} sinh viên có điểm`,
    icon: 'pi pi-star',
  },
  {
    label: 'Sinh viên cảnh báo học vụ',
    value: formatNumber(attentionStudents.value.length),
    helper: `Điểm dưới ${LOW_SCORE_THRESHOLD}`,
    icon: 'pi pi-exclamation-triangle',
    tone: attentionStudents.value.length ? 'danger' : 'success',
  },
])

const growthMonths = computed(() => {
  const months = buildRecentMonths(GROWTH_MONTH_COUNT)
  const counts = months.map((month) => ({
    ...month,
    count: students.value.filter((student) => isSameMonth(student.createdAt, month.date)).length,
  }))
  const max = Math.max(...counts.map((month) => month.count), 1)

  return counts.map((month) => ({
    ...month,
    height: month.count === 0 ? 4 : Math.max(12, Math.round((month.count / max) * 100)),
  }))
})

const scoreDistribution = computed(() => {
  const buckets = [
    { label: 'Xuất sắc', count: 0, color: '#14B8A6' },
    { label: 'Giỏi', count: 0, color: '#3B82F6' },
    { label: 'Khá', count: 0, color: '#64748B' },
    { label: 'Trung bình', count: 0, color: '#94A3B8' },
    { label: 'Yếu', count: 0, color: '#EF4444' },
  ]

  scoredStudents.value.forEach((student) => {
    const score = student.score ?? 0
    if (score >= 9) buckets[0].count += 1
    else if (score >= 8) buckets[1].count += 1
    else if (score >= 7) buckets[2].count += 1
    else if (score >= LOW_SCORE_THRESHOLD) buckets[3].count += 1
    else buckets[4].count += 1
  })

  const total = buckets.reduce((sum, bucket) => sum + bucket.count, 0)
  return buckets.map((bucket) => ({
    ...bucket,
    percent: total ? Math.round((bucket.count / total) * 100) : 0,
  }))
})

const scoreDistributionTotal = computed(() => scoreDistribution.value.reduce((sum, segment) => sum + segment.count, 0))
const scoreDistributionGradient = computed(() => {
  if (!scoreDistributionTotal.value) return '#f1f5f9'
  let cursor = 0
  const stops = scoreDistribution.value
    .filter((segment) => segment.count > 0)
    .map((segment) => {
      const start = cursor
      cursor += (segment.count / scoreDistributionTotal.value) * 100
      return `${segment.color} ${start}% ${cursor}%`
    })
  return `conic-gradient(${stops.join(', ')})`
})

onMounted(async () => {
  await loadDashboard()
})

async function loadDashboard() {
  loading.value = true
  errorMessage.value = ''

  try {
    const [studentItems, activityResponse] = await Promise.all([
      fetchAllStudents(),
      getActivityLogsApi(ACTIVITY_LIMIT).catch(() => null),
    ])
    students.value = studentItems
    activities.value = activityResponse?.result ?? []
  } catch (error) {
    students.value = []
    activities.value = []
    errorMessage.value = 'Không thể tải dữ liệu dashboard. Vui lòng kiểm tra kết nối API.'
  } finally {
    loading.value = false
  }
}

async function fetchAllStudents() {
  const firstResponse = await getStudentsApi({
    page: 1,
    size: DASHBOARD_PAGE_SIZE,
    sortField: 'id',
    sortOrder: 'desc',
  })
  const firstPage = firstResponse.result
  const items = [...firstPage.items]

  if (firstPage.totalPages <= 1) {
    return items
  }

  const requests = []
  for (let page = 2; page <= firstPage.totalPages; page += 1) {
    requests.push(getStudentsApi({ page, size: DASHBOARD_PAGE_SIZE, sortField: 'id', sortOrder: 'desc' }))
  }

  const restResponses = await Promise.all(requests)
  restResponses.forEach((response) => {
    items.push(...response.result.items)
  })

  return items
}

function buildRecentMonths(count: number) {
  const formatter = new Intl.DateTimeFormat('vi-VN', { month: 'short', year: 'numeric' })
  const shortFormatter = new Intl.DateTimeFormat('vi-VN', { month: 'short' })
  const today = new Date()

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (count - 1 - index), 1)
    return {
      key: `${date.getFullYear()}-${date.getMonth() + 1}`,
      date,
      label: formatter.format(date),
      shortLabel: shortFormatter.format(date),
    }
  })
}

function sortByCreatedAtDesc(left: Student, right: Student) {
  const leftTime = parseDateTime(left.createdAt)?.getTime() ?? 0
  const rightTime = parseDateTime(right.createdAt)?.getTime() ?? 0
  if (leftTime !== rightTime) return rightTime - leftTime
  return right.id - left.id
}

function isCurrentMonth(value: string | null | undefined) {
  return isSameMonth(value, new Date())
}

function isSameMonth(value: string | null | undefined, target: Date) {
  const date = parseDateTime(value)
  return !!date && date.getFullYear() === target.getFullYear() && date.getMonth() === target.getMonth()
}

function parseDateTime(value: string | null | undefined) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value)
}

function formatScore(score: number | null | undefined) {
  return score == null ? 'N/A' : score.toFixed(1)
}

function formatBirthday(value: string | null | undefined) {
  if (!value) return '--/--/----'
  const parts = value.split(/[/-]/)
  if (parts.length !== 3) return value
  const [year, month, day] = parts
  return year.length === 4 ? `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}` : value
}

function formatDateTime(value: string | null | undefined) {
  const date = parseDateTime(value)
  if (!date) return '--/--/----'
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}

function formatRelativeTime(value: string | null | undefined) {
  const date = parseDateTime(value)
  if (!date) return 'Chưa rõ thời gian'
  const diffMs = Date.now() - date.getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diffMs < minute) return 'Vừa xong'
  if (diffMs < hour) return `${Math.floor(diffMs / minute)} phút trước`
  if (diffMs < day) return `${Math.floor(diffMs / hour)} giờ trước`
  if (diffMs < 7 * day) return `${Math.floor(diffMs / day)} ngày trước`
  return formatDateTime(value)
}

function riskLabel(score: number | null | undefined) {
  if (score == null) return 'Thiếu điểm'
  return score < 4 ? 'Nguy cơ cao' : 'Cần hỗ trợ'
}

function activityTone(type: string) {
  if (type.includes('DELETED')) return 'danger'
  if (type.includes('EXPORTED')) return 'info'
  if (type.includes('UPDATED')) return 'warning'
  return 'success'
}
</script>

<style scoped>
.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.metric-card,
.dashboard-panel,
.notice-panel {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.metric-card {
  min-height: 136px;
  padding: var(--space-lg);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
}

.metric-card:hover {
  border-color: var(--color-border-strong);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.metric-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: var(--font-weight-bold);
}

.metric-card__header i {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: var(--color-surface-muted);
  color: var(--color-text-secondary);
}

.metric-card strong {
  display: block;
  margin-top: var(--space-lg);
  color: var(--color-text);
  font-size: 30px;
  line-height: 1;
  letter-spacing: 0;
}

.metric-card small {
  display: block;
  margin-top: var(--space-sm);
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
}

.metric-card--danger .metric-card__header i {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.metric-card--success .metric-card__header i {
  background: var(--color-success-soft);
  color: #15803d;
}

.notice-panel {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
  padding: var(--space-md) var(--space-lg);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
}

.notice-panel i {
  margin-top: 2px;
  color: var(--color-primary-hover);
}

.notice-panel--danger i {
  color: var(--color-danger);
}

.analytics-grid,
.insights-grid,
.activity-section {
  display: grid;
  gap: var(--space-xl);
  margin-bottom: var(--space-xl);
}

.analytics-grid {
  grid-template-columns: minmax(0, 1.45fr) minmax(340px, 0.85fr);
}

.insights-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.dashboard-panel {
  min-width: 0;
  padding: var(--space-xl);
}

.dashboard-panel--wide {
  min-width: 0;
}

.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.panel-heading h2 {
  margin: 0;
  color: var(--color-text);
  font-size: 16px;
  letter-spacing: 0;
}

.panel-heading p {
  margin: 4px 0 0;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.panel-badge,
.panel-link {
  min-height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-round);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
}

.panel-badge--danger {
  border-color: rgba(239, 68, 68, 0.2);
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.panel-link:hover {
  border-color: var(--color-border-strong);
  background: var(--color-surface-muted);
  color: var(--color-text);
}

.growth-chart {
  height: 320px;
  display: grid;
  grid-template-columns: repeat(6, minmax(48px, 1fr));
  gap: var(--space-lg);
  align-items: end;
  padding: var(--space-lg) 0 var(--space-sm);
  border-top: 1px solid var(--color-border);
}

.growth-chart__bar {
  height: 100%;
  display: grid;
  grid-template-rows: 24px 1fr 22px;
  gap: var(--space-sm);
  align-items: end;
  text-align: center;
}

.growth-chart__value {
  color: var(--color-text);
  font-size: 12px;
  font-weight: var(--font-weight-bold);
}

.growth-chart__track {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: end;
  justify-content: center;
  border-bottom: 1px solid var(--color-border);
  overflow: hidden;
}

.growth-chart__track span {
  width: min(42px, 62%);
  min-height: 8px;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  background: var(--color-primary);
  transition: height var(--transition-base), transform var(--transition-fast);
}

.growth-chart__track:hover span {
  transform: translateY(-3px);
}

.growth-chart__bar small {
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: var(--font-weight-bold);
}

.score-analytics {
  display: grid;
  grid-template-columns: 168px minmax(0, 1fr);
  gap: var(--space-xl);
  align-items: center;
}

.doughnut {
  width: 168px;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border-radius: var(--radius-round);
}

.doughnut > div {
  width: 96px;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border-radius: inherit;
  background: var(--color-surface);
  text-align: center;
}

.doughnut strong,
.doughnut span {
  display: block;
}

.doughnut strong {
  color: var(--color-text);
  font-size: 24px;
  line-height: 1;
}

.doughnut span {
  margin-top: -18px;
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: var(--font-weight-bold);
}

.legend-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.legend-item > span {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-round);
  flex: 0 0 auto;
}

.legend-item strong,
.legend-item small {
  display: block;
}

.legend-item strong {
  color: var(--color-text);
  font-size: 13px;
}

.legend-item small {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.empty-insight {
  min-height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-xl);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-lg);
  background: var(--color-background);
  text-align: center;
}

.empty-insight--compact {
  min-height: 180px;
}

.empty-insight i {
  color: var(--color-text-muted);
  font-size: 24px;
}

.empty-insight strong {
  color: var(--color-text);
  font-size: 14px;
}

.empty-insight span {
  max-width: 420px;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.data-table-wrap {
  max-height: 420px;
  overflow: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.insight-table {
  width: 100%;
  min-width: 620px;
  border-collapse: separate;
  border-spacing: 0;
}

.insight-table th {
  position: sticky;
  top: 0;
  z-index: 1;
  height: 42px;
  padding: 0 var(--space-md);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: var(--font-weight-bold);
  text-align: left;
  text-transform: uppercase;
}

.insight-table td {
  height: 52px;
  padding: 0 var(--space-md);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 13px;
}

.insight-table tbody tr:last-child td {
  border-bottom: 0;
}

.insight-table tbody tr:hover td {
  background: var(--color-primary-subtle);
}

.insight-table strong {
  color: var(--color-text);
}

.mono {
  color: var(--color-primary-hover);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-weight: var(--font-weight-bold);
}

.risk-badge {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 0 10px;
  border-radius: var(--radius-round);
  background: var(--color-warning-soft);
  color: #b45309;
  font-size: 12px;
  font-weight: var(--font-weight-bold);
}

.risk-badge--high {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.table-empty {
  padding: var(--space-xl);
  color: var(--color-text-secondary);
  text-align: center;
}

.table-skeleton {
  display: block;
  width: 100%;
  height: 12px;
  border-radius: var(--radius-round);
  background: linear-gradient(90deg, #f1f5f9, #e2e8f0, #f1f5f9);
  background-size: 200% 100%;
  animation: skeleton 1.2s ease-in-out infinite;
}

.activity-list {
  display: flex;
  flex-direction: column;
}

.activity-item {
  display: grid;
  grid-template-columns: 12px minmax(0, 1fr) auto;
  gap: var(--space-md);
  align-items: start;
  padding: var(--space-md) 0;
  border-top: 1px solid var(--color-border);
}

.activity-item:first-child {
  border-top: 0;
  padding-top: 0;
}

.activity-dot {
  width: 10px;
  height: 10px;
  margin-top: 6px;
  border-radius: var(--radius-round);
  background: var(--color-primary);
}

.activity-dot--danger {
  background: var(--color-danger);
}

.activity-dot--info {
  background: #3b82f6;
}

.activity-dot--warning {
  background: #f59e0b;
}

.activity-item strong {
  color: var(--color-text);
  font-size: 13px;
}

.activity-item p {
  margin: 3px 0 0;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.activity-item time {
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
}

@keyframes skeleton {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

@media (max-width: 1180px) {
  .overview-grid,
  .analytics-grid,
  .insights-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .analytics-grid,
  .insights-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-panel {
    padding: var(--space-lg);
  }

  .panel-heading,
  .activity-item {
    grid-template-columns: 1fr;
  }

  .panel-heading {
    flex-direction: column;
  }

  .score-analytics {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .growth-chart {
    overflow-x: auto;
  }

  .growth-chart__bar {
    min-width: 64px;
  }

  .activity-item time {
    white-space: normal;
  }
}
</style>
