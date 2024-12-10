import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";

/**
 *
 * @param {{
 * accept: object;
 * disabled: boolean;
 * maxFiles: integer;
 * minSize: integer;
 * }}
 *
 */

const FileInputForm = ({
	accept = null,
	maxFiles = null,
	minSize = null,
	maxSize = null,
	disabled = false,
	multiple = false,
	value = [],
	setValue = () => {},
	id = "",
	name = "",
	density = "normal",
	rounded = "base",
	size = "md",
	label = "",
	required = false,
	error = "",
	note = "",
}) => {
	const { colorMode } = useContext(ThemeContext);
	const [isHover, setIsHover] = useState(false);
	const [errorRejection, setErrorRejection] = useState(null);

	const onDrop = (acceptedFiles, fileRejections) => {
		if (fileRejections.length > 0) {
			setErrorRejection(fileRejections[0].errors[0].message);
			setValue([]);
			return;
		}
		setErrorRejection(null);
		setValue(acceptedFiles);
	};

	const { getRootProps, getInputProps, open } = useDropzone({
		onDrop,
		accept,
		disabled,
		maxFiles,
		minSize,
		maxSize,
		multiple,
		noClick: true,
	});

	// Size
	const fileInputSize =
		{
			sm: 12,
			md: 14,
			lg: 16,
			xl: 18,
		}[size] || 14;

	// Rounded
	const fileInputRounded =
		{
			none: 0,
			sm: 2,
			base: 4,
			md: 6,
			lg: 8,
			xl: 12,
			"2xl": 16,
			"3xl": 20,
			"4xl": 24,
		}[rounded] || rounded;

	// Density
	const fileInputDensity =
		{
			tight: 8,
			normal: 10,
			loose: 12,
		}[density] || 10;

	let containerStyle = {
		borderColor: error
			? "#ef4444"
			: disabled
			? colorMode === "light"
				? "#BABCBA80"
				: "#4D535580"
			: isHover
			? colorMode === "light"
				? "#9A9C9A"
				: "#6F6F6F"
			: colorMode === "light"
			? "#BABCBA"
			: "#4D5355",
		borderWidth: 1,
		borderStyle: "solid",
		outline: "none",
		borderRadius: fileInputRounded,
		fontSize: fileInputSize,
	};

	let buttonStyle = {
		backgroundColor: error
			? "#ef4444"
			: disabled
			? colorMode === "light"
				? "#BABCBA80"
				: "#4D535580"
			: isHover
			? colorMode === "light"
				? "#9A9C9A"
				: "#6F6F6F"
			: colorMode === "light"
			? "#BABCBA"
			: "#4D5355",
	};

	return (
		<div>
			{/* Label Basic */}
			<label
				htmlFor={id}
				style={{
					fontSize: fileInputSize,
				}}
				className={`mb-1 ${required && "required"}`}
			>
				{label}
			</label>

			<div
				onMouseEnter={() => setIsHover(true)}
				onMouseLeave={() => setIsHover(false)}
				{...getRootProps({
					className: `relative w-full overflow-hidden border border-base-100 dark:border-base-400 ${
						disabled ? "" : "cursor-pointer"
					}`,
					style: {
						...containerStyle,
						opacity: disabled ? 0.5 : 1,
					},
				})}
			>
				<input id={id} name={name} {...getInputProps()} />
				<div
					onClick={open}
					className="absolute w-full h-full top-0 left-0 z-0"
				></div>

				<div className="flex">
					<div
						style={{
							padding: `${fileInputDensity}px 14px`,
							...buttonStyle,
						}}
						className="text-white flex items-center justify-center whitespace-nowrap transition"
					>
						Upload File
					</div>
					<div className="px-4 py-2 flex items-center">
						{value && value.length > 0 ? (
							value.map((file, index) => {
								if (index === value.length - 1) return file.name;
								return `${file.name}, `;
							})
						) : (
							<div className="flex items-center gap-2">
								<div className="text-sm">No file selected</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Error */}
			{(error || errorRejection) && (
				<div
					style={{
						fontSize: fileInputSize - 3,
					}}
					className="leading-none tracking-wide mt-1 text-danger-500"
				>
					{error || errorRejection}
				</div>
			)}

			{/* Note */}
			{note && (
				<div
					style={{
						fontSize: fileInputSize - 3,
					}}
					className="leading-none tracking-wide mt-1"
				>
					{note}
				</div>
			)}
		</div>
	);
};

FileInputForm.propTypes = {
	accept: PropTypes.object,
	disabled: PropTypes.bool,
	maxFiles: PropTypes.number,
	minSize: PropTypes.number,
	maxSize: PropTypes.number,
	multiple: PropTypes.bool,
	value: PropTypes.array,
	setValue: PropTypes.func,
	id: PropTypes.string,
	name: PropTypes.string,
	density: PropTypes.string,
	rounded: PropTypes.string,
	size: PropTypes.string,
	label: PropTypes.string,
	required: PropTypes.bool,
	error: PropTypes.string,
	note: PropTypes.string,
};

export default FileInputForm;
