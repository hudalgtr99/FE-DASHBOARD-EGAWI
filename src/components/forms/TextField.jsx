import { ThemeContext } from "@/context/ThemeContext";
import Cleave from "cleave.js/react";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { TbX } from "react-icons/tb";

/**
 *
 * @param {{
 * id: string;
 * name: string;
 * type: string;
 * label: string;
 * value: string | number;
 * setValue: React.Dispatch<React.SetStateAction<string | number>>;
 * onChange: React.Dispatch<React.SetStateAction<string>>;
 * onBlur: React.Dispatch<React.SetStateAction<string>>;
 * onClick: React.Dispatch<React.SetStateAction<string>>;
 * disabled: boolean;
 * readOnly: boolean;
 * required: boolean;
 * placeholder: string;
 * variant: "basic" | "outline" | "underlined" | "filled";
 * size: "sm" | "md" | "lg" | "xl";
 * color: "primary" | "base" | "success" | "warning" | "danger" | "info";
 * rounded: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
 * density: "tight" | "normal" | "loose";
 * prefix: React.ReactNode;
 * suffix: React.ReactNode;
 * prepend: React.ReactNode;
 * append: React.ReactNode;
 * note: React.ReactNode;
 * error: React.ReactNode;
 * cleaveOptions: object;
 * clearable: boolean;
 * icon: React.ReactNode;
 * }}
 *
 */

