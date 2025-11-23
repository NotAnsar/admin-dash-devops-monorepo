import Logo from '@/components/Logo';
import UpdatePasswordForm from '@/components/auth/UpdatePasswordForm';
import Link from 'next/link';

export default function Page({
	searchParams,
}: {
	searchParams: { token?: string };
}) {
	return (
		<>
			<div className='flex flex-col space-y-2 '>
				<div className='flex gap-[6px] items-center'>
					<Logo className='text-foreground w-[26px] h-auto -rotate-45' />
					<h4 className='text-[28px] font-serif font-medium tracking-wide'>
						Orava
					</h4>
				</div>

				<h1 className='text-4xl font-medium tracking-tight '>
					Update Your Password
				</h1>

				<p className='text-sm text-muted-foreground'>
					Update Your Password and Email
				</p>
			</div>

			<UpdatePasswordForm token={searchParams.token || ''} />
			<div className='grid gap-1 text-[13px] text-muted-foreground/80 '>
				<p>
					Need to sign in?{' '}
					<Link
						href={'/auth/signin'}
						className='text-foreground font-medium hover:underline'
					>
						Sign In
					</Link>
				</p>
				<p>
					Forgot your password?{' '}
					<Link
						href={'/auth/password-recovery'}
						className='text-foreground font-medium hover:underline'
					>
						Click here
					</Link>
				</p>
			</div>
		</>
	);
}
