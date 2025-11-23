'use client';

import { cn } from '@/lib/utils';
import Logo from '../Logo';
import { usePathname } from 'next/navigation';
import { dashConfig } from '@/config/sidenav';
import NavGroup from './NavGroup';
import { SheetClose, SheetContent } from '../ui/sheet';
import { ModeToggleTrigger } from '../ModeToggle';
import { Moon, Sun } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function SideBarNavMobile({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const path = usePathname();
	const { management, overview, tools } = dashConfig;
	return (
		<SheetContent
			side='left'
			className={cn('flex flex-col p-5 gap-0 w-4/6', className)}
			{...props}
		>
			<SheetClose asChild>
				<Link
					className='flex gap-[6px] items-center pl-4 cursor-pointer'
					href={'/'}
				>
					<Logo className='text-foreground w-[26px] h-auto -rotate-45' />
					<h4 className='text-[28px] font-serif font-medium tracking-wide'>
						Orava
					</h4>
				</Link>
			</SheetClose>

			<NavGroup
				label='Overview'
				menuGrp={overview}
				path={path}
				className='mt-8'
				sheet={true}
			/>
			<NavGroup
				sheet={true}
				label='Management'
				menuGrp={management}
				path={path}
			/>
			<NavGroup sheet={true} label='Tools' menuGrp={tools} path={path} />

			<ModeToggleTrigger>
				<Button variant={'secondary'} className='mt-auto'>
					<Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
					<Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
					<span className='sr-only'>Toggle theme</span>
				</Button>
			</ModeToggleTrigger>
		</SheetContent>
	);
}
