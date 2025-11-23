import TimeRangeSelector from '@/components/analytics/TimeRangeSelector';
import { CategoryPerformanceSkeleton } from '@/components/analytics/CategoryPerformance';
import { SalesByDayOfWeekSkeleton } from '@/components/analytics/SalesByDayOfWeek';
import RevenueOrderTrendsServer from '@/components/analytics/RevenueOrderTrendsServer';
import CategoryPerformanceServer from '@/components/analytics/CategoryPerformanceServer';
import { Suspense } from 'react';
import { RevenueOrderTrendsSkeleton } from '@/components/analytics/RevenueOrderTrends';
import OrderStatusDistributionServer from '@/components/analytics/OrderStatusDistributionServer';
import TopSellingProductsServer from '@/components/analytics/TopSellingProductsServer';
import CustomerSegmentationServer from '@/components/analytics/CustomerSegmentationServer';
import InventoryStatusServer from '@/components/analytics/InventoryStatusServer';
import SalesByDayOfWeekServer from '@/components/analytics/SalesByDayOfWeekServer';
import { OrderStatusDistributionSkeleton } from '@/components/analytics/OrderStatusDistribution';
import { TopSellingProductsSkeleton } from '@/components/analytics/TopSellingProducts';
import { CustomerSegmentationSkeleton } from '@/components/analytics/CustomerSegmentation';
import { InventoryStatusSkeleton } from '@/components/analytics/InventoryStatus';

export default function Analytics({
	searchParams: { timeRange = '6months' },
}: {
	searchParams: { timeRange?: string };
}) {
	return (
		<main className='flex flex-1 flex-col gap-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold'>Advanced Analytics</h1>
				<TimeRangeSelector timeRange={timeRange} />
			</div>

			<div className='grid gap-6 md:grid-cols-2'>
				<Suspense fallback={<RevenueOrderTrendsSkeleton />}>
					<RevenueOrderTrendsServer timeRange={timeRange} />
				</Suspense>
				<Suspense fallback={<CategoryPerformanceSkeleton />}>
					<CategoryPerformanceServer timeRange={timeRange} />
				</Suspense>
			</div>

			<div className='grid gap-6 md:grid-cols-2'>
				<Suspense fallback={<OrderStatusDistributionSkeleton />}>
					<OrderStatusDistributionServer timeRange={timeRange} />
				</Suspense>
				<Suspense fallback={<TopSellingProductsSkeleton />}>
					<TopSellingProductsServer timeRange={timeRange} />
				</Suspense>
			</div>

			{/* <div className='grid gap-6 md:grid-cols-2'>
				<Suspense fallback={<CustomerSegmentationSkeleton />}>
					<CustomerSegmentationServer timeRange={timeRange} />
				</Suspense>
				<Suspense fallback={<InventoryStatusSkeleton />}>
					<InventoryStatusServer timeRange={timeRange} />
				</Suspense>
			</div> */}

			<div className='grid gap-6'>
				<Suspense fallback={<SalesByDayOfWeekSkeleton />}>
					<SalesByDayOfWeekServer timeRange={timeRange} />
				</Suspense>
			</div>
		</main>
	);
}
