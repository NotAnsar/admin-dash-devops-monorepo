import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Frown } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
	return (
		<main className='flex h-[80vh] flex-col items-center justify-center gap-2'>
			<Frown className='w-10 text-muted-foreground' />
			<h2 className='text-xl font-semibold'>404 Not Found</h2>
			<p>Could not find the requested User.</p>
			<Link href='/users' className={cn(buttonVariants(), 'mt-2')}>
				Go Back
			</Link>
		</main>
	);
}
