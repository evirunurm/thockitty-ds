import React, { useRef } from 'react'
import { useButton } from '@react-aria/button'
import type { AriaButtonProps } from '@react-aria/button'
import cx from 'classnames'
import styles from './Button.module.css'

export interface ButtonProps {
	children?: React.ReactNode
	onPress?: () => void
	disabled?: boolean
	type?: 'button' | 'submit' | 'reset'
	'aria-label'?: string
	'aria-labelledby'?: string
	'aria-describedby'?: string
	/** @default 'on-black' */
	variant?: 'on-black' | 'on-white'
	/** @default 'medium' */
	size?: 'small' | 'medium' | 'large'
	className?: string
	style?: React.CSSProperties
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(props, forwardedRef) => {
		const localRef = useRef<HTMLButtonElement>(null)
		const ref =
			(forwardedRef as React.RefObject<HTMLButtonElement>) ?? localRef
		const {
			disabled,
			variant = 'on-black',
			size = 'medium',
			children,
			className,
			style,
		} = props
		const { buttonProps } = useButton(
			{ ...props, isDisabled: disabled } as AriaButtonProps<'button'>,
			ref
		)

		return (
			<button
				{...buttonProps}
				ref={ref}
				className={cx(
					styles.button,
					variant && styles[variant],
					styles[size],
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
