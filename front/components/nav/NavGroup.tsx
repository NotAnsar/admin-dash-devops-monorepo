import { DashItem } from '@/config/sidenav';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { SheetClose } from '../ui/sheet';

import { ChevronDown } from 'lucide-react';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '../ui/collapsible';

export default function NavGroup({
	label,
	menuGrp,
	path,
	className,
	sheet = false,
	...props
}: {
	label: string;
	menuGrp: DashItem[];
	path: string;
	className?: string;
	sheet?: boolean;
}) {
	return (
		<div className={cn('mt-5', className)}>
			<h2 className='mb-2 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
				{label}
			</h2>
			<nav className='flex flex-col gap-1 font-normal'>
				{menuGrp.map((item, i) => (
					<Nav
						menuItem={item}
						currPath={path}
						{...props}
						sheet={sheet}
						key={i}
					/>
				))}
			</nav>
		</div>
	);
}

function Nav({
	menuItem,
	currPath,
	sheet,
	...props
}: {
	menuItem: DashItem;
	currPath: string;
	sheet?: boolean;
}) {
	const { Icon, path, title, subnav } = menuItem;
	const CommonLink = (
		<Link
			{...props}
			className={cn(
				buttonVariants({
					variant:
						currPath.split('/')[1] === path.split('/')[1]
							? 'secondary'
							: 'ghost',
				}),
				'justify-start font-normal flex gap-4 items-center transition duration-200 rounded-sm py-1'
			)}
			href={path}
		>
			<Icon className='h-[18px] w-auto' strokeWidth='1.6' />
			<p className='text-sm'>{title}</p>
		</Link>
	);
	if (subnav)
		return (
			<SliderNav
				item={menuItem}
				subnav={subnav}
				currPath={currPath}
				sheet={sheet}
			/>
		);

	if (sheet) return <SheetClose asChild>{CommonLink}</SheetClose>;

	return CommonLink;
}

function SliderNav({
	item,
	currPath,
	subnav,
	sheet,
}: {
	item: DashItem;
	currPath: string;
	subnav: Omit<DashItem, 'subnav'>[];
	sheet?: boolean;
}) {
	const isSubPath = subnav
		.map((s) => s.path.split('/')[1])
		.includes(currPath.split('/')[1]);

	return (
		<Collapsible
			className={cn(
				'data-[state=open]:bg-foreground/5 rounded-md transition-colors duration-300 ease-out grid gap-0.5',
				isSubPath ? 'bg-foreground/5 border border-foreground/15' : null
			)}
		>
			<CollapsibleTrigger
				className={cn(
					buttonVariants({ variant: 'ghost' }),
					'flex w-full items-center gap-2 rounded-md py-1 pl-4 pr-3 text-sm transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-90 justify-between'
				)}
			>
				<div className='flex justify-start gap-4 font-normal'>
					<item.Icon className='h-[18px] w-auto' strokeWidth='1.6' />
					<p className='text-sm'>{item.title}</p>
				</div>

				<ChevronDown
					className={cn('h-[18px] w-auto transition duwration-200 ease-out')}
					strokeWidth='1.6'
				/>
			</CollapsibleTrigger>

			<CollapsibleContent>
				{subnav?.map((item) => {
					const CommonLink = (
						<Link
							className={cn(
								buttonVariants({
									variant:
										currPath.split('/')[1] === item.path.split('/')[1]
											? 'secondary'
											: 'ghost',
								}),
								'justify-normal gap-3 h-9 w-full rounded-none border-x-0  font-normal text-[13px]'
							)}
							href={item.path}
						>
							<item.Icon className='h-[16px] w-auto' strokeWidth='1.6' />{' '}
							{item.title}
						</Link>
					);

					return sheet ? (
						<SheetClose asChild key={item.title}>
							{CommonLink}
						</SheetClose>
					) : (
						<Link
							key={item.title}
							className={cn(
								buttonVariants({
									variant:
										currPath.split('/')[1] === item.path.split('/')[1]
											? 'secondary'
											: 'ghost',
								}),
								'justify-normal gap-3 h-9 w-full rounded-none border-x-0 font-normal text-[13px]'
							)}
							href={item.path}
						>
							<item.Icon className='h-[16px] w-auto' strokeWidth='1.6' />{' '}
							{item.title}
						</Link>
					);
				})}
			</CollapsibleContent>
		</Collapsible>
	);
}
