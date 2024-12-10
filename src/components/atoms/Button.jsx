import { ThemeContext } from "@/context/ThemeContext";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { ButtonRipple, Loading } from "@/components";

/**
 *
 * @param {{
 * type: "button" | "submit" | "reset";
 * variant: "solid" | "outline" | "text" | "tonal" | "flat";
 * color: "primary" | "base" | "success" | "warning" | "danger" | "info";
 * textcolor: string;
 * size: "xs" | "sm" | "md" | "lg" | "xl";
 * rounded: "none" | "sm" | "rounded" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
 * block: boolean;
 * loading: boolean;
 * onClick: () => void;
 * loadingComponent: React.ReactNode;
 * disabled: boolean;
 * className: string;
 * children: React.ReactNode;
 * stopPropagation: boolean;
 * }}
 *
 */

const Button = ({
	type= "button",
	variant= "solid",
	color= "primary",
	textcolor= "",
	size= "md",
	rounded= "md",
	block= false,
	loading= false,
	onClick= () => {},
	loadingComponent= null,
	disabled= false,
	className= "",
	children= null,
	stopPropagation= false,
}) => {
	const { themeColor } = useContext(ThemeContext);
	const [isHover, setIsHover] = useState(false);

	// Color
	const btnColor =
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
	let btnSize = "";
	let btnFixed = "";
	if (arrSize.includes(size)) {
		btnSize =
			{
				xs: "min-w-[60px] min-h-[24px] px-2 py-1 text-xs",
				sm: "min-w-[80px] min-h-[28px] px-2 py-1 text-sm",
				md: "min-w-[100px] min-h-[32px] px-4 py-2 text-sm",
				lg: "min-w-[120px] min-h-[40px] px-4 py-2 text-base",
				xl: "min-w-[140px] min-h-[44px] px-4 py-2 text-base",
			}[size] || "min-w-[100px] min-h-[32px] px-4 py-2 text-sm";
	} else {
		btnFixed = size;
	}

	// Loading
	const btnLoading = loadingComponent ||
		{
			xs: <Loading color={"#fff"} loading={true} size={10} />,
			sm: <Loading color={"#fff"} loading={true} size={12} />,
			md: <Loading color={"#fff"} loading={true} size={14} />,
			lg: <Loading color={"#fff"} loading={true} size={16} />,
			xl: <Loading color={"#fff"} loading={true} size={18} />,
		}[size] || <Loading color={"#fff"} loading={true} size={14} />;

	// Rounded
	const btnRounded =
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

	// Style
	let btnStyle = {};
	if (variant === "outline") {
		btnStyle = {
			backgroundColor: isHover ? `${btnColor}10` : "transparent",
			border: `1px solid ${btnColor}`,
			color: textcolor ? textcolor : btnColor,
			width: `${btnFixed}px`,
			height: `${btnFixed}px`,
		};
	} else if (variant === "text") {
		btnStyle = {
			backgroundColor: isHover ? `${btnColor}30` : "transparent",
			color: textcolor ? textcolor : btnColor,
			width: `${btnFixed}px`,
			height: `${btnFixed}px`,
		};
	} else if (variant === "tonal") {
		btnStyle = {
			backgroundColor: isHover ? `${btnColor}30` : `${btnColor}20`,
			color: textcolor ? textcolor : btnColor,
			width: `${btnFixed}px`,
			height: `${btnFixed}px`,
		};
	} else if (variant === "flat") {
		btnStyle = {
			color: textcolor ? textcolor : "white",
			backgroundColor: btnColor,
			width: `${btnFixed}px`,
			height: `${btnFixed}px`,
			filter: disabled ? "brightness(1.2)" : "brightness(1)",
			WebkitFilter: disabled ? "brightness(1.2)" : "brightness(1)",
		};
	} else {
		btnStyle = {
			color: textcolor ? textcolor : "white",
			backgroundColor: btnColor,
			width: `${btnFixed}px`,
			height: `${btnFixed}px`,
			filter: disabled ? "brightness(1.2)" : "brightness(1)",
			WebkitFilter: disabled ? "brightness(1.2)" : "brightness(1)",
			boxShadow:
				"0 10px 15px -3px rgb(0, 0, 0, 0.15), 0 4px 6px -4px rgb(0, 0, 0, 0.15)",
		};
	}

	return (
		<ButtonRipple
			type={type}
			onMouseOver={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			color={
				!variant || variant === "solid" || variant === "flat"
					? ""
					: `${btnColor}60`
			}
			onClick={(e) => {
				onClick && onClick(e);
			}}
			stopPropagation={stopPropagation}
			duration={300}
			disabled={disabled || loading}
			style={btnStyle}
			className={`outline-none tracking-wide duration-150 active:scale-[.98] active:duration-300 ${btnRounded} ${
				btnSize ? btnSize : ""
			} ${btnFixed ? "flex items-center justify-center" : ""} ${
				block ? "w-full" : ""
			} ${className || "font-medium"}`}
		>
			{loading ? btnLoading : children}
		</ButtonRipple>
	);
};

Button.propTypes = {
	type: PropTypes.oneOf(["button", "submit", "reset"]),
	variant: PropTypes.oneOf(["solid", "outline", "text", "tonal", "flat"]),
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
	textcolor: PropTypes.string,
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
	block: PropTypes.bool,
	loading: PropTypes.bool,
	onClick: PropTypes.func,
	loadingComponent: PropTypes.node,
	disabled: PropTypes.bool,
	className: PropTypes.string,
	children: PropTypes.node,
	stopPropagation: PropTypes.bool,
};

export default Button;
