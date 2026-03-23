import type { Meta, StoryObj } from '@storybook/react-webpack5'
import { tokens } from '../ts/colors'
import { ColorSwatch } from './_components/color-swatch/ColorSwatch'
import { Section } from './_components/section/Section'

const groups = tokens.reduce<Record<string, typeof tokens>>((acc, token) => {
	const parts = token.path.split('.')
	const group = parts[2] ?? 'other'
	;(acc[group] ??= []).push(token)
	return acc
}, {})

const ColorSwatches = () => (
	<div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
		{Object.entries(groups).map(([group, groupTokens]) => (
			<Section title={group}>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns:
							'repeat(auto-fill, minmax(200px, 1fr))',
						gap: 16,
					}}
				>
					{groupTokens.map((token) => (
						<ColorSwatch color={token} />
					))}
				</div>
			</Section>
		))}
	</div>
)

const meta: Meta = {
	title: 'Tokens/Colors',
	tags: ['autodocs', '!dev'],
	parameters: {
		docs: {
			page: ColorSwatches,
		},
	},
}

export default meta
type Story = StoryObj

export const Default: Story = {
	render: () => <ColorSwatches />,
}
