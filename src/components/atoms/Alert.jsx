import { ThemeContext } from "@/context/ThemeContext";
import PropTypes from "prop-types";
import { useContext } from "react";
import { TbX } from "react-icons/tb";

/**
 *
 * @param {{
 * variant: "solid" | "outline" | "tonal";
 * color: "primary" | "base" | "success" | "warning" | "danger" | "info";
 * rounded: "none" | "sm" | "rounded" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
 * density: "tight" | "normal" | "loose";
 * icon: React.ReactNode;
 * closable: boolean;
 * show: boolean;
 * setShow: React.Dispatch<React.SetStateAction<boolean>>;
 * children: React.ReactNode;
 * }}
 *
 */

const Alert = ({
	variant = "solid",
	color = "primary",
	rounded = "md",
	density = "normal",
	icon = null,
	closable = false,
	show = true,
	setShow = () => {},
	children = null,
}) => {
	const { themeColor } = useContext(ThemeContext);

	// Color
	const alertColor =
		{
			primary: themeColor,
			base: "#BABCBD",
			success: "#4ED17E",
			warning: "#EEC239",
			danger: "#F26969",
			info: "#629BF8",
		}[color] || color;

	// Rounded
	const alertRounded =
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

	const alertDensity =
		{
			tight: "py-2",
			normal: "py-3",
			loose: "py-4",
		}[density] || "py-3";

	// Style
	let alertStyle = {};
	if (variant === "tonal") {
		alertStyle = {
			backgroundColor: `${alertColor}30`,
			color: alertColor,
		};
	} else if (variant === "outline") {
		alertStyle = {
			backgroundColor: "transparent",
			color: alertColor,
			border: `1px solid ${alertColor}`,
		};
	} else {
		alertStyle = {
			backgroundColor: alertColor,
			color: "white",
		};
	}

	if (show) {
		return (
			<div
				style={alertStyle}
				className={`px-4 w-full flex gap-3 items-center text-sm overflow-hidden ${alertDensity} ${alertRounded}`}
			>
				<div className="flex items-center gap-3">
					{icon} {children}
				</div>

				{closable && (
					<div
						onClick={() => setShow(false)}
						className="ml-auto cursor-pointer"
					>
						<TbX />
					</div>
				)}
			</div>
		);
	}

	return null;
};

Alert.propTypes = {
	variant: PropTypes.oneOf(["solid", "outline", "tonal"]),
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
	density: PropTypes.oneOf(["tight", "normal", "loose"]),
	icon: PropTypes.node,
	closable: PropTypes.bool,
	show: PropTypes.bool,
	setShow: PropTypes.func,
	children: PropTypes.node,
};
export default Alert;
