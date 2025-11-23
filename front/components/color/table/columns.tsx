'use client';

import { ColumnDef } from '@tanstack/react-table';
import { formatTimestamp } from '@/lib/utils';
import { Settings2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteColor } from '../DeleteColor';
import { useState } from 'react';
import { EditColor } from '../EditColor';
import { Color } from '@/types/color';

export const columns: ColumnDef<Color>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => {
			return (
				<div className='text-sm text-nowrap gap-2 flex items-center'>
					<p>{row.original.name}</p>
					<div
						className='w-4 h-4 rounded-full border-border border'
						style={{ background: row.original.value || undefined }}
					/>
				</div>
			);
		},
	},
	{
		accessorKey: 'value',
		header: 'Value',
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

		cell: ({ row }) => <EditButton color={row.original} />,
	},
	{
		id: 'delete',
		header: 'Delete',
		cell: ({ row }) => <DeleteButton color={row.original} />,
	},
];

function DeleteButton({ color }: { color: Color }) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	return (
		<>
			<Button variant={'ghost'} onClick={() => setIsDeleteDialogOpen(true)}>
				<Trash2 className='w-4 h-auto' />
			</Button>
			<DeleteColor
				id={color.id}
				open={isDeleteDialogOpen}
				setOpen={setIsDeleteDialogOpen}
			/>
		</>
	);
}

function EditButton({ color }: { color: Color }) {
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	return (
		<>
			<Button variant={'ghost'} onClick={() => setIsEditDialogOpen(true)}>
				<Settings2 className='w-4 h-auto' />
			</Button>
			<EditColor
				open={isEditDialogOpen}
				setopen={setIsEditDialogOpen}
				color={color}
			/>
		</>
	);
}
