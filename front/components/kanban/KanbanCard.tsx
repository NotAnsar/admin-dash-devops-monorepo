'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from 'react';

interface KanbanCardProps {
	id: string;
	status: string;
	children: ReactNode;
	onClick: () => void;
}

export default function KanbanCard({
	id,
	status,
	children,
	onClick,
}: KanbanCardProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id,
		data: {
			status,
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onClick={onClick}
			className='touch-none'
		>
			{children}
		</div>
	);
}
