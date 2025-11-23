'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { type CategoryPerformance } from '@/types/analytics';
import { DonutChart } from '@tremor/react';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

export default function CategoryPerformance({
	data,
}: {
	data: CategoryPerformance[];
}) {
	const dollarFormatter = (value: number) => `$${value.toLocaleString()}`;

	return (
		<Card className='col-span-1'>
			<CardHeader>
				<CardTitle>Category Performance</CardTitle>
				<CardDescription>Revenue by product category</CardDescription>
			</CardHeader>
			<CardContent>
				<DonutChart
					className='h-72'
					data={data}
					category='sales'
					index='category'
					valueFormatter={dollarFormatter}
					colors={['blue', 'violet', 'indigo', 'rose', 'cyan']}
					showAnimation={true}
					showLabel={false}
					showTooltip={true}
				/>
			</CardContent>
		</Card>
	);
}

export function CategoryPerformanceSkeleton({
	className,
}: {
	className?: string;
}) {
	return (
		<Card className={cn('rounded-lg', className)}>
			<CardHeader>
				<CardTitle>
					<Skeleton className='h-8 w-48' />
				</CardTitle>
				<CardDescription>
					<Skeleton className='h-4 w-56 mt-2' />
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='h-72 flex items-center justify-center'>
					<Skeleton className='h-full w-full rounded-full max-w-[240px] max-h-[240px]' />
				</div>
			</CardContent>
		</Card>
	);
}
