'use client';

import { Order } from '@/types/order';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '../../ui/button';
import { ArrowUpDown } from 'lucide-react';

import { generateAvatarFallback } from '@/config/dashboard';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatTimestamp } from '@/lib/utils';
import StatusCell from './StatusCell';
import ActionCell from './ActionCell';

export const columns: ColumnDef<Order>[] = [
	{
		accessorKey: 'userName',
		accessorFn: (row) => row.userName,
		enableHiding: false,
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='pl-0'
				>
					User
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const { userName, userEmail } = row.original;

			return (
				<div className='flex items-center gap-4 '>
					<Avatar className='hidden h-9 w-9 sm:flex'>
						<AvatarFallback>
							{generateAvatarFallback(
								userName.split(' ')[0],
								userName.split(' ')[1]
							)}
						</AvatarFallback>
					</Avatar>
					<div className='grid gap-1'>
						<p className='text-sm font-medium leading-none'>{userName}</p>
						<p className='text-sm text-muted-foreground'>{userEmail}</p>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: 'items',
		enableHiding: false,
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='pl-0'
				>
					Products
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const order_Items = row.original.items;

			return (
				<div className='grid gap-1'>
					{order_Items.map((item) => (
						<p className='text-sm font-medium leading-none' key={item.id}>
							{item.productName}
							<span className='text-muted-foreground'>{' * '}</span>
							{item.quantity}
						</p>
					))}
				</div>
			);
		},
	},
	{
		accessorKey: 'total',
		enableHiding: false,
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Total
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const price = parseFloat(row.getValue('total'));
			const formatted = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			}).format(price);

			return <div className='font-medium pl-4'>{formatted}</div>;
		},
	},

	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => <StatusCell order={row.original} />,

		// cell: ({ row }) => {
		// 	const status = row.original.status;

		// 	let variant: 'success' | 'error' | 'archive' | 'admin';
		// 	let IconComponent;
		// 	switch (status) {
		// 		case 'NEW':
		// 			variant = 'archive';
		// 			IconComponent = RefreshCcw;
		// 			break;
		// 		case 'COMPLETED':
		// 			variant = 'success';
		// 			IconComponent = ShieldCheck;
		// 			break;
		// 		case 'CANCELED':
		// 			variant = 'error';
		// 			IconComponent = Archive;
		// 			break;
		// 		default:
		// 			variant = 'archive';
		// 			IconComponent = Loader;
		// 	}

		// 	return (
		// 		<Badge variant={variant}>
		// 			<IconComponent className='w-3 h-auto' />
		// 			{status}
		// 		</Badge>
		// 	);
		// },
	},
	{
		accessorKey: 'createdAt',
		enableSorting: true,
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='pl-0'
				>
					Ordered At
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<div className='text-sm text-nowrap'>
					{formatTimestamp(row.original.createdAt, true)}
				</div>
			);
		},
		sortingFn: (rowA, rowB, columnId) => {
			const dateA = new Date(rowA.original.createdAt).getTime();
			const dateB = new Date(rowB.original.createdAt).getTime();
			return dateA > dateB ? 1 : dateA < dateB ? -1 : 0;
		},
	},
	// {
	// 	id: 'actions',
	// 	enableHiding: false,
	// 	cell: ({ row }) => <ActionCell order={row.original} />,
	// },
	{
		id: 'actions',
		enableHiding: false,
		header: 'Actions',
		cell: ({ row }) => <ActionCell order={row.original} />,
	},
];
