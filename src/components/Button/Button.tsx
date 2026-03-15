import React, { useRef } from 'react'
import { useButton } from '@react-aria/button'
import type { AriaButtonProps } from '@react-aria/button'
import cx from 'classnames'
import styles from './Button.module.css'

type ButtonVariant = 'on-black' | 'on-white'

export interface ButtonProps extends AriaButtonProps<'button'> {
	variant?: ButtonVariant
	className?: string
	style?: React.CSSProperties
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(props, forwardedRef) => {
		const localRef = useRef<HTMLButtonElement>(null)
		const ref =
			(forwardedRef as React.RefObject<HTMLButtonElement>) ?? localRef
		const { buttonProps } = useButton(props, ref)
		const { variant = 'on-black', children, className, style } = props

		return (
			<button
				{...buttonProps}
				ref={ref}
				className={cx(
					styles.button,
					variant && styles[variant],
					className
				)}
				style={style}
			>
				{children}
			</button>
		)
	}
)

Button.displayName = 'Button'
