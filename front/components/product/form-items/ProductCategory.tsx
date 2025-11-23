'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ProductState } from '@/actions/product-action';
import ErrorMessage from '@/components/ErrorMessage';
import { Label } from '@/components/ui/label';
import SelectInput from '@/components/ui/select-input';
import { Product } from '@/types/product';
import { Category } from '@/types/category';

export default function ProductCategory({
	categories,
	state,
	product,
}: {
	categories: Category[];
	state: ProductState;
	product?: Product;
}) {
	return (
		<Card x-chunk='dashboard-07-chunk-2'>
			<CardHeader>
				<CardTitle>Product Category</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='grid gap-1.5'>
					<Label
						htmlFor='categoryId'
						className={cn(state?.errors?.categoryId ? 'text-destructive' : '')}
					>
						Category
					</Label>

					<SelectInput
						options={categories.map((c) => ({ label: c.name, value: c.id }))}
						name='categoryId'
						initialValue={product?.category?.id || undefined}
						placeholder='Select Category'
						className={cn(
							state?.errors?.categoryId
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
					/>
					<ErrorMessage errors={state?.errors?.categoryId} />
				</div>
			</CardContent>
		</Card>
	);
}
