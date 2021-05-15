import React from 'react'

interface Props {
	onChange(event: {
		target: { value: React.SetStateAction<string> };
	}): void;
	autoFocus?: any
	value: string
	onKeyDown: (e: any) => Promise<void>
}

const Items = React.forwardRef<HTMLInputElement, Props>(
	({ onChange, autoFocus, value, onKeyDown }, ref) => (
		<input
			type='text'
			onChange={onChange}
			ref={ref}
			autoFocus
			value={value}
			onKeyDown={onKeyDown}
		/>
	),
);

export default Items