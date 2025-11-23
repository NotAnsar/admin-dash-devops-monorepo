import { fetchSalesByDayOfWeek } from '@/api/analytics';
import React from 'react';
import SalesByDayOfWeek from './SalesByDayOfWeek';

export default async function SalesByDayOfWeekServer({
	timeRange,
}: {
	timeRange: string;
}) {
	const data = await fetchSalesByDayOfWeek(timeRange);
	return <SalesByDayOfWeek data={data || []} />;
}
