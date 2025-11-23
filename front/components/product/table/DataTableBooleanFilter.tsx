import type { Column } from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { CheckIcon, PlusCircle } from 'lucide-react';

const valueToBool = (value: string) => {
	let res: boolean | undefined = undefined;
	if (value === 'true') res = true;
	else if (value === 'false') res = false;
	return res;
};

interface DataTableBooleanFilterProps<TData, TValue> {
	column?: Column<TData, TValue>;
	title?: string;
}

export function DataTableBooleanFilter<TData, TValue>({
	column,
	title,
	options,
	classname,
}: DataTableBooleanFilterProps<TData, TValue> & {
	options?: {
		label: string;
		value: string;
	}[];
	classname?: string;
}) {
	const selectedValue = column?.getFilterValue() as boolean | undefined;
	const booleanOptions = options
		? options
		: [
				{ label: 'True', value: 'true' },
				{ label: 'False', value: 'false' },
		  ];

	const handleSelect = (value: string) => {
		column?.setFilterValue(valueToBool(value));
	};
	const clearFilter = () => {
		column?.setFilterValue(undefined);
	};

	return (
		<Popover>
			<PopoverTrigger asChild className={classname}>
				<Button variant='outline' size='sm' className='h-10 border-dashed'>
					<PlusCircle className='mr-2 size-4' />
					{title}
					{selectedValue !== undefined && (
						<>
							<Separator orientation='vertical' className='mx-2 h-4' />
							<Badge
								variant='secondary'
								className='rounded-sm px-1 font-normal'
							>
								{
									booleanOptions?.find(
										(b) => valueToBool(b.value) === selectedValue
									)?.label
								}
							</Badge>
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[12.5rem] p-0' align='start'>
				<Command>
					<CommandList>
						<CommandGroup>
							{booleanOptions.map((option) => (
								<CommandItem
									key={option.value}
									onSelect={() => handleSelect(option.value)}
								>
									<div
										className={cn(
											'mr-2 flex size-4 items-center justify-center rounded-sm border border-primary',
											selectedValue === valueToBool(option.value)
												? 'bg-primary text-primary-foreground'
												: 'opacity-50 [&_svg]:invisible'
										)}
									>
										{selectedValue === valueToBool(option.value) && (
											<CheckIcon className='size-4' aria-hidden='true' />
										)}
									</div>
									<span>{option.label}</span>
								</CommandItem>
							))}
						</CommandGroup>
						{selectedValue !== undefined && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										onSelect={() => clearFilter()}
										className='justify-center text-center'
									>
										Clear filter
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
