'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ProductState } from '@/actions/product-action';
import ErrorMessage from '@/components/ErrorMessage';
import { Label } from '@/components/ui/label';
import SelectInput from '@/components/ui/select-input';
import { Product } from '@/types/product';

export default function ProductStatus({
	state,
	product,
}: {
	state: ProductState;
	product?: Product;
}) {
	return (
		<Card x-chunk='dashboard-07-chunk-3'>
			<CardHeader>
				<CardTitle>Product Status</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='grid gap-1.5'>
					<Label
						htmlFor='archived'
						className={cn(state?.errors?.archived ? 'text-destructive' : '')}
					>
						Status
					</Label>

					<SelectInput
						options={[
							{ label: 'Active', value: 'false' },
							{ label: 'Archived', value: 'true' },
						]}
						name='archived'
						initialValue={product?.archived ? 'true' : 'false'}
						placeholder='Select Status'
						className={cn(
							state?.errors?.archived
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
					/>
					<ErrorMessage errors={state?.errors?.archived} />
				</div>
			</CardContent>
		</Card>
	);
}
