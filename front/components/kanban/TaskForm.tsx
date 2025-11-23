import { Task } from '@/types/tasks';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ErrorMessage from '@/components/ErrorMessage';

interface TaskFormProps {
	task?: Task;
	errors?: Record<string, string[]>;
}

export default function TaskForm({ task, errors }: TaskFormProps) {
	return (
		<div className='grid gap-4 py-4'>
			<div>
				<label htmlFor='title' className='text-sm font-medium block mb-1'>
					Title
				</label>
				<Input
					id='title'
					name='title'
					defaultValue={task?.title || ''}
					placeholder='Task title'
					required
				/>
				{errors?.title && <ErrorMessage errors={errors.title} />}
			</div>

			<div>
				<label htmlFor='description' className='text-sm font-medium block mb-1'>
					Description
				</label>
				<Textarea
					id='description'
					name='description'
					defaultValue={task?.description || ''}
					placeholder='Task description'
					rows={3}
				/>
				{errors?.description && <ErrorMessage errors={errors.description} />}
			</div>

			<div>
				<label htmlFor='priority' className='text-sm font-medium block mb-1'>
					Priority
				</label>
				<select
					id='priority'
					name='priority'
					className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
					defaultValue={task?.priority || 'medium'}
				>
					<option value='low'>Low</option>
					<option value='medium'>Medium</option>
					<option value='high'>High</option>
				</select>
				{errors?.priority && <ErrorMessage errors={errors.priority} />}
			</div>

			<div>
				<label htmlFor='status' className='text-sm font-medium block mb-1'>
					Status
				</label>
				<select
					id='status'
					name='status'
					className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
					defaultValue={task?.status || 'todo'}
				>
					<option value='todo'>To Do</option>
					<option value='in-progress'>In Progress</option>
					<option value='done'>Done</option>
				</select>
				{errors?.status && <ErrorMessage errors={errors.status} />}
			</div>
		</div>
	);
}
