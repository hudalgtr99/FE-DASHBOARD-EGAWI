import { menu } from "@/constants/menu";
import { ThemeContext } from "@/context/ThemeContext";
import { useWindowSize } from "@/hooks/useWindowSize";
import { Disclosure, Transition } from "@headlessui/react";
import { useContext, useEffect, useState } from "react";
import { RxBorderDashed } from "react-icons/rx";
import { TbChevronRight, TbCircle } from "react-icons/tb";
import { NavLink, useLocation } from "react-router-dom";

const Menu = ({ sideOpen, openHover }) => {
  const [initNav, setInitNav] = useState([]);
  const [nav, setNav] = useState([]);
  const { pathname } = useLocation();
  const { themeColor } = useContext(ThemeContext);
  const { width } = useWindowSize();

  const closeAllNav = () => {
    setNav(initNav);
  };

  const navOpen = (data) => {
    setNav({ ...initNav, [data]: !nav[data] });
  };

  const navClose = (data) => {
    if (data) {
      setNav({ ...initNav, [data]: true });
    } else {
      setNav(initNav);
    }
  };

  useEffect(() => {
    if (width && width < 1024) {
      closeAllNav();
    }
  }, [width]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const initNav = menu
      .filter((item) => item.sub?.length > 0)
      .reduce((acc, item) => {
        acc[item.name] = false;
        return acc;
      }, {});

    setNav(initNav);
    setInitNav(initNav);
  }, []);

  useEffect(() => {
    if (!openHover) {
      if (!sideOpen) setNav(initNav);
    }
  }, [openHover]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!sideOpen) {
      if (openHover) {
        const menuActive = pathname.split("/")[2];
        setNav({ ...initNav, [menuActive]: true });
      }
    }
  }, [openHover]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="my-3">
      {menu.map((item, itemIdx) => {
        if (item.label) {
          return (
            <div
              key={itemIdx}
              className={`px-3 mt-6 mb-3 m-3 text-xs text-base-200 whitespace-nowrap h-3 ${
                sideOpen || openHover ? "" : "flex items-center justify-center"
              }`}
            >
              {sideOpen || openHover ? item.label : <RxBorderDashed />}
            </div>
          );
        }

        if (item?.sub?.length === 0) {
          return (
            <NavLink onClick={navClose} key={itemIdx} to={item.menuLink}>
              {({ isActive }) => (
                <div className="mb-1 px-3 w-full text-sm">
                  <div
                    style={{
                      background: isActive
                        ? `linear-gradient(90deg, ${themeColor} 0%, ${themeColor}90 100%)`
                        : "",
                      boxShadow: isActive
                        ? `0px 0px 10px 0px ${themeColor}60`
                        : "",
                    }}
                    className={`flex items-center justify-between w-full h-10 px-[18px] py-2 rounded-md overflow-hidden ${
                      isActive
                        ? "text-white"
                        : "hover:bg-base-50 dark:hover:bg-base-500"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-xl w-5">{isActive ? item.iconActive || item.icon : item.icon}</span>
                      <span
                        className={`${
                          sideOpen || openHover ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {item.title}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </NavLink>
          );
        }

        if (item?.sub?.length > 0) {
          return (
            <Disclosure key={itemIdx}>
              <Disclosure.Button
                onClick={() => navOpen(item.name)}
                className="w-full px-3 mb-1 text-sm"
              >
                <div
                  className={`flex items-center justify-between w-full h-10 px-[18px] py-2 rounded-md overflow-hidden ${
                    nav[item.name]
                      ? "bg-base-50 dark:bg-base-500"
                      : "hover:bg-base-50 dark:hover:bg-base-500"
                  } ${
                    pathname.split("/")[2] === item.name
                      ? "bg-base-50 dark:bg-base-500"
                      : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xl w-5">{item.icon}</span>
                    <span
                      className={`tracking-wide ${
                        sideOpen || openHover ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {item.title}
                    </span>
                  </span>

                  <div
                    className={`flex items-center gap-2 transition-[transform,opacity] ${
                      nav[item.name] ? "rotate-90" : ""
                    } ${sideOpen || openHover ? "opacity-100" : "opacity-0"}`}
                  >
                    <TbChevronRight />
                  </div>
                </div>
              </Disclosure.Button>
              <Transition
                show={nav[item.name]}
                className="overflow-hidden"
                enter="transition-[max-height] duration-300 ease-in"
                enterFrom="max-h-0"
                enterTo="max-h-[180vh]"
                leave="transition-[max-height] duration-300 ease-out"
                leaveFrom="max-h-[180vh]"
                leaveTo="max-h-0"
              >
                <Disclosure.Panel as="div" className="pb-2">
                  {item?.sub?.map((subItem, subItemIdx) => (
                    <div key={subItemIdx} className="mb-1 px-3 w-full text-sm">
                      <NavLink
                        onClick={() =>
                          navClose(
                            item.name,
                            localStorage.removeItem("editUserData")
                          )
                        }
                        to={subItem.menuLink}
                      >
                        {({ isActive }) => (
                          <div
                            style={{
                              background: isActive
                                ? `linear-gradient(90deg, ${themeColor} 0%, ${themeColor}90 100%)`
                                : "",
                              boxShadow: isActive
                                ? `0px 0px 10px 0px ${themeColor}60`
                                : "",
                            }}
                            className={`flex items-center justify-between w-full h-10 px-[18px] py-2 rounded-md overflow-hidden ${
                              isActive
                                ? "text-white"
                                : "hover:bg-base-50 dark:hover:bg-base-500"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="text-[10px] w-[18px] ml-1">
                                <TbCircle />
                              </span>
                              <span
                                className={`${
                                  sideOpen || openHover
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              >
                                {subItem.title}
                              </span>
                            </span>
                          </div>
                        )}
                      </NavLink>
                    </div>
                  ))}
                </Disclosure.Panel>
              </Transition>
            </Disclosure>
          );
        }

        return null;
      })}
    </div>
  );
};

export default Menu;
