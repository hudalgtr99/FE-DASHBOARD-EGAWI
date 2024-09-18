import { ThemeContext } from "@/context/ThemeContext";
import PropTypes from "prop-types";
import { useContext, useState } from "react";

/**
 *
 * @param {{
 * color?: "primary" | "base" | "success" | "warning" | "danger" | "info";
 * rounded?: "none" | "sm" | "rounded" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
 * density?: "tight" | "normal" | "loose";
 * size?: "xs" | "sm" | "md" | "lg" | "xl";
 * prefix?: React.ReactNode;
 * suffix?: React.ReactNode;
 * active?: boolean;
 * onClick?: () => void;
 * children?: React.ReactNode;
 * }}
 *
 */

const List = ({
    color = "primary",
    rounded = "md",
    density = "normal",
    size = "md",
    prefix = null,
    suffix = null,
    active = false,
    onClick = () => { },
    children = null,
}) => {
    const { themeColor } = useContext(ThemeContext);

    const [isHover, setIsHover] = useState(false);

    // Color
    const listColor =
        {
            primary: themeColor,
            base: "#BABCBD",
            success: "#4ED17E",
            warning: "#EEC239",
            danger: "#F26969",
            info: "#629BF8",
        }[color] || color;

    // Rounded
    const listRounded =
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
        }[rounded] || "rounded-md";

    // Density
    const listDensity =
        {
            tight: "py-2 px-2",
            normal: "py-2.5 px-2.5",
            loose: "py-3 px-3",
        }[density] || "py-2.5 px-2.5";

    // Size
    const listSize =
        {
            xs: 10,
            sm: 12,
            md: 14,
            lg: 16,
            xl: 18,
        }[size] || 14;

    return (
        <div
            style={{
                backgroundColor: active ? listColor : isHover ? `${listColor}20` : "",
                color: active ? "#fff" : isHover ? listColor : "",
                fontSize: listSize,
            }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={onClick}
            className={`flex w-full items-center justify-between gap-2 leading-none cursor-pointer ${listRounded} ${listDensity}`}
        >
            <div className="flex items-center gap-2">
                {prefix && (
                    <div
                        style={{
                            fontSize: listSize + 2,
                        }}
                    >
                        {prefix}
                    </div>
                )}
                <div className="truncate whitespace-nowrap">{children}</div>
            </div>
            {suffix && (
                <div
                    style={{
                        fontSize: listSize + 2,
                    }}
                >
                    {suffix}
                </div>
            )}
        </div>
    );
};

List.propTypes = {
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
    density: PropTypes.oneOf(["tight", "normal", "loose"]),
    size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
    prefix: PropTypes.node,
    suffix: PropTypes.node,
    active: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.node,
};

export default List;
