import { Button } from '@/components/ui/button';

interface ChatSuggestionProps {
	onSelectSuggestion: (suggestion: string) => void;
}

export default function ChatSuggestions({
	onSelectSuggestion,
}: ChatSuggestionProps) {
	// Updated suggestions that will trigger API calls
	const suggestions = [
		'Show me the last 5 orders',
		'Which products are running low on stock?',
		'Show me sales data from last month',
		'List our top 3 customers by order value',
	];

	return (
		<div className='flex flex-wrap gap-2 mt-2'>
			{suggestions.map((suggestion) => (
				<Button
					key={suggestion}
					variant='outline'
					size='sm'
					onClick={() => onSelectSuggestion(suggestion)}
					className='text-xs'
				>
					{suggestion}
				</Button>
			))}
		</div>
	);
}
