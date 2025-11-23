'use client';

import { useState, useTransition } from 'react';
import { useFormState } from 'react-dom';
import { updateTask, deleteTask, TaskUpdateState } from '@/actions/task-action';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from '@/components/ui/dialog';
import TaskForm from './TaskForm';
import { Task } from '@/types/tasks';
import { Loader2, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface EditTaskDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	task: Task | null;
}

const initialState: TaskUpdateState = {};

export default function EditTaskDialog({
	isOpen,
	onOpenChange,
	task,
}: EditTaskDialogProps) {
	const [isPending, startTransition] = useTransition();
	const [isDeleting, setIsDeleting] = useState(false);
	const { toast } = useToast();

	const updateTaskWithId = task
		? (state: TaskUpdateState, formData: FormData) =>
				updateTask(task.id, state, formData)
		: () => Promise.resolve(initialState);

	const [state, formAction] = useFormState(updateTaskWithId, initialState);

	const handleDelete = () => {
		if (!task) return;

		setIsDeleting(true);
		startTransition(async () => {
			const result = await deleteTask(task.id);

			if (result.success) {
				toast({
					title: 'Success',
					description: 'Task deleted successfully',
				});
				onOpenChange(false);
			} else {
				toast({
					title: 'Error',
					description: result.message || 'Failed to delete task',
					variant: 'destructive',
				});
			}
			setIsDeleting(false);
		});
	};

	// Close dialog if task was updated successfully
	if (state.success && isOpen) {
		onOpenChange(false);
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Task</DialogTitle>
				</DialogHeader>
				{task && (
					<form action={formAction}>
						<TaskForm task={task} errors={state.errors} />

						{state.message && !state.success && (
							<p className='text-sm text-red-500 mt-2'>{state.message}</p>
						)}

						<DialogFooter className='flex justify-between'>
							<Button
								type='button'
								variant='destructive'
								onClick={handleDelete}
								disabled={isPending || isDeleting}
							>
								{isDeleting ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										Deleting...
									</>
								) : (
									<>
										<Trash2 className='mr-2 h-4 w-4' />
										Delete
									</>
								)}
							</Button>
							<div className='flex gap-2'>
								<DialogClose asChild>
									<Button
										type='button'
										variant='outline'
										disabled={isPending || isDeleting}
									>
										Cancel
									</Button>
								</DialogClose>
								<Button type='submit' disabled={isPending || isDeleting}>
									{isPending ? (
										<>
											<Loader2 className='mr-2 h-4 w-4 animate-spin' />
											Saving...
										</>
									) : (
										'Save Changes'
									)}
								</Button>
							</div>
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}
