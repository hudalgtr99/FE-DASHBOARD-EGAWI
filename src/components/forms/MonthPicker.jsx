import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import moment from "moment";
import { useContext, useRef, useState } from "react";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { Button, TextField } from "@/components";
import { ThemeContext } from "@/context/ThemeContext";
import PropTypes from "prop-types";
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
 * value: string;
 * setValue: React.Dispatch<React.SetStateAction<string>>;
 * onChange: React.ChangeEventHandler<HTMLInputElement>;
 * required: boolean;
 * clearable: boolean;
 * placement: "top" | "top-start" | "top-end" | "right" | "right-start" | "right-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "left-start" | "left-end";
 * position: "relative" | "fixed" | "absolute" | "sticky";
 * }}
 *
 */

const MonthPicker = ({
	id= null,
	name= null,
	label= null,
	disabled= false,
	placeholder= null,
	variant= "basic",
	size= "md",
	color= "primary",
	rounded= "md",
	density= "normal",
	prefix= null,
	suffix= null,
	prepend= null,
	append= null,
	note= null,
	error= null,
	value= new Date(),
	setValue= null,
	onChange= null,
	required= false,
	clearable= false,
	placement= "bottom-start",
	position= "relative",
}) => {
	const { themeColor } = useContext(ThemeContext);
	const [open, setOpen] = useState(false);
	const ref = useRef();
	useOnClickOutside(ref, () => setOpen(false));
	const monthList = moment.months();
	const [year, setYear] = useState(new Date().getFullYear());

	const colorMonthPicker =
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
					color={colorMonthPicker}
					rounded={rounded}
					density={density}
					prefix={prefix}
					suffix={suffix}
					prepend={prepend}
					append={append}
					note={note}
					error={error}
					clearable={clearable}
					value={value ? moment(value).format("MMMM YYYY") : ""}
					onClick={() => {
						setOpen(!open);
						if (value) {
							setYear(Number(moment(value).format("YYYY")));
						} else {
							setYear(new Date().getFullYear());
						}
					}}
					setValue={setValue}
					readOnly
					required={required}
				/>
			</div>

			{open && (
				<div
					ref={refs.setFloating}
					style={floatingStyles}
					className={`bg-white dark:bg-base-700 w-fit rounded-lg shadow-lg border border-base-50 dark:border-base-500 z-10 p-4 ${position}`}
				>
					<div className="flex items-center justify-between mb-2">
						<Button
							onClick={() => {
								setYear(year - 1);
							}}
							variant="text"
							color={colorMonthPicker}
							size={40}
						>
							<TbChevronLeft />
						</Button>
						<div>{year}</div>
						<Button
							onClick={() => {
								setYear(year + 1);
							}}
							variant="text"
							color={colorMonthPicker}
							size={40}
						>
							<TbChevronRight />
						</Button>
					</div>
					<div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
						{monthList.map((month, index) => (
							<div className="flex items-center justify-center" key={index}>
								<div
									onClick={() => {
										onChange && onChange(new Date(year, index, 1));
										setOpen(false);
									}}
									style={{
										backgroundColor:
											moment(value).format("MMMM") === month &&
											moment(value).format("YYYY") === year.toString()
												? colorMonthPicker
												: "",
										color:
											moment(value).format("MMMM") === month &&
											moment(value).format("YYYY") === year.toString()
												? "white"
												: "",
									}}
									className="text-sm m-0 w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-base-75 dark:hover:bg-base-600 rounded-md"
								>
									{month.substring(0, 3)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

MonthPicker.propTypes = {
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
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
	setValue: PropTypes.func,
	onChange: PropTypes.func,
	required: PropTypes.bool,
	clearable: PropTypes.bool,
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

export default MonthPicker;
