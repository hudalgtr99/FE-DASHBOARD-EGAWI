import { ThemeContext } from "@/context/ThemeContext";
import PropTypes from "prop-types";
import { useContext } from "react";

const Container = ({
	fill = false,
	variant,
	rounded = "md",
	density = "normal",
	children,
	icon,
	title,
}) => {
	const { themeSkin } = useContext(ThemeContext);

	const containerDensity = {
		tight: "p-6 py-4",
		normal: "p-6",
		loose: "p-6 py-8",
	}[density] || "p-6";

	const containerRounded = {
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

	const containerVariant = {
		shadow: "shadow-lg",
		bordered: "bordered",
	}[variant];

	return (
		<div
			className={`${containerRounded} ${containerDensity} ${containerVariant ? containerVariant : themeSkin === "default" ? "bg-white shadow-lg" : themeSkin} ${fill ? "h-full w-full" : ""} bg-white dark:bg-gray-600`}
		>
			{title && icon && (
				<div className="flex items-center gap-2">
					<div className="text-lg">{icon}</div>
					<h3 className="text-md">{title}</h3>
				</div>
			)}
			{children}
		</div>
	);
};

Container.propTypes = {
	fill: PropTypes.bool,
	variant: PropTypes.oneOf(["shadow", "bordered"]),
	rounded: PropTypes.oneOf(["none", "sm", "rounded", "md", "lg", "xl", "2xl", "3xl", "full"]),
	density: PropTypes.oneOf(["tight", "normal", "loose"]),
	children: PropTypes.node.isRequired,
	icon: PropTypes.node,
	title: PropTypes.string,
};

export default Container;