const TextField = ({
	id = null,
	name = null,
	type = "text",
	label = "",
	value = "",
	setValue = () => { },
	onChange = () => { },
	onBlur = () => { },
	onClick = () => { },
	disabled = false,
	readOnly = false,
	required = false,
	placeholder = "",
	variant = "basic",
	size = "md",
	color = "primary",
	rounded = "md",
	density = "normal",
	prefix = null,
	suffix = null,
	prepend = null,
	append = null,
	note = null,
	error = null,
	cleaveOptions = null,
	clearable = false,
	icon = null, // New icon prop
}) => {
	const { themeColor, colorMode } = useContext(ThemeContext);

	const vaiants = ["outline", "underlined", "filled"];
	const [isFocus, setIsFocus] = useState(false);
	const [isHover, setIsHover] = useState(false);

	// Color, Size, Rounded, Density (as per your existing logic)
	const textFieldColor = {
		primary: themeColor,
		base: "#BABCBD",
		success: "#4ED17E",
		warning: "#EEC239",
		danger: "#F26969",
		info: "#629BF8",
	}[color] || color;

	const textFieldSize = {
		sm: 12,
		md: 14,
		lg: 16,
		xl: 18,
	}[size] || 14;

	const textFieldRounded = {
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

	const textFieldDensity = {
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
						? textFieldColor
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
					? `2px solid ${textFieldColor}`
					: "none",
			outlineOffset: -2,
			borderRadius: textFieldRounded,
		};
	} else if (variant === "filled") {
		containerStyle = {
			borderColor: error
				? "#ef4444"
				: disabled
					? colorMode === "light"
						? "#BABCBA80"
						: "#4D535580"
					: isFocus
						? textFieldColor
						: isHover
							? colorMode === "light"
								? "#9A9C9A"
								: "#6F6F6F"
							: colorMode === "light"
								? "#BABCBA"
								: "#4D5355",
			borderBottomWidth: 1,
			borderBottomStyle: "solid",
			borderTopLeftRadius: textFieldRounded,
			borderTopRightRadius: textFieldRounded,
			backgroundColor: colorMode === "light" ? "#f7f6f9" : "#20282A",
		};
	} else if (variant === "underlined") {
		containerStyle = {
			borderColor: error
				? "#ef4444"
				: disabled
					? colorMode === "light"
						? "#BABCBA80"
						: "#4D535580"
					: isFocus
						? textFieldColor
						: isHover
							? colorMode === "light"
								? "#9A9C9A"
								: "#6F6F6F"
							: colorMode === "light"
								? "#BABCBA"
								: "#4D5355",
			borderBottomWidth: 1,
			borderBottomStyle: "solid",
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
						? textFieldColor
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
			borderRadius: textFieldRounded,
		};
	}

	// Input Style Variant
	let inputStyle = {};
	if (variant === "outline") {
		inputStyle = {
			padding: `${textFieldDensity}px 14px`,
		};
	} else if (variant === "filled") {
		inputStyle = {
			padding: `${textFieldDensity + 6}px 14px ${textFieldDensity - 6}px`,
		};
	} else if (variant === "underlined") {
		inputStyle = {
			padding: `${textFieldDensity + 6}px 0px ${textFieldDensity - 6}px`,
		};
	} else {
		inputStyle = {
			padding: `${textFieldDensity}px 14px`,
		};
	}

	// Label Style Variant
	let labelStyle = {};
	if (variant === "outline") {
		labelStyle = {
			fontSize: isFocus || value ? textFieldSize - 2 : textFieldSize,
			left: 14,
			top: isFocus || value ? 0 : "50%",
			transform: "translateY(-50%)",
			color: isFocus || value ? textFieldColor : "",
		};
	} else if (variant === "filled") {
		labelStyle = {
			fontSize: isFocus || value ? textFieldSize - 4 : textFieldSize,
			left: 14,
			top: isFocus || value ? 10 : "50%",
			transform: "translateY(-50%)",
			color: isFocus || value ? textFieldColor : "",
		};
	} else if (variant === "underlined") {
		labelStyle = {
			fontSize: isFocus || value ? textFieldSize - 4 : textFieldSize,
			left: 0,
			top: isFocus || value ? 10 : "50%",
			transform: "translateY(-50%)",
			color: isFocus || value ? textFieldColor : "",
		};
	}

	return (
		<div className="w-full">
			{/* Label */}
			{!vaiants.includes(variant) && (
				<label
					htmlFor={id}
					style={{ fontSize: textFieldSize }}
					className={`mb-1 ${required && "required"}`}
				>
					{label}
					{required && <span className="text-red-500">*</span>}
				</label>
			)}

			{/* Container */}
			<div
				style={containerStyle}
				className={`relative ${!vaiants.includes(variant)
					? `flex items-center w-full border ${!disabled ? "cursor-pointer" : "cursor-not-allowed"}`
					: "w-full"
					} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
			>
				{/* Prefix */}
				{prefix && (
					<div className="absolute top-0 left-0 flex items-center justify-center px-3 h-full" style={{ width: 50 }}>
						{prefix}
					</div>
				)}

				{/* Icon */}
				{icon && (
					<div className="absolute left-52 flex items-center">
						{icon}
					</div>
				)}

				{/* Input */}
				<input
					id={id}
					name={name}
					type={type}
					value={value}
					onChange={onChange}
					onBlur={onBlur}
					onClick={onClick}
					disabled={disabled}
					readOnly={readOnly}
					required={required}
					placeholder={placeholder}
					style={inputStyle}
					className={`w-full bg-transparent border-none outline-none placeholder:text-neutral-500 text-sm text-neutral-700 focus:placeholder-transparent ${isFocus && "focus:ring-0"} ${!disabled ? "cursor-pointer" : "cursor-not-allowed"}`}
				/>

				{/* Suffix */}
				{suffix && (
					<div className="absolute top-0 right-0 flex items-center justify-center px-3 h-full" style={{ width: 50 }}>
						{suffix}
					</div>
				)}
			</div>

			{error && (
				<span className="text-red-500 text-sm mt-1 block">
					{error}
				</span>
			)}

			{/* Note */}
			{note && <p className="text-xs text-gray-500 mt-1">{note}</p>}
		</div>
	);
};

TextField.propTypes = {
	id: PropTypes.string,
	name: PropTypes.string,
	type: PropTypes.string,
	label: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	setValue: PropTypes.func,
	onChange: PropTypes.func,
	onBlur: PropTypes.func,
	onClick: PropTypes.func,
	disabled: PropTypes.bool,
	readOnly: PropTypes.bool,
	required: PropTypes.bool,
	placeholder: PropTypes.string,
	variant: PropTypes.oneOf(["basic", "outline", "underlined", "filled"]),
	size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
	color: PropTypes.oneOf(["primary", "base", "success", "warning", "danger", "info"]),
	rounded: PropTypes.oneOf(["none", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"]),
	density: PropTypes.oneOf(["tight", "normal", "loose"]),
	prefix: PropTypes.node,
	suffix: PropTypes.node,
	prepend: PropTypes.node,
	append: PropTypes.node,
	note: PropTypes.node,
	error: PropTypes.node,
	cleaveOptions: PropTypes.object,
	clearable: PropTypes.bool,
};

export default TextField;
