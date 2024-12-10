import { ThemeContext } from "@/context/ThemeContext";
import { useWindowSize } from "@/hooks/useWindowSize";
import PerfectScrollbar from "perfect-scrollbar";
import { useContext, useEffect, useRef, useState } from "react";
import { LiaCircle, LiaDotCircle } from "react-icons/lia";
import { TbX } from "react-icons/tb";
import { ButtonRipple } from "@/components";
import Menu from "./Menu";

const Sidebar = ({ sideOpen, setSideOpen }) => {
  const { width } = useWindowSize();
  const { themeColor, colorMode, themeSkin, themeBg } =
    useContext(ThemeContext);
  const [openHover, setOpenHover] = useState(false);
  const scrollbarContainer = useRef();
  const [scrolled, setScrolled] = useState(false);

  // Initialize PerfectScrollbar
  useEffect(() => {
    const ps = new PerfectScrollbar(scrollbarContainer.current, {
      wheelPropagation: true,
      useBothWheelAxes: true,
    });

    scrollbarContainer.current.addEventListener("ps-scroll-y", () => {
      if (ps.scrollbarYTop > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    });

    return () => {
      ps.destroy();
    };
  }, []);

  useEffect(() => {
    if (width && width < 1024) {
      setSideOpen(false);
    }
  }, [width]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Sidebar */}
      <aside
        onMouseEnter={() => width > 1024 && setOpenHover(true)}
        onMouseLeave={() => setOpenHover(false)}
        className={`fixed lg:left-0 z-50 h-full flex flex-col bg-white dark:bg-base-600 transition-[width,left] duration-500 tracking-wide ${
          sideOpen || openHover ? "w-64 -left-0" : "w-20 -left-96"
        } ${themeSkin === "default" ? "shadow-lg" : themeSkin}`}
      >
        {/* Background */}
        {themeBg !== "none" && (
          <img
            src={`/images/sidebar/${themeBg}`}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-10 -z-10 pointer-events-none "
            alt="bg-sidebar"
          />
        )}

        {/* Logo */}
        <div className="flex justify-between items-center w-full h-16 px-3 mx-auto">
          <div className="flex gap-2 items-center px-[8px]">
            <img src="/images/icons/egawi.png" alt="" className="w-10" />
            <div
              style={{ color: themeColor }}
              className={`font-bold transition-opacity duration-[1000ms] whitespace-nowrap ${
                sideOpen || openHover ? "opacity-100" : "opacity-0"
              } ${sideOpen || openHover ? "visible" : "invisible"}`}
            >
              E-Gawi
            </div>
          </div>
          <div className=" px-[8px]">
            <button
              className={`text-xl hidden lg:block ${
                !sideOpen && !openHover ? "lg:hidden" : ""
              }`}
            >
              {sideOpen ? (
                <LiaDotCircle onClick={() => setSideOpen(false)} />
              ) : (
                <LiaCircle onClick={() => setSideOpen(true)} />
              )}
            </button>
          </div>
          <ButtonRipple
            color={colorMode === "light" ? "#00000030" : "#ffffff30"}
            className="block lg:hidden p-2 rounded-full transition-[background] hover:bg-neutral-200 dark:hover:bg-base-400"
            onClick={() => setSideOpen(false)}
          >
            <TbX />
          </ButtonRipple>
        </div>

        {/* shadow */}
        {themeBg === "none" && (
          <div
            className={`bg-gradient-to-b from-white to-transparent dark:bg-gradient-to-b dark:from-base-600 dark:to-transparent h-10 w-full absolute top-16 z-10 transition-opacity duration-200 pointer-events-none ${
              scrolled ? "opacity-100" : "opacity-0"
            }`}
          ></div>
        )}

        {/* Menu */}
        <div
          ref={scrollbarContainer}
          className="relative flex-1 overflow-hidden group/rail"
        >
          <Menu sideOpen={sideOpen} openHover={openHover} />
        </div>
      </aside>

      {/* Backdrop */}
      <div
        onClick={() => setSideOpen(false)}
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-500 ${
          sideOpen
            ? "opacity-100 pointer-events-auto lg:opacity-0 lg:pointer-events-none"
            : "opacity-0 pointer-events-none"
        }`}
      ></div>
    </>
  );
};

export default Sidebar;
