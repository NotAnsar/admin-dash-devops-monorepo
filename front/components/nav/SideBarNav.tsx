'use client';

import { cn } from '@/lib/utils';
import Logo from '../Logo';
import { usePathname } from 'next/navigation';
import { dashConfig } from '@/config/sidenav';
import NavGroup from './NavGroup';
import SignOut from './SignOut';
import Link from 'next/link';

export default function SideBarNav({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const path = usePathname();
	const { management, overview, tools } = dashConfig;
	return (
		<aside
			className={cn(
				'hidden w-56 bg-background border-r border-border md:flex flex-col h-screen fixed p-5 ',
				className
			)}
			{...props}
		>
			<Link href={'/'} className='flex gap-[6px] items-center justify-center'>
				<Logo className='text-foreground w-[26px] h-auto -rotate-45' />
				<h4 className='text-[28px] font-serif font-medium tracking-wide'>
					Orava
				</h4>
			</Link>

			<NavGroup
				label='Overview'
				menuGrp={overview}
				path={path}
				className='mt-8'
			/>
			<NavGroup label='Management' menuGrp={management} path={path} />
			<NavGroup label='Tools' menuGrp={tools} path={path} />

			<SignOut className='w-full mb-3 mt-auto' />
		</aside>
	);
}
