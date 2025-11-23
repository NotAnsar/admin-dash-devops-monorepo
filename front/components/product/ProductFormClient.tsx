'use client';

import BreadCrumb from '@/components/BreadCrumb';
import { Button } from '@/components/ui/button';
import { Loader, Plus } from 'lucide-react';
import ProductDetails from './form-items/ProductDetails';
import { createProduct, updateProduct } from '@/actions/product-action';
import { useFormState, useFormStatus } from 'react-dom';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { Color } from '@/types/color';
import { Size } from '@/types/size';
import ErrorMessage from '../ErrorMessage';
import ProductStock from './form-items/ProductStock';
import FeaturedProduct from './form-items/FeaturedProduct';
import ProductCategory from './form-items/ProductCategory';
import ProductStatus from './form-items/ProductStatus';
import ProductImages from './form-items/ProductImages';

const initialState = { message: null, errors: {} };

export default function ProductFormClient({
	categories,
	colors,
	sizes,
	product,
}: {
	product?: Product;
	categories: Category[];
	colors: Color[];
	sizes: Size[];
}) {
	const [state, formAction] = useFormState(
		product?.id ? updateProduct.bind(null, product.id) : createProduct,
		initialState
	);

	return (
		<form action={formAction} encType='multipart/form-data'>
			<div className='flex gap-4 flex-col sm:flex-row justify-between'>
				<BreadCrumb
					items={[
						{ link: '/products', text: 'Product' },
						{
							link: product?.id
								? `/products/edit/${product.id}`
								: '/products/create',
							text: `${product?.id ? 'Edit' : 'Create'} Product`,
							isCurrent: true,
						},
					]}
				/>

				<PendingButton isEdit={!!product?.id} />
			</div>
			<ErrorMessage errors={state.message ? [state.message] : undefined} />

			<div className='grid gap-4 lg:gap-y-8 lg:gap-x-0 lg:grid-cols-1 xl:grid-cols-3 xl:gap-8 my-4'>
				<div className='grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8'>
					<ProductDetails product={product} state={state} />
					<ProductStock
						colors={colors}
						sizes={sizes}
						state={state}
						product={product}
					/>
					<FeaturedProduct state={state} product={product} />
				</div>
				<div className='grid auto-rows-max items-start gap-4 lg:gap-8'>
					<ProductCategory
						categories={categories}
						state={state}
						product={product}
					/>
					<ProductImages state={state} product={product} />
					<ProductStatus state={state} product={product} />
				</div>
			</div>
		</form>
	);
}

export function PendingButton({ isEdit = false }: { isEdit?: boolean }) {
	const { pending } = useFormStatus();

	return (
		<Button
			className='flex gap-1 justify-center items-center'
			type='submit'
			aria-disabled={pending}
			disabled={pending}
		>
			{pending ? (
				<Loader className='mr-2 h-4 w-4 animate-spin' />
			) : (
				<Plus className='w-4 h-auto' />
			)}

			{isEdit ? 'Edit Product' : 'Create Product'}
		</Button>
	);
}
