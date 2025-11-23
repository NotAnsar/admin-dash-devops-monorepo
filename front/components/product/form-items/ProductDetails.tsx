import { ProductState } from '@/actions/product-action';
import ErrorMessage from '@/components/ErrorMessage';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';

export default function ProductDetails({
	product,
	state,
}: {
	product?: Product;
	state: ProductState;
}) {
	return (
		<Card x-chunk='dashboard-07-chunk-0'>
			<CardHeader>
				<CardTitle>Product Details</CardTitle>
				<CardDescription>
					This section allows you to provide detailed information about the
					product. You can add the product name and a description to give more
					context.
				</CardDescription>
			</CardHeader>
			<CardContent className='grid gap-6'>
				<div className='grid gap-1.5'>
					<Label
						htmlFor='name'
						className={cn(state?.errors?.name ? 'text-destructive' : '')}
					>
						Name
					</Label>
					<Input
						id='name'
						type='text'
						name='name'
						placeholder='Product Name'
						defaultValue={product?.name || ''}
						className={cn(
							'w-full bg-transparent',
							state?.errors?.name
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
						required
					/>
					<ErrorMessage errors={state?.errors?.name} />
				</div>
				<div className='grid gap-1.5'>
					<Label
						htmlFor='description'
						className={cn(state?.errors?.description ? 'text-destructive' : '')}
					>
						Description
					</Label>
					<Textarea
						id='description'
						name='description'
						defaultValue={product?.description || ''}
						placeholder='Product Description'
						className={cn(
							'min-h-32',
							state?.errors?.description
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
						required
					/>
					<ErrorMessage errors={state?.errors?.description} />
				</div>
			</CardContent>
		</Card>
	);
}
