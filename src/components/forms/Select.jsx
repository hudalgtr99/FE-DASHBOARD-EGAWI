import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useState } from "react";
import { TbChevronDown, TbX } from "react-icons/tb";
import ReactSelect, { components } from "react-select";
import ReactSelectCreatable from "react-select/creatable";
import PropTypes from "prop-types";

/**
 *
 * @param {{
 * id: string;
 * name: string;
 * label: string;
 * options: object[];
 * value: object[] | object;
 * variant: "basic" | "outline";
 * size: "sm" | "md" | "lg" | "xl";
 * width: "full" | "half" | "third" | "quarter" | "auto";
 * menuplacement: "auto" | "top" | "bottom";
 * color: "primary" | "base" | "success" | "warning" | "danger" | "info";
 * rounded: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
 * density: "tight" | "normal" | "loose";
 * prepend: React.ReactNode;
 * append: React.ReactNode;
 * creatable: boolean;
 * clearable: boolean;
 * searchable: boolean;
 * disabled: boolean;
 * multi: boolean;
 * placeholder: string;
 * error: React.ReactNode;
 * note: React.ReactNode;
 * onChange: (value: object | object[]) => void;
 * onBlur: () => void;
 * required: boolean;
 * menuposition: "absolute" | "fixed";
 * }}
 *
 */

const Select = ({
	id = "",
	name = "",
	label = "",
	options = [],
	value = null,
	variant = "basic",
	size = "md",
	width = "full",
	menuplacement = "auto",
	color = "primary",
	rounded = "md",
	density = "normal",
	prepend = null,
	append = null,
	creatable = false,
	clearable = false,
	searchable = true,
	disabled = false,
	multi = false,
	placeholder = "",
	error = null,
	note = null,
	onChange = () => { },
	onBlur = () => { },
	required = false,
}) => {
	const { themeColor, colorMode } = useContext(ThemeContext);

	const variants = ["outline"];
	const [isOpen, setIsOpen] = useState(false);
	const [isFocus, setIsFocus] = useState(false);
	const [isHover, setIsHover] = useState(false);

	// Width
	const selectWidth = {
		full: "100%",
		half: "50%",
		third: "33.33%",
		quarter: "25%",
		auto: "auto",
	}[width] || `${width}px`;

	// Color
	const selectColor = {
		primary: themeColor,
		base: "#BABCBD",
		success: "#4ED17E",
		warning: "#EEC239",
		danger: "#F26969",
		info: "#629BF8",
	}[color] || color;

	// Size
	const selectSize = {
		sm: 12,
		md: 14,
		lg: 16,
		xl: 18,
	}[size] || 14;

	// Rounded
	const selectRounded = {
		none: 0,
		sm: 2,
		base: 4,
		md: 6,
		lg: 8,
		xl: 12,
		"2xl": 16,
		"3xl": 20,
		"4xl": 24,
	}[rounded] || rounded;

	// Density
	const selectDensity = {
		tight: 8,
		normal: 10,
		loose: 12,
	}[density] || 10;

	// Container Style Variant
	let containerStyle = {};
	if (variant === "outline") {
		containerStyle = {
			borderColor: error
				? "#ef4444"
				: disabled
					? colorMode === "light"
						? "#BABCBA80"
						: "#4D535580"
					: isFocus
						? selectColor
						: isHover
							? colorMode === "light"
								? "#9A9C9A"
								: "#6F6F6F"
							: colorMode === "light"
								? "#BABCBA"
								: "#4D5355",
			borderWidth: 1,
			borderStyle: "solid",
			outline: error
				? `2px solid #ef4444`
				: isFocus
					? `2px solid ${selectColor}`
					: "none",
			outlineOffset: -2,
			borderRadius: selectRounded,
		};
	} else {
		containerStyle = {
			borderColor: error
				? "#ef4444"
				: disabled
					? colorMode === "light"
						? "#BABCBA80"
						: "#4D535580"
					: isFocus
						? selectColor
						: isHover
							? colorMode === "light"
								? "#9A9C9A"
								: "#6F6F6F"
							: colorMode === "light"
								? "#BABCBA"
								: "#4D5355",
			borderWidth: 1,
			borderStyle: "solid",
			outline: "none",
			borderRadius: selectRounded,
		};
	}

	// Label Style Variant
	let labelStyle = {};
	if (variant === "outline") {
		labelStyle = {
			fontSize:
				isFocus || value?.length > 0 || value ? selectSize - 2 : selectSize,
			left: 14,
			top: isFocus || value?.length > 0 || value ? 0 : "50%",
			transform: "translateY(-50%)",
			color: isFocus || value?.length > 0 || value ? selectColor : "",
		};
	}

	const DropdownIndicator = (props) => (
		<components.DropdownIndicator {...props}>
			<TbChevronDown size={selectSize + 2} />
		</components.DropdownIndicator>
	);

	const ClearIndicator = (props) => (
		<components.ClearIndicator {...props}>
			<TbX size={selectSize + 2} className="cursor-pointer" />
		</components.ClearIndicator>
	);

	const MultiValueRemove = (props) => (
		<components.MultiValueRemove {...props}>
			<TbX size={selectSize} className="cursor-pointer" />
		</components.MultiValueRemove>
	);

	return (
		<div style={{ width: selectWidth }}>
			{/* Label Basic */}
			{!variants.includes(variant) && (
				<label
					htmlFor={id}
					style={{ fontSize: selectSize }}
					className={`mb-1 ${required && "required"}`}
				>
					{label}
					{required && <span className="text-red-500">*</span>}
				</label>
			)}

			<div className="flex">
				{prepend && (
					<div
						style={{ fontSize: selectSize }}
						className="flex items-center pr-2"
					>
						{prepend}
					</div>
				)}

				<div
					style={containerStyle}
					onMouseEnter={() => setIsHover(true)}
					onMouseLeave={() => setIsHover(false)}
					className={`relative w-full ${isFocus ? "shadow" : ""}`}
				>
					{variants.includes(variant) && label && (
						<span
							style={labelStyle}
							className={`absolute pointer-events-none transition-[top,font,padding,margin] leading-none whitespace-nowrap ${(isFocus && variant === "outline") ||
								(variant === "outline" && value)
								? "bg-white/80 dark:bg-base-600/80 backdrop-blur px-1 -ml-1"
								: ""
								}`}
						>
							{label}
						</span>
					)}

					{creatable ? (
						<ReactSelectCreatable
							id={id}
							name={name}
							options={options}
							menuPlacement={menuplacement}
							isClearable={clearable}
							isSearchable={searchable}
							isDisabled={disabled}
							isMulti={multi}
							onChange={onChange}
							value={value}
							placeholder={placeholder}
							onFocus={() => {
								setIsFocus(true);
								setIsOpen(true);
							}}
							onBlur={() => {
								setIsFocus(false);
								setIsOpen(false);
								onBlur();
							}}
							styles={{
								control: (provided) => ({
									...provided,
									fontSize: selectSize,
									minHeight: 32,
									height: "auto",
									border: "none",
								}),
								dropdownIndicator: (provided) => ({
									...provided,
									padding: 0,
								}),
								clearIndicator: (provided) => ({
									...provided,
									padding: 0,
								}),
								multiValue: (provided) => ({
									...provided,
									borderRadius: selectRounded,
								}),
								multiValueRemove: (provided) => ({
									...provided,
									padding: 0,
								}),
							}}
							components={{ DropdownIndicator, ClearIndicator, MultiValueRemove }}
						/>
					) : (
						<ReactSelect
							id={id}
							name={name}
							options={options}
							menuPlacement={menuplacement}
							isClearable={clearable}
							isSearchable={searchable}
							isDisabled={disabled}
							isMulti={multi}
							onChange={onChange}
							value={value}
							placeholder={placeholder}
							onFocus={() => {
								setIsFocus(true);
								setIsOpen(true);
							}}
							onBlur={() => {
								setIsFocus(false);
								setIsOpen(false);
								onBlur();
							}}
							styles={{
								control: (provided) => ({
									...provided,
									fontSize: selectSize,
									minHeight: 32,
									height: "auto",
									border: "none",
								}),
								dropdownIndicator: (provided) => ({
									...provided,
									padding: 0,
								}),
								clearIndicator: (provided) => ({
									...provided,
									padding: 0,
								}),
								multiValue: (provided) => ({
									...provided,
									borderRadius: selectRounded,
								}),
								multiValueRemove: (provided) => ({
									...provided,
									padding: 0,
								}),
							}}
							components={{ DropdownIndicator, ClearIndicator, MultiValueRemove }}
						/>
					)}
				</div>

				{append && (
					<div
						style={{ fontSize: selectSize }}
						className="flex items-center pl-2"
					>
						{append}
					</div>
				)}
			</div>

			{error && (
				<span className="text-red-500 text-sm mt-1 block">
					{error}
				</span>
			)}

			{note && (
				<span className="text-gray-500 text-sm mt-1 block">
					{note}
				</span>
			)}
		</div>
	);
};

