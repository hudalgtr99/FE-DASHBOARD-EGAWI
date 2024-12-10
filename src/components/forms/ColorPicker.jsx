import { ChromePicker } from "react-color";
import { Popover } from "@/components";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useState } from "react";
import PropTypes from "prop-types";

/**
 *
 * @param {{
 * id: string;
 * label: string;
 * required: boolean;
 * placement: "top" | "top-start" | "top-end" | "right" | "right-start" | "right-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "left-start" | "left-end";
 * rounded: "none" | "sm" | "base" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
 * density: "tight" | "normal" | "loose";
 * size: "sm" | "md" | "lg" | "xl";
 * note: React.ReactNode;
 * error: React.ReactNode;
 * value: string;
 * setValue: React.Dispatch<React.SetStateAction<string>>;
 * }}
 *
 */

const ColorPicker = ({
	id=null,
	label="",
	required=false,
	placement="bottom-start",
	rounded="md",
	density="normal",
	size="md",
	note=null,
	error=null,
	value="#FFFFFF",
	setValue=() => {},
}) => {
	const { colorMode } = useContext(ThemeContext);
	const [isHover, setIsHover] = useState(false);

	const getContrast = (hexcolor) => {
		const r = parseInt(hexcolor.substring(1, 3), 16);
		const g = parseInt(hexcolor.substring(3, 5), 16);
		const b = parseInt(hexcolor.substring(5, 7), 16);
		const yiq = (r * 299 + g * 587 + b * 114) / 1000;
		return yiq >= 128 ? "#4D5355" : "#BABCBA";
	};

	// Size
	const colorPickerSize =
		{
			sm: 12,
			md: 14,
			lg: 16,
			xl: 18,
		}[size] || 14;

	// Rounded
	const colorPickerRounded =
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
	const colorPickerDensity =
		{
			tight: 8,
			normal: 10,
			loose: 12,
		}[density] || 10;

	const style = {
		fontSize: colorPickerSize,
		borderRadius: colorPickerRounded,
		borderWidth: 1,
		borderStyle: "solid",
		outline: "none",
		borderColor: error
			? "#ef4444"
			: isHover
			? colorMode === "light"
				? "#9A9C9A"
				: "#6F6F6F"
			: colorMode === "light"
			? "#BABCBA"
			: "#4D5355",
	};
	return (
		<div className="w-full">
			{/* Label Basic */}
			<label
				htmlFor={id}
				style={{
					fontSize: colorPickerSize,
				}}
				className={`mb-1 ${required && "required"}`}
			>
				{label}
			</label>
			<div
				onMouseEnter={() => setIsHover(true)}
				onMouseLeave={() => setIsHover(false)}
			>
				<Popover
					full
					placement={placement}
					button={
						<div
							style={{ ...style }}
							className="outline-none w-full h-full leading-none bg-transparent flex items-center gap-2 overflow-hidden"
						>
							<div
								style={{
									backgroundColor: value,
									padding: `${colorPickerDensity}px 14px`,
									color: getContrast(value),
								}}
								className="w-full h-full"
							>
								{value === "" ? "Pick a color" : value}
							</div>
						</div>
					}
				>
					<ChromePicker
						className="!font-sans font-bold !bg-white dark:!bg-base-800"
						color={value}
						onChange={(value) => setValue(value.hex)}
					/>
				</Popover>
			</div>

			{/* Error */}
			{error && (
				<div
					style={{
						fontSize: colorPickerSize - 3,
					}}
					className="leading-none tracking-wide mt-1 text-danger-500"
				>
					{error}
				</div>
			)}

			{/* Note */}
			{note && (
				<div
					style={{
						fontSize: colorPickerSize - 3,
					}}
					className="leading-none tracking-wide mt-1"
				>
					{note}
				</div>
			)}
		</div>
	);
};

ColorPicker.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string,
	required: PropTypes.bool,
	placement: PropTypes.oneOf([
		"top",
		"top-start",
		"top-end",
		"right",
		"right-start",
		"right-end",
		"bottom",
		"bottom-start",
		"bottom-end",
		"left",
		"left-start",
		"left-end",
	]),
	rounded: PropTypes.oneOf([
		"none",
		"sm",
		"base",
		"md",
		"lg",
		"xl",
		"2xl",
		"3xl",
		"4xl",
	]),
	density: PropTypes.oneOf(["tight", "normal", "loose"]),
	size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
	note: PropTypes.node,
	error: PropTypes.node,
	value: PropTypes.string,
	setValue: PropTypes.func,
};

export default ColorPicker;
