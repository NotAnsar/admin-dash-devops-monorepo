'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '../../ui/button';
import { ArrowUpDown, Shield, ShieldCheck } from 'lucide-react';
import Badge from '../../Badge';
import ActionCell from './ActionCell';
import { User } from '@/types/user';
import { formatTimestamp } from '@/lib/utils';

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: 'email',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='px-0'
				>
					Email
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
	},
	{
		accessorKey: 'firstName',
		header: 'First Name',
	},
	{
		accessorKey: 'lastName',
		header: 'Last Name',
	},
	{
		accessorKey: 'role',
		header: 'Status',
		cell: ({ row }) => {
			const role = row.getValue('role');

			return (
				<Badge variant={role === 'ADMIN' ? 'admin' : 'archive'}>
					{role === 'ADMIN' ? (
						<>
							<ShieldCheck className='w-3 h-auto' /> Admin
						</>
					) : (
						<>
							<Shield className='w-3 h-auto' /> User
						</>
					)}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'createdAt',
		header: 'Date Joined',
		cell: ({ row }) => (
			<div className='text-sm text-nowrap'>
				{formatTimestamp(row.getValue('createdAt'))}
			</div>
		),
	},
	{
		id: 'actions',
		cell: ({ row }) => <ActionCell user={row.original} />,
	},
];
