import { fetchCategoryPerformance } from '@/api/analytics';
import React from 'react';
import CategoryPerformance from './CategoryPerformance';

export default async function CategoryPerformanceServer({
	timeRange,
}: {
	timeRange: string;
}) {
	const data = await fetchCategoryPerformance(timeRange);

	return <CategoryPerformance data={data || []} />;
}
