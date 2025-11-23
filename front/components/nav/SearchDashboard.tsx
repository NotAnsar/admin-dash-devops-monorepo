'use client';

import { Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '../ui/command';
import { DashItem, dashConfig } from '@/config/sidenav';
import { useRouter } from 'next/navigation';

export default function SearchDashboard() {
	const [open, setOpen] = useState(false);
	const { management, overview, tools } = dashConfig;

	const close = useCallback((command: () => unknown) => {
		setOpen(false);
		command();
	}, []);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, []);

	return (
		<>
			<button
				className='hidden md:flex items-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 relative justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 h-10 w-[300px]'
				onClick={() => setOpen(true)}
			>
				<Search className='absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
				<span className='inline-flex px-4 text-[13px]'>
					Search in Dashboard...
				</span>
				<span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex'>
					<span className='text-xs'>⌘</span>K
				</span>
			</button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder='Type a command or search...' />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGrp heading='Overview' menuGrp={overview} close={close} />
					<CommandGrp heading='Management' menuGrp={management} close={close} />
					<CommandGrp heading='Tools' menuGrp={tools} close={close} />
				</CommandList>
			</CommandDialog>
		</>
	);
}

function CommandGrp({
	heading,
	menuGrp,
	close,
}: {
	heading: string;
	menuGrp: DashItem[];
	close: (command: () => unknown) => void;
	className?: string;
}) {
	const router = useRouter();

	return (
		<CommandGroup heading={heading}>
			{menuGrp.map((item) =>
				item.subnav ? (
					item.subnav.map((i) => (
						<Item
							close={() => close(() => router.push(i.path))}
							item={i}
							key={i.title}
						/>
					))
				) : (
					<Item
						close={() => close(() => router.push(item.path))}
						item={item}
						key={item.title}
					/>
				)
			)}
		</CommandGroup>
	);
}

function Item({ item, close }: { item: DashItem; close: () => void }) {
	return (
		<CommandItem
			key={item.title}
			onSelect={() => {
				close();
			}}
			className='font-normal flex gap-4 items-center transition duration-200 rounded-sm w-full cursor-pointer'
		>
			<item.Icon className='h-[18px] w-auto' strokeWidth='1.6' />
			<span className='font-normal'>{item.title}</span>
		</CommandItem>
	);
}
