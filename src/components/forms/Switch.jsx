import { ThemeContext } from "@/context/ThemeContext";
import PropTypes from "prop-types";
import { useContext } from "react";

/**
 *
 * @param {{
 * id: string;
 * label: string;
 * value: boolean;
 * onChange: React.Dispatch<React.SetStateAction<string>>;
 * size: "sm" | "md" | "lg" | "xl";
 * color: "primary" | "success" | "warning" | "danger" | "info";
 * disabled: boolean;
 * required: boolean;
 * }}
 *
 */

const Switch = ({
	id = "",
	label = "",
	value = false,
	onChange = () => {},
	size = "md",
	color = "primary",
	disabled = false,
	required = false,
}) => {
	const { themeColor, colorMode } = useContext(ThemeContext);

	// Color
	const switchColor =
		{
			primary: themeColor,
			success: "#4ED17E",
			warning: "#EEC239",
			danger: "#F26969",
			info: "#629BF8",
		}[color] || color;

	const switchSize =
		{
			sm: 16,
			md: 18,
			lg: 20,
			xl: 22,
		}[size] || 18;

	const text =
		{
			sm: 12,
			md: 14,
			lg: 16,
			xl: 18,
		}[size] || 14;

	return (
		<div className="flex gap-2">
			<div
				style={{
					backgroundColor: disabled
						? "#BABCBA80"
						: value
						? switchColor
						: colorMode === "light"
						? "#BABCBD"
						: "#4D5355",
					width: switchSize * 2 - 4,
					height: switchSize,
					opacity: disabled ? 0.5 : 1,
				}}
				className="relative rounded-full overflow-hidden"
			>
				<div
					style={{
						left: value ? switchSize - 2 : 4,
						width: switchSize - 6,
						height: switchSize - 6,
						top: "50%",
						transform: "translateY(-50%)",
						backgroundColor: "white",
					}}
					className={`rounded-full absolute transition-[left]`}
				></div>
				<input
					id={id}
					disabled={disabled}
					checked={value}
					onChange={(e) => {
						e.stopPropagation();
						onChange(e);
					}}
					type="checkbox"
					className={`absolute w-full h-full top-0 left-0 opacity-0 ${
						disabled ? "" : "cursor-pointer"
					}`}
				/>
			</div>
			{label && (
				<label
					htmlFor={id}
					style={{
						fontSize: text,
					}}
					className={`cursor-pointer ${
						disabled
							? "pointer-events-none text-base-100 dark:text-base-400"
							: "text-base-300 dark:text-base-200"
					} ${required && "required"}`}
				>
					{label}
				</label>
			)}
		</div>
	);
};

Switch.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string,
	value: PropTypes.bool,
	onChange: PropTypes.func,
	size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
	color: PropTypes.oneOfType([
		PropTypes.oneOf(["primary", "success", "warning", "danger", "info"]),
		PropTypes.string,
	]),
	disabled: PropTypes.bool,
	required: PropTypes.bool,
};
export default Switch;
