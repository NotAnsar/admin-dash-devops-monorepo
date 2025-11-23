import { fetchCustomerSegmentation } from '@/api/analytics';
import React from 'react';
import CustomerSegmentation from './CustomerSegmentation';

export default async function CustomerSegmentationServer({
	timeRange,
}: {
	timeRange: string;
}) {
	const data = await fetchCustomerSegmentation(timeRange);

	return <CustomerSegmentation data={data || []} />;
}
