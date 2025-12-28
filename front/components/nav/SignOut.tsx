'use client';
import { logout } from '@/actions/auth-action';
import { Button } from '../ui/button';
import { Loader, LogOut } from 'lucide-react';
import { useFormStatus } from 'react-dom';

export default function SignOut({
	className,
	...props
}: React.HTMLAttributes<HTMLFormElement>) {
	return (
		<form className={className} action={logout} {...props}>
			<PendingButton />
		</form>
	);
}

function PendingButton() {
	const { pending } = useFormStatus();
	return (
		<Button
			className='font-normal flex gap-4 items-center transition duration-200 rounded-sm w-full'
			variant={'ghost'}
			type='submit'
			aria-disabled={pending}
			disabled={pending}
		>
			{pending ? (
				<Loader className='h-[18px] w-auto animate-spin' />
			) : (
				<LogOut className='h-[18px] w-auto ' strokeWidth='1.8' />
			)}
			<p className='text-[15px]'>Sign Out 123</p>
		</Button>
	);
}
