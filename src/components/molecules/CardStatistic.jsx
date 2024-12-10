import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";
import { Card } from "@/components";

/**
 *
 * @param {{
 * title: string;
 * value: string;
 * description: string;
 * color: "primary" | "base" | "success" | "warning" | "danger" | "info";
 * rounded: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
 * icon: React.ReactNode;
 * iconRounded: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
 * onClick: () => void;
 * }}
 *
 *
 */

const CardStatistic = ({
	title,
	value,
	description,
	color = "primary",
	rounded = "md",
	icon,
	iconRounded = "md",
	onClick,
}) => {
	const { themeColor } = useContext(ThemeContext);

	// Color
	const cardColor =
		{
			primary: themeColor,
			base: "#BABCBD",
			success: "#4ED17E",
			warning: "#EEC239",
			danger: "#F26969",
			info: "#629BF8",
		}[color] || color;

	// Rounded
	const icRounded =
		{
			none: "rounded-none",
			sm: "rounded-sm",
			md: "rounded-md",
			lg: "rounded-lg",
			xl: "rounded-xl",
			"2xl": "rounded-2xl",
			"3xl": "rounded-3xl",
			full: "rounded-full",
		}[iconRounded] || "rounded-md";

	return (
		<Card onClick={onClick} color={color} rounded={rounded} variant="border">
			<div className="text-sm">
				<div className="flex items-center gap-4 mb-2">
					<div
						style={{
							backgroundColor: `${cardColor}30`,
						}}
						className={`w-10 h-10 flex items-center justify-center ${icRounded}`}
					>
						<div
							style={{
								color: cardColor,
							}}
							className="text-xl"
						>
							{icon}
						</div>
					</div>
					<div className="font-medium text-lg">{value}</div>
				</div>

				<div className="font-medium">{title}</div>
				<div className="text-xs text-base-200 dark:text-base-300">
					{description}
				</div>
			</div>
		</Card>
	);
};

export default CardStatistic;
