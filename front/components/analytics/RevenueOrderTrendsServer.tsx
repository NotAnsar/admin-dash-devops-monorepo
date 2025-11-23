import { fetchRevenueTrends } from '@/api/analytics';
import React from 'react';
import RevenueOrderTrends from './RevenueOrderTrends';

export default async function RevenueOrderTrendsServer({
	timeRange,
}: {
	timeRange: string;
}) {
	const data = await fetchRevenueTrends(timeRange);

	return <RevenueOrderTrends salesTrendData={data || []} />;
}
