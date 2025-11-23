import { UserState } from '@/actions/user-action';
import ErrorMessage from '@/components/ErrorMessage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { User, USER_ROLES } from '@/types/user';

export default function UserDetails({
	state,
	user,
}: {
	state: UserState;
	user?: User;
}) {
	return (
		<div className='grid gap-6 sm:grid-cols-2 mt-5'>
			<div className='grid gap-3 h-fit'>
				<Label
					htmlFor='firstName'
					className={cn(state?.errors?.firstName ? 'text-destructive' : '')}
				>
					First Name
				</Label>
				<div>
					<Input
						id='firstName'
						type='text'
						name='firstName'
						className={cn(
							'w-full',
							state?.errors?.firstName
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
						placeholder='Your First Name'
						defaultValue={user?.firstName || ''}
						required
					/>
					<ErrorMessage errors={state?.errors?.firstName} />
				</div>
			</div>
			<div className='grid gap-3 h-fit'>
				<Label
					htmlFor='lastName'
					className={cn(state?.errors?.lastName ? 'text-destructive' : '')}
				>
					Last Name
				</Label>
				<div>
					<Input
						id='lastName'
						type='text'
						name='lastName'
						className={cn(
							'w-full h-fit',
							state?.errors?.lastName
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
						placeholder='Your Last Name'
						defaultValue={user?.lastName || ''}
						required
					/>
					<ErrorMessage errors={state?.errors?.lastName} />
				</div>
			</div>
			<div
				className={cn(
					'grid gap-3 h-fit sm:col-span-2 ',
					user && 'sm:col-span-1'
				)}
			>
				<Label
					htmlFor='email'
					className={cn(state?.errors?.email ? 'text-destructive' : '')}
				>
					Email
				</Label>
				<div>
					<Input
						id='email'
						type='text'
						name='email'
						className={cn(
							'w-full',
							state?.errors?.email
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
						placeholder='Your Email'
						defaultValue={user?.email || ''}
						required
					/>
					<ErrorMessage errors={state?.errors?.email} />
				</div>
			</div>
			{!user && (
				<div className='grid gap-3 h-fit'>
					<Label
						htmlFor='password'
						className={cn(state?.errors?.password ? 'text-destructive' : '')}
					>
						Password
					</Label>
					<div>
						<Input
							id='password'
							type='password'
							name='password'
							className={cn(
								'w-full',
								state?.errors?.password
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
							placeholder='********'
							required
						/>
						<ErrorMessage errors={state?.errors?.password} />
					</div>
				</div>
			)}
			<div className='grid gap-3 h-fit'>
				<Label
					htmlFor='role'
					className={cn(state?.errors?.role ? 'text-destructive' : '')}
				>
					Role
				</Label>
				<Select required name='role' defaultValue={user?.role || undefined}>
					<SelectTrigger id='role' aria-label='Select role' name='role'>
						<SelectValue placeholder='Select role' />
					</SelectTrigger>
					<SelectContent>
						{USER_ROLES?.map(({ label, value }) => (
							<SelectItem value={value} key={value}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<ErrorMessage errors={state?.errors?.role} />
			</div>
		</div>
	);
}
