'use client';

import { useFormState } from 'react-dom';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { updatePassword, UpdatePassState } from '@/actions/reset-password';
import { cn } from '@/lib/utils';
import PendingButton from './PendingButton';
import ErrorMessage from '../ErrorMessage';
import { useEffect } from 'react';
import { toast } from '../ui/use-toast';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordForm({ token }: { token: string }) {
	const initialState: UpdatePassState = { message: null, errors: {} };
	const updateUserWithCode = updatePassword.bind(null, token);
	const [state, action] = useFormState(updateUserWithCode, initialState);
	const router = useRouter();

	useEffect(() => {
		if (state?.success) {
			toast({
				title: 'Password Updated',
				description: state?.message,
				action: (
					<Link
						href={'/auth/signin'}
						className={cn('text-foreground font-medium', buttonVariants())}
					>
						Sign In
					</Link>
				),
			});
			router.replace('/auth/signin');
		} else if (state?.message) {
			toast({
				title: 'Error',
				description: state?.message,
				variant: 'destructive',
			});
		}
	}, [state, router]);

	return (
		<form className='grid gap-2' action={action}>
			<div className='space-y-2'>
				<Label
					className={cn(state?.errors?.password ? 'text-destructive' : '')}
				>
					Your New Password
				</Label>
				<Input
					required
					type='password'
					name='password'
					placeholder='********'
					autoComplete='on'
					className={cn(
						'bg-transparent',
						state?.errors?.password
							? 'border-destructive focus-visible:ring-destructive '
							: ''
					)}
				/>
				<ErrorMessage errors={state?.errors?.password} />
			</div>
			<div className='space-y-2'>
				<Label
					className={cn(
						state?.errors?.confirmPassword ? 'text-destructive' : ''
					)}
				>
					Confirm Your New Password
				</Label>
				<Input
					required
					type='password'
					name='confirmPassword'
					placeholder='********'
					autoComplete='on'
					className={cn(
						'bg-transparent',
						state?.errors?.password
							? 'border-destructive focus-visible:ring-destructive '
							: ''
					)}
				/>
				<ErrorMessage errors={state?.errors?.confirmPassword} />
			</div>

			<ErrorMessage
				errors={state?.message && !state.success ? [state?.message] : undefined}
			/>
			<PendingButton>Update Password</PendingButton>
		</form>
	);
}
