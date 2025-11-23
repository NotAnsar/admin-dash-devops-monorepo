'use client';

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogPortal,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dispatch, SetStateAction } from 'react';
import { deleteAccount } from '@/actions/profile-action';
import { toast } from '../ui/use-toast';
import { useFormStatus } from 'react-dom';
import { Button } from '../ui/button';
import { Loader, Trash2 } from 'lucide-react';

export function DeleteUserDialog({
	open,
	setOpen,
}: {
	open?: boolean;
	setOpen?: Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogPortal>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							account and remove your data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<form
							action={async () => {
								const res = await deleteAccount();

								if (res) {
									toast({
										title: res.title,
										description: res.message,
										variant: 'destructive',
									});
								}
							}}
						>
							<PendingButton />
						</form>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogPortal>
		</AlertDialog>
	);
}

export function PendingButton() {
	const { pending } = useFormStatus();

	return (
		<Button
			variant={'destructive'}
			className='flex gap-1 justify-center items-center'
			type='submit'
			aria-disabled={pending}
			disabled={pending}
		>
			{pending ? (
				<Loader className='mr-2 h-4 w-4 animate-spin' />
			) : (
				<Trash2 className='w-4 h-auto' />
			)}
			Delete Account
		</Button>
	);
}
