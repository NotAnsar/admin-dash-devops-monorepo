// 'use client';

// import { Button } from '@/components/ui/button';
// import { toast } from '@/components/ui/use-toast';
// import { generateInvoicePDF } from '@/lib/generate-invoice';
// import { Order } from '@/types/order';
// import { FileDown } from 'lucide-react';
// import { useState } from 'react';

// export default function ActionCell({ order }: { order: Order }) {
// 	const [isLoading, setIsLoading] = useState(false);

// 	const handleDownloadInvoice = async () => {
// 		setIsLoading(true);
// 		try {
// 			// Generate PDF invoice using the order data we already have
// 			// No need to fetch the order again as we already have the complete data
// 			const { url, filename } = generateInvoicePDF(order);

// 			// Create an anchor and trigger download
// 			const link = document.createElement('a');
// 			link.href = url;
// 			link.download = filename;
// 			document.body.appendChild(link);
// 			link.click();
// 			document.body.removeChild(link);

// 			toast({
// 				description: 'Invoice generated and downloaded successfully',
// 			});
// 		} catch (error) {
// 			console.error('Error generating invoice:', error);
// 			toast({
// 				variant: 'destructive',
// 				description: 'Failed to generate invoice',
// 			});
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};

// 	return (
// 		<div className='flex items-center gap-2'>
// 			<Button
// 				size='sm'
// 				variant='outline'
// 				className='h-8 flex items-center gap-1'
// 				onClick={handleDownloadInvoice}
// 				disabled={isLoading}
// 			>
// 				{isLoading ? (
// 					<span className='h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent' />
// 				) : (
// 					<FileDown className='h-3.5 w-3.5' />
// 				)}
// 				<span className='sr-only md:not-sr-only md:inline-block'>
// 					{isLoading ? 'Generating...' : 'Invoice'}
// 				</span>
// 			</Button>
// 		</div>
// 	);
// }

'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { generateInvoicePDF } from '@/lib/generate-invoice';
import { Order } from '@/types/order';
import { FileDown, Eye } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function ActionCell({ order }: { order: Order }) {
	const [isLoading, setIsLoading] = useState(false);

	const handleDownloadInvoice = async () => {
		setIsLoading(true);
		try {
			// Generate PDF invoice using the order data we already have
			const { url, filename } = generateInvoicePDF(order);

			// Create an anchor and trigger download
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
		<div className='flex items-center gap-2'>
			{/* View Order Button */}
			<Link href={`/orders/${order.id}`}>
				<Button
					size='sm'
					variant='outline'
					className='h-8 flex items-center gap-1'
				>
					<Eye className='h-3.5 w-3.5' />
					<span className='sr-only md:not-sr-only md:inline-block'>View</span>
				</Button>
			</Link>

			{/* Download Invoice Button */}
			<Button
				size='sm'
				variant='outline'
				className='h-8 flex items-center gap-1'
				onClick={handleDownloadInvoice}
				disabled={isLoading}
			>
				{isLoading ? (
					<span className='h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent' />
				) : (
					<FileDown className='h-3.5 w-3.5' />
				)}
				<span className='sr-only md:not-sr-only md:inline-block'>
					{isLoading ? 'Generating...' : 'Invoice'}
				</span>
			</Button>
		</div>
	);
}