Select.propTypes = {
	id: PropTypes.any,
	name: PropTypes.any,
	label: PropTypes.any,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.any.isRequired,
			label: PropTypes.any.isRequired,
		})
	),
	value: PropTypes.oneOfType([
		PropTypes.arrayOf(
			PropTypes.shape({
				value: PropTypes.any.isRequired,
				label: PropTypes.any.isRequired,
			})
		),
		PropTypes.shape({
			value: PropTypes.any.isRequired,
			label: PropTypes.any.isRequired,
		}),
	]),
	variant: PropTypes.oneOf(["basic", "outline"]),
	size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
	width: PropTypes.oneOf(["full", "half", "third", "quarter", "auto"]),
	menuplacement: PropTypes.oneOf(["auto", "top", "bottom"]),
	color: PropTypes.oneOf(["primary", "base", "success", "warning", "danger", "info"]),
	rounded: PropTypes.oneOf(["none", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"]),
	density: PropTypes.oneOf(["tight", "normal", "loose"]),
	prepend: PropTypes.node,
	append: PropTypes.node,
	creatable: PropTypes.bool,
	clearable: PropTypes.bool,
	searchable: PropTypes.bool,
	disabled: PropTypes.bool,
	multi: PropTypes.bool,
	placeholder: PropTypes.any,
	error: PropTypes.node,
	note: PropTypes.node,
	onChange: PropTypes.func,
	onBlur: PropTypes.func,
	required: PropTypes.bool,
	menuposition: PropTypes.oneOf(["absolute", "fixed"]),
};

export default Select;
