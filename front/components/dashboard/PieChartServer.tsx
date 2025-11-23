import { fetchCategorySalesPerformance } from '@/api/home';
import React from 'react';
import PieChartCategories from './PieChartCategories';

export default async function PieChartServer() {
	const res = await fetchCategorySalesPerformance();

	if (!res) return null;

	return (
		<PieChartCategories
			data={res.map((r) => ({ name: r.categoryName, value: r.totalRevenue }))}
		/>
	);
}
