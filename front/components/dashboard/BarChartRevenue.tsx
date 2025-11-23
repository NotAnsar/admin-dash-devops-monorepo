'use client';

import { cn } from '@/lib/utils';
import { BarChart } from '@tremor/react';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export default function BarChartRevenue({
	className,
	data,
}: {
	className?: string;
	data: { date: string; Sales: number }[];
}) {
	return (
		<Card
			className={cn('r</CardHeader>ounded-lg flex flex-col gap-2', className)}
		>
			<CardHeader className='px-4 md:px-6'>
				<CardTitle className='dark:text-foreground text-foregrou</CardTitle>nd text-2xl font-semibold leading-none tracking-tight flex justify-between items-end '>
					Revenue for Last Months
				</CardTitle>
				<CardDescription className='dark:text-muted-foreground text-muted-foreground text-sm mt-2'>
					Gain insights into recent revenue sales trends to inform strategic
					decisions.
				</CardDescription>
			</CardHeader>

			<BarChart
				className='h-56 sm:h-80 lg:h-full px-4 sm:px-6 pb-6'
				data={data}
				index='date'
				showAnimation={true}
				categories={['Sales']}
				colors={['blue']}
				valueFormatter={valueFormatter}
				yAxisWidth={30}
			/>
		</Card>
	);
}

function valueFormatter(number: number) {
	const formatter = new Intl.NumberFormat('en-US', {
		maximumFractionDigits: 0,
		notation: 'compact',
		compactDisplay: 'short',
		style: 'currency',
		currency: 'USD',
	});

	return formatter.format(number);
}

export function BarChartRevenueSkeleton({ className }: { className?: string }) {
	return (
		<Card className={cn('rounded-lg flex flex-col gap-2', className)}>
			<CardHeader className='px-4 md:px-6'>
				<CardTitle className='dark:text-foreground text-foreground text-2xl font-semibold leading-none tracking-tight flex justify-between items-end'>
					<Skeleton className='h-8 w-64' />
				</CardTitle>
				<CardDescription className='dark:text-muted-foreground text-muted-foreground text-sm mt-2'>
					<Skeleton className='h-4 w-full mt-2' />
				</CardDescription>
			</CardHeader>

			<div className='h-56 sm:h-80 lg:h-full px-4 sm:px-6 pb-6'>
				<Skeleton className='h-full w-full' />
			</div>
		</Card>
	);
}
