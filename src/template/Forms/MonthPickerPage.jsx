import { Container, MonthPicker } from "@/components";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useState } from "react";
import { TbCalendar, TbDownload, TbRecordMail } from "react-icons/tb";

const MonthPickerPage = () => {
	const { themeColor } = useContext(ThemeContext);

	const [value, setValue] = useState("");

	const [colorMonthPicker, setColorMonthPicker] = useState([
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

	const [roundedMonthPicker, setRoundedMonthPicker] = useState([
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

	const [variantMonthPicker, setVariantMonthPicker] = useState([
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

	const [densityMonthPicker, setDensityMonthPicker] = useState([
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
					{colorMonthPicker.map((item, index) => (
						<MonthPicker
							key={index}
							color={item.color}
							value={item.value}
							label={item.label}
							placeholder={item.label}
							variant="outline"
							onChange={(value) => {
								let newColorMonthPicker = [...colorMonthPicker];
								newColorMonthPicker[index].value = value;
								setColorMonthPicker(newColorMonthPicker);
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
					set the density of the MonthPicker.
				</div>

				<div className="flex flex-col gap-2">
					{densityMonthPicker.map((item, itemIdx) => (
						<MonthPicker
							key={itemIdx}
							color={item.color}
							placeholder={item.label}
							label={item.label}
							value={item.value}
							density={item.density}
							variant="outline"
							onChange={(value) => {
								const newItems = [...densityMonthPicker];
								newItems[itemIdx].value = value;
								setDensityMonthPicker(newItems);
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
					set the rounded of the MonthPicker.
				</div>

				<div className="grid grid-cols-2 gap-2">
					{roundedMonthPicker.map((item, index) => (
						<MonthPicker
							key={index}
							placeholder={item.label}
							label={item.label}
							variant="outline"
							value={item.value}
							rounded={item.rounded}
							onChange={(e) => {
								const newRoundedMonthPicker = [...roundedMonthPicker];
								newRoundedMonthPicker[index].value = e;
								setRoundedMonthPicker(newRoundedMonthPicker);
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
					set the variant of the MonthPicker.
				</div>

				<div className="flex flex-col gap-2">
					{variantMonthPicker.map((item, index) => (
						<MonthPicker
							key={index}
							placeholder={item.label}
							label={item.label}
							variant={item.variant}
							value={item.value}
							onChange={(e) => {
								const newVariantMonthPicker = [...variantMonthPicker];
								newVariantMonthPicker[index].value = e;
								setVariantMonthPicker(newVariantMonthPicker);
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
					to disable the MonthPicker.
				</div>

				<div className="flex flex-col gap-2">
					<MonthPicker
						placeholder="Disabled"
						label="Disabled"
						variant="basic"
						disabled
					/>
					<MonthPicker
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
					set the note of the MonthPicker.
					<br />
					The <span style={{ color: themeColor }}>error</span> prop is used to
					set the error of the MonthPicker.
				</div>

				<div className="grid grid-cols-2 gap-2">
					<MonthPicker
						placeholder="Note"
						label="Note"
						note="This is a note"
						value={value}
						onChange={(value) => setValue(value)}
					/>
					<MonthPicker
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
					set the prefix of the MonthPicker.
					<br />
					The <span style={{ color: themeColor }}>suffix</span> prop is used to
					set the suffix of the MonthPicker.
				</div>

				<div className="flex flex-col gap-2">
					<MonthPicker
						prefix={<TbCalendar />}
						placeholder="Prefix"
						label="Prefix"
						value={value}
						onChange={(value) => setValue(value)}
					/>
					<MonthPicker
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
					set the prepend of the MonthPicker.
					<br />
					The <span style={{ color: themeColor }}>append</span> prop is used to
					set the append of the MonthPicker.
				</div>

				<div className="flex flex-col gap-2">
					<MonthPicker
						prepend={<TbRecordMail />}
						placeholder="Prepend"
						label="Prepend"
						value={value}
						onChange={(value) => setValue(value)}
					/>
					<MonthPicker
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

export default MonthPickerPage;
