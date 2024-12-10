import { ThemeContext } from "@/context/ThemeContext";
import PropTypes from "prop-types";
import { useContext } from "react";

/**
 *
 * @param {{
 * variant: "solid" | "tonal";
 * color: "primary" | "base" | "success" | "warning" | "danger" | "info";
 * size: "xs" | "sm" | "md" | "lg" | "xl";
 * rounded: "none" | "sm" | "rounded" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
 * onClick: () => void;
 * className: string;
 * }}
 *
 */

const Avatar = ({
	variant = "solid",
	color = "primary",
	size = "md",
	rounded = "full",
	onClick = () => {},
	className = "",
	children = null,
}) => {
	const { themeColor } = useContext(ThemeContext);

	// Color
	const avColor =
		{
			primary: themeColor,
			base: "#BABCBD",
			success: "#4ED17E",
			warning: "#EEC239",
			danger: "#F26969",
			info: "#629BF8",
		}[color] || color;

	// Size
	const arrSize = ["xs", "sm", "md", "lg", "xl"];
	let avSize = "";
	let avFixed = "";
	if (arrSize.includes(size)) {
		avSize =
			{
				xs: "w-6 h-6 text-[10px]",
				sm: "w-8 h-8 text-[10px]",
				md: "w-10 h-10 text-sm",
				lg: "w-12 h-12 text-sm",
				xl: "w-14 h-14 text-sm",
			}[size] || "w-10 h-10 text-sm";
	} else {
		avFixed = size;
	}

	// Rounded
	const avRounded =
		{
			none: "rounded-none",
			sm: "rounded-sm",
			rounded: "rounded",
			md: "rounded-md",
			lg: "rounded-lg",
			xl: "rounded-xl",
			"2xl": "rounded-2xl",
			"3xl": "rounded-3xl",
			full: "rounded-full",
		}[rounded] || "rounded-full";

	// Style
	let avStyle = {};
	if (variant === "tonal") {
		avStyle = {
			backgroundColor: `${avColor}30`,
			color: avColor,
			width: `${avFixed}px`,
			height: `${avFixed}px`,
		};
	} else {
		avStyle = {
			color: "white",
			backgroundColor: avColor,
			width: `${avFixed}px`,
			height: `${avFixed}px`,
		};
	}

	return (
		<div
			style={avStyle}
			onClick={onClick}
			className={`flex items-center justify-center overflow-hidden ${avRounded} ${
				avSize ? avSize : ""
			} ${className}`}
		>
			{children}
		</div>
	);
};

Avatar.propTypes = {
	variant: PropTypes.oneOf(["solid", "tonal"]),
	color: PropTypes.oneOfType([
		PropTypes.oneOf([
			"primary",
			"base",
			"success",
			"warning",
			"danger",
			"info",
		]),
		PropTypes.string,
	]),
	size: PropTypes.oneOfType([
		PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
		PropTypes.number,
		PropTypes.string,
	]),
	rounded: PropTypes.oneOf([
		"none",
		"sm",
		"rounded",
		"md",
		"lg",
		"xl",
		"2xl",
		"3xl",
		"full",
	]),
	onClick: PropTypes.func,
	className: PropTypes.string,
	children: PropTypes.node,
};

export default Avatar;
