import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import SearchForm from './SearchForm.vue'
import type { SearchForm as SearchPayload } from '../../types/student'

const meta = {
  title: 'ScreenList/SearchForm',
  component: SearchForm,
  tags: ['autodocs'],
  render: () => ({
    components: { SearchForm },
    setup() {
      const latestPayload = ref<SearchPayload | null>(null)

      const onSearch = (payload: SearchPayload) => {
        latestPayload.value = payload
      }

      return { latestPayload, onSearch }
    },
    template: `
      <div style="width: 860px; max-width: 100%;">
        <SearchForm @search="onSearch" />
        <pre
          v-if="latestPayload"
          style="margin-top: 12px; padding: 12px; border-radius: 10px; background: #111827; color: #f9fafb; font-size: 12px;"
        >{{ JSON.stringify(latestPayload, null, 2) }}</pre>
      </div>
    `,
  }),
} satisfies Meta<typeof SearchForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
