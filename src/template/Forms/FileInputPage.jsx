import { Container, FileInput, FileInputForm } from "@/components";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useState } from "react";

const FileInputPage = () => {
	const { themeColor } = useContext(ThemeContext);

	const [value, setValue] = useState([]);
	const [valueMultiple, setValueMultiple] = useState([]);

	const [valueForm, setValueForm] = useState([]);

	return (
		<div className="grid grid-cols-1 gap-4">
			{/* Basic */}
			<Container>
				<div className="text-lg font-normal mb-4">Basic</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>FileInput</span> component is
					used to upload files.
				</div>

				<div className="flex flex-wrap gap-2">
					<FileInput height={10} value={value} setValue={setValue} />
				</div>
			</Container>

			{/* Multiple */}
			<Container>
				<div className="text-lg font-normal mb-4">Multiple</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>multiple</span> prop is used
					to allow multiple files to be uploaded.
				</div>

				<div className="flex flex-wrap gap-2">
					<FileInput
						value={valueMultiple}
						setValue={setValueMultiple}
						multiple
					/>
				</div>
			</Container>

			<Container>
				<FileInputForm value={valueForm} setValue={setValueForm} />
			</Container>
		</div>
	);
};

export default FileInputPage;
