import { ButtonRipple, Drawer, Popover, Radio } from "@/components";
import { themeBgs, themeColors } from "@/constants/theme";
import { ThemeContext } from "@/context/ThemeContext";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useContext, useEffect, useRef, useState } from "react";
import { ChromePicker } from "react-color";
import { TbArrowUp, TbCheck, TbPencil, TbPhotoOff, TbSettings } from "react-icons/tb";
import { Outlet } from "react-router-dom";
import BreadCrumb from "./BreadCrumb";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
	// const [sideOpen, setSideOpen] = useLocalStorage("side-open", true);
	const {
		sideOpen,
		colorMode,
		setColorMode,
		themeColor,
		setThemeColor,
		themeBg,
		setThemeBg,
		themeSkin,
		setThemeSkin,
		navbarType,
		setNavbarType,
		contentType,
		setContentType,
	} = useContext(ThemeContext);
	const themeConfigRef = useRef();
	const mainRef = useRef();

	const [themeConfig, setThemeConfig] = useState(false);

	const [toTop, setToTop] = useState(false);

	useOnClickOutside(themeConfigRef, () => setThemeConfig(false));

	useEffect(() => {
		if (mainRef.current) {
			const main = mainRef.current;
			main.addEventListener("scroll", () => {
				if (main.scrollTop > 20) {
					setToTop(true);
				} else {
					setToTop(false);
				}
			});

			return () => {
				main.removeEventListener("scroll", () => {});
			};
		}
	}, [mainRef]);

	return (
		<>
			{/* Main */}
			<main
				ref={mainRef}
				className={`w-full scroll-smooth text-base-300 dark:text-base-200 font-light h-screen overflow-y-auto custom-scroll ${
					themeSkin === "default" ? "bg-base-50 dark:bg-base-700" : "bg-white dark:bg-base-700"
				}`}
			>
				<Sidebar />
				<div
					className={`w-full transition-[padding] duration-500 ${
						contentType === "compact" ? "max-w-[1440px] mx-auto" : ""
					} ${sideOpen ? "lg:pl-64" : "lg:pl-20"}`}
				>
					<Header />
					<div className={` mx-6 mt-4 block lg:hidden`}>
						<div className="flex flex-row h-full items-center gap-x-2 font-semibold">
							<BreadCrumb />
						</div>
					</div>
					<section className="min-h-screen w-full p-6">
						<Outlet />
					</section>
					<Footer />
				</div>
			</main>

			{/* To Top Button */}
			<ButtonRipple
				style={{
					backgroundColor: themeColor,
				}}
				onClick={() => mainRef.current.scrollTo(0, 0)}
				className={`fixed text-xl text-white shadow-lg bottom-10 right-12 z-30 p-2 rounded-lg transition-opacity duration-300 ${
					toTop ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
				}`}
			>
				<TbArrowUp />
			</ButtonRipple>

			{/* Settings Button */}
			<ButtonRipple
				style={{
					backgroundColor: themeColor,
				}}
				onClick={() => setThemeConfig(true)}
				className={` fixed text-xl text-white shadow-lg bottom-10 z-30 p-2 rounded-l-lg transition-[right] duration-500 ${
					themeConfig ? "-right-10" : "right-0"
				}`}
			>
				<TbSettings />
			</ButtonRipple>

			{/* Settings Panel */}
			<Drawer
				width="366px"
				title="CUSTOMIZE THEME"
				description="Make your own theme"
				dismiss
				open={themeConfig}
				setOpen={setThemeConfig}
			>
				{/* Theme */}
				<div className="p-5 border-b border-neutral-200 dark:border-base-500">
					<div className="mb-2 font-semibold text-xs tracking-widest">THEME</div>
					{/* Primary Color */}
					<div className="mb-4">
						<div className="text-sm mb-1">Primary Color</div>
						<div className="flex flex-wrap gap-4">
							{themeColors.map((color, colorIdx) => (
								<ButtonRipple
									key={colorIdx}
									onClick={() => {
										setThemeColor(color);
									}}
									style={{
										backgroundColor: color,
										boxShadow: color === themeColor ? `0px 0px 10px 0px ${color}60` : "",
									}}
									className="w-10 h-10 rounded text-white flex items-center justify-center"
								>
									{color === themeColor && <TbCheck />}
								</ButtonRipple>
							))}
							<Popover
								placement="bottom-end"
								button={
									<ButtonRipple
										style={{
											backgroundColor: themeColor,
											boxShadow: `0px 0px 10px 0px ${themeColor}60`,
										}}
										className="w-10 h-10 rounded text-white flex items-center justify-center"
									>
										<TbPencil />
									</ButtonRipple>
								}
							>
								<ChromePicker
									className="!font-sans font-bold !bg-white dark:!bg-base-800"
									color={themeColor}
									onChange={(value) => setThemeColor(value.hex)}
									presetColors={themeColors}
								/>
							</Popover>
						</div>
					</div>

					{/* Background */}
					<div className="mb-4">
						<div className="text-sm mb-1">Background</div>
						<div className="flex flex-wrap gap-2">
							<ButtonRipple onClick={() => setThemeBg("none")}>
								<div className="h-12 w-12 shadow rounded overflow-hidden border dark:border-base-400 flex items-center justify-center text-xl">
									<TbPhotoOff />
								</div>
							</ButtonRipple>
							{themeBgs.map((bg, bgIdx) => (
								<ButtonRipple onClick={() => setThemeBg(bg)} key={bgIdx}>
									<div className="h-12 w-12 rounded overflow-hidden relative shadow">
										<img
											className="h-full w-full object-cover"
											src={`/images/sidebar/${bg}`}
											alt=""
										/>
										{bg === themeBg && (
											<div className="absolute bg-black/30 text-white inset-0 flex items-center justify-center">
												<TbCheck />
											</div>
										)}
									</div>
								</ButtonRipple>
							))}
						</div>
					</div>

					{/* Skins */}
					<div className="mb-4">
						<div className="text-sm mb-1">Skins</div>
						<div>
							<Radio
								color={themeColor}
								value={themeSkin}
								onChange={setThemeSkin}
								options={[
									{
										label: "Default",
										value: "default",
									},
									{
										label: "Bordered",
										value: "bordered",
									},
								]}
							/>
						</div>
					</div>

					{/* Theme */}
					<div>
						<div className="text-sm mb-1">Theme</div>
						<div>
							<Radio
								color={themeColor}
								value={colorMode}
								onChange={setColorMode}
								options={[
									{
										label: "Light",
										value: "light",
									},
									{
										label: "Dark",
										value: "dark",
									},
								]}
							/>
						</div>
					</div>
				</div>

				{/* Layout */}
				<div className="p-5 border-b border-neutral-200 dark:border-base-500">
					<div className="mb-2 font-semibold text-xs tracking-widest">LAYOUT</div>

					{/* Navbar Type */}
					<div className="mb-4">
						<div className="text-sm mb-1">Navbar Type</div>
						<div>
							<Radio
								color={themeColor}
								value={navbarType}
								onChange={setNavbarType}
								options={[
									{
										label: "Sticky",
										value: "sticky",
									},
									{
										label: "Static",
										value: "static",
									},
									{
										label: "Hidden",
										value: "hidden",
									},
								]}
							/>
						</div>
					</div>

					{/* Content Type */}
					<div>
						<div className="text-sm mb-1">Content Type</div>
						<div>
							<Radio
								color={themeColor}
								value={contentType}
								onChange={setContentType}
								options={[
									{
										label: "Compact",
										value: "compact",
									},
									{
										label: "Wide",
										value: "wide",
									},
								]}
							/>
						</div>
					</div>
				</div>
			</Drawer>
		</>
	);
};

export default Layout;
