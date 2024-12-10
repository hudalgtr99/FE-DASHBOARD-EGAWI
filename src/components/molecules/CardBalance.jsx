import { ThemeContext } from "@/context/ThemeContext";
import { convertToRupiah } from "@/utils/convertToRupiah";
import { useContext } from "react";
import PropTypes from "prop-types";

/**
 *
 * @param {{
 * title: string;
 * value: integer;
 * colorFrom: "primary" | "base" | "success" | "warning" | "danger" | "info";
 * colorTo: "primary" | "base" | "success" | "warning" | "danger" | "info";
 * rounded: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
 * onClick: () => void;
 * }}
 *
 *
 */

const CardBalance = ({
	title,
	value,
	colorFrom,
	colorTo,
	rounded,
	onClick,
}) => {
	const { themeColor } = useContext(ThemeContext);

	// Color
	const cardColorFrom =
		{
			primary: themeColor,
			base: "#BABCBD",
			success: "#4ED17E",
			warning: "#EEC239",
			danger: "#F26969",
			info: "#629BF8",
		}[colorFrom] || colorFrom;
	const cardColorTo =
		{
			primary: themeColor,
			base: "#BABCBD",
			success: "#4ED17E",
			warning: "#EEC239",
			danger: "#F26969",
			info: "#629BF8",
		}[colorTo] || colorTo;

	// Rounded
	const cardRounded =
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
		}[rounded] || "rounded-md";

	return (
		<div
			onClick={onClick}
			style={{
				background: `linear-gradient(to bottom right, ${cardColorFrom}, ${cardColorTo})`,
			}}
			className={`group/card relative p-4 overflow-hidden text-sm text-white shadow hover:shadow-lg transition-all duration-300 ${
				onClick ? "cursor-pointer" : ""
			} ${cardRounded}`}
		>
			<div className="relative z-20 font-thin">
				<div>{title}</div>
				<div className="text-2xl font-medium">{convertToRupiah(value)}</div>
			</div>

			{/* Circle */}
			<div className="absolute z-10 shadow -top-8 -right-5 w-16 h-16 rounded-full bg-gradient-to-tr from-white/30 to-transparent group-hover/card:w-20 group-hover/card:h-20  transition-all duration-300"></div>
			<div className="absolute -bottom-10 -right-2 w-20 h-20 rounded-full bg-gradient-to-tr from-white/30 to-transparent group-hover/card:w-24 group-hover/card:h-24 transition-all duration-300"></div>
		</div>
	);
};

CardBalance.propTypes = {
	title: PropTypes.string,
	value: PropTypes.number,
	colorFrom: PropTypes.oneOf([
		"primary",
		"base",
		"success",
		"warning",
		"danger",
		"info",
	]),
	colorTo: PropTypes.oneOf([
		"primary",
		"base",
		"success",
		"warning",
		"danger",
		"info",
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
};

CardBalance.defaultProps = {
	title: "Balance",
	value: 0,
	colorFrom: "primary",
	colorTo: "primary",
	rounded: "md",
};

export default CardBalance;
