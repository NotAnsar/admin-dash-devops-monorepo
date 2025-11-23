import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '@/types/order';

export function generateInvoicePDF(order: Order): {
	url: string;
	filename: string;
} {
	// Create a new PDF document
	const doc = new jsPDF();

	const pageWidth = doc.internal.pageSize.getWidth();

	// Set up some styles
	const primaryColor = '#0a0a0a';
	doc.setDrawColor(primaryColor);
	doc.setFillColor(primaryColor);

	doc.setFontSize(22);
	doc.setTextColor(primaryColor);
	doc.setFont('serif', 'bold'); // Using serif for Recoleta
	doc.text('Orava', 20, 20);

	// Using sans-serif for Satoshi
	doc.setFontSize(10);
	doc.setFont('helvetica', 'normal'); // Using helvetica for Satoshi
	doc.setTextColor(100);
	doc.text('123 Commerce Street', 20, 27);
	doc.text('Business City, ST 12345', 20, 32);
	doc.text('contact@orava.com', 20, 37);

	// Add invoice title and number
	doc.setFontSize(16);
	doc.setFont('helvetica', 'bold');
	doc.setTextColor(0);
	doc.text('INVOICE', pageWidth - 20, 20, { align: 'right' });

	doc.setFontSize(12);
	doc.text(`#${order.id.substring(0, 12).toUpperCase()}`, pageWidth - 20, 27, {
		align: 'right',
	});

	// Add date
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(10);
	doc.text(
		`Date: ${new Date(order.createdAt).toLocaleDateString()}`,
		pageWidth - 20,
		34,
		{ align: 'right' }
	);
	doc.text(`Status: ${order.status}`, pageWidth - 20, 39, { align: 'right' });

	// Add a separator line
	doc.setLineWidth(0.5);
	doc.line(20, 45, pageWidth - 20, 45);

	// Customer information
	doc.setFontSize(12);
	doc.setFont('helvetica', 'bold');
	doc.text('Bill To:', 20, 55);

	doc.setFont('helvetica', 'normal');
	doc.setFontSize(10);
	doc.text(order.userName, 20, 62);
	doc.text(order.userEmail, 20, 67);

	// Items table
	const tableColumn = ['Item', 'Quantity', 'Unit Price', 'Total'];
	const tableRows = order.items.map((item) => [
		item.productName,
		item.quantity.toString(),
		`$${item.unitPrice.toFixed(2)}`,
		`$${item.subtotal.toFixed(2)}`,
	]);

	autoTable(doc, {
		head: [tableColumn],
		body: tableRows,
		startY: 75,
		theme: 'grid',
		headStyles: {
			fillColor: primaryColor,
			textColor: 255,
			fontStyle: 'bold',
			font: 'helvetica',
		},
		bodyStyles: {
			font: 'helvetica',
		},
		margin: { top: 75, right: 20, bottom: 160, left: 20 },
	});

	// Add total
	const finalY = (doc as any).lastAutoTable.finalY + 10;

	doc.setFontSize(10);
	doc.setFont('helvetica', 'normal');
	doc.text('Subtotal:', pageWidth - 80, finalY);
	doc.text(`$${order.total.toFixed(2)}`, pageWidth - 20, finalY, {
		align: 'right',
	});

	doc.text('Tax:', pageWidth - 80, finalY + 7);
	const tax = order.total * 0.08; // Assuming 8% tax
	doc.text(`$${tax.toFixed(2)}`, pageWidth - 20, finalY + 7, {
		align: 'right',
	});

	doc.setLineWidth(0.5);
	doc.line(pageWidth - 80, finalY + 10, pageWidth - 20, finalY + 10);

	doc.setFontSize(12);
	doc.setFont('helvetica', 'bold');
	doc.text('Total:', pageWidth - 80, finalY + 17);
	doc.text(`$${(order.total + tax).toFixed(2)}`, pageWidth - 20, finalY + 17, {
		align: 'right',
	});

	// Add footer
	doc.setFontSize(10);
	doc.setFont('helvetica', 'normal');
	doc.setTextColor(100);
	doc.text('Thank you for your business!', pageWidth / 2, finalY + 40, {
		align: 'center',
	});

	// Generate PDF
	const pdfUrl = doc.output('datauristring');
	const filename = `invoice-${order.id}.pdf`;

	return { url: pdfUrl, filename };
}
