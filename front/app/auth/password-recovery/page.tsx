import Logo from '@/components/Logo';
import RecoveryForm from '@/components/auth/RecoveryForm';

export default function page() {
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
					Recover Your Password
				</h1>

				<p className='text-sm text-muted-foreground'>
					{"You'll receive an email to recover your password"}
				</p>
			</div>

			<RecoveryForm />
		</>
	);
}
