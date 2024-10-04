import { ThemeContext } from "@/context/ThemeContext";
import { autoUpdate, offset, useFloating } from "@floating-ui/react";
import PropTypes from "prop-types";
import { useContext } from "react";

/**
 *
 * @param {{
 * placement?: "top" | "top-start" | "top-end" | "right" | "right-start" | "right-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "left-start" | "left-end";
 * color?: "primary" | "base" | "success" | "warning" | "danger" | "info";
 * size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
 * rounded?: "none" | "sm" | "rounded" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
 * value?: string | number | React.ReactNode;
 * spacing?: number;
 * skidding?: number;
 * hidden?: boolean;
 * className?: string;
 * children?: React.ReactNode;
 * }}
 *
 */

const Badge = ({
    placement = "right-start",
    color = "primary",
    size = "md",
    rounded = "full",
    value = "",
    spacing = -12,
    skidding = 0,
    hidden = false,
    className = "",
    children = null,
}) => {
    const { themeColor } = useContext(ThemeContext);

    const { refs, floatingStyles } = useFloating({
        placement,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset({
                mainAxis: spacing,
                crossAxis: skidding,
            }),
        ],
    });

    // Color
    const badgeColor =
        {
            primary: themeColor,
            base: "#BABCBD",
            success: "#4ED17E",
            warning: "#EEC239",
            danger: "#F26969",
            info: "#629BF8",
        }[color] || color;

    // Size
    const badgeSize =
        {
            xs: "min-w-[4px] h-1 p-[3px] text-[6px]",
            sm: "min-w-[8px] h-2 p-[4px] text-[7px]",
            md: "min-w-[12px] h-3 p-[5px] text-[8px]",
            lg: "min-w-[16px] h-4 p-[5px] text-[9px]",
            xl: "min-w-[20px] h-5 p-[5px] text-[10px]",
            "2xl": "min-w-[24px] h-6 p-[5px] text-[11px]",
            "3xl": "min-w-[28px] h-7 p-[5px] text-[12px]",
        }[size] || "min-w-[12px] h-3 p-[5px] text-[8px]";

    // Rounded
    const badgeRounded =
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

    const style = {
        backgroundColor: badgeColor,
        color: "white",
    };

    return (
        <div className="relative">
            <div ref={refs.setReference} className="">
                {children}
            </div>

            <div
                ref={refs.setFloating}
                style={{ ...floatingStyles, ...style }}
                className={`absolute z-10 border-2 flex items-center justify-center border-white dark:border-gray-600 rounded-full ${hidden ? "hidden" : ""
                    } ${badgeRounded} ${badgeSize}  ${className}`}
            >
                {value}
            </div>
        </div>
    );
};

Badge.propTypes = {
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
    size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", "2xl", "3xl"]),
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
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.node,
    ]),
    spacing: PropTypes.number,
    skidding: PropTypes.number,
    hidden: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
};

export default Badge;
