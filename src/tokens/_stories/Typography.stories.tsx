import type { Meta, StoryObj } from '@storybook/react'
import { tokens } from '../ts/typography'

const groups = tokens.reduce<Record<string, typeof tokens>>((acc, token) => {
	const parts = token.path.split('.')
	const group = parts[2] ?? 'other'
	;(acc[group] ??= []).push(token)
	return acc
}, {})

const TypographyStyles = () => (
	<div style={{ fontFamily: 'system-ui, sans-serif' }}>
		{Object.entries(groups).map(([group, groupTokens]) => (
			<div key={group} style={{ marginBottom: 48 }}>
				<h2 style={{ textTransform: 'capitalize', marginBottom: 16 }}>
					{group}
				</h2>
				{groupTokens.map((token) => {
					const shortName = token.path.split('.').pop() ?? token.name
					return (
						<div
							key={token.name}
							style={{
								marginBottom: 32,
								borderBottom: '1px solid #f0f0f0',
								paddingBottom: 24,
							}}
						>
							<div
								style={{
									fontFamily: token.fontFamily,
									fontSize: token.fontSize,
									fontWeight: token.fontWeight,
									fontStyle: token.fontStyle,
									lineHeight:
										token.lineHeight === 'auto'
											? 'normal'
											: token.lineHeight,
									marginBottom: 12,
								}}
							>
								{shortName}
							</div>
							<table
								style={{
									fontSize: 12,
									fontFamily: 'monospace',
									color: '#666',
									borderCollapse: 'collapse',
								}}
							>
								<tbody>
									<tr>
										<td
											style={{
												padding: '2px 16px 2px 0',
												fontWeight: 600,
											}}
										>
											Family
										</td>
										<td>{token.fontFamily}</td>
									</tr>
									<tr>
										<td
											style={{
												padding: '2px 16px 2px 0',
												fontWeight: 600,
											}}
										>
											Size
										</td>
										<td>{token.fontSize}</td>
									</tr>
									<tr>
										<td
											style={{
												padding: '2px 16px 2px 0',
												fontWeight: 600,
											}}
										>
											Weight
										</td>
										<td>{token.fontWeight}</td>
									</tr>
									<tr>
										<td
											style={{
												padding: '2px 16px 2px 0',
												fontWeight: 600,
											}}
										>
											Line Height
										</td>
										<td>{token.lineHeight}</td>
									</tr>
									<tr>
										<td
											style={{
												padding: '2px 16px 2px 0',
												color: '#999',
											}}
										>
											CSS Variable
										</td>
										<td style={{ color: '#999' }}>
											var({token.cssVariable})
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					)
				})}
			</div>
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
