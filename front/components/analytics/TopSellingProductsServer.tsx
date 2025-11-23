import { fetchTopSellingProducts } from '@/api/analytics';
import React from 'react';
import TopSellingProducts from './TopSellingProducts';

export default async function TopSellingProductsServer({
	timeRange,
}: {
	timeRange: string;
}) {
	const data = await fetchTopSellingProducts(timeRange);
	return <TopSellingProducts data={data || []} />;
}
