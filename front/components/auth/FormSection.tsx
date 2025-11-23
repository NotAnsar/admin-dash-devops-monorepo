'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { signinAction, signinGuest } from '@/actions/auth-action';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import PendingButton from './PendingButton';
import { useEffect } from 'react';
import { toast } from '../ui/use-toast';

export default function FormSection() {
	const [state, action] = useFormState(signinAction, {});

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
					{state?.errors?.email &&
						state.errors.email.map((error: string) => (
							<p className='text-sm font-medium text-destructive' key={error}>
								{error}
							</p>
						))}
				</div>
				<div className='space-y-2'>
					<Label
						className={cn(state?.errors?.password ? 'text-destructive' : '')}
					>
						Password
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
					{state?.errors?.password &&
						state.errors.password.map((error: string) => (
							<p className='text-sm font-medium text-destructive' key={error}>
								{error}
							</p>
						))}
				</div>

				{(state?.message || state?.errors) && (
					<p className='text-sm font-medium text-destructive'>
						{state.message}
					</p>
				)}
				<PendingButton className='mt-2'>Sign In</PendingButton>
			</form>
			<div className='grid gap-1 text-[13px] text-muted-foreground/80 '>
				<p>
					Forgot your password?{' '}
					<Link
						href={'/auth/password-recovery'}
						className='text-foreground font-medium hover:underline'
					>
						Click here
					</Link>
				</p>
				<GuestSection />
			</div>
		</>
	);
}

export function GuestSection() {
	const [state, action] = useFormState(signinGuest, {});
	useEffect(() => {
		if (state?.message) {
			toast({
				title: 'Guest User Error',
				description: state.message,
				variant: 'destructive',
			});
		}
	}, [state?.message, state?.errors]);

	return (
		<form action={action}>
			Or Just Join as <PendingGuestButton />
		</form>
	);
}

export function PendingGuestButton() {
	const { pending } = useFormStatus();
	return (
		<button
			className='text-foreground font-medium hover:underline'
			type='submit'
			aria-disabled={pending}
			disabled={pending}
		>
			{pending ? '...' : 'Guest User'}
		</button>
	);
}
