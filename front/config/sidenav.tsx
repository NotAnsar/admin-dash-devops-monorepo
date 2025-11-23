import {
	BarChart3,
	BookCheck,
	Box,
	Boxes,
	Calendar,
	FileText,
	LayoutDashboard,
	LucideIcon,
	PackageSearch,
	Palette,
	Ruler,
	SquareKanbanIcon,
	Users,
} from 'lucide-react';

export type DashItem = {
	title: string;
	Icon: LucideIcon;
	path: string;
	subnav?: Omit<DashItem, 'subnav'>[];
};

export const dashConfig = {
	overview: [
		{ title: 'Dashboard', Icon: LayoutDashboard, path: '/' },
		{ title: 'Analytics', Icon: BarChart3, path: '/analytics' },
	],
	management: [
		{ title: 'Users', Icon: Users, path: '/users' },
		{
			title: 'Products',
			Icon: PackageSearch,
			path: '/products',
			subnav: [
				{ title: 'All Products', Icon: Box, path: '/products' },
				{ title: 'Categories', Icon: Boxes, path: '/categories' },
				{ title: 'Colors', Icon: Palette, path: '/colors' },
				{ title: 'Sizes', Icon: Ruler, path: '/sizes' },
			],
		},
		{ title: 'Orders', Icon: BookCheck, path: '/orders' },
	],
	tools: [
		{ title: 'Kanban', Icon: SquareKanbanIcon, path: '/kanban' },
		{ title: 'Calendar', Icon: Calendar, path: '/calendar' },
	],
};
