import { columns } from '@/components/size/table/columns';
import { DataTable } from '@/components/color/table/data-table';
import { CreateSizeButton } from '@/components/size/CreateSize';
import { fetchSizes } from '@/api/sizes';

export default async function Products() {
	const sizes = await fetchSizes();

	return (
		<>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>Sizes</h1>
				<CreateSizeButton />
			</div>

			<DataTable columns={columns} data={sizes} />
		</>
	);
}
