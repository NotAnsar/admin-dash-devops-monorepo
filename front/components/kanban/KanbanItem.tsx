'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface KanbanItemProps {
	id: string;
	title: string;
	description: string;
	priority: 'low' | 'medium' | 'high';
	onClick: () => void;
}

export default function KanbanItem({
	id,
	title,
	description,
	priority,
	onClick,
}: KanbanItemProps) {
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({ id: id });

	const style = transform
		? {
				transform: CSS.Translate.toString(transform),
		  }
		: undefined;

	// Determine badge variant based on priority
	const getBadgeVariant = () => {
		switch (priority) {
			case 'high':
				return 'destructive';
			case 'medium':
				return 'default';
			case 'low':
				return 'secondary';
			default:
				return 'default';
		}
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			className={`${
				isDragging ? 'opacity-50' : ''
			} cursor-grab active:cursor-grabbing `}
		>
			<Card className='mb-3' onClick={onClick}>
				<CardHeader className='p-3 pb-0'>
					<div className='flex justify-between items-start'>
						<CardTitle className='text-sm'>{title}</CardTitle>
						<Badge variant={getBadgeVariant()}>{priority}</Badge>
					</div>
				</CardHeader>
				<CardContent className='p-3 pt-2'>
					<p className='text-xs text-muted-foreground line-clamp-2'>
						{description}
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
