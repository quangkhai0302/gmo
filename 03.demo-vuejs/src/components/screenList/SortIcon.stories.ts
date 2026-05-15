import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SortIcon from './SortIcon.vue'

const meta = {
  title: 'ScreenList/SortIcon',
  component: SortIcon,
  tags: ['autodocs'],
  args: {
    field: 'name',
    sort: {
      field: null,
      order: null,
    },
  },
  render: (args) => ({
    components: { SortIcon },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; align-items: center; gap: 8px; font-weight: 600;">
        Name
        <SortIcon v-bind="args" />
      </div>
    `,
  }),
} satisfies Meta<typeof SortIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Inactive: Story = {}

export const Ascending: Story = {
  args: {
    sort: {
      field: 'name',
      order: 'asc',
    },
  },
}

export const Descending: Story = {
  args: {
    sort: {
      field: 'name',
      order: 'desc',
    },
  },
}
