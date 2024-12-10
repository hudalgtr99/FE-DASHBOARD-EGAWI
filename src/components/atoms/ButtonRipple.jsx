import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";
import useRipple from "use-ripple-hook";
import PropTypes from "prop-types";

/**
 *
 * @param {{
 * color: "primary" | "base" | "success" | "warning" | "danger" | "info";
 * duration: number;
 * cancelAutomatically: boolean;
 * disabled: boolean;
 * children: React.ReactNode;
 * onClick: () => void;
 * className: string;
 * style: React.CSSProperties;
 * stopPropagation: boolean;
 * }}
 *
 */

const ButtonRipple = ({
	color= "",
	duration= 500,
	cancelAutomatically= false,
	disabled= false,
	children= null,
	onClick= () => {},
	className= "",
	style= {},
	stopPropagation= false,
	...rest
}) => {
	const { themeColor, colorMode } = useContext(ThemeContext);

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

	const [ripple, event] = useRipple({
		duration: duration || 500,
		color: btnColor || colorMode === "light" ? "#00000030" : "#ffffff30",
		cancelAutomatically: cancelAutomatically || false,
		timingFunction: "cubic-bezier(.42,.36,.28,.88)",
		disabled: disabled,
	});
	return (
		<button
			{...rest}
			className={className}
			style={style}
			disabled={disabled}
			ref={ripple}
			onMouseDown={event}
			onClick={(e) => {
				stopPropagation && e.stopPropagation();
				onClick && onClick(e);
			}}
		>
			{children}
		</button>
	);
};

ButtonRipple.propTypes = {
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
	duration: PropTypes.number,
	cancelAutomatically: PropTypes.bool,
	disabled: PropTypes.bool,
	children: PropTypes.node,
	onClick: PropTypes.func,
	className: PropTypes.string,
	style: PropTypes.object,
	stopPropagation: PropTypes.bool,
};

export default ButtonRipple;
