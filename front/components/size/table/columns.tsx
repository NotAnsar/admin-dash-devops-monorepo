'use client';

import { ColumnDef } from '@tanstack/react-table';
import { formatTimestamp } from '@/lib/utils';
import { Settings2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteSize } from '../DeleteSize';
import { useState } from 'react';
import { EditSize } from '../EditSize';
import { Size } from '@/types/size';

export const columns: ColumnDef<Size>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'fullname',
		header: 'Full Name',
	},
	{
		accessorKey: 'createdAt',
		header: 'Created at',
		cell: ({ row }) => {
			return (
				<div className='text-sm text-nowrap'>
					{formatTimestamp(row.getValue('createdAt'))}
				</div>
			);
		},
	},
	{
		id: 'edit',
		header: 'Edit',
		cell: ({ row }) => <EditButton size={row.original} />,
	},
	{
		id: 'delete',
		header: 'Delete',
		cell: ({ row }) => <DeleteButton size={row.original} />,
	},
];

function DeleteButton({ size }: { size: Size }) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	return (
		<>
			<Button variant={'ghost'} onClick={() => setIsDeleteDialogOpen(true)}>
				<Trash2 className='w-4 h-auto' />
			</Button>
			<DeleteSize
				id={size.id}
				open={isDeleteDialogOpen}
				setOpen={setIsDeleteDialogOpen}
			/>
		</>
	);
}

function EditButton({ size }: { size: Size }) {
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	return (
		<>
			<Button variant={'ghost'} onClick={() => setIsEditDialogOpen(true)}>
				<Settings2 className='w-4 h-auto' />
			</Button>
			<EditSize
				open={isEditDialogOpen}
				setopen={setIsEditDialogOpen}
				size={size}
			/>
		</>
	);
}
