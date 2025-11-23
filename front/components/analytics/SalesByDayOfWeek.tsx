'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { BarChart, LineChart } from '@tremor/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type SalesByDay } from '@/types/analytics';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

export default function SalesByDayOfWeek({ data }: { data: SalesByDay[] }) {
	const dollarFormatter = (value: number) => `$${value.toLocaleString()}`;
	const numberFormatter = (value: number) => value.toLocaleString();

	return (
		<Card className='col-span-1'>
			<CardHeader>
				<CardTitle>Sales by Day of Week</CardTitle>
				<CardDescription>
					Revenue and transaction patterns throughout the week
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue='bar'>
					<div className='flex justify-end mb-4'>
						<TabsList>
							<TabsTrigger value='bar'>Bar</TabsTrigger>
							<TabsTrigger value='line'>Line</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent value='bar'>
						<BarChart
							className='h-80'
							data={data}
							index='day'
							categories={['sales']}
							colors={['violet']}
							valueFormatter={dollarFormatter}
							showAnimation={true}
							showLegend={false}
						/>
					</TabsContent>

					<TabsContent value='line'>
						<LineChart
							className='h-80'
							data={data}
							index='day'
							categories={['sales', 'transactions']}
							colors={['violet', 'emerald']}
							valueFormatter={(value: number, category?: string) => {
								if (category === 'sales') return dollarFormatter(value);
								return numberFormatter(value);
							}}
							showAnimation={true}
							showLegend={true}
							yAxisWidth={80}
						/>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}

export function SalesByDayOfWeekSkeleton({
	className,
}: {
	className?: string;
}) {
	return (
		<Card className={cn('col-span-1', className)}>
			<CardHeader>
				<CardTitle>
					<Skeleton className='h-8 w-48' />
				</CardTitle>
				<CardDescription>
					<Skeleton className='h-4 w-64 mt-2' />
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='flex justify-end mb-4'>
					<Skeleton className='h-9 w-32 rounded-md' />
				</div>
				<div className='h-80 w-full'>
					<Skeleton className='h-full w-full' />
				</div>
			</CardContent>
		</Card>
	);
}
