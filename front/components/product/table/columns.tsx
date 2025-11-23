'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '../../ui/button';
import {
	Archive,
	ArrowUpDown,
	BadgeInfo,
	ShieldCheck,
	ShieldX,
} from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import Badge from '../../Badge';
import ActionCell from './ActionCell';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { Color } from '@/types/color';
import { Size } from '@/types/size';

export const columns: ColumnDef<Product>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		enableHiding: false,
	},
	{
		accessorKey: 'price',
		enableHiding: false,

		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Price
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const price = parseFloat(row.getValue('price'));
			const formatted = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			}).format(price);

			return <div className='font-medium pl-4'>{formatted}</div>;
		},
	},
	{
		accessorKey: 'stock',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					In Stock
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const stock = parseInt(row.getValue('stock'));

			if (stock <= 0) {
				return (
					<Badge variant={'error'} className='px-2 text-nowrap ml-4'>
						Out of Stock
					</Badge>
				);
			}
			return <div className='font-medium ml-4'>{stock}</div>;
		},
	},
	{
		accessorKey: 'category',
		header: 'Category',
		cell: ({ row }) => {
			const category: Category = row.getValue('category');

			return <div>{category.name}</div>;
		},
		filterFn: (row, key, searchValue) => {
			const category: Category = row.getValue(key);

			return category?.id === searchValue;
		},
	},

	{
		accessorKey: 'color',
		header: 'Color',
		cell: ({ row }) => {
			const color: Color = row.getValue('color');
			return <div>{color?.name}</div>;
		},
	},
	{
		accessorKey: 'size',
		header: 'Size',
		cell: ({ row }) => {
			const size: Size = row.getValue('size');
			return <div>{size?.name}</div>;
		},
	},
	{
		accessorKey: 'archived',
		header: 'Status',
		cell: ({ row }) => {
			const archived = row.getValue('archived');

			return (
				<Badge variant={archived ? 'archive' : 'success'}>
					{archived ? (
						<>
							<Archive className='w-3 h-auto' /> Archived
						</>
					) : (
						<>
							<ShieldCheck className='w-3 h-auto' /> Active
						</>
					)}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'featured',
		header: () => (
			<div className='flex gap-2 items-center relative'>
				Featured
				<DropdownMenu>
					<DropdownMenuTrigger asChild className='cursor-pointer'>
						<BadgeInfo className='h-4 w-4' />
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end' className='w-[100px]'>
						<DropdownMenuItem className='text-xs'>
							Featured Product Appear on the Home Page
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		),
		cell: ({ row }) => {
			const featured = row.getValue('featured');

			return (
				<Badge
					variant={featured ? 'success' : 'archive'}
					className='text-nowrap'
				>
					{featured ? (
						<>
							<ShieldCheck className='w-3 h-auto' /> Featured
						</>
					) : (
						<>
							<ShieldX className='w-3 h-auto' /> Not Featured
						</>
					)}
				</Badge>
			);
		},
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => (
			<ActionCell id={row.original.id} archived={row.original.archived} />
		),
	},
];
