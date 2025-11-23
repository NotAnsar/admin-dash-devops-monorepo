'use client';

import { useState, useEffect } from 'react';
import {
	Calendar as BigCalendar,
	momentLocalizer,
	View,
} from 'react-big-calendar';
import moment from 'moment';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	CalendarIcon,
	ChevronLeft,
	ChevronRight,
	Plus,
	Trash2,
} from 'lucide-react';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Event categories with colors
const eventCategories = [
	{ id: 'meeting', name: 'Meeting', color: '#0369a1' },
	{ id: 'task', name: 'Task', color: '#4f46e5' },
	{ id: 'reminder', name: 'Reminder', color: '#059669' },
	{ id: 'personal', name: 'Personal', color: '#f59e0b' },
	{ id: 'deadline', name: 'Deadline', color: '#dc2626' },
];

// Setup localizer for the calendar
const localizer = momentLocalizer(moment);

// Initial events
const initialEvents = [
	{
		id: 1,
		title: 'Product team meeting',
		start: new Date(2025, 4, 8, 10, 0), // May 8, 2025 at 10:00
		end: new Date(2025, 4, 8, 11, 30), // May 8, 2025 at 11:30
		category: 'meeting',
		description: 'Discuss the new product features for the upcoming release.',
	},
	{
		id: 2,
		title: 'Website redesign deadline',
		start: new Date(2025, 4, 15), // May 15, 2025 (all-day)
		end: new Date(2025, 4, 15),
		allDay: true,
		category: 'deadline',
		description: 'Final deadline for the website redesign project.',
	},
	{
		id: 3,
		title: 'Review Q2 analytics',
		start: new Date(2025, 4, 10, 14, 0), // May 10, 2025 at 14:00
		end: new Date(2025, 4, 10, 15, 0), // May 10, 2025 at 15:00
		category: 'task',
		description: 'Analyze Q2 performance metrics and prepare report.',
	},
	{
		id: 4,
		title: 'Team lunch',
		start: new Date(2025, 4, 12, 12, 0), // May 12, 2025 at 12:00
		end: new Date(2025, 4, 12, 13, 30), // May 12, 2025 at 13:30
		category: 'personal',
		description: 'Team building lunch at Bistro Garden.',
	},
];

