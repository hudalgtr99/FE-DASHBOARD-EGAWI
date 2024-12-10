import { Button, Invoice, Select } from "@/components";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const ExampleTemplateInvoice = () => {
	const [template] = useState([
		{ value: 1, label: "Invoice #1" },
		{ value: 2, label: "Invoice #2" },
		{ value: 3, label: "Invoice #3" },
	]);
	const [selectedTemplate, setSelectedTemplate] = useState({
		value: 1,
		label: "Invoice #1",
	});
	const ref = useRef();
	const handlePrint = useReactToPrint({
		content: () => ref.current,
		documentTitle: selectedTemplate.label,
	});
	const [invoice] = useState({
		id: 1,
		invoiceNumber: "47/ADM-INV/11/23",
		customer: {
			id: 47,
			name: "Ayu Fitriani",
			address: "Jl. Pulau Legundi gg family no 56",
			phone: "08123456789",
		},
		date: "20 November 2023",
		dueDate: "5 Desember 2023",
		items: [
			{
				id: 1,
				name: "Internet Access Lite Download 10Mbps",
				description: "Periode 20 November 2023",
				code: "UpTo10",
				qty: 1,
				price: 185000,
			},
			{
				id: 2,
				name: "Internet Access Lite Download 10Mbps",
				description: "Periode 20 November 2023",
				code: "UpTo10",
				qty: 2,
				price: 185000,
			},
		],
		discount: 20000,
		tax: 3000,
	});
	const [company] = useState({
		name: "PT. Queen Network Nusantara",
		address:
			"Jl. Alam Gaya No. 42 BTN II Way Halim Permai Bandar Lampung, Lampung 35135",
		phone: "+62 721 801 001",
		bank: {
			name: "Bank BCA",
			accountNumber: "0202924555",
			accountName: "PT. Queen Network Nusantara",
		},
	});

	return (
		<div>
			<div className="flex items-start justify-between mb-3">
				<div>{selectedTemplate.label}</div>

				<div className="flex gap-2">
					<Button onClick={handlePrint}>Print</Button>
					<div className="w-32">
						<Select
							options={template}
							placeholder="Select Template"
							value={selectedTemplate}
							onChange={(e) => {
								setSelectedTemplate(e);
							}}
						/>
					</div>
				</div>
			</div>
			<div className="shadow-lg rounded-lg bg-white dark:bg-base-600 overflow-hidden">
				<Invoice
					type={selectedTemplate.value}
					data={invoice}
					company={company}
					ref={ref}
				/>
			</div>
		</div>
	);
};

export default ExampleTemplateInvoice;
