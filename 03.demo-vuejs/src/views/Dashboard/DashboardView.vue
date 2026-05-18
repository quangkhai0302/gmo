<template>
  <DashboardLayout
    title="Tổng quan"
    breadcrumb="Tổng quan"
    eyebrow="Student Management"
    subtitle="Bảng điều khiển vận hành giúp theo dõi tăng trưởng sinh viên, chất lượng học tập và các hoạt động gần đây."
  >
    <section class="stats-grid">
      <StatCard label="Tổng số sinh viên" :value="formatNumber(totalStudents)" trend="+12.4% trong tháng" icon="pi pi-users" />
      <StatCard label="Số lớp học" value="24" trend="+3 lớp mới" icon="pi pi-building-columns" />
      <StatCard label="Điểm trung bình" :value="averageScoreLabel" trend="+0.3 so với kỳ trước" icon="pi pi-star" />
      <StatCard label="Sinh viên mới" value="38" trend="+8 tuần này" icon="pi pi-user-plus" />
    </section>

    <section class="dashboard-grid">
      <article class="panel panel--wide">
        <div class="panel__header">
          <div>
            <h2>Tăng trưởng sinh viên</h2>
            <p>Số lượng hồ sơ được tạo mới theo từng tháng</p>
          </div>
          <button class="panel__ghost-btn" type="button">
            <i class="pi pi-calendar"></i>
            12 tháng
          </button>
        </div>
        <div class="growth-chart" aria-label="Biểu đồ tăng trưởng sinh viên">
          <span v-for="bar in growthBars" :key="bar.month" :style="{ height: `${bar.value}%` }">
            <small>{{ bar.month }}</small>
          </span>
        </div>
      </article>

      <article class="panel">
        <div class="panel__header">
          <div>
            <h2>Phân tích điểm số</h2>
            <p>Phân bổ theo nhóm học lực</p>
          </div>
        </div>
        <div class="score-list">
          <div v-for="item in scoreSegments" :key="item.label" class="score-list__item">
            <div>
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}%</strong>
            </div>
            <div class="score-list__track">
              <span :style="{ width: `${item.value}%` }"></span>
            </div>
          </div>
        </div>
      </article>

      <article class="panel">
        <div class="panel__header">
          <div>
            <h2>Thống kê học tập</h2>
            <p>Tình trạng vận hành hiện tại</p>
          </div>
        </div>
        <div class="learning-metrics">
          <div>
            <span>Tỷ lệ hoàn thành hồ sơ</span>
            <strong>92%</strong>
          </div>
          <div>
            <span>Lớp đang hoạt động</span>
            <strong>18</strong>
          </div>
          <div>
            <span>Cảnh báo học vụ</span>
            <strong>06</strong>
          </div>
        </div>
      </article>

      <article class="panel panel--wide">
        <div class="panel__header">
          <div>
            <h2>Sinh viên gần đây</h2>
            <p>Các hồ sơ vừa được cập nhật trong hệ thống</p>
          </div>
          <RouterLink class="panel__link" to="/students">Xem tất cả</RouterLink>
        </div>
        <div class="recent-table">
          <div class="recent-table__row recent-table__row--head">
            <span>Mã SV</span>
            <span>Họ tên</span>
            <span>Ngày sinh</span>
            <span>Điểm TB</span>
          </div>
          <div v-for="student in recentStudents" :key="student.id" class="recent-table__row">
            <span class="mono">{{ student.code }}</span>
            <strong>{{ student.name }}</strong>
            <span>{{ formatBirthday(student.birthday) }}</span>
            <span>{{ student.score == null ? 'N/A' : student.score.toFixed(1) }}</span>
          </div>
          <div v-if="!recentStudents.length" class="recent-table__empty">
            Chưa có dữ liệu sinh viên để hiển thị.
          </div>
        </div>
      </article>

      <article class="panel">
        <div class="panel__header">
          <div>
            <h2>Activity timeline</h2>
            <p>Nhật ký vận hành gần đây</p>
          </div>
        </div>
        <div class="timeline">
          <div v-for="activity in activities" :key="activity.title" class="timeline__item">
            <span></span>
            <div>
              <strong>{{ activity.title }}</strong>
              <small>{{ activity.time }}</small>
            </div>
          </div>
        </div>
      </article>
    </section>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import { getStudentsApi } from '@/api/axios'
import type { Student } from '@/types/student'

const recentStudents = ref<Student[]>([])
const totalStudents = ref(0)

const growthBars = [
  { month: 'T1', value: 42 },
  { month: 'T2', value: 50 },
  { month: 'T3', value: 46 },
  { month: 'T4', value: 62 },
  { month: 'T5', value: 72 },
  { month: 'T6', value: 68 },
  { month: 'T7', value: 81 },
  { month: 'T8', value: 88 },
  { month: 'T9', value: 78 },
  { month: 'T10', value: 93 },
  { month: 'T11', value: 86 },
  { month: 'T12', value: 96 },
]

