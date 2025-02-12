import { ThemeContext } from "@/context/ThemeContext";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useWindowSize } from "@/hooks/useWindowSize";
import PropTypes from "prop-types";
import { useContext, useRef } from "react";
import { TbX } from "react-icons/tb";
import { ButtonRipple } from "..";

/**
 *
 * @param {{
 * title: string;
 * description: string;
 * width: string;
 * open: boolean;
 * setOpen: React.Dispatch<React.SetStateAction<boolean>>;
 * dismiss: boolean;
 * variant: "default" | "bordered";
 * children: React.ReactNode;
 *  }}
 *
 */

const Drawer = ({
	title,
	description,
	width = "380px",
	open,
	setOpen,
	dismiss = true,
	variant = "default",
	children,
}) => {
	const { width: windowWidth, height: windowHeight } = useWindowSize();
	const { colorMode, themeSkin } = useContext(ThemeContext);
	const ref = useRef();
	useOnClickOutside(ref, () => {
		if (dismiss && open) {
			setOpen(false);
		}
	});

	let style;
	if (windowWidth === 0) {
		return null;
	}
	if (windowWidth < 768) {
		style = {
			width: "100%",
			top: open ? "0" : `${windowHeight}px`,
			left: "0",
		};
	} else {
		style = {
			width: width,
			right: open ? "0" : `-${width}`,
			bottom: "0",
		};
	}

	const containerVariant = {
		default: "shadow-lg bg-white dark:bg-base-600",
		bordered: "bordered",
	}[variant];

	return (
		<div
			ref={ref}
			className={`fixed z-50 bg-base-50/90 backdrop-blur-sm dark:bg-base-600/90 text-base-300 dark:text-base-200 h-screen transition-[right,top] duration-500 ${
				containerVariant
					? containerVariant
					: themeSkin === "default"
					? "bg-white dark:bg-base-600 shadow-lg"
					: themeSkin
			}`}
			style={{
				...style,
			}}
		>
			<div className="absolute w-full z-10 top-0 p-4 border-b border-neutral-200 dark:border-base-500 flex items-center justify-between">
				<div>
					<div className="leading-none">{title}</div>
					<div className="text-xs text-base-300 leading-none">{description}</div>
				</div>
				<ButtonRipple
					color={colorMode === "light" ? "#00000030" : "#ffffff30"}
					className="p-2 rounded-full transition-[background] hover:bg-neutral-200 dark:hover:bg-base-400"
					onClick={() => setOpen(false)}
				>
					<TbX />
				</ButtonRipple>
			</div>
			<div
				style={{
					height: `calc(100vh - 64px)`,
				}}
				className="overflow-y-auto custom-scroll relative z-0 mt-16 pb-24"
			>
				{children}
			</div>
		</div>
	);
};

Drawer.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	width: PropTypes.string,
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	dismiss: PropTypes.bool,
	variant: PropTypes.oneOf(["bordered", "default"]),
	children: PropTypes.node,
};

export default Drawer;
