import {
	autoUpdate,
	flip,
	offset,
	shift,
	useDismiss,
	useFloating,
	useFocus,
	useHover,
	useInteractions,
	useRole,
} from "@floating-ui/react";
import { Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import { useState } from "react";

/**
 *
 * @param {{
 * tooltip: React.ReactNode;
 * placement: "top" | "top-start" | "top-end" | "right" | "right-start" | "right-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "left-start" | "left-end";
 * spacing: number;
 * fill: boolean;
 * delay: number;
 * position: "relative" | "fixed" | "absolute" | "sticky";
 * disabled: boolean;
 * children: React.ReactNode;
 * }}
 *
 */

const Tooltip = ({ tooltip, placement, spacing, fill, delay, position, disabled, children }) => {
	const [isOpen, setIsOpen] = useState(false);

	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		placement,
		onOpenChange: setIsOpen,
		middleware: [offset(spacing), flip(), shift()],
		whileElementsMounted: autoUpdate,
	});

	const hover = useHover(context, {
		move: false,
		delay: {
			open: delay,
			close: 0,
		},
	});
	const focus = useFocus(context);
	const dismiss = useDismiss(context);
	const role = useRole(context, { role: "tooltip" });

	const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

	return (
		<span className="relative leading-3">
			<span className="leading-3" ref={refs.setReference} {...getReferenceProps()}>
				{children}
			</span>
			<Transition
				show={isOpen && !disabled && Boolean(tooltip)}
				className={`${position} z-10`}
				enter="transition duration-100 ease-out"
				enterFrom="transform scale-95 opacity-0"
				enterTo="transform scale-100 opacity-100"
				leave="transition duration-75 ease-out"
				leaveFrom="transform scale-100 opacity-100"
				leaveTo="transform scale-95 opacity-0"
			>
				<div
					className={`absolute bg-white text-base-300 dark:bg-base-500 dark:text-base-200 text-sm px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap text-center ${
						fill ? "min-w-full" : "w-fit"
					}`}
					ref={refs.setFloating}
					style={floatingStyles}
					{...getFloatingProps()}
				>
					{tooltip}
				</div>
			</Transition>
		</span>
	);
};

Tooltip.propTypes = {
	tooltip: PropTypes.node,
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
	spacing: PropTypes.number,
	fill: PropTypes.bool,
	delay: PropTypes.number,
	position: PropTypes.oneOf(["relative", "fixed", "absolute", "sticky"]),
	disabled: PropTypes.bool,
	children: PropTypes.node,
};

Tooltip.defaultProps = {
	tooltip: null,
	placement: "top",
	spacing: 5,
	fill: false,
	delay: 0,
	position: "relative",
	disabled: false,
	children: null,
};

export default Tooltip;
