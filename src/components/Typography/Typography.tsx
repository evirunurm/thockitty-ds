import React from 'react'
import cx from 'classnames'
import styles from './Typography.module.css'
import { colorMap, variantMap } from './typographyMaps'

export type TypographyVariant = keyof typeof variantMap
export type TypographyColor = keyof typeof colorMap

export interface TypographyProps {
	variant: TypographyVariant
	as?: React.ElementType
	color?: TypographyColor
	className?: string
	children: React.ReactNode
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
	(
		{ variant, as: Tag = 'span', color = 'black', className, children },
		ref
	) => {
		return (
			<Tag
				ref={ref}
				className={cx(styles.typography, className)}
				style={{
					font: `var(${variantMap[variant]})`,
					...(color && { color: `var(${colorMap[color]})` }),
				}}
			>
				{children}
			</Tag>
		)
	}
)

Typography.displayName = 'Typography'
