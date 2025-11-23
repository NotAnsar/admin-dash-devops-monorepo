'use client';

import { useFormState } from 'react-dom';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ResetState, recoverPassword } from '@/actions/reset-password';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import PendingButton from './PendingButton';
import { useEffect } from 'react';
import { toast } from '../ui/use-toast';
import ErrorMessage from '../ErrorMessage';

export default function RecoveryForm() {
	const initialState: ResetState = { message: null, errors: {} };
	const [state, action] = useFormState(recoverPassword, initialState);

	useEffect(() => {
		if (state?.success) {
			toast({ title: 'Reset Link Sent', description: state.message });
		} else if (state?.message) {
			toast({
				title: 'Error',
				description: state?.message,
				variant: 'destructive',
			});
		}
	}, [state]);

	return (
		<>
			<form className='grid gap-2' action={action}>
				<div className='space-y-2'>
					<Label className={cn(state?.errors?.email ? 'text-destructive' : '')}>
						Email
					</Label>
					<Input
						required
						type='email'
						name='email'
						placeholder='name@example.com'
						className={cn(
							'bg-transparent',
							state?.errors?.email
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
					/>

					<ErrorMessage errors={state?.errors?.email} />
				</div>

				<ErrorMessage
					errors={
						state?.message && !state.success ? [state?.message] : undefined
					}
				/>
				<PendingButton>Send Reset Link</PendingButton>
			</form>
			<div className='grid gap-1 text-[13px] text-muted-foreground/80 '>
				<p>
					Need to sign in?{' '}
					<Link
						href={'/auth/signin'}
						className='text-foreground font-medium hover:underline'
					>
						Click here
					</Link>
				</p>
			</div>
		</>
	);
}
