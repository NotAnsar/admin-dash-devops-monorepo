'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { RevenueTrend } from '@/types/analytics';
import { AreaChart } from '@tremor/react';
import { Skeleton } from '../ui/skeleton';

export default function RevenueOrderTrends({
	salesTrendData,
}: {
	salesTrendData: RevenueTrend[];
}) {
	const dollarFormatter = (value: number) => `$${value.toLocaleString()}`;
	const numberFormatter = (value: number) => value.toLocaleString();

	return (
		<Card className='col-span-1'>
			<CardHeader>
				<CardTitle>Revenue & Order Trends</CardTitle>
				<CardDescription>Monthly sales and order volume</CardDescription>
			</CardHeader>
			<CardContent>
				<AreaChart
					className='h-72'
					data={salesTrendData}
					index='date'
					categories={['revenue', 'orders']}
					colors={['indigo', 'cyan']}
					valueFormatter={(value: number, category?: string) => {
						if (category === 'revenue') return dollarFormatter(value);
						return numberFormatter(value);
					}}
					yAxisWidth={60}
					showAnimation={true}
					showLegend={true}
				/>
			</CardContent>
		</Card>
	);
}

export function RevenueOrderTrendsSkeleton({
	className,
}: {
	className?: string;
}) {
	return (
		<Card className={`col-span-1 ${className}`}>
			<CardHeader>
				<div className='space-y-2'>
					<Skeleton className='h-5 w-1/3' />
					<Skeleton className='h-4 w-1/2' />
				</div>
			</CardHeader>
			<CardContent>
				<div className='h-72 relative'>
					{/* Chart area skeleton */}
					<Skeleton className='h-full w-full' />

					{/* Legend skeletons */}
					<div className='absolute bottom-2 right-2 flex items-center space-x-4'>
						<div className='flex items-center space-x-1'>
							<Skeleton className='h-3 w-3 rounded-full' />
							<Skeleton className='h-4 w-16' />
						</div>
						<div className='flex items-center space-x-1'>
							<Skeleton className='h-3 w-3 rounded-full' />
							<Skeleton className='h-4 w-16' />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
