'use client';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';

import { logout } from '@/actions/auth-action';
import { Avatar, AvatarFallback } from './ui/avatar';
import { LogOutIcon, UserIcon, UserRoundCog, UserRoundX } from 'lucide-react';
import { DeleteUserDialog } from './profile/DeleteUserDialog';
import { Dialog } from './ui/dialog';
import { User } from '@/types/user';
import { useState } from 'react';
import { EditUserDialog } from './profile/EditUserDialog';

export default function UserNav({ user }: { user: User }) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	return (
		<Dialog>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Avatar className='flex items-center justify-center'>
						<AvatarFallback className='h-9 w-auto aspect-square'>
							<span className='sr-only'>{user?.email}</span>
							<UserIcon className='h-[17px] w-auto' />
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<div className='flex items-center justify-start gap-2 p-2'>
						<div className='flex flex-col space-y-1 leading-none'>
							{(user?.firstName || user?.lastName) && (
								<p className='font-medium'>
									{user.firstName && <span>{user.firstName}</span>}{' '}
									{user.lastName && <span>{user.lastName}</span>}
								</p>
							)}

							<p className='w-[200px] truncate text-[13px] text-muted-foreground'>
								{user?.email}
							</p>
						</div>
					</div>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => setIsEditDialogOpen(true)}
						className='cursor-pointer'
					>
						<UserRoundCog className='w-4 h-auto mr-2' />
						Edit Profile
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => setIsDeleteDialogOpen(true)}
						className='cursor-pointer'
					>
						<UserRoundX className='w-4 h-auto mr-2' />
						Delete Account
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className='cursor-pointer p-0'>
						<form action={logout} className='w-full relative'>
							<button type='submit' className='p-2 w-full text-left flex'>
								<LogOutIcon className='w-4 h-auto mr-2' />
								Sign out
							</button>
						</form>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<EditUserDialog
				user={user}
				open={isEditDialogOpen}
				setopen={setIsEditDialogOpen}
				key={isEditDialogOpen.toString()}
			/>
			<DeleteUserDialog
				open={isDeleteDialogOpen}
				setOpen={setIsDeleteDialogOpen}
			/>
		</Dialog>
	);
}
