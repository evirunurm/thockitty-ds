import type { Meta, StoryObj } from '@storybook/react'
import { tokens } from '../ts/spacing'

const SpacingScale = () => (
	<div style={{ fontFamily: 'system-ui, sans-serif' }}>
		<table style={{ width: '100%', borderCollapse: 'collapse' }}>
			<thead>
				<tr
					style={{
						textAlign: 'left',
						borderBottom: '2px solid #e0e0e0',
					}}
				>
					<th style={{ padding: '8px 12px' }}>Token</th>
					<th style={{ padding: '8px 12px' }}>Value</th>
					<th style={{ padding: '8px 12px' }}>Preview</th>
					<th style={{ padding: '8px 12px' }}>CSS Variable</th>
				</tr>
			</thead>
			<tbody>
				{tokens.map((token) => (
					<tr
						key={token.name}
						style={{ borderBottom: '1px solid #f0f0f0' }}
					>
						<td
							style={{
								padding: '8px 12px',
								fontSize: 13,
								fontWeight: 600,
							}}
						>
							{token.path}
						</td>
						<td
							style={{
								padding: '8px 12px',
								fontSize: 13,
								fontFamily: 'monospace',
							}}
						>
							{token.value}
						</td>
						<td style={{ padding: '8px 12px' }}>
							<div
								style={{
									width: token.value,
									height: 16,
									backgroundColor: '#e65f89',
									borderRadius: 2,
								}}
							/>
						</td>
						<td
							style={{
								padding: '8px 12px',
								fontSize: 11,
								fontFamily: 'monospace',
								color: '#999',
							}}
						>
							var({token.cssVariable})
						</td>
					</tr>
				))}
			</tbody>
		</table>
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
