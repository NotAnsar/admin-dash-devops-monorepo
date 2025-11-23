'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Loader, Plus } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';
import { useFormState } from 'react-dom';
import { toast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { SizeState, createSize } from '@/actions/size-action';
import ErrorMessage from '../ErrorMessage';

export function CreateSize({
	open,
	setopen,
}: {
	open: boolean;
	setopen: Dispatch<SetStateAction<boolean>>;
}) {
	const initialState: SizeState = { message: null, errors: {} };
	const [state, action] = useFormState(createSize, initialState);

	useEffect(() => {
		if (state === undefined) {
			setopen(false);
			toast({ description: 'Size data created successfully.' });
		}
	}, [state, setopen]);

	return (
		<Dialog open={open} onOpenChange={setopen}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Create Size</DialogTitle>
					<DialogDescription>
						{
							"Create a new size. Enter the size details and click save when you're done."
						}
					</DialogDescription>
				</DialogHeader>

				<form className='grid gap-4 ' id='update' action={action}>
					<div>
						<div className='flex items-center gap-4'>
							<Label
								htmlFor='name'
								className={cn(
									'text-nowrap',
									state?.errors?.name ? 'text-destructive' : ''
								)}
							>
								Size Code
							</Label>
							<Input
								id='name'
								name='name'
								placeholder='XL'
								className={cn(
									'bg-transparent col-span-3',
									state?.errors?.name
										? 'border-destructive focus-visible:ring-destructive '
										: ''
								)}
							/>
						</div>
						<ErrorMessage errors={state?.errors?.name} />
					</div>

					<div>
						<div className='flex items-center gap-4'>
							<Label
								htmlFor='fullname'
								className={cn(
									'text-nowrap',
									state?.errors?.fullname ? 'text-destructive' : ''
								)}
							>
								Full Name
							</Label>
							<Input
								id='fullname'
								name='fullname'
								placeholder='Extra Large'
								className={cn(
									'bg-transparent col-span-3',
									state?.errors?.fullname
										? 'border-destructive focus-visible:ring-destructive '
										: ''
								)}
							/>
						</div>
						<ErrorMessage errors={state?.errors?.fullname} />
					</div>

					<DialogFooter>
						<ErrorMessage
							errors={state?.message ? [state?.message] : undefined}
						/>
						<PendingButton />
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function PendingButton() {
	const { pending } = useFormStatus();

	return (
		<Button type='submit' aria-disabled={pending} disabled={pending}>
			{pending ? (
				<Loader className='mr-2 h-4 w-4 animate-spin' />
			) : (
				<Plus className='mr-2 h-4 w-4' />
			)}
			Create Size
		</Button>
	);
}

export function CreateSizeButton() {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setIsCreateDialogOpen(true)}>Add Size</Button>
			<CreateSize open={isCreateDialogOpen} setopen={setIsCreateDialogOpen} />
		</>
	);
}
