'use client';

import { updateOrderStatus, StatusState } from '@/actions/order-action';
import SelectInput from '@/components/ui/select-input';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Order, statusEnumValues } from '@/types/order';
import React, { useEffect } from 'react';
import { useFormState } from 'react-dom';

export default function StatusCell({ order }: { order: Order }) {
	const initialState: StatusState = { message: null, errors: {} };
	const [state, action] = useFormState(
		updateOrderStatus.bind(null, order?.id),
		initialState
	);

	useEffect(() => {
		if (state.message) {
			toast({
				description: state.message,
				variant: state.success ? 'default' : 'destructive',
			});
		}
	}, [state]);

	const handleStatusChange = (newStatus: string | null) => {
		if (newStatus) {
			const formData = new FormData();
			formData.append('status', newStatus);
			action(formData);
		}
	};

	return (
		<form action={action}>
			<SelectInput
				name='status'
				options={statusEnumValues}
				initialValue={order?.status || undefined}
				placeholder='Select Category'
				className={cn(
					state?.errors?.status
						? 'border-destructive focus-visible:ring-destructive '
						: ''
				)}
				onChange={handleStatusChange}
			/>
		</form>
	);
}
