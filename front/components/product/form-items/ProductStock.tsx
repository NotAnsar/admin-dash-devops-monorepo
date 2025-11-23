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
import SelectInput from '@/components/ui/select-input';
import { SizeToggleGroup } from '@/components/ui/size-toggle-group';
import { cn } from '@/lib/utils';
import { Color } from '@/types/color';
import { Product } from '@/types/product';
import { Size } from '@/types/size';

export default function ProductStock({
	colors,
	sizes,
	product,
	state,
}: {
	colors: Color[];
	sizes: Size[];
	product?: Product;
	state: ProductState;
}) {
	return (
		<Card x-chunk='dashboard-07-chunk-1'>
			<CardHeader>
				<CardTitle>Stock</CardTitle>
				<CardDescription>
					Lipsum dolor sit amet, consectetur adipiscing elit
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:flex gap-6 justify-between'>
					<div className='grid gap-1.5 h-fit'>
						<Label
							htmlFor='stock'
							className={cn(state?.errors?.stock ? 'text-destructive' : '')}
						>
							Stock
						</Label>
						<Input
							id='stock'
							name='stock'
							type='number'
							className={cn(
								'bg-transparent',
								state?.errors?.stock
									? 'border-destructive focus-visible:ring-destructive'
									: ''
							)}
							min={0}
							required
							defaultValue={product?.stock || ''}
						/>
						<ErrorMessage errors={state?.errors?.stock} />
					</div>

					<div className='grid gap-1.5 h-fit'>
						<Label
							htmlFor='price'
							className={cn(state?.errors?.price ? 'text-destructive' : '')}
						>
							Price
						</Label>
						<Input
							id='price'
							name='price'
							type='number'
							className={cn(
								'bg-transparent',
								state?.errors?.price
									? 'border-destructive focus-visible:ring-destructive'
									: ''
							)}
							min={0.01}
							step='any'
							required
							defaultValue={product?.price || ''}
						/>
						<ErrorMessage errors={state?.errors?.price} />
					</div>

					<div className='grid gap-1.5 lg:w-[180px] h-fit'>
						<Label
							htmlFor='colorId'
							className={cn(state?.errors?.colorId ? 'text-destructive' : '')}
						>
							Color
						</Label>

						<SelectInput
							options={colors.map((c) => ({ label: c.name, value: c.id }))}
							name='colorId'
							initialValue={product?.color?.id || undefined}
							placeholder='Select Color'
							className={cn(
								state?.errors?.colorId
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>

						<ErrorMessage errors={state?.errors?.colorId} />
					</div>

					<div className='grid gap-1.5 mr-auto h-fit'>
						<Label
							htmlFor='sizeId'
							className={cn(state?.errors?.sizeId ? 'text-destructive' : '')}
						>
							Size
						</Label>

						<SizeToggleGroup
							options={sizes.map((s) => ({ label: s.name, value: s.id }))}
							defaultValue={product?.size?.id}
							name='sizeId'
							error={!!state?.errors?.sizeId}
						/>
						<ErrorMessage errors={state?.errors?.sizeId} />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
