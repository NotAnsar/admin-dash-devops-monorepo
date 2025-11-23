import { CreateCategoryButton } from '@/components/category/CreateCategory';
import { columns } from '@/components/category/table/columns';
import { DataTable } from '@/components/category/table/data-table';
import { fetchCategories } from '@/api/categories';

export default async function Products() {
	const categories = await fetchCategories();

	return (
		<>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>Categories</h1>
				<CreateCategoryButton />
			</div>

			<DataTable columns={columns} data={categories} />
		</>
	);
}
