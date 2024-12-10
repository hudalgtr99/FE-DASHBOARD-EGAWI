import { Container, Radio } from "@/components";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useState } from "react";

const RadioPage = () => {
	const { themeColor } = useContext(ThemeContext);

	const [selectedColor, setSelectedColor] = useState("#7367f0");
	const [selectedInline, setSelectedInline] = useState(true);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
			{/* Color */}
			<Container>
				<div className="text-lg font-normal mb-4">Color</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>color</span> prop is used to
					set the color of the radio.
				</div>

				<Radio
					color={selectedColor}
					value={selectedColor}
					onChange={setSelectedColor}
					options={[
						{
							label: "Primary",
							value: "primary",
						},
						{
							label: "Base",
							value: "base",
						},
						{
							label: "Success",
							value: "success",
						},
						{
							label: "Warning",
							value: "warning",
						},
						{
							label: "Danger",
							value: "danger",
						},
						{
							label: "Info",
							value: "info",
						},
					]}
				/>
			</Container>

			{/* Inline */}
			<Container>
				<div className="text-lg font-normal mb-4">Inline</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>inline</span> prop is used to
					set the radio to be inline. Default is true.
				</div>

				<div className="flex gap-6">
					<Radio
						color={themeColor}
						value={selectedInline}
						onChange={setSelectedInline}
						inline={false}
						options={[
							{
								label: "True",
								value: true,
							},
							{
								label: "False",
								value: false,
							},
						]}
					/>
				</div>
			</Container>

			{/* Size */}
			<Container>
				<div className="text-lg font-normal mb-4">Size</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>size</span> prop is used to
					set the size of the radio.
				</div>

				<div>
					<Radio
						color={themeColor}
						size="sm"
						options={[
							{
								label: "True",
								value: true,
							},
							{
								label: "False",
								value: false,
							},
						]}
					/>
					<Radio
						color={themeColor}
						size="md"
						options={[
							{
								label: "True",
								value: true,
							},
							{
								label: "False",
								value: false,
							},
						]}
					/>
					<Radio
						color={themeColor}
						size="lg"
						options={[
							{
								label: "True",
								value: true,
							},
							{
								label: "False",
								value: false,
							},
						]}
					/>
					<Radio
						color={themeColor}
						size="xl"
						options={[
							{
								label: "True",
								value: true,
							},
							{
								label: "False",
								value: false,
							},
						]}
					/>
				</div>
			</Container>
		</div>
	);
};

export default RadioPage;
