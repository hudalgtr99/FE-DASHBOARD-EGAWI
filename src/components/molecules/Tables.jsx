import { useRef, useState } from "react";
import PropTypes from "prop-types";

/**
 *
 * @param {{
 * size: "xs" | "sm" | "md" | "lg" | "xl";
 * density: "tight" | "normal" | "loose";
 * tablefix: boolean;
 * height: string | number;
 * children: React.ReactNode;
 * }}
 */

const Tables = ({
	size = "md",
	density = "normal",
	tablefix = false,
	height = "auto",
	children,
	style
}) => {
	// Size
	const tableSize =
		{
			xs: 10,
			sm: 12,
			md: 14,
			lg: 16,
			xl: 18,
		}[size] || 14;

	// Density
	const tableDensity =
		{
			tight: "[&>thead>tr>th]:py-1 [&>tbody>tr>td]:py-1",
			normal: "[&>thead>tr>th]:py-2 [&>tbody>tr>td]:py-2",
			loose: "[&>thead>tr>th]:py-3 [&>tbody>tr>td]:py-3",
		}[density] || "[&>thead>tr>th]:py-2 [&>tbody>tr>td]:py-2";

	return (
		<div
			style={{
				height: height,
				...style,
			}}
			className="w-full overflow-auto custom-scroll"
		>
			<table
				style={{
					fontSize: `${tableSize}px`,
				}}
				className={`w-full border-separate border-spacing-0 ${tableDensity} ${
					tablefix ? "table-fixed" : "table-auto"
				}`}
			>
				{children}
			</table>
		</div>
	);
};

/**
 *
 * @param {{
 * children: React.ReactNode;
 * style: React.CSSProperties;
 * sticky: boolean;
 * }}
 */

const TableHead = ({ children, style, sticky = false }) => {
	return (
		<thead
			style={{
				...style,
			}}
			className={`${
				sticky ? "sticky top-0 bg-white dark:bg-base-600 shadow-sm" : ""
			}`}
		>
			{children}
		</thead>
	);
};

/**
 *
 * @param {{
 * children: React.ReactNode;
 * style: React.CSSProperties;
 * }}
 */

const TableBody = ({ children, style }) => {
	return (
		<tbody
			style={{
				...style,
			}}
		>
			{children}
		</tbody>
	);
};

/**
 *
 * @param {{
 * children: React.ReactNode;
 * style: React.CSSProperties;
 * expandable: React.ReactNode;
 * }}
 */

const TableRow = ({ children, style, expandable = null }) => {
	const ref = useRef(null);
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<>
			<tr
				style={{
					...style,
				}}
				onClick={() => setIsExpanded(!isExpanded)}
				className={`${expandable ? "cursor-pointer" : ""}`}
			>
				{children}
			</tr>

			{expandable && (
				<tr>
					<td
						style={{
							padding: "0px",
						}}
						colSpan={children.length}
					>
						<div
							ref={ref}
							style={{
								height: isExpanded ? `${ref.current.scrollHeight}px` : "0px",
							}}
							className={`overflow-hidden transition-[height] duration-300 ease-in-out ${
								isExpanded ? "border-b dark:border-base-500" : ""
							}`}
						>
							{expandable}
						</div>
					</td>
				</tr>
			)}
		</>
	);
};

/**
 *
 * @param {{
 * children: React.ReactNode;
 * style: React.CSSProperties;
 * center: boolean;
 * }}
 */

const TableHeader = ({ children, style, center = false }) => {
	return (
		<th
			style={{
				...style,
			}}
			className={`border-b dark:border-base-500 font-normal uppercase tracking-wide px-2 sticky ${
				center ? "text-center" : "text-left"
			}`}
		>
			{children}
		</th>
	);
};

/**
 *
 * @param {{
 * children: React.ReactNode;
 * style: React.CSSProperties;
 * center: boolean;
 * colspan: integer;
 * }}
 */

const TableData = ({ children, style, center = false, colspan = 1 }) => {
	return (
		<td
			style={{
				...style,
			}}
			colSpan={colspan}
			className={`border-b dark:border-base-500 px-2 ${
				center ? "text-center" : "text-left"
			}`}
		>
			{children}
		</td>
	);
};

Tables.propTypes = {
	size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
	density: PropTypes.oneOf(["tight", "normal", "loose"]),
	tablefix: PropTypes.bool,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	children: PropTypes.node,
};

TableHead.propTypes = {
	children: PropTypes.node,
	style: PropTypes.object,
	sticky: PropTypes.bool,
};

TableBody.propTypes = {
	children: PropTypes.node,
	style: PropTypes.object,
};

TableRow.propTypes = {
	children: PropTypes.node,
	style: PropTypes.object,
	expandable: PropTypes.node,
};

TableHeader.propTypes = {
	children: PropTypes.node,
	style: PropTypes.object,
	center: PropTypes.bool,
};

TableData.propTypes = {
	children: PropTypes.node,
	style: PropTypes.object,
	center: PropTypes.bool,
	colspan: PropTypes.number,
};

Tables.Head = TableHead;
Tables.Body = TableBody;
Tables.Row = TableRow;
Tables.Header = TableHeader;
Tables.Data = TableData;

export default Tables;
