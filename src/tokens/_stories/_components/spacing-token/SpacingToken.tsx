import { TokenButton } from '../token-button/TokenButton'
import styles from './SpacingToken.module.css'

type SpacingTokenParams = {
	token: {
		name: string
		path: string
		value: string
		cssVariable: string
	}
}

const COLORS = {
	baseBlack: 'var(--foundation-color-base-black)',
	gray100: 'var(--foundation-color-gray-100)',
	gray300: 'var(--foundation-color-gray-300)',
	gray500: 'var(--foundation-color-gray-500)',
}

const CAPTION_MONO = {
	fontFamily: 'Geist Mono, monospace',
	fontSize: 12,
	fontWeight: 400,
}

function getLabel(path: string): string {
	return path.split('.').pop() ?? ''
}

export const SpacingToken = ({ token }: SpacingTokenParams) => {
	return (
		<div className={styles.card}>
			<div className={styles.stage} style={{ backgroundColor: COLORS.gray100 }}>
				<div
					className={styles.bar}
					style={{ width: token.value, backgroundColor: '#e65f89' }}
				/>
			</div>
			<div className={styles.meta}>
				<span style={{ ...CAPTION_MONO, fontWeight: 500, color: COLORS.baseBlack }}>
					{getLabel(token.path)}
				</span>
				<span style={{ ...CAPTION_MONO, color: COLORS.gray500 }}>{token.value}</span>
			</div>
			<div className={styles.divider} style={{ backgroundColor: COLORS.gray300 }} />
			<TokenButton value={token.cssVariable} />
		</div>
	)
}
