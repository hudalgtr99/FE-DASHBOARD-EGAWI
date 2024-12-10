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

<<<<<<< HEAD
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
			className="fixed inset-0 z-50 p-5 flex flex-col items-center justify-center overflow-hidden"
		>
			{/* Backdrop */}
			<Transition.Child
				as="div"
				enter="transition-opacity duration-300 ease-in-out"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-300 ease-in-out"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
				className="w-full h-full absolute bg-black/50"
				onClick={onBackDropClick}
			/>

			{/* Content */}
			<Transition.Child
				as="div"
				ref={contentRef}
				enter="transition-opacity duration-300 ease-out transform"
				enterFrom="opacity-0 scale-95"
				enterTo="opacity-100 scale-100"
				leave="transition-opacity duration-300 ease-in transform"
				leaveFrom="opacity-100 scale-100"
				leaveTo="opacity-0 scale-95"
				className={`transition-all duration-300 rounded`}
				style={{
					maxWidth: modalWidth,
					width: width === "auto" ? "auto" : "100%",
					height: modalHeight,
				}}
			>
				{/* Button Close */}
				{btnClose && (
					<div className="absolute -top-2 -right-2 hover:-top-1.5 transition-[top,right] duration-100">
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
=======
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
>>>>>>> eada576d240605ae594c340d36868ed04828c3d8
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
