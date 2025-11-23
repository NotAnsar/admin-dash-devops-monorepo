'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { type InventoryStatus } from '@/types/analytics';
import { BarChart } from '@tremor/react';
import { Skeleton } from '../ui/skeleton';

export default function InventoryStatus({ data }: { data: InventoryStatus[] }) {
	const numberFormatter = (value: number) => value.toLocaleString();

	return (
		<Card className='col-span-1'>
			<CardHeader>
				<CardTitle>Inventory Status</CardTitle>
				<CardDescription>Current stock levels vs. threshold</CardDescription>
			</CardHeader>
			<CardContent>
				<BarChart
					className='h-72'
					data={data}
					index='name'
					categories={['stock', 'threshold']}
					colors={['blue', 'red']}
					valueFormatter={numberFormatter}
					layout='vertical'
					showAnimation={true}
					showLegend={true}
					yAxisWidth={140}
				/>
			</CardContent>
		</Card>
	);
}

export function InventoryStatusSkeleton({ className }: { className?: string }) {
	return (
		<Card className={cn('col-span-1', className)}>
			<CardHeader>
				<CardTitle>
					<Skeleton className='h-8 w-36' />
				</CardTitle>
				<CardDescription>
					<Skeleton className='h-4 w-52 mt-2' />
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='flex flex-col h-72'>
					<div className='flex items-center justify-end mb-3'>
						<Skeleton className='h-4 w-16 mr-3' />
						<Skeleton className='h-4 w-16' />
					</div>
					<div className='flex flex-1 items-center'>
						<div className='w-32'>
							{[1, 2, 3, 4, 5].map((i) => (
								<Skeleton key={i} className='h-4 w-28 mb-5' />
							))}
						</div>
						<div className='flex-1 h-full'>
							{[1, 2, 3, 4, 5].map((i) => (
								<div key={i} className='flex h-6 mb-3 gap-2 items-center'>
									<Skeleton className='h-6 w-full max-w-[120px]' />
									<Skeleton className='h-6 w-full max-w-[80px]' />
								</div>
							))}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
