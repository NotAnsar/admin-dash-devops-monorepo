import AnalyticCards, {
	AnalyticCardsSkeleton,
} from '@/components/dashboard/AnalyticCards';
import { BarChartRevenueSkeleton } from '@/components/dashboard/BarChartRevenue';
import BarChartServer from '@/components/dashboard/BarChartServer';

import InventoryAlert, {
	InventoryAlertSkeleton,
} from '@/components/dashboard/InventoryAlert';
import { PieChartCategoriesSkeleton } from '@/components/dashboard/PieChartCategories';
import PieChartServer from '@/components/dashboard/PieChartServer';
import RecentSales, {
	RecentSalesSkeleton,
} from '@/components/dashboard/RecentSales';

import { Suspense } from 'react';

export default async function Home() {
	return (
		<main className='flex flex-1 flex-col gap-4 md:gap-8'>
			<div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4'>
				<Suspense fallback={<AnalyticCardsSkeleton />}>
					<AnalyticCards />
				</Suspense>
			</div>
			<div className='grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-5'>
				<Suspense
					fallback={<BarChartRevenueSkeleton className='xl:col-span-3' />}
				>
					<BarChartServer />
				</Suspense>
				<Suspense fallback={<RecentSalesSkeleton />}>
					<RecentSales />
				</Suspense>
			</div>
			<div className='grid gap-4 md:gap-8 lg:grid-cols-2'>
				<Suspense fallback={<InventoryAlertSkeleton />}>
					<InventoryAlert />
				</Suspense>
				<Suspense fallback={<PieChartCategoriesSkeleton />}>
					<PieChartServer />
				</Suspense>
			</div>
		</main>
	);
}
