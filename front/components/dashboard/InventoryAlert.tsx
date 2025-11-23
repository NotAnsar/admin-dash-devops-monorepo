import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';

import Link from 'next/link';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../ui/table';

import Badge from '../Badge';
import { Archive, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { fetchInventoryAlerts } from '@/api/home';

export default async function InventoryAlert({
	className,
}: {
	className?: string;
}) {
	const res = await fetchInventoryAlerts();

	if (!res) return null;

	return (
		<Card x-chunk='dashboard-01-chunk-5' className={className}>
			<CardHeader>
				<CardTitle className='flex justify-between items-end '>
					<span>Inventory Alert</span>

					<Link
						href='/products'
						className={cn(buttonVariants({ size: 'sm' }), 'ml-auto gap-1')}
					>
						View All
						<ArrowUpRight className='h-4 w-4' />
					</Link>
				</CardTitle>

				<CardDescription>
					Some of your products are out of stock and running low in inventory
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Product</TableHead>
							<TableHead className='hidden sm:table-cell'>Price</TableHead>
							<TableHead className='hidden sm:table-cell'>Status</TableHead>
							<TableHead className='text-right'>Stock</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{res.map((p) => (
							<TableRow key={p.productId}>
								<TableCell>
									<div className='font-medium'>{p.productName}</div>
									<div className='hidden text-sm text-muted-foreground md:inline'>
										{p.categoryName}
									</div>
								</TableCell>
								<TableCell className='hidden sm:table-cell'>
									${p.productPrice.toFixed(2)}
								</TableCell>

								<TableCell className='hidden sm:table-cell'>
									<Badge variant={p.archived ? 'archive' : 'success'}>
										{p.archived ? (
											<>
												<Archive className='w-3 h-auto' /> Archived
											</>
										) : (
											<>
												<ShieldCheck className='w-3 h-auto' /> Active
											</>
										)}
									</Badge>
								</TableCell>

								<TableCell className={'text-right font-medium'}>
									{p.currentStock}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

export function InventoryAlertSkeleton({ className }: { className?: string }) {
	return (
		<Card x-chunk='dashboard-01-chunk-5' className={className}>
			<CardHeader>
				<CardTitle className='flex justify-between items-end'>
					<span>Inventory Alert</span>
					<div className={cn(buttonVariants({ size: 'sm' }), 'ml-auto gap-1')}>
						View All
						<ArrowUpRight className='h-4 w-4' />
					</div>
				</CardTitle>
				<CardDescription>
					Some of your products are out of stock and running low in inventory
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Product</TableHead>
							<TableHead className='hidden sm:table-cell'>Price</TableHead>
							<TableHead className='hidden sm:table-cell'>Status</TableHead>
							<TableHead className='text-right'>Stock</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array(5)
							.fill(0)
							.map((_, i) => (
								<TableRow key={i}>
									<TableCell>
										<div className='space-y-2'>
											<Skeleton className='h-4 w-24' />
											<Skeleton className='h-3 w-16 hidden md:block' />
										</div>
									</TableCell>
									<TableCell className='hidden sm:table-cell'>
										<Skeleton className='h-4 w-12' />
									</TableCell>
									<TableCell className='hidden sm:table-cell'>
										<Skeleton className='h-6 w-20' />
									</TableCell>
									<TableCell className='text-right'>
										<Skeleton className='h-4 w-8 ml-auto' />
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
