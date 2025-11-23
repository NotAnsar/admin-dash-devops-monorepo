'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { TopProduct } from '@/types/analytics';
import { BarChart } from '@tremor/react';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

export default function TopSellingProducts({ data }: { data: TopProduct[] }) {
	const numberFormatter = (value: number) => value.toLocaleString();

	return (
		<Card className='col-span-1'>
			<CardHeader>
				<CardTitle>Top Selling Products</CardTitle>
				<CardDescription>
					Best performing products by sales volume
				</CardDescription>
			</CardHeader>
			<CardContent>
				<BarChart
					className='h-72'
					data={data}
					index='name'
					categories={['sales']}
					colors={['blue']}
					valueFormatter={numberFormatter}
					layout='vertical'
					showAnimation={true}
					showLegend={false}
					yAxisWidth={140}
				/>
			</CardContent>
		</Card>
	);
}

export function TopSellingProductsSkeleton({
	className,
}: {
	className?: string;
}) {
	return (
		<Card className={cn('col-span-1', className)}>
			<CardHeader>
				<CardTitle>
					<Skeleton className='h-8 w-44' />
				</CardTitle>
				<CardDescription>
					<Skeleton className='h-4 w-52 mt-2' />
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='flex flex-col h-72'>
					<div className='flex items-center'>
						<div className='w-32'>
							{[1, 2, 3, 4, 5].map((i) => (
								<Skeleton key={i} className='h-4 w-28 mb-5' />
							))}
						</div>
						<div className='flex-1 h-full'>
							{[1, 2, 3, 4, 5].map((i) => (
								<div key={i} className='h-6 mb-3'>
									<Skeleton
										className={`h-6 w-${(Math.random() * 50 + 30).toFixed(0)}%`}
									/>
								</div>
							))}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
