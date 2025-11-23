'use client';

import { Button } from '@/components/ui/button';
import { Order } from '@/types/order';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface DownloadOrdersCSVProps {
	orders: Order[];
}

export default function DownloadOrdersCSV({ orders }: DownloadOrdersCSVProps) {
	const [isGenerating, setIsGenerating] = useState(false);

	const generateCSV = () => {
		setIsGenerating(true);

		try {
			// Define CSV headers
			const headers = [
				'Order ID',
				'Customer Name',
				'Customer Email',
				'Date',
				'Status',
				'Total',
				'Items',
			].join(',');

			// Generate CSV rows
			const rows = orders.map((order) => {
				// Format the date
				const date = new Date(order.createdAt).toLocaleDateString();

				// Format the items
				const itemsList = order.items
					.map((item) => `${item.productName} (${item.quantity})`)
					.join('; ');

				return [
					order.id,
					`"${order.userName.replace(/"/g, '""')}"`, // Handle quotes in names
					order.userEmail,
					date,
					order.status,
					order.total.toFixed(2),
					`"${itemsList.replace(/"/g, '""')}"`, // Handle quotes in product names
				].join(',');
			});

			// Combine headers and rows
			const csvContent = [headers, ...rows].join('\n');

			// Create a Blob from the CSV content
			const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

			// Create a download link
			const link = document.createElement('a');
			const url = URL.createObjectURL(blob);

			// Set link properties
			link.setAttribute('href', url);
			link.setAttribute(
				'download',
				`orders_${new Date().toISOString().split('T')[0]}.csv`
			);
			link.style.visibility = 'hidden';

			// Append to document, click and remove
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			// Clean up the URL
			URL.revokeObjectURL(url);

			toast({
				description: 'Orders exported to CSV successfully',
			});
		} catch (error) {
			console.error('Error generating CSV:', error);
			toast({
				variant: 'destructive',
				description: 'Failed to generate CSV file',
			});
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<Button
			onClick={generateCSV}
			disabled={isGenerating}
			className='flex items-center gap-2'
		>
			{isGenerating ? (
				<span className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
			) : (
				<Download className='h-4 w-4' />
			)}
			{isGenerating ? 'Generating...' : 'Download CSV'}
		</Button>
	);
}
