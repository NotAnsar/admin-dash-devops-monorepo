'use client';

import { useTransition } from 'react';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import KanbanItem from './KanbanItem';
import { Task } from '@/types/tasks';
import { updateTaskStatus } from '@/actions/task-action';
import { useToast } from '@/components/ui/use-toast';

type Status = 'todo' | 'in-progress' | 'done';

interface KanbanBoardProps {
	tasks: Task[];
	onEditTask: (task: Task) => void;
}

export default function KanbanBoard({ tasks, onEditTask }: KanbanBoardProps) {
	const [isPending, startTransition] = useTransition();
	const { toast } = useToast();

	// Configure sensors for drag and drop
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8, // Minimum drag distance before activating
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	// Get tasks filtered by status
	const getTasksByStatus = (status: Status) => {
		return tasks.filter((task) => task.status === status);
	};

	// Handle drag end event
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over) return;

		// Extract the task ID and target column
		const taskId = active.id.toString();
		const targetColumnId = over.id.toString();

		// Make sure it's a valid status
		if (
			targetColumnId === 'todo' ||
			targetColumnId === 'in-progress' ||
			targetColumnId === 'done'
		) {
			startTransition(async () => {
				const res = await updateTaskStatus(
					taskId,
					targetColumnId.toUpperCase()
				);
				// if (!res.success) {
				if (res.message) {
					toast({
						title: res.success ? 'Success' : 'Error',
						description: res.message,
						variant: res.success ? 'default' : 'destructive',
						duration: 3000,
					});
				}
			});
		}
	};

	// Column definitions
	const columns: { id: Status; title: string }[] = [
		{ id: 'todo', title: 'To Do' },
		{ id: 'in-progress', title: 'In Progress' },
		{ id: 'done', title: 'Done' },
	];

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-12rem)]'>
				{columns.map((column) => (
					<KanbanColumn
						key={column.id}
						id={column.id}
						title={column.title}
						taskCount={getTasksByStatus(column.id).length}
					>
						<div className='flex-1 overflow-x-hidden p-2 space-y-3 overflow-y-hidden'>
							{getTasksByStatus(column.id).map((task) => (
								<KanbanItem
									key={task.id}
									id={task.id}
									title={task.title}
									description={task.description}
									priority={task.priority}
									onClick={() => onEditTask(task)}
								/>
							))}
						</div>
					</KanbanColumn>
				))}
			</div>
		</DndContext>
	);
}
