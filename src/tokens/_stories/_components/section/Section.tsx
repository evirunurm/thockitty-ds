import { PropsWithChildren } from 'react'
import styles from './Section.module.css'

type SectionParams = {
	title: string
	description?: string
	bordered?: boolean
	padded?: boolean
}

export const Section = ({
	title,
	description,
	bordered,
	padded,
	children,
}: PropsWithChildren<SectionParams>) => {
	const contentClasses = [
		bordered ? styles.bordered : undefined,
		padded ? styles.padded : undefined,
	].filter(Boolean).join(' ') || undefined

	return (
		<section className={styles.section}>
			<div className={styles.header}>
				<h2>{title}</h2>
				{description && <p className={styles.description}>{description}</p>}
			</div>
			<div className={contentClasses}>{children}</div>
		</section>
	)
}
