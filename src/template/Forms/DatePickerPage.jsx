import { Container, DatePicker } from "@/components";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useState } from "react";
import { TbCalendar, TbDownload, TbRecordMail } from "react-icons/tb";

const DatePickerPage = () => {
	const { themeColor } = useContext(ThemeContext);

	const [value, setValue] = useState("");
	const [multipleValue, setMultipleValue] = useState([]);
	const [rangeValue, setRangeValue] = useState([]);

	const [colorDatePicker, setColorDatePicker] = useState([
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

	const [roundedDatePicker, setRoundedDatePicker] = useState([
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

	const [sizeDatePicker, setSizeDatePicker] = useState([
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

	const [variantDatePicker, setVariantDatePicker] = useState([
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
		{
			variant: "filled",
			label: "Filled",
			value: "",
		},
		{
			variant: "underlined",
			label: "Underlined",
			value: "",
		},
	]);

	const [densityDatePicker, setDensityDatePicker] = useState([
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
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
			{/* Color */}
			<Container>
				<div className="text-lg font-normal mb-4">Color</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>color</span> prop is used to
					set the color of the DatePicker.
				</div>

				<div className="grid grid-cols-2 gap-2">
					{colorDatePicker.map((item, itemIdx) => (
						<DatePicker
							key={itemIdx}
							color={item.color}
							placeholder={item.label}
							label={item.label}
							value={item.value}
							variant="outline"
							onChange={(value) => {
								const newItems = [...colorDatePicker];
								newItems[itemIdx].value = value;
								setColorDatePicker(newItems);
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
					set the density of the DatePicker.
				</div>

				<div className="flex flex-col gap-2">
					{densityDatePicker.map((item, itemIdx) => (
						<DatePicker
							key={itemIdx}
							color={item.color}
							placeholder={item.label}
							label={item.label}
							value={item.value}
							density={item.density}
							variant="outline"
							onChange={(value) => {
								const newItems = [...densityDatePicker];
								newItems[itemIdx].value = value;
								setDensityDatePicker(newItems);
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
					set the rounded of the DatePicker.
				</div>

				<div className="grid grid-cols-2 gap-2">
					{roundedDatePicker.map((item, index) => (
						<DatePicker
							key={index}
							placeholder={item.label}
							label={item.label}
							variant="outline"
							value={item.value}
							rounded={item.rounded}
							onChange={(e) => {
								const newRoundedDatePicker = [...roundedDatePicker];
								newRoundedDatePicker[index].value = e;
								setRoundedDatePicker(newRoundedDatePicker);
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
					set the size of the DatePicker.
				</div>

				<div className="flex flex-col gap-2">
					{sizeDatePicker.map((item, index) => (
						<DatePicker
							key={index}
							placeholder={item.label}
							label={item.label}
							variant="outline"
							value={item.value}
							size={item.size}
							onChange={(e) => {
								const newSizeDatePicker = [...sizeDatePicker];
								newSizeDatePicker[index].value = e;
								setSizeDatePicker(newSizeDatePicker);
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
					set the variant of the DatePicker.
				</div>

				<div className="flex flex-col gap-2">
					{variantDatePicker.map((item, index) => (
						<DatePicker
							key={index}
							placeholder={item.label}
							label={item.label}
							variant={item.variant}
							value={item.value}
							onChange={(e) => {
								const newVariantDatePicker = [...variantDatePicker];
								newVariantDatePicker[index].value = e;
								setVariantDatePicker(newVariantDatePicker);
							}}
						/>
					))}
				</div>
			</Container>

			{/* Mode */}
			<Container>
				<div className="text-lg font-normal mb-4">Mode</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>mode</span> prop is used to
					set the mode of the DatePicker.
				</div>

				<div className="flex flex-col gap-2">
					<DatePicker
						mode="single"
						placeholder="Single"
						label="Single"
						variant="outline"
						value={value}
						setValue={setValue}
						// onChange={(value) => setValue(value)}
					/>
					<DatePicker
						mode="multiple"
						placeholder="Multiple"
						label="Multiple"
						variant="outline"
						value={multipleValue}
						setValue={setMultipleValue}
					/>
					<DatePicker
						mode="range"
						placeholder="Range"
						label="Range"
						variant="outline"
						value={rangeValue}
						setValue={setRangeValue}
					/>
				</div>
			</Container>

			{/* Disabled */}
			<Container>
				<div className="text-lg font-normal mb-4">Disabled</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>disabled</span> prop is used
					to disable the DatePicker.
				</div>

				<div className="flex flex-col gap-2">
					<DatePicker
						placeholder="Disabled"
						label="Disabled"
						variant="basic"
						disabled
					/>
					<DatePicker
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
					set the note of the DatePicker.
					<br />
					The <span style={{ color: themeColor }}>error</span> prop is used to
					set the error of the DatePicker.
				</div>

				<div className="grid grid-cols-2 gap-2">
					<DatePicker
						placeholder="Note"
						label="Note"
						note="This is a note"
						value={value}
						onChange={(value) => setValue(value)}
					/>
					<DatePicker
						placeholder="Error"
						label="Error"
						error="This is an error"
						value={value}
						onChange={(value) => setValue(value)}
					/>
				</div>
			</Container>

			{/* Prefix & Suffix */}
			<Container>
				<div className="text-lg font-normal mb-4">Prefix & Suffix</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>prefix</span> prop is used to
					set the prefix of the DatePicker.
					<br />
					The <span style={{ color: themeColor }}>suffix</span> prop is used to
					set the suffix of the DatePicker.
				</div>

				<div className="flex flex-col gap-2">
					<DatePicker
						prefix={<TbCalendar />}
						placeholder="Prefix"
						label="Prefix"
						value={value}
						onChange={(value) => setValue(value)}
					/>
					<DatePicker
						suffix={<TbCalendar />}
						placeholder="Suffix"
						label="Suffix"
						setValue={setValue}
						value={value}
						onChange={(value) => setValue(value)}
					/>
				</div>
			</Container>

			{/* Prepend & Append */}
			<Container>
				<div className="text-lg font-normal mb-4">Prepend & Append</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>prepend</span> prop is used to
					set the prepend of the DatePicker.
					<br />
					The <span style={{ color: themeColor }}>append</span> prop is used to
					set the append of the DatePicker.
				</div>

				<div className="flex flex-col gap-2">
					<DatePicker
						prepend={<TbRecordMail />}
						placeholder="Prepend"
						label="Prepend"
						value={value}
						onChange={(value) => setValue(value)}
					/>
					<DatePicker
						append={<TbDownload />}
						placeholder="Append"
						label="Append"
						value={value}
						onChange={(value) => setValue(value)}
					/>
				</div>
			</Container>
		</div>
	);
};

export default DatePickerPage;
