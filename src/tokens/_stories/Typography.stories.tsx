import type { Meta, StoryObj } from '@storybook/react'
import { tokens } from '../ts/typography'
import { TypographyToken } from './_components/typography-token/TypographyToken'
import { Section } from './_components/section/Section'

const groups = tokens.reduce<Record<string, typeof tokens>>((acc, token) => {
	const parts = token.path.split('.')
	const group = parts[2] ?? 'other'
	;(acc[group] ??= []).push(token)
	return acc
}, {})

const TypographyStyles = () => (
	<div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
		{Object.entries(groups).map(([group, groupTokens]) => (
			<Section key={group} title={group}>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					{groupTokens.map((token) => (
						<TypographyToken key={token.name} token={token} />
					))}
				</div>
			</Section>
		))}
	</div>
)

const meta: Meta = {
	title: 'Tokens/Typography',
	tags: ['autodocs', '!dev'],
	parameters: {
		docs: {
			page: TypographyStyles,
		},
	},
}

export default meta
type Story = StoryObj

export const Default: Story = {
	render: () => <TypographyStyles />,
}
