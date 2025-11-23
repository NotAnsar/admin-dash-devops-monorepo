'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CustomerSegment } from '@/types/analytics';
import { AreaChart } from '@tremor/react';
import { Skeleton } from '../ui/skeleton';

export default function CustomerSegmentation({
	data,
}: {
	data: CustomerSegment[];
}) {
	const numberFormatter = (value: number) => value.toLocaleString();

	return (
		<Card className='col-span-1'>
			<CardHeader>
				<CardTitle>New vs. Returning Customers</CardTitle>
				<CardDescription>Customer acquisition and retention</CardDescription>
			</CardHeader>
			<CardContent>
				<AreaChart
					className='h-72'
					data={data}
					index='month'
					categories={['new', 'returning']}
					colors={['emerald', 'violet']}
					valueFormatter={numberFormatter}
					showAnimation={true}
					showLegend={true}
					stack={true}
				/>
			</CardContent>
		</Card>
	);
}

export function CustomerSegmentationSkeleton({
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
					<Skeleton className='h-4 w-48 mt-2' />
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='flex flex-col h-72'>
					<div className='flex items-center justify-end mb-3'>
						<Skeleton className='h-4 w-16 mr-3' />
						<Skeleton className='h-4 w-16' />
					</div>
					<div className='flex-1 relative'>
						<div className='absolute bottom-0 left-0 right-0 h-3/4'>
							<div className='h-full w-full relative'>
								<Skeleton className='absolute bottom-0 left-0 right-0 h-3/5 rounded-md opacity-70' />
								<Skeleton className='absolute bottom-0 left-0 right-0 h-4/5 rounded-md opacity-40' />
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
