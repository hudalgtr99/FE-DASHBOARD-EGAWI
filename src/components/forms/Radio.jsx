import { RadioGroup } from "@headlessui/react";
import ButtonRipple from "../atoms/ButtonRipple";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";
import PropTypes from "prop-types";

/**
 *
 * @param {{
 * value: any;
 * onChange: React.Dispatch<React.SetStateAction<string>>;
 * options: object[];
 * size: "xs" | "sm" | "md" | "lg" | "xl";
 * color: "primary" | "base" | "success" | "warning" | "danger" | "info";
 * inline: boolean;
 * }}
 *
 */

const Radio = ({
  value = "",
  onChange = () => {},
  options = [],
  size = "md",
  color = "primary",
  inline = true,
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

  const radioSize =
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
    <RadioGroup
      className={`${inline ? "flex flex-wrap gap-x-3 gap-y-2" : ""}`}
      value={value}
      onChange={onChange}
    >
      {options.map((option, optionIdx) => (
        <RadioGroup.Option key={optionIdx} value={option.value}>
          {({ checked }) => (
            <div className="flex items-center gap-x-1">
              <ButtonRipple
                type="button"
                color={`${checkboxColor}50`}
                className="p-2 rounded-full transition-[background] hover:bg-neutral-200 dark:hover:bg-base-400"
              >
                <div
                  style={{
                    width: radioSize,
                    height: radioSize,
                    backgroundColor: checked ? "white" : "",
                    border: checked
                      ? `4px solid ${checkboxColor}`
                      : "1px solid #6A6F70",
                  }}
                  className="rounded-full flex items-center justify-center"
                ></div>
              </ButtonRipple>
              <div
                className="cursor-pointer"
                style={{
                  fontSize: text,
                }}
              >
                {option.label}
              </div>
            </div>
          )}
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  );
};

Radio.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.object),
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
  inline: PropTypes.bool,
};

export default Radio;