export default function CalendarPage() {
	// State
	const [events, setEvents] = useState(initialEvents);
	const [newEvent, setNewEvent] = useState({
		title: '',
		description: '',
		start: new Date(),
		end: new Date(),
		category: 'meeting',
		allDay: false,
	});
	const [selectedEvent, setSelectedEvent] = useState<any>(null);
	const [view, setView] = useState<View>('month');
	const [date, setDate] = useState(new Date());
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isAllDay, setIsAllDay] = useState(false);

	// Mobile detection
	const [isMobile, setIsMobile] = useState(false);
	const [mobileView, setMobileView] = useState<View>('agenda'); // Better for mobile

	// Detect mobile devices
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);

		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// Set appropriate view for mobile devices
	useEffect(() => {
		if (isMobile) {
			if (view === 'month' || view === 'week') {
				setMobileView('agenda'); // Agenda view works better on mobile
			} else {
				setMobileView(view);
			}
		}
	}, [isMobile, view]);

	// Filter events for better mobile performance
	const displayEvents = isMobile
		? events.filter((evt) => {
				const eventTime = new Date(evt.start);
				const now = new Date();
				const oneMonthAgo = new Date();
				oneMonthAgo.setMonth(now.getMonth() - 1);
				const oneMonthAhead = new Date();
				oneMonthAhead.setMonth(now.getMonth() + 1);
				return eventTime >= oneMonthAgo && eventTime <= oneMonthAhead;
		  })
		: events;

	// Setup calendar styling
	const eventStyleGetter = (event: any) => {
		const category = eventCategories.find((cat) => cat.id === event.category);
		const backgroundColor = category ? category.color : '#3174ad';
		const style = {
			backgroundColor,
			borderRadius: '4px',
			opacity: 0.9,
			color: 'white',
			border: '0px',
			display: 'block',
		};
		return { style };
	};

	// Handle event click
	const handleSelectEvent = (event: any) => {
		setSelectedEvent(event);
		setIsViewDialogOpen(true);
	};

	// Handle creating a new event slot
	const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
		setNewEvent({
			title: '',
			description: '',
			start,
			end,
			category: 'meeting',
			allDay: false,
		});
		setIsAllDay(
			start.getDate() === end.getDate() &&
				start.getHours() === 0 &&
				end.getHours() === 0
		);
		setIsAddDialogOpen(true);
	};

	// Add new event
	const handleAddEvent = () => {
		if (newEvent.title) {
			const event = {
				...newEvent,
				id: Date.now(),
				allDay: isAllDay,
			};

			// If all day event, adjust the times
			if (isAllDay) {
				event.end = new Date(event.end);
				event.end.setHours(23, 59, 59);
			}

			setEvents([...events, event]);
			setIsAddDialogOpen(false);
		}
	};

	// Edit event
	const handleEditEvent = () => {
		if (selectedEvent && selectedEvent.title) {
			const updatedEvents = events.map((event) =>
				event.id === selectedEvent.id ? selectedEvent : event
			);
			setEvents(updatedEvents);
			setIsEditDialogOpen(false);
			setIsViewDialogOpen(false);
		}
	};

	// Delete event
	const handleDeleteEvent = () => {
		if (selectedEvent) {
			setEvents(events.filter((event) => event.id !== selectedEvent.id));
			setIsViewDialogOpen(false);
		}
	};

	// Format date for toolbar
	const formatToolbarDate = () => {
		const formatter = new Intl.DateTimeFormat('en', {
			month: 'long',
			year: 'numeric',
		});
		return formatter.format(date);
	};

	// Event time formatting
	const formatEventTime = (date: Date) => {
		return format(date, 'h:mm a');
	};

	// Custom event component for mobile
	const MobileEventWrapper = ({ event }: { event: any }) => {
		const category = eventCategories.find((cat) => cat.id === event.category);
		const backgroundColor = category ? category.color : '#3174ad';

		return (
			<div
				className='px-1 py-1 truncate rounded text-white text-sm'
				style={{ backgroundColor }}
			>
				<div className='whitespace-nowrap overflow-hidden text-ellipsis font-medium'>
					{event.title}
				</div>
				{!isMobile && !event.allDay && (
					<div className='text-xs opacity-90'>
						{format(event.start, 'h:mm a')}
					</div>
				)}
			</div>
		);
	};

	// Custom toolbar
	const CustomToolbar = () => {
		return (
			<div
				className={`flex ${
					isMobile ? 'flex-col' : 'justify-between'
				} items-center mb-4 gap-2`}
			>
				<div className='flex gap-1 w-full'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => {
							let newDate;
							switch (view) {
								case 'month':
									newDate = new Date(
										date.getFullYear(),
										date.getMonth() - 1,
										1
									);
									break;
								case 'week':
									newDate = new Date(date);
									newDate.setDate(newDate.getDate() - 7);
									break;
								case 'day':
									newDate = new Date(date);
									newDate.setDate(newDate.getDate() - 1);
									break;
								default:
									newDate = new Date(date);
							}
							setDate(newDate);
						}}
						className='p-1 md:p-2'
					>
						<ChevronLeft className='h-4 w-4' />
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={() => setDate(new Date())}
						className='p-1 md:p-2 text-xs md:text-sm'
					>
						Today
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={() => {
							let newDate;
							switch (view) {
								case 'month':
									newDate = new Date(
										date.getFullYear(),
										date.getMonth() + 1,
										1
									);
									break;
								case 'week':
									newDate = new Date(date);
									newDate.setDate(newDate.getDate() + 7);
									break;
								case 'day':
									newDate = new Date(date);
									newDate.setDate(newDate.getDate() + 1);
									break;
								default:
									newDate = new Date(date);
							}
							setDate(newDate);
						}}
						className='p-1 md:p-2'
					>
						<ChevronRight className='h-4 w-4' />
					</Button>
					<span className='text-sm md:text-lg font-medium ml-2 truncate'>
						{formatToolbarDate()}
					</span>
				</div>

				<div className={`flex gap-1 ${isMobile ? 'w-full mt-2' : ''}`}>
					<Button
						variant={view === 'day' ? 'default' : 'outline'}
						size='sm'
						onClick={() => setView('day')}
						className={`${isMobile ? 'flex-1' : ''} text-xs md:text-sm`}
					>
						Day
					</Button>
					{!isMobile && (
						<Button
							variant={view === 'week' ? 'default' : 'outline'}
							size='sm'
							onClick={() => setView('week')}
							className='text-xs md:text-sm'
						>
							Week
						</Button>
					)}
					<Button
						variant={view === 'month' ? 'default' : 'outline'}
						size='sm'
						onClick={() => setView('month')}
						className={`${isMobile ? 'flex-1' : ''} text-xs md:text-sm`}
					>
						Month
					</Button>
					<Button
						variant={view === 'agenda' ? 'default' : 'outline'}
						size='sm'
						onClick={() => setView('agenda')}
						className={`${isMobile ? 'flex-1' : ''} text-xs md:text-sm`}
					>
						Agenda
					</Button>
					<Button
						size='sm'
						onClick={() => {
							setNewEvent({
								title: '',
								description: '',
								start: new Date(),
								end: new Date(),
								category: 'meeting',
								allDay: false,
							});
							setIsAllDay(false);
							setIsAddDialogOpen(true);
						}}
						className={`${isMobile ? 'flex-1' : ''} text-xs md:text-sm`}
					>
						<Plus className='h-4 w-4 mr-1' />
						{!isMobile && 'Event'}
					</Button>
				</div>
			</div>
		);
	};

	return (
		<div className='flex flex-col h-full'>
			<div className='flex items-center justify-between mb-4 md:mb-6'>
				<h1 className='text-xl md:text-2xl font-bold'>Calendar</h1>
			</div>

			<div className='flex-1 bg-background rounded-md border overflow-hidden'>
				<div className='p-2 md:p-4'>
					<CustomToolbar />
					<div className='h-[65vh] md:h-[75vh]'>
						<BigCalendar
							localizer={localizer}
							events={displayEvents}
							startAccessor='start'
							endAccessor='end'
							onSelectEvent={handleSelectEvent}
							onSelectSlot={handleSelectSlot}
							selectable
							view={isMobile ? mobileView : view}
							onView={(newView: View) => setView(newView)}
							date={date}
							onNavigate={(date) => setDate(date)}
							eventPropGetter={eventStyleGetter}
							popup
							longPressThreshold={250}
							length={isMobile ? 5 : 30}
							components={{
								toolbar: () => null, // Using custom toolbar
								event: (props) => <MobileEventWrapper {...props} />,
							}}
							formats={{
								timeGutterFormat: (date: Date) => {
									return localizer.format(date, 'h a');
								},
								eventTimeRangeFormat: ({
									start,
									end,
								}: {
									start: Date;
									end: Date;
								}) => {
									const startStr = localizer.format(start, 'h:mm a');
									const endStr = localizer.format(end, 'h:mm a');
									return `${startStr} - ${endStr}`;
								},
								// Simplify day headers on mobile
								dayHeaderFormat: (date: Date) => {
									return isMobile
										? localizer.format(date, 'ddd') // Just show "Mon", "Tue", etc.
										: localizer.format(date, 'dddd, MMMM DD'); // Full format on desktop
								},
							}}
						/>
					</div>
				</div>
			</div>

			{/* Add Event Dialog */}
			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent className='sm:max-w-[500px] w-[95vw] max-h-[80vh] overflow-y-auto'>
					<DialogHeader>
						<DialogTitle>Add New Event</DialogTitle>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<div>
							<label
								className='text-sm font-medium block mb-1'
								htmlFor='event-title'
							>
								Event Title
							</label>
							<Input
								id='event-title'
								value={newEvent.title}
								onChange={(e) =>
									setNewEvent({ ...newEvent, title: e.target.value })
								}
								placeholder='Enter event title'
							/>
						</div>
						<div
							className={`grid ${
								isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'
							}`}
						>
							<div>
								<label className='text-sm font-medium block mb-1'>
									Start Date
								</label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant={'outline'}
											className={cn(
												'w-full justify-start text-left font-normal',
												!newEvent.start && 'text-muted-foreground'
											)}
										>
											<CalendarIcon className='mr-2 h-4 w-4' />
											{newEvent.start
												? format(newEvent.start, 'PPP')
												: 'Select date'}
										</Button>
									</PopoverTrigger>
									<PopoverContent className='w-auto p-0'>
										<Calendar
											mode='single'
											selected={newEvent.start}
											onSelect={(date) =>
												setNewEvent({ ...newEvent, start: date || new Date() })
											}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</div>
							<div>
								<label className='text-sm font-medium block mb-1'>
									End Date
								</label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant={'outline'}
											className={cn(
												'w-full justify-start text-left font-normal',
												!newEvent.end && 'text-muted-foreground'
											)}
										>
											<CalendarIcon className='mr-2 h-4 w-4' />
											{newEvent.end
												? format(newEvent.end, 'PPP')
												: 'Select date'}
										</Button>
									</PopoverTrigger>
									<PopoverContent className='w-auto p-0'>
										<Calendar
											mode='single'
											selected={newEvent.end}
											onSelect={(date) =>
												setNewEvent({ ...newEvent, end: date || new Date() })
											}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</div>
						</div>

						{!isAllDay && (
							<div
								className={`grid ${
									isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'
								}`}
							>
								<div>
									<label
										className='text-sm font-medium block mb-1'
										htmlFor='start-time'
									>
										Start Time
									</label>
									<Input
										id='start-time'
										type='time'
										value={format(newEvent.start, 'HH:mm')}
										onChange={(e) => {
											const [hours, minutes] = e.target.value.split(':');
											const newDate = new Date(newEvent.start);
											newDate.setHours(parseInt(hours), parseInt(minutes));
											setNewEvent({ ...newEvent, start: newDate });
										}}
										className={isMobile ? 'p-6 text-base' : ''}
									/>
								</div>
								<div>
									<label
										className='text-sm font-medium block mb-1'
										htmlFor='end-time'
									>
										End Time
									</label>
									<Input
										id='end-time'
										type='time'
										value={format(newEvent.end, 'HH:mm')}
										onChange={(e) => {
											const [hours, minutes] = e.target.value.split(':');
											const newDate = new Date(newEvent.end);
											newDate.setHours(parseInt(hours), parseInt(minutes));
											setNewEvent({ ...newEvent, end: newDate });
										}}
										className={isMobile ? 'p-6 text-base' : ''}
									/>
								</div>
							</div>
						)}

						<div className='flex items-center gap-2'>
							<input
								type='checkbox'
								id='all-day'
								checked={isAllDay}
								onChange={(e) => setIsAllDay(e.target.checked)}
								className={`h-5 w-5 rounded border-gray-300 ${
									isMobile ? 'mr-2' : ''
								}`}
							/>
							<label
								htmlFor='all-day'
								className={`text-sm font-medium ${isMobile ? 'text-base' : ''}`}
							>
								All Day Event
							</label>
						</div>

						<div>
							<label className='text-sm font-medium block mb-1'>Category</label>
							<Select
								value={newEvent.category}
								onValueChange={(value) =>
									setNewEvent({ ...newEvent, category: value })
								}
							>
								<SelectTrigger className={isMobile ? 'p-6 text-base' : ''}>
									<SelectValue placeholder='Select a category' />
								</SelectTrigger>
								<SelectContent>
									{eventCategories.map((category) => (
										<SelectItem
											key={category.id}
											value={category.id}
											className={isMobile ? 'text-base p-3' : ''}
										>
											<div className='flex items-center'>
												<span
													className={`inline-block rounded-full mr-2 ${
														isMobile ? 'w-4 h-4' : 'w-3 h-3'
													}`}
													style={{ backgroundColor: category.color }}
												></span>
												{category.name}
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<label
								className='text-sm font-medium block mb-1'
								htmlFor='event-desc'
							>
								Description
							</label>
							<Textarea
								id='event-desc'
								value={newEvent.description}
								onChange={(e) =>
									setNewEvent({ ...newEvent, description: e.target.value })
								}
								placeholder='Event details'
								rows={3}
								className={isMobile ? 'text-base' : ''}
							/>
						</div>
					</div>
					<DialogFooter className={isMobile ? 'flex-col space-y-2' : ''}>
						<Button
							variant='outline'
							onClick={() => setIsAddDialogOpen(false)}
							className={isMobile ? 'w-full py-6' : ''}
						>
							Cancel
						</Button>
						<Button
							onClick={handleAddEvent}
							className={isMobile ? 'w-full py-6' : ''}
						>
							Add Event
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* View Event Dialog */}
			<Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
				<DialogContent className='sm:max-w-[500px] w-[95vw] max-h-[80vh] overflow-y-auto'>
					<DialogHeader>
						<DialogTitle>{selectedEvent?.title}</DialogTitle>
					</DialogHeader>
					<div className='py-4'>
						{selectedEvent && (
							<>
								<div className='mb-4'>
									<p className='text-sm font-medium mb-1'>Time</p>
									<p className={isMobile ? 'text-base' : ''}>
										{selectedEvent.allDay ? (
											<>
												{format(selectedEvent.start, 'PPP')}
												{!moment(selectedEvent.start).isSame(
													selectedEvent.end,
													'day'
												) && ` - ${format(selectedEvent.end, 'PPP')}`}
												<span className='ml-2 text-sm text-muted-foreground'>
													(All day)
												</span>
											</>
										) : (
											<>
												{format(selectedEvent.start, 'PPP')}{' '}
												{formatEventTime(selectedEvent.start)} -
												{!moment(selectedEvent.start).isSame(
													selectedEvent.end,
													'day'
												) && ` ${format(selectedEvent.end, 'PPP')} `}
												{formatEventTime(selectedEvent.end)}
											</>
										)}
									</p>
								</div>
								<div className='mb-4'>
									<p className='text-sm font-medium mb-1'>Category</p>
									<div className='flex items-center'>
										<span
											className={`inline-block rounded-full mr-2 ${
												isMobile ? 'w-4 h-4' : 'w-3 h-3'
											}`}
											style={{
												backgroundColor:
													eventCategories.find(
														(cat) => cat.id === selectedEvent.category
													)?.color || '#3174ad',
											}}
										></span>
										<span className={isMobile ? 'text-base' : ''}>
											{eventCategories.find(
												(cat) => cat.id === selectedEvent.category
											)?.name || 'Unknown'}
										</span>
									</div>
								</div>
								{selectedEvent.description && (
									<div>
										<p className='text-sm font-medium mb-1'>Description</p>
										<p
											className={`whitespace-pre-wrap ${
												isMobile ? 'text-base' : ''
											}`}
										>
											{selectedEvent.description}
										</p>
									</div>
								)}
							</>
						)}
					</div>
					<DialogFooter
						className={isMobile ? 'flex-col' : 'flex justify-between'}
					>
						<Button
							variant='destructive'
							onClick={handleDeleteEvent}
							className={isMobile ? 'w-full py-6 mb-2' : ''}
						>
							<Trash2 className='mr-2 h-4 w-4' />
							Delete
						</Button>
						<div className={`flex gap-2 ${isMobile ? 'w-full flex-col' : ''}`}>
							<Button
								variant='outline'
								onClick={() => setIsViewDialogOpen(false)}
								className={isMobile ? 'w-full py-6' : ''}
							>
								Close
							</Button>
							<Button
								onClick={() => setIsEditDialogOpen(true)}
								className={isMobile ? 'w-full py-6' : ''}
							>
								Edit
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Event Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className='sm:max-w-[500px] w-[95vw] max-h-[80vh] overflow-y-auto'>
					<DialogHeader>
						<DialogTitle>Edit Event</DialogTitle>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						{selectedEvent && (
							<>
								<div>
									<label
										className='text-sm font-medium block mb-1'
										htmlFor='edit-title'
									>
										Event Title
									</label>
									<Input
										id='edit-title'
										value={selectedEvent.title}
										onChange={(e) =>
											setSelectedEvent({
												...selectedEvent,
												title: e.target.value,
											})
										}
										className={isMobile ? 'p-6 text-base' : ''}
									/>
								</div>
								<div
									className={`grid ${
										isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'
									}`}
								>
									<div>
										<label className='text-sm font-medium block mb-1'>
											Start Date
										</label>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant={'outline'}
													className={`w-full justify-start text-left font-normal ${
														isMobile ? 'py-6' : ''
													}`}
												>
													<CalendarIcon className='mr-2 h-4 w-4' />
													{format(selectedEvent.start, 'PPP')}
												</Button>
											</PopoverTrigger>
											<PopoverContent className='w-auto p-0'>
												<Calendar
													mode='single'
													selected={selectedEvent.start}
													onSelect={(date) =>
														setSelectedEvent({
															...selectedEvent,
															start: date || selectedEvent.start,
														})
													}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
									</div>
									<div>
										<label className='text-sm font-medium block mb-1'>
											End Date
										</label>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant={'outline'}
													className={`w-full justify-start text-left font-normal ${
														isMobile ? 'py-6' : ''
													}`}
												>
													<CalendarIcon className='mr-2 h-4 w-4' />
													{format(selectedEvent.end, 'PPP')}
												</Button>
											</PopoverTrigger>
											<PopoverContent className='w-auto p-0'>
												<Calendar
													mode='single'
													selected={selectedEvent.end}
													onSelect={(date) =>
														setSelectedEvent({
															...selectedEvent,
															end: date || selectedEvent.end,
														})
													}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
									</div>
								</div>

								{!selectedEvent.allDay && (
									<div
										className={`grid ${
											isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'
										}`}
									>
										<div>
											<label
												className='text-sm font-medium block mb-1'
												htmlFor='edit-start-time'
											>
												Start Time
											</label>
											<Input
												id='edit-start-time'
												type='time'
												value={format(selectedEvent.start, 'HH:mm')}
												onChange={(e) => {
													const [hours, minutes] = e.target.value.split(':');
													const newDate = new Date(selectedEvent.start);
													newDate.setHours(parseInt(hours), parseInt(minutes));
													setSelectedEvent({
														...selectedEvent,
														start: newDate,
													});
												}}
												className={isMobile ? 'p-6 text-base' : ''}
											/>
										</div>
										<div>
											<label
												className='text-sm font-medium block mb-1'
												htmlFor='edit-end-time'
											>
												End Time
											</label>
											<Input
												id='edit-end-time'
												type='time'
												value={format(selectedEvent.end, 'HH:mm')}
												onChange={(e) => {
													const [hours, minutes] = e.target.value.split(':');
													const newDate = new Date(selectedEvent.end);
													newDate.setHours(parseInt(hours), parseInt(minutes));
													setSelectedEvent({ ...selectedEvent, end: newDate });
												}}
												className={isMobile ? 'p-6 text-base' : ''}
											/>
										</div>
									</div>
								)}

								<div className='flex items-center gap-2'>
									<input
										type='checkbox'
										id='edit-all-day'
										checked={selectedEvent.allDay}
										onChange={(e) =>
											setSelectedEvent({
												...selectedEvent,
												allDay: e.target.checked,
											})
										}
										className={`h-5 w-5 rounded border-gray-300 ${
											isMobile ? 'mr-2' : ''
										}`}
									/>
									<label
										htmlFor='edit-all-day'
										className={`text-sm font-medium ${
											isMobile ? 'text-base' : ''
										}`}
									>
										All Day Event
									</label>
								</div>

								<div>
									<label className='text-sm font-medium block mb-1'>
										Category
									</label>
									<Select
										value={selectedEvent.category}
										onValueChange={(value) =>
											setSelectedEvent({ ...selectedEvent, category: value })
										}
									>
										<SelectTrigger className={isMobile ? 'p-6 text-base' : ''}>
											<SelectValue placeholder='Select a category' />
										</SelectTrigger>
										<SelectContent>
											{eventCategories.map((category) => (
												<SelectItem
													key={category.id}
													value={category.id}
													className={isMobile ? 'text-base p-3' : ''}
												>
													<div className='flex items-center'>
														<span
															className={`inline-block rounded-full mr-2 ${
																isMobile ? 'w-4 h-4' : 'w-3 h-3'
															}`}
															style={{ backgroundColor: category.color }}
														></span>
														{category.name}
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div>
									<label
										className='text-sm font-medium block mb-1'
										htmlFor='edit-desc'
									>
										Description
									</label>
									<Textarea
										id='edit-desc'
										value={selectedEvent.description}
										onChange={(e) =>
											setSelectedEvent({
												...selectedEvent,
												description: e.target.value,
											})
										}
										rows={3}
										className={isMobile ? 'text-base' : ''}
									/>
								</div>
							</>
						)}
					</div>
					<DialogFooter className={isMobile ? 'flex-col space-y-2' : ''}>
						<Button
							variant='outline'
							onClick={() => setIsEditDialogOpen(false)}
							className={isMobile ? 'w-full py-6' : ''}
						>
							Cancel
						</Button>
						<Button
							onClick={handleEditEvent}
							className={isMobile ? 'w-full py-6' : ''}
						>
							Save Changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Mobile-specific styles */}
			<style jsx global>{`
				@media (max-width: 767px) {
					/* Make the calendar more compact on mobile */
					.rbc-calendar {
						font-size: 0.875rem;
					}

					/* Increase touch targets */
					.rbc-event {
						padding: 0.5rem 0.25rem;
					}

					/* Make month view more usable */
					.rbc-month-view .rbc-header {
						padding: 0.25rem;
					}

					.rbc-month-view .rbc-date-cell {
						padding-right: 0.25rem;
						text-align: center;
					}

					/* Simplify agenda view */
					.rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
						padding: 0.5rem;
					}

					/* Better touch areas for all controls */
					.rbc-toolbar button {
						padding: 0.75rem;
					}
				}
			`}</style>
		</div>
	);
}
