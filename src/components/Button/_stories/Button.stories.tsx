import type { Meta, StoryObj } from '@storybook/react-webpack5'
import { Button } from '../Button'

const meta: Meta<typeof Button> = {
	title: 'Components/Button',
	component: Button,
	tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
	args: {
		children: 'button',
	},
}

export const Disabled: Story = {
	args: {
		children: 'disabled',
		isDisabled: true,
	},
}

export const OnWhite: Story = {
	args: {
		children: 'button',
		variant: 'on-white',
	},
	globals: {
        backgrounds: {
            value: "light"
        }
    },
}

export const OnWhiteDisabled: Story = {
	args: {
		children: 'disabled',
		variant: 'on-white',
		isDisabled: true,
	},
	globals: {
        backgrounds: {
            value: "light"
        }
    },
}
