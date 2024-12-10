import { ThemeContext } from "@/context/ThemeContext";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import moment from "moment/moment";
import PropTypes from "prop-types";
import { useContext, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { TextField } from "@/components";
import {
	autoUpdate,
	flip,
	offset,
	shift,
	useFloating,
} from "@floating-ui/react";

/**
 *
 * @param {{
 * id: string;
 * name: string;
 * label: string;
 * disabled: boolean;
 * placeholder: string;
 * variant: "basic" | "outline" | "underlined" | "filled";
 * size: "sm" | "md" | "lg" | "xl";
 * color: "primary" | "base" | "success" | "warning" | "danger" | "info";
 * rounded: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
 * density: "tight" | "normal" | "loose";
 * prefix: React.ReactNode;
 * suffix: React.ReactNode;
 * prepend: React.ReactNode;
 * append: React.ReactNode;
 * note: React.ReactNode;
 * error: React.ReactNode;
 * mode: "single" | "multiple" | "range";
 * fromYear: number;
 * toYear: number;
 * value: string;
 * setValue: React.Dispatch<React.SetStateAction<string>>;
 * onChange: React.ChangeEventHandler<HTMLInputElement>;
 * required: boolean;
 * placement: "top" | "top-start" | "top-end" | "right" | "right-start" | "right-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "left-start" | "left-end";
 * position: "relative" | "fixed" | "absolute" | "sticky";
 * }}
 *
 */

const DatePicker = ({
	id = null,
	name = null,
	label = null,
	disabled = false,
	placeholder = null,
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
	mode = "single",
	fromYear = null,
	toYear = null,
	value = null,
	setValue = null,
	onChange = null,
	required = false,
	placement = "bottom-start",
	position = "relative",
}) => {
	const { themeColor, colorMode } = useContext(ThemeContext);
	const year = moment().year();
	const fromyear = fromYear || 2015;
	const toyear = toYear || year + 2;

	const [open, setOpen] = useState(false);

	const ref = useRef();
	useOnClickOutside(ref, () => setOpen(false));

	// Color
	const datepickerColor =
		{
			primary: themeColor,
			base: "#BABCBD",
			success: "#4ED17E",
			warning: "#EEC239",
			danger: "#F26969",
			info: "#629BF8",
		}[color] || color;

	const { refs, floatingStyles } = useFloating({
		placement: placement,
		whileElementsMounted: autoUpdate,
		middleware: [offset(), flip(), shift()],
	});

	return (
		<div ref={ref} className="relative">
			<div ref={refs.setReference}>
				<TextField
					id={id}
					name={name}
					label={label}
					disabled={disabled}
					placeholder={placeholder}
					variant={variant}
					size={size}
					color={color}
					rounded={rounded}
					density={density}
					prefix={prefix}
					suffix={suffix}
					prepend={prepend}
					append={append}
					note={note}
					error={error}
					value={
						mode === "range"
							? `${moment(value?.from).format("DD/MM/YYYY")} - ${moment(
									value?.to
							  ).format("DD/MM/YYYY")}`
							: mode === "multiple"
							? value?.map((v) => moment(v).format("DD/MM/YYYY")).join(", ")
							: value
							? moment(value).format("DD/MM/YYYY")
							: ""
					}
					onClick={() => setOpen(!open)}
					setValue={setValue}
					readOnly
					required={required}
				/>
			</div>

			{open && (
				<div
					ref={refs.setFloating}
					style={floatingStyles}
					className={`bg-white dark:bg-base-700 w-fit rounded-lg shadow-lg border border-base-50 dark:border-base-500 z-10 ${position}`}
				>
					<DayPicker
						className="m-0 p-4 text-sm"
						selected={value}
						onSelect={setValue}
						onDayClick={(e) => {
							if (mode === "single") setOpen(false);
							onChange && onChange(e);
						}}
						modifiersStyles={{
							selected: {
								backgroundColor: datepickerColor,
								color: "#fff",
							},
						}}
						styles={{
							dropdown: {
								backgroundColor: colorMode === "light" ? "#fff" : "#171C1E",
							},
							caption_label: {
								fontSize: "0.875rem",
							},
						}}
						classNames={{
							button: `rdp-button hover:!bg-base-75 dark:hover:!bg-base-500 ${
								mode !== "range" ? "rounded-lg" : ""
							} ${
								mode === "single" ? "aria-selected:!pointer-events-none" : ""
							}`,
							day_selected: "rdp-day_selected ",
						}}
						mode={mode}
						captionLayout="dropdown-buttons"
						fromYear={fromyear}
						toYear={toyear}
						showOutsideDays
					/>
				</div>
			)}
		</div>
	);
};

DatePicker.propTypes = {
	id: PropTypes.string,
	name: PropTypes.string,
	label: PropTypes.string,
	disabled: PropTypes.bool,
	placeholder: PropTypes.string,
	variant: PropTypes.oneOf(["basic", "outline", "underlined", "filled"]),
	size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
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
	rounded: PropTypes.oneOfType([
		PropTypes.oneOf(["none", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"]),
		PropTypes.number,
	]),
	density: PropTypes.oneOf(["tight", "normal", "loose"]),
	prefix: PropTypes.node,
	suffix: PropTypes.node,
	prepend: PropTypes.node,
	append: PropTypes.node,
	note: PropTypes.node,
	error: PropTypes.node,
	mode: PropTypes.oneOf(["single", "multiple", "range"]),
	fromYear: PropTypes.number,
	toYear: PropTypes.number,
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.string),
		PropTypes.object,
	]),
	setValue: PropTypes.func,
	onChange: PropTypes.func,
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
	position: PropTypes.oneOf(["relative", "fixed", "absolute", "sticky"]),
};


export default DatePicker;
