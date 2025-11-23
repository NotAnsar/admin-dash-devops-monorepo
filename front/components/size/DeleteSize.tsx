import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '../ui/use-toast';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '../ui/button';
import { Loader } from 'lucide-react';
import { deleteSize } from '@/actions/size-action';

export const DeleteSize = ({
	id,
	open,
	setOpen,
}: {
	id: string;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
	const [state, action] = useFormState(deleteSize.bind(null, id), {});

	useEffect(() => {
		if (state.message) {
			setOpen(false);
			toast({
				description: state.message,
				variant: state.success ? 'default' : 'destructive',
			});
		}
	}, [state, setOpen]);

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						Deleting this size will also delete all products associated with it.
						This action cannot be undone. Do you want to proceed with the
						deletion?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<form action={action}>
						<PendingButton />
					</form>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

function PendingButton() {
	const { pending } = useFormStatus();

	return (
		<Button
			type='submit'
			aria-disabled={pending}
			disabled={pending}
			className='bg-destructive text-white hover:bg-destructive/90 w-full'
		>
			{pending && <Loader className='mr-2 h-4 w-4 animate-spin' />}
			Delete
		</Button>
	);
}
