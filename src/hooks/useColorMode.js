import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

const useColorMode = () => {
	const [colorMode, setColorMode] = useLocalStorage("color-mode", "light");

	useEffect(() => {
		const className = "dark";
		const bodyClassList = document.body.classList;

		colorMode === "dark"
			? bodyClassList.add(className)
			: bodyClassList.remove(className);
	}, [colorMode]);

	return [colorMode, setColorMode];
};

export default useColorMode;
