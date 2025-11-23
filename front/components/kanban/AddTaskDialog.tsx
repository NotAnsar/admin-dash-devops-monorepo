'use client';

import { useState, useTransition } from 'react';
import { useFormState } from 'react-dom';
import { createTask, TaskState } from '@/actions/task-action';
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
import { Loader2 } from 'lucide-react';

interface AddTaskDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

const initialState: TaskState = {};

export default function AddTaskDialog({
	isOpen,
	onOpenChange,
}: AddTaskDialogProps) {
	const [isPending, startTransition] = useTransition();
	const [state, formAction] = useFormState(createTask, initialState);

	const handleSubmit = (formData: FormData) => {
		startTransition(() => {
			formAction(formData);
		});
	};

	// Close dialog if task was created successfully
	if (state.success && isOpen) {
		onOpenChange(false);
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New Task</DialogTitle>
				</DialogHeader>
				<form action={handleSubmit}>
					<TaskForm errors={state.errors} />

					{state.message && !state.success && (
						<p className='text-sm text-red-500 mt-2'>{state.message}</p>
					)}

					<DialogFooter>
						<DialogClose asChild>
							<Button type='button' variant='outline'>
								Cancel
							</Button>
						</DialogClose>
						<Button type='submit' disabled={isPending}>
							{isPending ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									Creating...
								</>
							) : (
								'Create Task'
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
