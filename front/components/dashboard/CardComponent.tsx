import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';

export default function CardComponent({
	card,
}: {
	card: {
		id: string;
		title: string;
		icon: LucideIcon;
		value: string;
		description: string;
	};
}) {
	return (
		<Card
			x-chunk={card.id}
			className=' hover:bg-foreground/5 cursor-pointer duration-200 transition ease-out'
		>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<CardTitle className='text-sm font-medium'>{card.title}</CardTitle>
				<card.icon className='h-4 w-4 text-muted-foreground' />
			</CardHeader>
			<CardContent>
				<div className='text-2xl font-semibold'>{card.value}</div>
				<p className='text-xs text-muted-foreground'>{card.description}</p>
			</CardContent>
		</Card>
	);
}

export function CardComponentSkeleton() {
	return (
		<Card className=' hover:bg-foreground/5 cursor-pointer duration-200 transition ease-out'>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<Skeleton className='text-sm font-medium w-20 h-[14px] my-[3px]' />
				<Skeleton className='h-4 w-4 text-muted-foreground rounded-sm' />
			</CardHeader>
			<CardContent>
				<Skeleton className='text-2xl font-semibold w-8 h-6 my-1' />
				<Skeleton className='text-xs text-muted-foreground w-36 h-[14px] my-px' />
			</CardContent>
		</Card>
	);
}
