import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";
import PropTypes from "prop-types";

/**
 *
 * @param {{
 * variant: "solid" | "outline" | "tonal";
 * color: "primary" | "base" | "success" | "warning" | "danger" | "info";
 * size: "xs" | "sm" | "md" | "lg" | "xl";
 * rounded: "none" | "sm" | "rounded" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
 * className: string;
 * children: React.ReactNode;
 * }}
 *
 */

const Chip = ({
  variant = "solid",
  color = "primary",
  size = "sm",
  rounded = "full",
  className = "",
  children
}) => {
  const { themeColor } = useContext(ThemeContext);

  // Color
  const btnColor =
    {
      primary: themeColor,
      base: "#BABCBD",
      success: "#4ED17E",
      warning: "#EEC239",
      danger: "#F26969",
      info: "#629BF8",
    }[color] || color;

  // Size
  const btnSize =
    {
      xs: "px-1.5 py-0.5 text-[10px]",
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
      lg: "px-4 py-2 text-base",
      xl: "px-5 py-2.5 text-lg",
    }[size] || "px-2 py-1 text-xs";

  // Rounded
  const btnRounded =
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

  // Style
  let btnStyle = {};
  if (variant === "outline") {
    btnStyle = {
      border: `1px solid ${btnColor}`,
      color: btnColor,
    };
  } else if (variant === "solid") {
    btnStyle = {
      color: "white",
      backgroundColor: btnColor,
      boxShadow: `0px 1px 2px 0 rgb(0, 0, 0, 0.05)`,
    };
  } else {
    btnStyle = {
      backgroundColor: `${btnColor}30`,
      color: btnColor,
    };
  }

  return (
    <div
      style={btnStyle}
      className={`outline-none max-w-full truncate whitespace-nowrap tracking-wide text-center ${btnRounded} ${btnSize} ${
        className || "font-medium"
      }`}
    >
      {children}
    </div>
  );
};

Chip.propTypes = {
  variant: PropTypes.oneOf(["solid", "outline", "tonal"]),
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
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Chip;
