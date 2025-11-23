'use client';

import { useState, useEffect } from 'react';
import { ProductState } from '@/actions/product-action';
import ErrorMessage from '@/components/ErrorMessage';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import { Product } from '@/types/product';

export default function FeaturedProduct({
	product,
	state,
}: {
	product?: Product;
	state: ProductState;
}) {
	const [isFeatured, setIsFeatured] = useState(product?.featured || false);

	// Update state if product prop changes
	useEffect(() => {
		setIsFeatured(product?.featured || false);
	}, [product?.featured]);

	return (
		<Card x-chunk='dashboard-07-chunk-5'>
			<CardHeader>
				<CardTitle>Featured Product</CardTitle>
				<CardDescription>
					This Product Will Appear on the Home Page
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='grid gap-1.5'>
					<input
						type='checkbox'
						id='featured'
						name='featured'
						checked={isFeatured}
						value={isFeatured ? 'true' : 'false'}
						onChange={() => setIsFeatured(!isFeatured)}
						hidden
					/>
					<Button
						size='sm'
						variant='secondary'
						type='button'
						className='w-fit'
						onClick={() => setIsFeatured(!isFeatured)}
					>
						{isFeatured ? 'Unfeatured Product' : 'Featured Product'}
					</Button>

					<p className='text-sm mt-1 text-muted-foreground'>
						{isFeatured
							? 'Your product is featured and will be displayed on the home page'
							: 'Your product is not featured on the home page'}
					</p>

					<ErrorMessage errors={state?.errors?.featured} />
				</div>
			</CardContent>
		</Card>
	);
}
