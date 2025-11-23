import { fetchCategories } from '@/api/categories';
import { fetchColors } from '@/api/colors';
import { fetchSizes } from '@/api/sizes';
import ProductFormClient from '@/components/product/ProductFormClient';

export default async function page() {
	const [colors, sizes, categories] = await Promise.all([
		fetchColors(),
		fetchSizes(),
		fetchCategories(),
	]);

	return (
		<ProductFormClient categories={categories} colors={colors} sizes={sizes} />
	);
}
