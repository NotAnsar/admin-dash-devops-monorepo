import CardComponent, { CardComponentSkeleton } from './CardComponent';
import { fetchDashboardSummary } from '@/api/home';
import { Archive, CreditCard, DollarSign, Users } from 'lucide-react';

export default async function AnalyticCards() {
	const res = await fetchDashboardSummary();

	if (!res) {
		return null;
	}

	return (
		<>
			<CardComponent
				card={{
					id: 'dashboard-01-chunk-1',
					title: 'Total Clients',
					icon: Users,
					value: `+${res.totalClients}`,
					description: 'Number Of all your clients',
				}}
			/>
			<CardComponent
				card={{
					id: 'dashboard-01-chunk-3',
					title: 'Total Products',
					icon: Archive,
					value: `+${res.totalProducts}`,
					description: 'Number of all your products',
				}}
			/>
			<CardComponent
				card={{
					id: 'dashboard-01-chunk-0',
					title: 'Total Revenue',
					icon: DollarSign,
					value: '$' + res.totalRevenue.toFixed(2),
					description: 'Total earnings from all sales',
				}}
			/>
			<CardComponent
				card={{
					id: 'dashboard-01-chunk-2',
					title: 'Total Sales',
					icon: CreditCard,
					value: '+' + res.totalSales,
					description: 'Number of completed transactions',
				}}
			/>
		</>
	);
}
export function AnalyticCardsSkeleton() {
	return (
		<>
			{Array.from({ length: 4 }, (_, i) => (
				<CardComponentSkeleton key={i} />
			))}
		</>
	);
}
