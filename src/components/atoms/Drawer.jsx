import { ThemeContext } from "@/context/ThemeContext";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useWindowSize } from "@/hooks/useWindowSize";
import PropTypes from "prop-types";
import { useContext, useRef } from "react";
import { TbX } from "react-icons/tb";
import { ButtonRipple } from "@/components";

/**
 *
 * @param {{
 * title: string;
 * description: string;
 * width: string;
 * open: boolean;
 * setOpen: React.Dispatch<React.SetStateAction<boolean>>;
 * dismiss: boolean;
 * variant: "shadow" | "bordered";
 * children: React.ReactNode;
 *  }}
 *
 */

const Drawer = ({
  title = "",
  description = "",
  width = "380px",
  open = false,
  dismiss = true,
  variant = "default",
  setOpen,
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
    shadow: "shadow-lg bg-white dark:bg-base-600",
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
      <div className="sticky top-0 px-4 py-6 border-b border-neutral-200 dark:border-base-500 flex items-center justify-between">
        <div>
          <div className="leading-none font-bold uppercase">{title}</div>
          <div className="text-xs text-base-300 leading-none">
            {description}
          </div>
        </div>
        {/* <ButtonRipple
          color={colorMode === "light" ? "#00000030" : "#ffffff30"}
          className="p-2 rounded-full transition-[background] hover:bg-neutral-200 dark:hover:bg-base-400"
          onClick={() => {
            console.log("Drawer before closing:", open); // Log nilai 'open' sebelum setOpen dipanggil
            setOpen(!open);
            console.log("Drawer after closing:", open); // Log nilai 'open' setelah setOpen dipanggil
          }}
        >
          <TbX />
        </ButtonRipple> */}
      </div>
      <div
        style={{
          height: `calc(100vh - 64px)`,
        }}
        className="overflow-y-auto custom-scroll"
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
  variant: PropTypes.oneOf(["shadow", "bordered", "default"]),
  children: PropTypes.node,
};
export default Drawer;
