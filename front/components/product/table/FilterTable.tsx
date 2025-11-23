import { Input } from '../../ui/input';
import { RotateCcw } from 'lucide-react';
import { Button } from '../../ui/button';
import { Table } from '@tanstack/react-table';
import { DataTableBooleanFilter } from './DataTableBooleanFilter';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Category } from '@/types/category';

export default function FilterTable<TData>({
	table,
	categories,
}: {
	table: Table<TData>;
	categories: Category[];
}) {
	return (
		<div className='flex flex-col lg:flex-row items-center py-4 gap-2'>
			<div className='grid sm:grid-cols-3 lg:flex gap-2 w-full'>
				<Input
					placeholder='Filter by name'
					className='flex gap-1 w-full lg:w-[270px] '
					value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('name')?.setFilterValue(event.target.value)
					}
				/>

				<DataTableBooleanFilter
					column={table.getColumn('featured')}
					title={'Featured'}
					options={[
						{ label: 'Featured', value: 'true' },
						{ label: 'Not Featured', value: 'false' },
					]}
					classname='hidden sm:flex'
				/>

				<DataTableBooleanFilter
					column={table.getColumn('archived')}
					title={'Status'}
					options={[
						{ label: 'Archived', value: 'true' },
						{ label: 'Active', value: 'false' },
					]}
					classname='hidden sm:flex'
				/>
			</div>

			<div className='flex items-center gap-2 w-full lg:w-[350px] '>
				<Select
					onValueChange={(e) => table.getColumn('category')?.setFilterValue(e)}
					value={
						(table.getColumn('category')?.getFilterValue() as string) || ''
					}
				>
					<SelectTrigger className='order-none md:order-1'>
						<SelectValue placeholder='Filter by Categories' />
					</SelectTrigger>
					<SelectContent className='w-full'>
						{categories.map((c) => (
							<SelectItem key={c.id} value={c.id}>
								{c.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{table.getColumn('category')?.getIsFiltered() && (
					<Button
						variant={'outline'}
						onClick={() => table.getColumn('category')?.setFilterValue('')}
						className=' flex items-center gap-2 '
					>
						<RotateCcw className={'h-[13px] w-[13px] mt-[2px] '} />
					</Button>
				)}
			</div>
		</div>
	);
}
