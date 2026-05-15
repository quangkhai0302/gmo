import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import Pagination from './Pagination.vue'

const meta = {
  title: 'ScreenList/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    currentPage: 6,
    totalItems: 173,
    pageSize: 10,
  },
  render: (args) => ({
    components: { Pagination },
    setup() {
      const page = ref(args.currentPage)

      watch(
        () => args.currentPage,
        (value) => {
          page.value = value
        }
      )

      return { args, page }
    },
    template: `
      <div style="width: 920px; max-width: 100%; background: #fff; border-radius: 16px; padding: 16px;">
        <p style="margin: 0 0 12px; color: #6b7280; font-size: 13px;">Current page: {{ page }}</p>
        <Pagination
          :currentPage="page"
          :totalItems="args.totalItems"
          :pageSize="args.pageSize"
          @change-page="page = $event"
        />
      </div>
    `,
  }),
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalItems: 28,
    pageSize: 10,
  },
}
