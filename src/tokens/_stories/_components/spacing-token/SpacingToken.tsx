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
	const label = getLabel(token.path)
	const barWidth = parseInt(token.value) * 4

	return (
		<div className={styles.row}>
			<span
				className={styles.label}
				style={{ ...CAPTION_MONO, fontWeight: 600, color: COLORS.baseBlack }}
			>
				{label}
			</span>
			<div className={styles.barTrack}>
				<div className={styles.bar} style={{ width: barWidth }} />
			</div>
			<span className={styles.value} style={{ ...CAPTION_MONO, color: COLORS.gray500 }}>
				{token.value}
			</span>
			<TokenButton value={token.cssVariable} />
		</div>
	)
}
