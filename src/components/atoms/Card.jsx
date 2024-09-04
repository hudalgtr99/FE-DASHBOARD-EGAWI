import { ThemeContext } from "@/context/ThemeContext";
import PropTypes from "prop-types";
import { useContext, useState } from "react";

/**
 *
 * @param {{
 * variant?: "solid" | "tonal" | "border" | "gradient";
 * color?: "primary" | "base" | "success" | "warning" | "danger" | "info" | "white";
 * rounded?: "none" | "sm" | "rounded" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
 * density?: "tight" | "normal" | "loose";
 * borderPosition?: "top" | "right" | "bottom" | "left" | "all";
 * onClick?: () => void;
 * children?: React.ReactNode;
 * }}
 *
 */

const Card = ({
  variant = "solid",
  color = "primary",
  rounded = "md",
  density = "normal",
  borderPosition = "bottom",
  onClick,
  children = null,
}) => {
  const { themeColor, colorMode } = useContext(ThemeContext);
  const [isHover, setIsHover] = useState(false);

  // Color
  const cardColor =
    {
      primary: themeColor,
      base: "#BABCBD",
      success: "#4ED17E",
      warning: "#EEC239",
      danger: "#F26969",
      info: "#629BF8",
      white: colorMode === "light" ? "#FFFFFF" : "#1D2426",
    }[color] || color;

  // Rounded
  const cardRounded =
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
  const cardDensity =
    {
      tight: "p-2",
      normal: "p-4",
      loose: "p-6",
    }[density] || "p-4";

  // Border Position
  const cardBorderPosition = {
    top: {
      borderTop: isHover
        ? `2px solid ${cardColor}`
        : `2px solid ${cardColor}60`,
    },
    right: {
      borderRight: isHover
        ? `2px solid ${cardColor}`
        : `2px solid ${cardColor}60`,
    },
    bottom: {
      borderBottom: isHover
        ? `2px solid ${cardColor}`
        : `2px solid ${cardColor}60`,
    },
    left: {
      borderLeft: isHover
        ? `2px solid ${cardColor}`
        : `2px solid ${cardColor}60`,
    },
    all: {
      border: isHover ? `2px solid ${cardColor}` : `2px solid ${cardColor}60`,
    },
  }[borderPosition] || {
    borderBottom: isHover
      ? `2px solid ${cardColor}`
      : `2px solid ${cardColor}60`,
  };

  // Style
  let cardStyle = {};
  if (variant === "border") {
    cardStyle = {
      background: colorMode === "light" ? "white" : "#1D2426",
      ...cardBorderPosition,
    };
  } else if (variant === "tonal") {
    cardStyle = {
      background: `${cardColor}50`,
      color: `${cardColor}`,
    };
  } else if (variant === "gradient") {
    cardStyle = {
      background: `linear-gradient(120deg, ${cardColor} 0%, ${cardColor}70 100%)`,
      color: "white",
    };
  } else {
    cardStyle = {
      background: cardColor,
      color: "white",
    };
  }

  return (
    <div
      style={{
        ...cardStyle,
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={`transition-[border,box-shadow] shadow hover:shadow-lg ${onClick ? "cursor-pointer" : ""} ${cardDensity} ${cardRounded}`}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  variant: PropTypes.oneOf(["solid", "tonal", "border", "gradient"]),
  color: PropTypes.oneOfType([
    PropTypes.oneOf([
      "primary",
      "base",
      "success",
      "warning",
      "danger",
      "info",
      "white",
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
  borderPosition: PropTypes.oneOf(["top", "right", "bottom", "left", "all"]),
  onClick: PropTypes.func,
  children: PropTypes.node,
};

export default Card;
