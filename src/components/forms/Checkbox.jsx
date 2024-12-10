import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";
import { TbCheck } from "react-icons/tb";
import { ButtonRipple } from "@/components";
import PropTypes from "prop-types";

/**
 *
 * @param {{
 * id: string;
 * checked: boolean;
 * onChange: React.Dispatch<React.SetStateAction<boolean>>;
 * size: "xs" | "sm" | "md" | "lg" | "xl";
 * color: "primary" | "base" | "success" | "warning" | "danger" | "info";
 * disabled: boolean;
 * label: string;
 * }}
 *
 */

const Checkbox = ({
  id = "",
  checked = false,
  onChange = () => {},
  size = "md",
  color = "primary",
  disabled = false,
  label = "",
}) => {
  const { themeColor } = useContext(ThemeContext);

  // Color
  const checkboxColor =
    {
      primary: themeColor,
      base: "#BABCBD",
      success: "#4ED17E",
      warning: "#EEC239",
      danger: "#F26969",
      info: "#629BF8",
    }[color] || color;

  // Size
  const checkSize =
    {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
    }[size] || 16;

  const text =
    {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
    }[size] || 14;

  return (
    <div className="flex items-center gap-x-1">
      <ButtonRipple
        className="relative rounded-full flex items-center justify-center transition-[background] hover:bg-neutral-100 dark:hover:bg-base-500"
        color={checkboxColor ? `${checkboxColor}50` : `#989C9D50`}
        style={{
          width: checkSize + 16,
          height: checkSize + 16,
        }}
        onClick={onChange}
        disabled={disabled}
        type="button"
      >
        {checked && (
          <TbCheck
            size={text}
            style={{
              marginLeft: -text / 2,
              marginTop: -text / 2,
            }}
            className={`absolute text-white z-10 top-1/2 left-1/2 inset-0 pointer-events-none`}
          />
        )}
        <input
          id={id}
          style={{
            width: checkSize,
            height: checkSize,
            background: checked
              ? checkboxColor
                ? checkboxColor
                : themeColor
              : "transparent",
          }}
          className={`appearance-none rounded outline-none pointer-events-none ${
            checked ? "shadow" : "border border-base-200 dark:border-base-300"
          } ${disabled ? "opacity-50" : ""}`}
          readOnly
          checked={checked}
          type="checkbox"
        />
      </ButtonRipple>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: text,
          }}
          className={`cursor-pointer ${
            disabled
              ? "pointer-events-none text-base-100 dark:text-base-400"
              : "text-base-300 dark:text-base-200"
          }`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
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
  disabled: PropTypes.bool,
  label: PropTypes.string,
};

export default Checkbox;
