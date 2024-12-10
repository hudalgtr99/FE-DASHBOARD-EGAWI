import { Container, Select } from "@/components";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useState } from "react";
import { TbDownload, TbRecordMail } from "react-icons/tb";

const SelectPage = () => {
	const { themeColor } = useContext(ThemeContext);

	const options = [
		{ value: "chocolate", label: "Chocolate", isDisabled: true },
		{ value: "strawberry", label: "Strawberry", isDisabled: true },
		{ value: "vanilla", label: "Vanilla" },
		{ value: "mango", label: "Mango" },
	];

	const [value, setValue] = useState("");
	const [multiValue, setMultiValue] = useState("");

	const [colorSelect, setColorSelect] = useState([
		{
			color: "primary",
			label: "Primary",
			value: "",
		},
		{
			color: "base",
			label: "Base",
			value: "",
		},
		{
			color: "success",
			label: "Success",
			value: "",
		},
		{
			color: "warning",
			label: "Warning",
			value: "",
		},
		{
			color: "danger",
			label: "Danger",
			value: "",
		},
		{
			color: "info",
			label: "Info",
			value: "",
		},
	]);

	const [roundedSelect, setRoundedSelect] = useState([
		{
			rounded: "none",
			label: "None",
			value: "",
		},
		{
			rounded: "sm",
			label: "sm",
			value: "",
		},
		{
			rounded: "md",
			label: "md",
			value: "",
		},
		{
			rounded: "lg",
			label: "lg",
			value: "",
		},
		{
			rounded: "xl",
			label: "xl",
			value: "",
		},
		{
			rounded: "2xl",
			label: "2xl",
			value: "",
		},
		{
			rounded: "3xl",
			label: "3xl",
			value: "",
		},
		{
			rounded: "4xl",
			label: "4xl",
			value: "",
		},
	]);

	const [sizeSelect, setSizeSelect] = useState([
		{
			size: "sm",
			label: "sm",
			value: "",
		},
		{
			size: "md",
			label: "md",
			value: "",
		},
		{
			size: "lg",
			label: "lg",
			value: "",
		},
		{
			size: "xl",
			label: "xl",
			value: "",
		},
	]);

	const [variantSelect, setVariantSelect] = useState([
		{
			variant: "basic",
			label: "Basic",
			value: "",
		},
		{
			variant: "outline",
			label: "Outline",
			value: "",
		},
	]);

	const [densitySelect, setDensitySelect] = useState([
		{
			density: "tight",
			label: "Tight",
			value: "",
		},
		{
			density: "normal",
			label: "Normal",
			value: "",
		},
		{
			density: "loose",
			label: "Loose",
			value: "",
		},
	]);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-20">
			{/* Color */}
			<Container>
				<div className="text-lg font-normal mb-4">Color</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>color</span> prop is used to
					set the color of the Select.
				</div>

				<div className="grid grid-cols-2 gap-2">
					{colorSelect.map((item, index) => (
						<Select
							key={index}
							options={options}
							placeholder={item.label}
							label={item.label}
							variant="outline"
							value={item.value}
							color={item.color}
							onChange={(e) => {
								const newColorSelect = [...colorSelect];
								newColorSelect[index].value = e;
								setColorSelect(newColorSelect);
							}}
						/>
					))}
				</div>
			</Container>

			{/* Density */}
			<Container>
				<div className="text-lg font-normal mb-4">Density</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>density</span> prop is used to
					set the density of the Select.
				</div>

				<div className="flex flex-col gap-2">
					{densitySelect.map((item, index) => (
						<Select
							key={index}
							options={options}
							placeholder={item.label}
							label={item.label}
							variant="outline"
							value={item.value}
							density={item.density}
							onChange={(e) => {
								const newDensitySelect = [...densitySelect];
								newDensitySelect[index].value = e;
								setDensitySelect(newDensitySelect);
							}}
						/>
					))}
				</div>
			</Container>

			{/* Rounded */}
			<Container>
				<div className="text-lg font-normal mb-4">Rounded</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>rounded</span> prop is used to
					set the rounded of the Select.
				</div>

				<div className="grid grid-cols-2 gap-2">
					{roundedSelect.map((item, index) => (
						<Select
							key={index}
							options={options}
							placeholder={item.label}
							label={item.label}
							variant="outline"
							value={item.value}
							rounded={item.rounded}
							onChange={(e) => {
								const newRoundedSelect = [...roundedSelect];
								newRoundedSelect[index].value = e;
								setRoundedSelect(newRoundedSelect);
							}}
						/>
					))}
				</div>
			</Container>

			{/* Size */}
			<Container>
				<div className="text-lg font-normal mb-4">Size</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>size</span> prop is used to
					set the size of the Select.
				</div>

				<div className="flex flex-col gap-2">
					{sizeSelect.map((item, index) => (
						<Select
							key={index}
							options={options}
							placeholder={item.label}
							label={item.label}
							variant="outline"
							value={item.value}
							size={item.size}
							onChange={(e) => {
								const newSizeSelect = [...sizeSelect];
								newSizeSelect[index].value = e;
								setSizeSelect(newSizeSelect);
							}}
						/>
					))}
				</div>
			</Container>

			{/* Variant */}
			<Container>
				<div className="text-lg font-normal mb-4">Variant</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>variant</span> prop is used to
					set the variant of the Select.
				</div>

				<div className="flex flex-col gap-2">
					{variantSelect.map((item, index) => (
						<Select
							key={index}
							options={options}
							placeholder={item.label}
							label={item.label}
							variant={item.variant}
							value={item.value}
							onChange={(e) => {
								const newVariantSelect = [...variantSelect];
								newVariantSelect[index].value = e;
								setVariantSelect(newVariantSelect);
							}}
						/>
					))}
				</div>
			</Container>

			{/* Disabled */}
			<Container>
				<div className="text-lg font-normal mb-4">Disabled</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>disabled</span> prop is used
					to disable the Select.
				</div>

				<div className="flex flex-col gap-2">
					<Select
						options={options}
						placeholder="Disabled"
						label="Disabled"
						variant="basic"
						disabled
					/>
					<Select
						options={options}
						placeholder="Disabled"
						label="Disabled"
						variant="outline"
						disabled
					/>
				</div>
			</Container>

			{/* Note & Error */}
			<Container>
				<div className="text-lg font-normal mb-4">Note & Error</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>note</span> prop is used to
					set the note of the Select.
					<br />
					The <span style={{ color: themeColor }}>append</span> prop is used to
					set the error of the Select.
				</div>

				<div className="grid grid-cols-2 gap-2">
					<Select
						options={options}
						placeholder={"Note"}
						label={"Note"}
						note={"This is a note"}
						variant={"outline"}
						value={value}
						onChange={(e) => setValue(e)}
					/>
					<Select
						options={options}
						placeholder={"Error"}
						label={"Error"}
						error={"This is an error"}
						variant={"outline"}
						value={value}
						onChange={(e) => setValue(e)}
					/>
				</div>
			</Container>

			{/* Prepend & Append */}
			<Container>
				<div className="text-lg font-normal mb-4">Prepend & Append</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>prepend</span> prop is used to
					set the prepend of the Select.
					<br />
					The <span style={{ color: themeColor }}>append</span> prop is used to
					set the append of the Select.
				</div>

				<div className="flex flex-col gap-2">
					<Select
						options={options}
						placeholder={"Prepend"}
						label={"Prepend"}
						variant={"outline"}
						value={value}
						onChange={(e) => setValue(e)}
						prepend={<TbDownload />}
					/>
					<Select
						options={options}
						placeholder={"Append"}
						label={"Append"}
						variant={"outline"}
						value={value}
						onChange={(e) => setValue(e)}
						append={<TbRecordMail />}
					/>
				</div>
			</Container>

			{/* Multi */}
			<Container>
				<div className="text-lg font-normal mb-4">Multi</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>multi</span> prop is used to
					set multiple values of the Select.
				</div>

				<Select
					multi
					options={options}
					placeholder={"Multi"}
					label={"Multi"}
					variant={"outline"}
					value={multiValue}
					onChange={(e) => setMultiValue(e)}
				/>
			</Container>

			{/* Creatable */}
			<Container>
				<div className="text-lg font-normal mb-4">Creatable</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>creatable</span> prop is used
					to set the creatable of the Select.
				</div>

				<Select
					creatable
					multi
					options={options}
					placeholder={"Creatable"}
					label={"Creatable"}
					variant={"outline"}
					value={multiValue}
					onChange={(e) => setMultiValue(e)}
				/>
			</Container>

			{/* Clearable */}
			<Container>
				<div className="text-lg font-normal mb-4">Clearable</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>clearable</span> prop is used
					to set the clearable of the Select.
				</div>

				<Select
					clearable
					options={options}
					placeholder={"Clearable"}
					label={"Clearable"}
					variant={"outline"}
					value={value}
					onChange={(e) => setValue(e)}
				/>
			</Container>

			{/* Searchable */}
			<Container>
				<div className="text-lg font-normal mb-4">Searchable</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>searchable</span> prop is used
					to set the searchable of the Select.
				</div>

				<Select
					searchable
					options={options}
					placeholder={"Searchable"}
					label={"Searchable"}
					variant={"outline"}
					value={value}
					onChange={(e) => setValue(e)}
				/>
			</Container>
		</div>
	);
};

export default SelectPage;
