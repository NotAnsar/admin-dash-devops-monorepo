'use client';

import { Category } from '@/types/category';
import { ColumnDef } from '@tanstack/react-table';
import { formatTimestamp } from '@/lib/utils';
import { Settings2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteCategory } from '../DeleteCategory';
import { useState } from 'react';
import { EditCategory } from '../EditCategory';

export const columns: ColumnDef<Category>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		enableHiding: false,
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

		cell: ({ row }) => <EditButton category={row.original} />,
	},
	{
		id: 'delete',
		header: 'Delete',
		cell: ({ row }) => <DeleteButton category={row.original} />,
	},
];

function DeleteButton({ category }: { category: Category }) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	return (
		<>
			<Button variant={'ghost'} onClick={() => setIsDeleteDialogOpen(true)}>
				<Trash2 className='w-4 h-auto' />
			</Button>
			<DeleteCategory
				id={category.id}
				open={isDeleteDialogOpen}
				setOpen={setIsDeleteDialogOpen}
			/>
		</>
	);
}

function EditButton({ category }: { category: Category }) {
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	return (
		<>
			<Button variant={'ghost'} onClick={() => setIsEditDialogOpen(true)}>
				<Settings2 className='w-4 h-auto' />
			</Button>
			<EditCategory
				open={isEditDialogOpen}
				setopen={setIsEditDialogOpen}
				category={category}
			/>
		</>
	);
}
