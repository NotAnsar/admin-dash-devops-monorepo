import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatTimestamp(
	timestamp: string | number,
	showTime: boolean = false
): string {
	// Handle Unix timestamp in seconds (convert to milliseconds)
	const dateObj = new Date(
		typeof timestamp === 'number' && timestamp < 10000000000
			? timestamp * 1000
			: timestamp
	);

	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];

	let formattedDate = `${dateObj.getDate().toString().padStart(2, '0')} ${
		months[dateObj.getMonth()]
	} ${dateObj.getFullYear()}`;

	if (showTime) {
		const hours = dateObj.getHours().toString().padStart(2, '0');
		const minutes = dateObj.getMinutes().toString().padStart(2, '0');
		formattedDate += ` ${hours}:${minutes}`;
	}

	return formattedDate;
}
