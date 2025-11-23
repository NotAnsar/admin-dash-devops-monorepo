'use client';

import { Button } from '@/components/ui/button';
import { Loader, Plus } from 'lucide-react';

import BreadCrumb from '@/components/BreadCrumb';
import { useFormState, useFormStatus } from 'react-dom';
import { UserState, createUser } from '@/actions/user-action';
import UserDetails from './form-items/UserDetails';
import ErrorMessage from '../ErrorMessage';

export default function CreateUserForm() {
	const initialState: UserState = { message: null, errors: {} };
	const [state, action] = useFormState(createUser, initialState);

	return (
		<form action={action}>
			<div className='flex gap-4 flex-col sm:flex-row justify-between'>
				<BreadCrumb
					items={[
						{ link: '/users', text: 'User' },
						{
							link: '/users/create',
							text: 'Create User',
							isCurrent: true,
						},
					]}
				/>

				<PendingButton />
			</div>

			<ErrorMessage errors={state?.message ? [state?.message] : undefined} />

			<UserDetails state={state} />
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
			Create User
		</Button>
	);
}
