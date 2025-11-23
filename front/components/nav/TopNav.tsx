import { Menu } from 'lucide-react';
import { ModeToggle } from '../ModeToggle';
import Logo from '../Logo';
import UserNav from '../UserNav';
import SideBarNavMobile from './SideBarNavMobile';
import { Sheet, SheetTrigger } from '../ui/sheet';
import SearchDashboard from './SearchDashboard';
import Link from 'next/link';
import { getUserSession } from '@/lib/session';
import { logout } from '@/actions/auth-action';
import { redirect } from 'next/navigation';

export default async function TopNav() {
	const session = await getUserSession();
	const user = session?.user;

	if (!user) {
		await logout();
		redirect('/auth/signin');
	}

	return (
		<Sheet>
			<header className='sticky top-0 w-full border-b bg-background px-4 border-border h-14 grid items-center z-50'>
				<nav className='flex justify-between items-center gap-4'>
					<Link
						className='md:hidden relative flex gap-[6px] items-center justify-center'
						href='/'
					>
						<Logo className='text-foreground w-[26px] h-auto -rotate-45' />

						<h4 className='text-[28px] font-serif font-medium tracking-wide'>
							Orava
						</h4>
					</Link>
					<SearchDashboard />
					<div className='flex items-center gap-2 '>
						<SheetTrigger asChild>
							<Menu className='md:hidden cursor-pointer' />
						</SheetTrigger>

						<span className='hidden md:block'>
							<ModeToggle />
						</span>

						<UserNav user={user} />
					</div>
				</nav>
			</header>

			<SideBarNavMobile />
		</Sheet>
	);
}
