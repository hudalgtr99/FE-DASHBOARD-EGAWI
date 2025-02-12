/* eslint-disable react-refresh/only-export-components */
import { themeColors } from "@/constants/theme";
import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
	// SideOpen
	const sideopen = localStorage.getItem("side-open");
	const [sideOpen, setSideOpen] = useState(sideopen || true);
	useEffect(() => {
		localStorage.setItem("side-open", sideOpen.toString());
	}, [sideOpen]);

	// Theme Color
	const themecolor = localStorage.getItem("theme-color");
	const [themeColor, setThemeColor] = useState(themecolor || themeColors[0]);
	useEffect(() => {
		localStorage.setItem("theme-color", themeColor.toString());
	}, [themeColor]);

	// Theme Background
	const themebg = localStorage.getItem("theme-bg");
	const [themeBg, setThemeBg] = useState(themebg || "none");
	useEffect(() => {
		localStorage.setItem("theme-bg", themeBg.toString());
	}, [themeBg]);

	// Theme Skin
	const themeskin = localStorage.getItem("theme-skin");
	const [themeSkin, setThemeSkin] = useState(themeskin || "default");
	useEffect(() => {
		localStorage.setItem("theme-skin", themeSkin.toString());
	}, [themeSkin]);

	// Color Mode
	const colormode = localStorage.getItem("theme-color-mode");
	const [colorMode, setColorMode] = useState(colormode || "light");
	useEffect(() => {
		const className = "dark";
		const bodyClassList = document.body.classList;

		colorMode === "dark" ? bodyClassList.add(className) : bodyClassList.remove(className);

		localStorage.setItem("theme-color-mode", colorMode.toString());
	}, [colorMode]);

	// Navbar Type
	const navbartype = localStorage.getItem("theme-navbar-type");
	const [navbarType, setNavbarType] = useState(navbartype || "sticky");
	useEffect(() => {
		localStorage.setItem("theme-navbar-type", navbarType.toString());
	}, [navbarType]);

	// Footer Type
	const footertype = localStorage.getItem("theme-footer-type");
	const [footerType, setFooterType] = useState(footertype || "sticky");
	useEffect(() => {
		localStorage.setItem("theme-footer-type", footerType.toString());
	}, [footerType]);

	// Content Type
	const contenttype = localStorage.getItem("theme-content-type");
	const [contentType, setContentType] = useState(contenttype || "compact");
	useEffect(() => {
		localStorage.setItem("theme-content-type", contentType.toString());
	}, [contentType]);

	return (
		<ThemeContext.Provider
			value={{
				sideOpen,
				setSideOpen,
				themeColor,
				setThemeColor,
				themeBg,
				setThemeBg,
				themeSkin,
				setThemeSkin,
				colorMode,
				setColorMode,
				navbarType,
				setNavbarType,
				footerType,
				setFooterType,
				contentType,
				setContentType,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
};
