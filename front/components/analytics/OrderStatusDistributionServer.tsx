import React from 'react';
import OrderStatusDistribution from './OrderStatusDistribution';
import { fetchOrderStatusDistribution } from '@/api/analytics';

export default async function OrderStatusDistributionServer({
	timeRange,
}: {
	timeRange: string;
}) {
	const data = await fetchOrderStatusDistribution(timeRange);

	return <OrderStatusDistribution data={data || []} />;
}
