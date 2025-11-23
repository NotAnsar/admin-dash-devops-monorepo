import { Loader } from 'lucide-react';

export default function Loading() {
	return (
		<main className='flex h-[80vh] flex-col items-center justify-center gap-2'>
			<Loader className='animate-spin w-6 h-auto aspect-square' />
		</main>
	);
}
