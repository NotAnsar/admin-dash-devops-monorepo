'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { generateInvoicePDF } from '@/lib/generate-invoice';
import { Order } from '@/types/order';
import { FileDown } from 'lucide-react';
import { useState } from 'react';

export default function OrderInvoiceButton({ order }: { order: Order }) {
	const [isLoading, setIsLoading] = useState(false);

	const handleDownloadInvoice = async () => {
		setIsLoading(true);
		try {
			const { url, filename } = generateInvoicePDF(order);

			const link = document.createElement('a');
			link.href = url;
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			toast({
				description: 'Invoice generated and downloaded successfully',
			});
		} catch (error) {
			console.error('Error generating invoice:', error);
			toast({
				variant: 'destructive',
				description: 'Failed to generate invoice',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			onClick={handleDownloadInvoice}
			disabled={isLoading}
			className='flex items-center gap-2'
		>
			{isLoading ? (
				<span className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
			) : (
				<FileDown className='h-4 w-4' />
			)}
			{isLoading ? 'Generating...' : 'Download Invoice'}
		</Button>
	);
}
