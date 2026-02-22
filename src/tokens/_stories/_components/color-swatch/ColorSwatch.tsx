import { useState } from 'react'
import { TokenButton } from '../token-button/TokenButton'

type ColorSwatchParams = {
	color: Color
}

type Color = {
	name: string
	path: string
	value: string
	cssVariable: string
}

function getLabel(path: string): string {
	const last = path.split('.').pop() ?? ''
	return last.charAt(0).toUpperCase() + last.slice(1)
}

const SIZE = 150
const STROKE_WIDTH = 1
const RADIUS = (SIZE - STROKE_WIDTH) / 2

const COLORS = {
	baseBlack: 'var(--foundation-color-base-black)',
	baseWhite: 'var(--foundation-color-base-white)',
	gray200: 'var(--foundation-color-gray-200)',
	gray300: 'var(--foundation-color-gray-300)',
	gray500: 'var(--foundation-color-gray-500)',
}

const CAPTION_MONO = {
	fontFamily: 'Geist Mono, monospace',
	fontSize: 12,
	fontWeight: 400,
}

export const ColorSwatch = ({ color }: ColorSwatchParams) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<div
				style={{
					width: SIZE,
					height: SIZE,
					borderRadius: '50%',
					overflow: 'hidden',
					position: 'relative',
					background: COLORS.baseWhite,
				}}
			>
				<svg
					width={SIZE}
					height={SIZE}
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						zIndex: 1,
						pointerEvents: 'none',
					}}
				>
					<circle
						cx={SIZE / 2}
						cy={SIZE / 2}
						r={RADIUS}
						fill="none"
						strokeWidth={STROKE_WIDTH}
						strokeDasharray="5 5"
						style={{ stroke: COLORS.gray200 }}
					/>
				</svg>
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: '50%',
						backgroundColor: color.value,
					}}
				/>
				<div
					style={{
						position: 'absolute',
						top: 'calc(50% + 12px)',
						left: '50%',
						transform: 'translate(-50%)',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 6,
					}}
				>
					<span
						style={{
							...CAPTION_MONO,
							fontWeight: 500,
							color: COLORS.baseBlack,
						}}
					>
						{getLabel(color.path)}
					</span>
					<div
						style={{
							width: 24,
							height: 1,
							backgroundColor: COLORS.gray300,
							borderRadius: 1,
						}}
					/>
					<span
						style={{
							...CAPTION_MONO,
							color: COLORS.gray500,
						}}
					>
						{color.value.toUpperCase()}
					</span>
				</div>
			</div>
			<TokenButton value={color.cssVariable} />
		</div>
	)
}
