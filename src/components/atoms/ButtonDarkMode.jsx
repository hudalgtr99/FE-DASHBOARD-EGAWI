import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";
import { TbMoon, TbSunHigh } from "react-icons/tb";
import ButtonRipple from "./ButtonRipple";

const ButtonDarkMode = () => {
	const { colorMode, setColorMode } = useContext(ThemeContext);
	return (
		<ButtonRipple
			color={colorMode === "light" ? "#00000030" : "#ffffff30"}
			className="h-10 w-10 hover:bg-neutral-200 dark:hover:bg-base-500 rounded-full relative overflow-hidden"
			onClick={() => setColorMode(colorMode === "light" ? "dark" : "light")}
		>
			<TbMoon
				className={`text-2xl transition-[top] text-base-300 dark:text-base-200 duration-500 absolute -mt-3 top-1/2 -ml-3 left-1/2 ${
					colorMode === "light" ? "top-16" : ""
				}`}
			/>
			<TbSunHigh
				className={`text-2xl transition-[top] text-base-300 dark:text-base-200 duration-500 absolute -mt-3 top-1/2 -ml-3 left-1/2 ${
					colorMode === "dark" ? "top-16" : ""
				}`}
			/>
		</ButtonRipple>
	);
};

export default ButtonDarkMode;
