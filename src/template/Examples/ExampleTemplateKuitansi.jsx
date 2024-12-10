import { Button, Kuitansi, Select } from "@/components";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const ExampleTemplateKuitansi = () => {
	const [template] = useState([
		{ value: 1, label: "Kuitansi #1" },
		{ value: 2, label: "Kuitansi #2" },
		{ value: 3, label: "Kuitansi #3" },
	]);
	const [selectedTemplate, setSelectedTemplate] = useState({
		value: 1,
		label: "Kuitansi #1",
	});
	const ref = useRef();
	const handlePrint = useReactToPrint({
		content: () => ref.current,
		documentTitle: selectedTemplate.label,
	});

	const [data] = useState({
		noInvoice: "47/ADM-INV/11/23",
		telahTerimaDari: "Asep Sutisna",
		uangSejumlah: 200000,
		untukPembayaran: "Layanan Internet Paket 15Mbps - Asep Sutisna",
		metodePembayaran: "Tunai",
		penerima: "Talitha",
		datetime: "23/11/2021",
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
				<Kuitansi ref={ref} type={selectedTemplate.value} data={data} />
			</div>
		</div>
	);
};

export default ExampleTemplateKuitansi;
