'use client';

import { useState } from 'react';
import { Task } from '@/types/tasks';
import KanbanHeader from './KanbanHeader';
import KanbanBoard from './KanbanBoard';
import TaskDialog from './TaskDialog';

export default function Kanban({ data: tasks }: { data: Task[] }) {
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [editTask, setEditTask] = useState<Task | null>(null);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	// Handler for editing a task
	const handleEditTask = (task: Task) => {
		setEditTask(task);
		setIsEditDialogOpen(true);
	};

	return (
		<main className='flex flex-1 flex-col gap-4'>
			<KanbanHeader onAddTask={() => setIsAddDialogOpen(true)} />

			<KanbanBoard tasks={tasks} onEditTask={handleEditTask} />

			<TaskDialog
				isOpen={isAddDialogOpen}
				onOpenChange={setIsAddDialogOpen}
				key={isAddDialogOpen ? 'true' : 'false'}
			/>

			<TaskDialog
				isOpen={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}
				task={editTask || undefined}
				key={isEditDialogOpen ? 'true' : 'false'}
			/>
		</main>
	);
}
