'use client';

import { useDroppable } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
	id: string;
	title: string;
	taskCount: number;
	children: ReactNode;
}

export default function KanbanColumn({
	id,
	title,
	taskCount,
	children,
}: KanbanColumnProps) {
	const { isOver, setNodeRef } = useDroppable({ id: id });

	return (
		<Card
			className={`flex flex-col h-full ${
				isOver ? 'ring-2 ring-border bg-border' : ''
			}`}
			ref={setNodeRef}
		>
			<CardHeader className='px-3 py-2'>
				<div className='flex justify-between items-center'>
					<CardTitle className='text-sm font-medium'>{title}</CardTitle>
					<span className='bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium'>
						{taskCount}
					</span>
				</div>
			</CardHeader>
			<CardContent
				className={cn(
					'flex-1 overflow-x-hidden p-0 h-full ',
					isOver ? 'overflow-y-hidden' : 'overflow-y-scroll'
				)}
			>
				{children}
			</CardContent>
		</Card>
	);
}
