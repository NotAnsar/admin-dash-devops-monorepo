import { fetchUsers, getCurrentUser } from '@/api/users';
import { buttonVariants } from '@/components/ui/button';
import { columns } from '@/components/user/table/columns';
import { DataTable } from '@/components/user/table/data-table';

import { cn } from '@/lib/utils';
import Link from 'next/link';

export default async function Page() {
	const currentUser = await getCurrentUser();

	const filteredUsers = (await fetchUsers()).filter(
		(user) => user.id !== currentUser?.id
	);

	return (
		<>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>Users</h1>
				<Link href={'/users/create'} className={cn(buttonVariants())}>
					Add User
				</Link>
			</div>

			<DataTable columns={columns} data={filteredUsers} />
		</>
	);
}
