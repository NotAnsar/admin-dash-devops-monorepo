import { fetchOrderById } from '@/api/orders';
import OrderDetails from '@/components/order/OrderDetails';
import { notFound } from 'next/navigation';
import React from 'react';

export default async function page({
	params: { id },
}: {
	params: { id: string };
}) {
	const order = await fetchOrderById(id);

	if (!order) {
		return notFound();
	}

	return <OrderDetails order={order} />;
}
