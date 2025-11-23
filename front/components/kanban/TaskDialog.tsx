'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createTask, deleteTask, updateTask } from '@/actions/task-action';
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
import { toast } from '@/components/ui/use-toast';

interface TaskDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	task?: Task | undefined;
}

// Initial state for our form

export default function TaskDialog({
	isOpen,
	onOpenChange,
	task,
}: TaskDialogProps) {
	const initialState = { success: false, message: '', errors: {} };
	// Determine if we're in edit or add mode
	const isEditMode = Boolean(task?.id);
	const formAction = isEditMode ? updateTask.bind(null, task!.id) : createTask;

	// Single form state for main action
	const [formState, formDispatch] = useFormState(formAction, initialState);

	// Handle form success and toast messages
	useEffect(() => {
		// Auto-close dialog on success
		if (formState.success && isOpen) {
			onOpenChange(false);
		}

		// Show toast notification if we have a message
		if (formState.message) {
			toast({
				title: formState.success ? 'Success' : 'Error',
				description: formState.message,
				variant: formState.success ? 'default' : 'destructive',
			});
		}
	}, [formState, isOpen, onOpenChange]);

	// Handle delete action with client-side action
	const handleDelete = async () => {
		if (!task?.id) return;

		try {
			// Use the server action directly
			const result = await deleteTask(task.id);

			// Show result toast
			toast({
				title: result.success ? 'Success' : 'Error',
				description:
					result.message ||
					(result.success ? 'Task deleted' : 'Failed to delete task'),
				variant: result.success ? 'default' : 'destructive',
			});

			// Close dialog on success
			if (result.success) {
				onOpenChange(false);
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to delete task',
				variant: 'destructive',
			});
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isEditMode ? 'Edit Task' : 'Add New Task'}</DialogTitle>
				</DialogHeader>

				<form action={formDispatch}>
					<TaskForm task={task} errors={formState.errors} />

					{formState.message && !formState.success && (
						<p className='text-sm text-destructive mt-2'>{formState.message}</p>
					)}

					<DialogFooter
						className={isEditMode ? 'flex justify-between flex-row' : ''}
					>
						{isEditMode && <DeleteButton onDelete={handleDelete} />}

						<div
							className={`flex gap-2 ${
								!isEditMode ? 'w-full justify-end' : ''
							}`}
						>
							<DialogClose asChild>
								<Button type='button' variant='outline'>
									Cancel
								</Button>
							</DialogClose>
							<SubmitButton isEditMode={isEditMode} />
						</div>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

// Simple submit button component
function SubmitButton({ isEditMode }: { isEditMode: boolean }) {
	const { pending } = useFormStatus();

	return (
		<Button type='submit' disabled={pending}>
			{pending ? (
				<>
					<Loader2 className='mr-2 h-4 w-4 animate-spin' />
					{isEditMode ? 'Saving...' : 'Creating...'}
				</>
			) : isEditMode ? (
				'Save Changes'
			) : (
				'Create Task'
			)}
		</Button>
	);
}

// Simple delete button component with its own loading state
function DeleteButton({ onDelete }: { onDelete: () => Promise<void> }) {
	const { pending } = useFormStatus();
	const [isDeleting, setIsDeleting] = useState(false);

	const handleClick = async () => {
		setIsDeleting(true);
		await onDelete();
		setIsDeleting(false);
	};

	return (
		<Button
			type='button'
			variant='destructive'
			onClick={handleClick}
			disabled={pending || isDeleting}
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
	);
}
