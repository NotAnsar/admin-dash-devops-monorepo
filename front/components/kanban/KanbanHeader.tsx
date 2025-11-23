'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface KanbanHeaderProps {
	onAddTask: () => void;
}

export default function KanbanHeader({ onAddTask }: KanbanHeaderProps) {
	return (
		<div className='flex justify-between items-center'>
			<h1 className='text-2xl font-bold'>Kanban Board</h1>
			<Button onClick={onAddTask}>
				<PlusCircle className='mr-2 h-4 w-4' />
				New Task
			</Button>
		</div>
	);
}
