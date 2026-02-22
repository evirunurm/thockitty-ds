import { PropsWithChildren, useState } from 'react'
import styles from './Section.module.css'

type SectionParams = {
	title: string
}

export const Section = ({
	title,
	children,
}: PropsWithChildren<SectionParams>) => {
	return (
		<section className={styles.section}>
			<h2>{title}</h2>
			{children}
		</section>
	)
}
