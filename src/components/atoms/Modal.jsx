import { ThemeContext } from "@/context/ThemeContext";
import { Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import { useContext, useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { ButtonRipple } from "..";

/**
 *
 * @param {{
 * show: boolean;
 * setShow: React.Dispatch<React.SetStateAction<boolean>>;
 * width: "xs" | "sm" | "md" | "lg" | "xl" | "full" | "auto";
 * height: "auto" | "full";
 * btnClose: boolean;
 * persistent: boolean;
 * children: React.ReactNode;
 * }}
 *
 */

const Modal = ({
  show = false,
  setShow = () => {},
  width = "auto",
  height = "auto",
  btnClose = true,
  persistent = false,
  children,
}) => {
  const { colorMode, themeSkin } = useContext(ThemeContext);
  const [animateWiggle, setAnimateWiggle] = useState(false);

  const contentRef = useRef();

  const onBackDropClick = () => {
    if (!persistent) {
      setShow(false);
    } else {
      setAnimateWiggle(true);
    }
  };

  useEffect(() => {
    if (animateWiggle) {
      const content = contentRef.current;
      content.classList.add("animate-wiggle");
      setTimeout(() => {
        content.classList.remove("animate-wiggle");
        setAnimateWiggle(false);
      }, 200);

      return () => {
        content.classList.remove("animate-wiggle");
        setAnimateWiggle(false);
      };
    }
  }, [animateWiggle]);

  const modalWidth =
    {
      xs: "320px",
      sm: "480px",
      md: "640px",
      lg: "800px",
      xl: "960px",
      full: "100%",
    }[width] || width;

  const modalHeight =
    {
      full: "100%",
    }[height] || height;

  return (
    <Transition
      show={show}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Backdrop */}
      <Transition.Child
        as="div"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="w-full h-full bg-black/50 transition-opacity duration-300"
        onClick={onBackDropClick}
      />

      {/* Content */}
      <Transition.Child
        as="div"
        ref={contentRef}
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
        className={`transition-[opacity,transform] duration-300 rounded z-[1000] absolute px-5`}
        style={{
          maxWidth: modalWidth,
          width: width === "auto" ? "auto" : "100%",
          height: modalHeight,
        }}
      >
        {/* Button Close */}
        {btnClose && (
          <div className="absolute -top-2 -right-2 hover:-top-1.5 transition-[top,right] duration-100 px-5">
            <ButtonRipple
              color={colorMode === "light" ? "#00000030" : "#ffffff30"}
              onClick={() => setShow(false)}
              className={`bg-base-50 dark:bg-base-600 w-8 h-8 rounded flex items-center justify-center ${
                themeSkin === "default" ? "shadow-lg" : themeSkin
              }`}
            >
              <FiX />
            </ButtonRipple>
          </div>
        )}
        <div
          className={`max-h-[90vh] h-full w-full bg-white dark:bg-base-600 rounded overflow-y-auto custom-scroll ${
            themeSkin === "default" ? "shadow-lg" : themeSkin
          }`}
        >
          {children}
        </div>
      </Transition.Child>
    </Transition>
  );
};

Modal.propTypes = {
  show: PropTypes.bool,
  setShow: PropTypes.func,
  width: PropTypes.oneOfType([
    PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", "full", "auto"]),
    PropTypes.string,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.oneOf(["auto", "full"]),
    PropTypes.string,
  ]),
  btnClose: PropTypes.bool,
  persistent: PropTypes.bool,
  children: PropTypes.node,
};

export default Modal;
