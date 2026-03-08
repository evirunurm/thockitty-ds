import { TokenButton } from '../token-button/TokenButton'
import styles from './TypographyToken.module.css'

type TypographyTokenParams = {
	token: {
		name: string
		path: string
		cssVariable: string
		fontFamily: string
		fontSize: string
		fontWeight: number
		fontStyle: string
		lineHeight: string
		letterSpacing: string
	}
}

const COLORS = {
	baseBlack: 'var(--foundation-color-base-black)',
	gray300: 'var(--foundation-color-gray-300)',
	gray500: 'var(--foundation-color-gray-500)',
}

const CAPTION_MONO = {
	fontFamily: 'Geist Mono, monospace',
	fontSize: 12,
	fontWeight: 400,
}

export const TypographyToken = ({ token }: TypographyTokenParams) => {
	const label = token.path.split('.').pop() ?? token.name
	const lineHeight = token.lineHeight === 'auto' ? 'normal' : token.lineHeight

	return (
		<div className={styles.card}>
			<div className={styles.sample}>
				<span
					className={styles.sampleText}
					style={{
						fontFamily: token.fontFamily,
						fontSize: token.fontSize,
						fontWeight: token.fontWeight,
						fontStyle: token.fontStyle,
						lineHeight,
						letterSpacing: token.letterSpacing,
						color: COLORS.baseBlack,
					}}
				>
					{label}
				</span>
			</div>
			<div className={styles.divider} style={{ backgroundColor: COLORS.gray300 }} />
			<div className={styles.meta}>
				<table className={styles.table}>
					<tbody>
						{[
							['Family', token.fontFamily],
							['Size', token.fontSize],
							['Weight', String(token.fontWeight)],
							['Line Height', token.lineHeight],
							['Letter Spacing', token.letterSpacing],
						].map(([label, value]) => (
							<tr key={label}>
								<td
									className={styles.tableLabel}
									style={{ ...CAPTION_MONO, fontWeight: 600, color: COLORS.baseBlack }}
								>
									{label}
								</td>
								<td
									className={styles.tableValue}
									style={{ ...CAPTION_MONO, color: COLORS.gray500 }}
								>
									{value}
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<TokenButton value={token.cssVariable} />
			</div>
		</div>
	)
}
