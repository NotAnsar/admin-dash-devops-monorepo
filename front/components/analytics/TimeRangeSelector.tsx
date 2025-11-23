'use client';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';

interface TimeRangeSelectorProps {
	timeRange: string;
}

export default function TimeRangeSelector({
	timeRange,
}: TimeRangeSelectorProps) {
	const router = useRouter();

	const handleValueChange = (newTimeRange: string) => {
		router.push(`?timeRange=${newTimeRange}`);
	};

	return (
		<Select value={timeRange} onValueChange={handleValueChange}>
			<SelectTrigger className='w-[180px]'>
				<SelectValue placeholder='Select time range' />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value='30days'>Last 30 Days</SelectItem>
				<SelectItem value='3months'>Last 3 Months</SelectItem>
				<SelectItem value='6months'>Last 6 Months</SelectItem>
				<SelectItem value='1year'>Last Year</SelectItem>
			</SelectContent>
		</Select>
	);
}
