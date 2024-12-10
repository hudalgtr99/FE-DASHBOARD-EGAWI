import { ThemeContext } from "@/context/ThemeContext";
import { useWindowSize } from "@/hooks/useWindowSize";
import React, { useContext } from "react";
import PropTypes from "prop-types";

/**
 *
 * @param {{
 * multi: boolean;
 * children: React.ReactNode;
 * }}
 *
 */

const Timeline = ({ multi, children }) => {
	const child = React.Children.map(children, (el) => {
		return React.cloneElement(el, { multi });
	});
	return (
		<div
			className={`grid gap-y-4 ${
				multi
					? "grid-cols-[minmax(min-content,24px)_auto] md:grid-cols-[auto_minmax(min-content,24px)_auto]"
					: "grid-cols-[minmax(min-content,24px)_auto]"
			}`}
		>
			{child}
		</div>
	);
};

/**
 *
 * @param {{
 * icon: React.ReactNode;
 * variant: "solid" | "tonal" | "dot" | "default";
 * color: "primary" | "base" | "success" | "warning" | "danger" | "info";
 * size: "xs" | "sm" | "md" | "lg" | "xl";
 * noline: boolean;
 * position: "left" | "right";
 * rounded: "none" | "sm" | "rounded" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
 * children: React.ReactNode;
 * }}
 *
 */

const TimelineItem = ({
	icon = null,
	variant = "default",
	color = "primary",
	size = "md",
	noline = false,
	position = "right",
	rounded = "full",
	children = null,
}) => {
	const { themeColor } = useContext(ThemeContext);
	const { width } = useWindowSize();
	// Color
	const timelineColor =
		{
			primary: themeColor,
			base: "#BABCBD",
			success: "#4ED17E",
			warning: "#EEC239",
			danger: "#F26969",
			info: "#629BF8",
		}[color] || color;

	// Rounded
	const timelineRounded =
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
		}[rounded] || "rounded-full";

	const timelinePosition =
		{
			left: "left",
			right: "right",
		}[position] || "right";

	const timelineSize =
		{
			xs: 12,
			sm: 14,
			md: 16,
			lg: 18,
			xl: 20,
		}[size] || size;

	let style = {};
	if (variant === "solid") {
		style = {
			backgroundColor: timelineColor,
			color: "white",
			padding: "0.5rem",
		};
	} else if (variant === "tonal") {
		style = {
			backgroundColor: `${timelineColor}30`,
			color: timelineColor,
			padding: "0.5rem",
		};
	} else if (variant === "dot") {
		style = {
			backgroundColor: `${timelineColor}30`,
			padding: "3px",
		};
	} else {
		style = {
			color: timelineColor,
			padding: "0.5rem",
		};
	}

	let lineStyle = {};
	if (variant === "dot") {
		lineStyle = {
			height: `calc(100% - ${timelineSize + 3}px)`,
			top: timelineSize + 12,
		};
	} else {
		lineStyle = {
			height: `calc(100% - ${timelineSize + 16}px)`,
			top: timelineSize + 24,
		};
	}

	return (
		<>
			{multi && (
				<div className="w-full pr-5 hidden md:block">
					{timelinePosition === "left" && <div>{children}</div>}
				</div>
			)}
			<div className="w-full flex flex-col items-center relative">
				<div
					style={{
						...style,
						fontSize: `${timelineSize}px`,
					}}
					className={`z-10 ${timelineRounded}`}
				>
					{variant !== "dot" ? (
						icon
					) : (
						<div
							style={{
								width: `${timelineSize - 2}px`,
								height: `${timelineSize - 2}px`,
								borderRadius: "50%",
								backgroundColor: timelineColor,
							}}
						></div>
					)}
				</div>
				{!noline && (
					<div
						style={{
							...lineStyle,
						}}
						className="w-px absolute bg-gray-200 dark:bg-base-400 z-0"
					></div>
				)}
			</div>
			<div className="w-full pl-5">
				{(timelinePosition === "right" || !multi || width <= 778) && (
					<div>{children}</div>
				)}
			</div>
		</>
	);
};

Timeline.propTypes = {
	multi: PropTypes.bool,
	children: PropTypes.node,
};
Timeline.defaultProps = {
	multi: false,
	children: null,
};

TimelineItem.propTypes = {
	icon: PropTypes.node,
	variant: PropTypes.oneOfType([
		PropTypes.oneOf(["solid", "tonal", "dot", "default"]),
		PropTypes.string,
	]),
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
	size: PropTypes.oneOfType([
		PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
		PropTypes.number,
	]),
	noline: PropTypes.bool,
	position: PropTypes.oneOf(["left", "right"]),
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
	children: PropTypes.node,
};
Timeline.Item = TimelineItem;

export default Timeline;
