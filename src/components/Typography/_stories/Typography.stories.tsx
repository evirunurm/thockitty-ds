import type { Meta, StoryObj } from '@storybook/react-webpack5'
import { Typography } from '../Typography'

const meta: Meta<typeof Typography> = {
	title: 'Components/Typography',
	component: Typography,
	tags: [],
	args: {
		color: 'white',
	},
	argTypes: {
		as: {
			control: 'text',
		},
	},
}

export default meta
type Story = StoryObj<typeof Typography>

// ── Titles ────────────────────────────────────────────────

export const Hero: Story = {
	args: {
		variant: 'hero',
		children: 'Hero',
	},
}

export const HeroMono: Story = {
	name: 'Hero Mono',
	args: {
		variant: 'hero-mono',
		children: 'Hero Mono',
	},
}

// ── Headings ──────────────────────────────────────────────

export const Heading01: Story = {
	name: 'Heading 01',
	args: {
		variant: 'heading-01',
		as: 'h1',
		children: 'Heading 01',
	},
}

export const Heading02: Story = {
	name: 'Heading 02',
	args: {
		variant: 'heading-02',
		as: 'h2',
		children: 'Heading 02',
	},
}

export const Heading03: Story = {
	name: 'Heading 03',
	args: {
		variant: 'heading-03',
		as: 'h3',
		children: 'Heading 03',
	},
}

export const Heading04: Story = {
	name: 'Heading 04',
	args: {
		variant: 'heading-04',
		as: 'h4',
		children: 'Heading 04',
	},
}

export const HeadingMono01: Story = {
	name: 'Heading Mono 01',
	args: {
		variant: 'heading-mono-01',
		as: 'h1',
		children: 'Heading Mono 01',
	},
}

export const HeadingMono02: Story = {
	name: 'Heading Mono 02',
	args: {
		variant: 'heading-mono-02',
		as: 'h2',
		children: 'Heading Mono 02',
	},
}

export const HeadingMono03: Story = {
	name: 'Heading Mono 03',
	args: {
		variant: 'heading-mono-03',
		as: 'h3',
		children: 'Heading Mono 03',
	},
}

export const HeadingMono04: Story = {
	name: 'Heading Mono 04',
	args: {
		variant: 'heading-mono-04',
		as: 'h4',
		children: 'Heading Mono 04',
	},
}

// ── Body ──────────────────────────────────────────────────

export const BodyLarge: Story = {
	name: 'Body Large',
	args: {
		variant: 'body-large',
		as: 'p',
		children: 'Body Large — the quick brown fox jumps over the lazy dog.',
	},
}

export const Body: Story = {
	args: {
		variant: 'body',
		as: 'p',
		children: 'Body — the quick brown fox jumps over the lazy dog.',
	},
}

export const BodySmall: Story = {
	name: 'Body Small',
	args: {
		variant: 'body-small',
		as: 'p',
		children: 'Body Small — the quick brown fox jumps over the lazy dog.',
	},
}

export const Caption: Story = {
	args: {
		variant: 'caption',
		as: 'span',
		children: 'Caption — supplementary label or metadata text.',
	},
}

export const BodyMonoLarge: Story = {
	name: 'Body Mono Large',
	args: {
		variant: 'body-mono-large',
		as: 'p',
		children: 'Body Mono Large — the quick brown fox jumps over the lazy dog.',
	},
}

export const BodyMono: Story = {
	name: 'Body Mono',
	args: {
		variant: 'body-mono',
		as: 'p',
		children: 'Body Mono — the quick brown fox jumps over the lazy dog.',
	},
}

export const BodyMonoSmall: Story = {
	name: 'Body Mono Small',
	args: {
		variant: 'body-mono-small',
		as: 'p',
		children: 'Body Mono Small — the quick brown fox jumps over the lazy dog.',
	},
}

export const CaptionMono: Story = {
	name: 'Caption Mono',
	args: {
		variant: 'caption-mono',
		as: 'span',
		children: 'Caption Mono — supplementary label or metadata text.',
	},
}
