import { fetchCategories } from '@/api/categories';
import { fetchColors } from '@/api/colors';
import { fetchProductById } from '@/api/products';
import { fetchSizes } from '@/api/sizes';
import ProductFormClient from '@/components/product/ProductFormClient';

import { notFound } from 'next/navigation';

export default async function page({
	params: { id },
}: {
	params: { id: string };
}) {
	const [colors, sizes, categories, product] = await Promise.all([
		fetchColors(),
		fetchSizes(),
		fetchCategories(),
		fetchProductById(id),
	]);

	if (!product) notFound();

	return (
		<ProductFormClient
			categories={categories}
			colors={colors}
			product={product}
			sizes={sizes}
		/>
	);
}
