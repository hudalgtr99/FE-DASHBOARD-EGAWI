import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const TextArea = ({
	id = "",
	name = "",
	label = "",
	value = "",
	onChange = () => {},
	onBlur = () => {},
	disabled = false,
	readOnly = false,
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
	rows = 2,
	required = false,
}) => {
	const { themeColor, colorMode } = useContext(ThemeContext);

	const vaiants = ["outline", "underlined", "filled"];
	const [isFocus, setIsFocus] = useState(false);
	const [isHover, setIsHover] = useState(false);

	// Color
	const textFieldColor =
		{
			primary: themeColor,
			base: "#BABCBD",
			success: "#4ED17E",
			warning: "#EEC239",
			danger: "#F26969",
			info: "#629BF8",
		}[color] || color;

	// Size
	const textFieldSize =
		{
			sm: 12,
			md: 14,
			lg: 16,
			xl: 18,
		}[size] || 14;

	// Rounded
	const textFieldRounded =
		{
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
	const textFieldDensity =
		{
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
			top: isFocus || value ? 0 : 14,
			transform: "translateY(-50%)",
			color: isFocus || value ? textFieldColor : "",
		};
	} else if (variant === "filled") {
		labelStyle = {
			fontSize: isFocus || value ? textFieldSize - 4 : textFieldSize,
			left: 14,
			top: isFocus || value ? 10 : 14,
			transform: "translateY(-50%)",
			color: isFocus || value ? textFieldColor : "",
		};
	} else if (variant === "underlined") {
		labelStyle = {
			fontSize: isFocus || value ? textFieldSize - 4 : textFieldSize,
			left: 0,
			top: isFocus || value ? 10 : 14,
			transform: "translateY(-50%)",
			color: isFocus || value ? textFieldColor : "",
		};
	}

	const textAreaRef = useRef(null);

	const resizeTextArea = () => {
		if (!textAreaRef.current) return;
		textAreaRef.current.style.height = "auto";
		textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
	};

	useEffect(resizeTextArea, [value]);

	return (
		<div className="w-full">
			{/* Label Basic */}
			{!vaiants.includes(variant) && (
				<label
					htmlFor={id}
					style={{
						fontSize: textFieldSize,
					}}
					className={`mb-1 ${required && "required"}`}
				>
					{label}
				</label>
			)}

			{/* Input */}
			<div className="flex">
				{prepend && (
					<div
						style={{
							fontSize: textFieldSize,
						}}
						className="flex items-start p-[10px] leading-none"
					>
						{prepend}
					</div>
				)}

				<div
					style={{
						...containerStyle,
					}}
					className={`relative flex flex-1 ${isFocus ? "shadow" : ""}`}
				>
					{/* Label Variant */}
					{vaiants.includes(variant) && label && (
						<span
							style={{ ...labelStyle }}
							className={`absolute pointer-events-none transition-[top,font,padding,margin] leading-none whitespace-nowrap ${
								(isFocus && variant === "outline") ||
								(variant === "outline" && value)
									? "bg-white/80 dark:bg-base-600/80 backdrop-blur px-1 -ml-1"
									: ""
							}`}
						>
							{label}
						</span>
					)}

					{prefix && (
						<div
							style={{
								fontSize: textFieldSize,
							}}
							className="absolute top-0 left-0 flex items-center p-3 pointer-events-none"
						>
							{prefix}
						</div>
					)}

					<textarea
						id={id}
						name={name}
						value={value}
						onChange={onChange}
						onBlur={onBlur}
						disabled={disabled}
						readOnly={readOnly}
						placeholder={placeholder}
						style={{
							...inputStyle,
							fontSize: textFieldSize,
							color: colorMode === "light" ? "#000" : "#FFF",
						}}
						ref={textAreaRef}
						rows={rows}
						className={`w-full resize-none ${disabled ? "cursor-not-allowed" : ""}`}
					/>
				</div>

				{suffix && (
					<div
						style={{
							fontSize: textFieldSize,
						}}
						className="flex items-center p-[10px] leading-none"
					>
						{suffix}
					</div>
				)}
			</div>

			{/* Error */}
			{error && (
				<p className="text-red-500 text-xs mt-1">
					{error}
				</p>
			)}

			{/* Note */}
			{note && !error && (
				<p className="text-gray-500 text-xs mt-1">
					{note}
				</p>
			)}
		</div>
	);
};

TextArea.propTypes = {
	id: PropTypes.string,
	name: PropTypes.string,
	label: PropTypes.string,
	value: PropTypes.string,
	onChange: PropTypes.func,
	onBlur: PropTypes.func,
	disabled: PropTypes.bool,
	readOnly: PropTypes.bool,
	placeholder: PropTypes.string,
	variant: PropTypes.oneOf(["outline", "underlined", "filled"]),
	size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
	color: PropTypes.oneOf([
		"primary",
		"base",
		"success",
		"warning",
		"danger",
		"info",
	]),
	rounded: PropTypes.oneOf(["none", "sm", "base", "md", "lg", "xl", "2xl", "3xl", "4xl"]),
	density: PropTypes.oneOf(["tight", "normal", "loose"]),
	prefix: PropTypes.node,
	suffix: PropTypes.node,
	prepend: PropTypes.node,
	append: PropTypes.node,
	note: PropTypes.string,
	error: PropTypes.string,
	rows: PropTypes.number,
	required: PropTypes.bool,
};

export default TextArea;
