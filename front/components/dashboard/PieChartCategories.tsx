'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { DonutChart } from '@tremor/react';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

export default function PieChartCategories({
	className,
	data,
}: {
	className?: string;
	data: {
		name: string;
		value: number;
	}[];
}) {
	return (
		<Card className={cn('rounded-lg flex flex-col gap-2', className)}>
			<CardHeader>
				<CardTitle className='dark:text-foreground text-foreground text-2xl font-semibold leading-none tracking-tight flex justify-between items-end'>
					Category Sales Performance
				</CardTitle>
				<CardDescription className='dark:text-muted-foreground text-muted-foreground text-sm mt-2'>
					Analyze recent revenue sales trends for each category to make informed
					strategic decisions.
				</CardDescription>
			</CardHeader>

			<DonutChart
				data={data}
				className='min-h-80 h-80 lg:min-h-96 lg:h-full p-6'
				variant='pie'
				valueFormatter={dataFormatter}
				showAnimation
			/>
		</Card>
	);
}

const dataFormatter = (number: number) =>
	`$ ${Intl.NumberFormat('us').format(number).toString()}`;

export function PieChartCategoriesSkeleton({
	className,
}: {
	className?: string;
}) {
	return (
		<Card className={cn('rounded-lg flex flex-col gap-2', className)}>
			<CardHeader>
				<CardTitle className='dark:text-foreground text-foreground text-2xl font-semibold leading-none tracking-tight flex justify-between items-end'>
					<Skeleton className='h-6 w-64' />
				</CardTitle>
				<CardDescription className='dark:text-muted-foreground text-muted-foreground text-sm mt-2'>
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-3/4 mt-1' />
				</CardDescription>
			</CardHeader>

			<div className='min-h-80 h-80 lg:min-h-96 lg:h-full p-6 flex items-center justify-center'>
				<div className='relative w-auto h-full aspect-square rounded-full'>
					<Skeleton className='absolute inset-0 rounded-full' />
					<Skeleton className='absolute inset-[15%] rounded-full bg-background' />
				</div>
			</div>
		</Card>
	);
}
