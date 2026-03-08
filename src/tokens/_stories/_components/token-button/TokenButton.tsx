import { useState } from 'react'
import { Button } from '../../../../components/Button'
import styles from './TokenButton.module.css'

type TokenButtonParams = {
	value: string
}

export const TokenButton = ({ value }: TokenButtonParams) => {
	const [copied, setCopied] = useState(false)

	const handleCopy = () => {
		navigator.clipboard.writeText(value).then(() => {
			setCopied(true)
			setTimeout(() => setCopied(false), 1500)
		})
	}

	return (
		<Button
			onClick={handleCopy}
			className={styles.button}
			aria-title="Copy CSS variable name"
		>
			{copied ? 'Copied!' : value}
		</Button>
	)
}
