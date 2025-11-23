import { CreateColorButton } from '@/components/color/CreateColor';
import { columns } from '@/components/color/table/columns';
import { DataTable } from '@/components/color/table/data-table';
import { fetchColors } from '@/api/colors';

export default async function Products() {
	const colors = await fetchColors();

	return (
		<>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>Colors</h1>
				<CreateColorButton />
			</div>

			<DataTable columns={columns} data={colors} />
		</>
	);
}
