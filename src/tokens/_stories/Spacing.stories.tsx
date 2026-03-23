import type { Meta, StoryObj } from '@storybook/react-webpack5'
import { tokens } from '../ts/spacing'
import { SpacingToken } from './_components/spacing-token/SpacingToken'
import { Section } from './_components/section/Section'

const groups = tokens.reduce<Record<string, typeof tokens>>((acc, token) => {
	const group = token.path.split('.')[1] ?? 'other'
	;(acc[group] ??= []).push(token)
	return acc
}, {})

const SpacingScale = () => (
	<div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
		{Object.entries(groups).map(([group, groupTokens]) => (
			<Section key={group} title={group}>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
						gap: 16,
					}}
				>
					{groupTokens.map((token) => (
						<SpacingToken key={token.name} token={token} />
					))}
				</div>
			</Section>
		))}
	</div>
)

const meta: Meta = {
	title: 'Tokens/Spacing',
	tags: ['autodocs', '!dev'],
	parameters: {
		docs: {
			page: SpacingScale,
		},
	},
}

export default meta
type Story = StoryObj

export const Default: Story = {
	render: () => <SpacingScale />,
}
