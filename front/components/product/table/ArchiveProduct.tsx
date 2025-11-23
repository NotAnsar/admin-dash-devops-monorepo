import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '../../ui/use-toast';
import { toggleArchiveProduct } from '@/actions/product-action';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '../../ui/button';
import { Loader } from 'lucide-react';

export const ArchiveProduct = ({
	id,
	open,
	setOpen,
	isArchived,
}: {
	id: string;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	isArchived: boolean;
}) => {
	const [state, action] = useFormState(toggleArchiveProduct.bind(null, id), {});

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
						{isArchived
							? 'This will restore your product from the archives.'
							: 'This will archive your product. You can restore it later from the archives.'}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<form action={action}>
						<PendingButton isArchived={isArchived} />
					</form>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

function PendingButton({ isArchived }: { isArchived: boolean }) {
	const { pending } = useFormStatus();

	return (
		<Button
			type='submit'
			aria-disabled={pending}
			disabled={pending}
			className={`${
				isArchived
					? 'bg-green-600 hover:bg-green-700'
					: 'bg-yellow-600 hover:bg-yellow-700'
			} text-white w-full`}
		>
			{pending && <Loader className='mr-2 h-4 w-4 animate-spin' />}
			{isArchived ? 'Restore' : 'Archive'}
		</Button>
	);
}