const scoreSegments = [
  { label: 'Xuất sắc', value: 24 },
  { label: 'Khá', value: 46 },
  { label: 'Trung bình', value: 22 },
  { label: 'Cần hỗ trợ', value: 8 },
]

const activities = [
  { title: 'Cập nhật hồ sơ sinh viên', time: '5 phút trước' },
  { title: 'Xuất báo cáo CSV hoàn tất', time: '28 phút trước' },
  { title: 'Tạo mã sinh viên tự động', time: '1 giờ trước' },
  { title: 'Đồng bộ danh sách lớp học', time: 'Hôm nay' },
]

const averageScoreLabel = computed(() => {
  const scored = recentStudents.value.filter((student) => student.score != null)
  if (!scored.length) return '8.1'
  const total = scored.reduce((sum, student) => sum + (student.score ?? 0), 0)
  return (total / scored.length).toFixed(1)
})

onMounted(async () => {
  try {
    const response = await getStudentsApi({ page: 1, size: 5 })
    recentStudents.value = response.result.items
    totalStudents.value = response.result.totalItems
  } catch {
    recentStudents.value = []
    totalStudents.value = 0
  }
})

function formatNumber(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value)
}

function formatBirthday(value: string | null | undefined) {
  if (!value) return '--/--/----'
  const parts = value.split(/[/-]/)
  if (parts.length !== 3) return value
  const [year, month, day] = parts
  return year.length === 4 ? `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}` : value
}
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(320px, 0.9fr);
  gap: var(--space-xl);
}

.panel {
  padding: var(--space-xl);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.panel--wide {
  min-width: 0;
}

.panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.panel__header h2 {
  margin: 0;
  font-size: 16px;
  letter-spacing: 0;
}

.panel__header p {
  margin: 4px 0 0;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.panel__ghost-btn,
.panel__link {
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 0 var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
}

.growth-chart {
  height: 280px;
  display: grid;
  grid-template-columns: repeat(12, minmax(24px, 1fr));
  align-items: end;
  gap: var(--space-md);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--color-border);
}

.growth-chart span {
  position: relative;
  min-height: 32px;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  background: linear-gradient(180deg, var(--color-primary), #99f6e4);
  transition: transform var(--transition-fast);
}

.growth-chart span:hover {
  transform: translateY(-4px);
}

.growth-chart small {
  position: absolute;
  left: 50%;
  bottom: -24px;
  transform: translateX(-50%);
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: var(--font-weight-semibold);
}

.score-list,
.learning-metrics,
.timeline {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.score-list__item {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.score-list__item div:first-child,
.learning-metrics div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
}

.score-list__item strong,
.learning-metrics strong {
  color: var(--color-text);
  font-size: 20px;
}

.score-list__track {
  height: 8px;
  border-radius: var(--radius-round);
  background: var(--color-surface-muted);
  overflow: hidden;
}

.score-list__track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--color-primary);
}

.learning-metrics div {
  min-height: 58px;
  padding: 0 var(--space-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-background);
}

.recent-table {
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.recent-table__row {
  display: grid;
  grid-template-columns: 1fr 1.6fr 1fr 0.8fr;
  gap: var(--space-lg);
  align-items: center;
  min-height: 52px;
  padding: 0 var(--space-lg);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 13px;
}

.recent-table__row:last-child {
  border-bottom: 0;
}

.recent-table__row--head {
  min-height: 44px;
  background: var(--color-background);
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
}

.recent-table__row strong {
  color: var(--color-text);
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: var(--color-primary-hover);
  font-weight: var(--font-weight-bold);
}

.recent-table__empty {
  padding: var(--space-xl);
  color: var(--color-text-secondary);
  text-align: center;
  font-size: 14px;
}

.timeline__item {
  position: relative;
  display: flex;
  gap: var(--space-md);
}

.timeline__item > span {
  width: 10px;
  height: 10px;
  margin-top: 6px;
  border-radius: var(--radius-round);
  background: var(--color-primary);
  box-shadow: 0 0 0 4px var(--color-primary-subtle);
  flex: 0 0 auto;
}

.timeline__item strong,
.timeline__item small {
  display: block;
}

.timeline__item strong {
  color: var(--color-text);
  font-size: 13px;
}

.timeline__item small {
  margin-top: 2px;
  color: var(--color-text-muted);
  font-size: 12px;
}

@media (max-width: 1180px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .panel {
    padding: var(--space-lg);
  }

  .growth-chart {
    height: 220px;
    gap: var(--space-sm);
    overflow-x: auto;
  }

  .growth-chart span {
    min-width: 26px;
  }

  .recent-table__row {
    grid-template-columns: 1fr;
    gap: var(--space-xs);
    align-items: start;
    padding: var(--space-md);
  }

  .recent-table__row--head {
    display: none;
  }
}
</style>
