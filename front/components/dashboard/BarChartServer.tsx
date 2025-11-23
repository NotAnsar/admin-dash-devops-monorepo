import { fetchMonthlyRevenue } from '@/api/home';
import React from 'react';
import BarChartRevenue from './BarChartRevenue';

export default async function BarChartServer() {
	const res = await fetchMonthlyRevenue();

	if (!res) return null;

	return (
		<BarChartRevenue
			className='xl:col-span-3'
			data={res.map((r) => ({
				date: new Date(r.month + '-01').toLocaleDateString('en-US', {
					month: 'short',
				}),
				Sales: r.revenue,
			}))}
		/>
	);
}
