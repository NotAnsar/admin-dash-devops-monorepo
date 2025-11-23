'use client';

import { Button } from '@/components/ui/button';
import { Loader, Plus } from 'lucide-react';

import BreadCrumb from '@/components/BreadCrumb';
import { useFormState, useFormStatus } from 'react-dom';
import { UserUpdateState, updateUser } from '@/actions/user-action';
import UserDetails from './form-items/UserDetails';
import { User } from '@/types/user';

export default function EditUserForm({ user }: { user: User }) {
	const initialState: UserUpdateState = { message: null, errors: {} };
	const [state, action] = useFormState(
		updateUser.bind(null, user.id),
		initialState
	);

	return (
		<form action={action}>
			<div className='flex gap-4 flex-col sm:flex-row justify-between'>
				<BreadCrumb
					items={[
						{ link: '/users', text: 'User' },
						{
							link: `/users/edit/${user.id}`,
							text: 'Edit User',
							isCurrent: true,
						},
					]}
				/>

				<PendingButton />
			</div>
			{(state?.message || state?.errors) && (
				<p className='text-sm font-medium text-destructive'>{state.message}</p>
			)}

			<UserDetails state={state} user={user} />
		</form>
	);
}

export function PendingButton() {
	const { pending } = useFormStatus();

	return (
		<Button
			className='flex gap-1 justify-center items-center'
			type='submit'
			aria-disabled={pending}
			disabled={pending}
		>
			{pending ? (
				<Loader className='mr-2 h-4 w-4 animate-spin' />
			) : (
				<Plus className='w-4 h-auto' />
			)}
			Edit User
		</Button>
	);
}
