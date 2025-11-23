// import { columns } from '@/components/order/table/columns';
// import { DataTable } from '@/components/order/table/data-table';
// import { Button } from '@/components/ui/button';
// import { fetchOrders } from '@/api/orders';

// export default async function Orders() {
// 	const orders = await fetchOrders();

// 	return (
// 		<>
// 			<div className='flex items-center justify-between'>
// 				<h1 className='text-2xl font-bold'>Orders</h1>
// 				<Button>Download CSV</Button>
// 			</div>

// 			<DataTable columns={columns} data={orders} />
// 		</>
// 	);
// }

import { columns } from '@/components/order/table/columns';
import { DataTable } from '@/components/order/table/data-table';
import { fetchOrders } from '@/api/orders';
import DownloadOrdersCSV from '@/components/order/DownloadOrdersCSV';

export default async function Orders() {
	const orders = await fetchOrders();

	return (
		<>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>Orders</h1>
				<DownloadOrdersCSV orders={orders} />
			</div>

			<DataTable columns={columns} data={orders} />
		</>
	);
}
