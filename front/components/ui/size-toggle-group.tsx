'use client';

import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';
import { cn } from '@/lib/utils';

interface SizeToggleGroupProps {
	options: { value: string; label: string }[];
	defaultValue?: string;
	className?: string;
	name?: string;
	error?: boolean | string;
	onChange?: (value: string) => void;
}

export function SizeToggleGroup({
	options,
	defaultValue,
	className,
	name = 'sizeId',
	error,
	onChange,
}: SizeToggleGroupProps) {
	const [selectedSize, setSelectedSize] = useState(defaultValue || undefined);

	const handleValueChange = (value: string) => {
		if (value) {
			setSelectedSize(value);
			onChange?.(value);
		}
	};

	return (
		<div className='relative'>
			<input type='hidden' name={name} id={name} value={selectedSize} />
			<ToggleGroup
				type='single'
				variant='outline'
				className={cn(
					'w-full',
					error ? 'border-destructive focus-visible:ring-destructive' : '',
					className
				)}
				value={selectedSize}
				onValueChange={handleValueChange}
			>
				{options.map((option) => (
					<ToggleGroupItem key={option.value} value={option.value}>
						{option.label}
					</ToggleGroupItem>
				))}
			</ToggleGroup>
			{error && typeof error === 'string' && (
				<p className='text-sm text-destructive mt-1'>{error}</p>
			)}
		</div>
	);
}
