import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Header from './Header.vue'

const meta = {
  title: 'ScreenList/Header',
  component: Header,
  tags: ['autodocs'],
  args: {
    username: 'Nguyen Van A',
    showUsername: true,
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const HiddenUsername: Story = {
  args: {
    showUsername: false,
  },
}
