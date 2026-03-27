import { PropsWithChildren } from 'react'
import styles from './DocPage.module.css'

export const DocPage = ({ children }: PropsWithChildren) => (
	<div className={styles.page}>{children}</div>
)
