import { ThemeContext } from "@/context/ThemeContext";
import { Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import { useContext, useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { ButtonRipple } from "@/components";

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
	children
}) => {
	const { colorMode, themeSkin } = useContext(ThemeContext);
	const [animateWiggle, setAnimateWiggle] = useState(false);

	const contentRef = useRef();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 dark:bg-opacity-75">
      <div
        ref={modalRef}
        className="bg-white border-2 border-black rounded-lg pb-6 mx-2 w-full max-w-[600px] max-h-[600px] overflow-y-auto hidden-scroll dark:bg-gray-900 dark:text-white"
      >
        <div className="flex bg-gray-100 px-6 py-4 rounded-t-lg justify-between items-center mb-4 dark:bg-gray-800 dark:text-white">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <FaTimes />
          </button>
        </div>
        <div className="relative px-6">
          {children}
        </div>
      </div>
    </div>
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
