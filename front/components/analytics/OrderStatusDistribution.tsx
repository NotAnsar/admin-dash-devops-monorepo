'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { OrderStatus } from '@/types/analytics';

import { DonutChart } from '@tremor/react';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

export default function OrderStatusDistribution({
	data,
}: {
	data: OrderStatus[];
}) {
	const numberFormatter = (value: number) => value.toLocaleString();

	return (
		<Card className='col-span-1'>
			<CardHeader>
				<CardTitle>Order Status Distribution</CardTitle>
				<CardDescription>Current orders by status</CardDescription>
			</CardHeader>
			<CardContent>
				<DonutChart
					className='h-72'
					data={data}
					category='count'
					index='status'
					valueFormatter={numberFormatter}
					colors={['amber', 'green', 'rose', 'blue']}
					showAnimation={true}
					showLabel={true}
				/>
			</CardContent>
		</Card>
	);
}

export function OrderStatusDistributionSkeleton({
	className,
}: {
	className?: string;
}) {
	return (
		<Card className={cn('col-span-1', className)}>
			<CardHeader>
				<CardTitle>
					<Skeleton className='h-8 w-56' />
				</CardTitle>
				<CardDescription>
					<Skeleton className='h-4 w-40 mt-2' />
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='h-72 flex items-center justify-center'>
					<div className='relative w-48 h-48'>
						<Skeleton className='absolute inset-0 rounded-full' />
						<Skeleton className='absolute inset-[25%] rounded-full bg-background' />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
