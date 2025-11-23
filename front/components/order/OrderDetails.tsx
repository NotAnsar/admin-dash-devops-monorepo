import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { formatTimestamp } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import StatusCell from '@/components/order/table/StatusCell';
import OrderInvoiceButton from './OrderInvoiceButton';
import { Order } from '@/types/order';

export default function OrderDetails({ order }: { order: Order }) {
	const tax = order?.total * 0.08; // Assuming a tax rate of 8%
	const grandTotal = order?.total + tax;

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex sm:items-center justify-between flex-col sm:flex-row gap-1'>
				<div className='flex items-center gap-2'>
					<Link href='/orders'>
						<Button variant='ghost' size='icon'>
							<ArrowLeft className='h-4 w-4' />
						</Button>
					</Link>
					<h1 className='text-2xl font-bold'>
						Order #{order?.id?.substring(0, 8)?.toUpperCase()}
					</h1>
				</div>
				<OrderInvoiceButton order={order} />
			</div>

			{/* Order summary */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<div className='space-y-4'>
					<div className='bg-secondary dark:bg-secondary/60 rounded-lg p-4 space-y-3'>
						<h3 className='text-md font-semibold'>Customer Information</h3>
						<Separator />
						<div className='grid grid-cols-2 gap-2'>
							<div className='text-sm text-muted-foreground'>Name</div>
							<div className='text-sm font-medium'>{order?.userName}</div>
							<div className='text-sm text-muted-foreground'>Email</div>
							<div className='text-sm font-medium'>{order?.userEmail}</div>
						</div>
					</div>

					<div className='bg-secondary dark:bg-secondary/60 rounded-lg p-4 space-y-3'>
						<h3 className='text-md font-semibold'>Order Information</h3>
						<Separator />
						<div className='grid grid-cols-2 gap-2'>
							<div className='text-sm text-muted-foreground'>Order ID</div>
							<div className='text-sm font-medium'>{order?.id}</div>
							<div className='text-sm text-muted-foreground'>Date</div>
							<div className='text-sm font-medium'>
								{formatTimestamp(order?.createdAt)}
							</div>
							<div className='text-sm text-muted-foreground'>Status</div>
							<div>
								<StatusCell order={order} />
							</div>
						</div>
					</div>
				</div>

				{/* Order items */}
				<div className='bg-card rounded-lg border shadow-sm'>
					<div className='flex flex-col h-full'>
						<div className='p-4 border-b'>
							<h3 className='text-md font-semibold'>Order Items</h3>
						</div>
						<div className='divide-y overflow-auto flex-1'>
							{order?.items?.map((item) => (
								<div
									key={item?.id}
									className='p-4 flex justify-between items-center'
								>
									<div>
										<div className='font-medium'>{item?.productName}</div>
										<div className='text-sm text-muted-foreground'>
											${item?.unitPrice?.toFixed(2)} × {item?.quantity}
										</div>
									</div>
									<div className='font-medium'>
										${item?.subtotal?.toFixed(2)}
									</div>
								</div>
							))}
						</div>
						<div className='p-4 bg-secondary dark:bg-secondary/60 mt-auto'>
							<div className='flex justify-between items-center'>
								<div className='text-sm font-medium'>Subtotal</div>
								<div className='font-medium'>${order?.total?.toFixed(2)}</div>
							</div>
							<div className='flex justify-between items-center mt-1'>
								<div className='text-sm font-medium'>Tax (8%)</div>
								<div className='font-medium'>${tax?.toFixed(2)}</div>
							</div>
							<Separator className='my-2' />
							<div className='flex justify-between items-center'>
								<div className='text-lg font-semibold'>Total</div>
								<div className='text-lg font-semibold'>
									${grandTotal?.toFixed(2)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
