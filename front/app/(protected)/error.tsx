'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<main className='flex h-[80vh] flex-col items-center justify-center'>
			<h2 className='text-center'>Something went wrong!</h2>
			<Button className='mt-2' onClick={() => reset()}>
				Try again
			</Button>
		</main>
	);
}
