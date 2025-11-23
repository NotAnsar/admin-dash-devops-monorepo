import { fetchInventoryStatus } from '@/api/analytics';
import React from 'react';
import InventoryStatus from './InventoryStatus';

export default async function InventoryStatusServer({
	timeRange,
}: {
	timeRange: string;
}) {
	const data = await fetchInventoryStatus();
	return <InventoryStatus data={data || []} />;
}
