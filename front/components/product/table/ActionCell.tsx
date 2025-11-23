'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Button } from '../../ui/button';
import { MoreHorizontalIcon } from 'lucide-react';
import { useState } from 'react';
import { Dialog } from '@radix-ui/react-dialog';
import Link from 'next/link';
import { DeleteProduct } from './DeleteProduct';
import { ArchiveProduct } from './ArchiveProduct';

export default function ActionCell({
	id,
	archived,
}: {
	id: string;
	archived: boolean;
}) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);

	return (
		<Dialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' className='h-8 w-8 p-0'>
						<span className='sr-only'>Open menu</span>
						<MoreHorizontalIcon className='h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuItem onClick={() => navigator.clipboard.writeText(id)}>
						Copy product ID
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className='p-0'>
						<Link href={`/products/edit/${id}`} className='px-2 py-1.5 w-full'>
							Edit Product
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => setIsArchiveDialogOpen(true)}
						className='cursor-pointer'
					>
						{archived ? 'Restore Product' : 'Archive Product'}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => setIsDeleteDialogOpen(true)}
						className='cursor-pointer'
					>
						Delete Product
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<DeleteProduct
				id={id}
				open={isDeleteDialogOpen}
				setOpen={setIsDeleteDialogOpen}
			/>
			<ArchiveProduct
				id={id}
				open={isArchiveDialogOpen}
				setOpen={setIsArchiveDialogOpen}
				isArchived={archived}
			/>
		</Dialog>
	);
}
