import React, { Fragment, useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useWindowSize } from "@/hooks/useWindowSize";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { BiChevronRight } from "react-icons/bi";
import { menu } from "@/constants/menu";

const Sidebar = ({ open, setOpen }) => {
  const initNav = {
    perusahaan: false,
    masterdata: false,
    kepegawaian: false,
    asesmen: false,
    kompetensi: false,
    kemitraan: false,
    dokumentasi: false,
  };

  const { width } = useWindowSize();
  const [navopen, setNavopen] = useState(initNav);

  const navOpen = (data) => {
    setNavopen({ ...initNav, [data]: !navopen[data] });
  };

  const ref = useRef();
  useOnClickOutside(ref, () => navOpen(initNav));

  useEffect(() => {
    if (width && width < 1024) {
      setOpen(false);
    }
  }, [width]);

  useEffect(() => {
    if (width && width > 1024) {
      setOpen(true);
    }
  }, [width]);

  return (
    <Fragment>
      <div
        onClick={() => setOpen(!open)}
        className={`fixed w-screen h-screen lg:hidden ${open ? "" : "hidden"}`}
      ></div>

      {/* Sidebar */}
      <div
        className={`${open ? "translate-x-0 w-[260px]" : "w-0"
          } z-10 fixed lg:relative h-screen flex flex-col bg-white shadow-lg shadow-slate-400 text-black transition-all duration-300 ease-in-out rounded-none`}
      >
        {/* Logo */}
        <div className={`${open ? "w-full flex justify-center py-2" : "hidden"}`}>
          <img className={`${navopen ? "w-32" : "hidden"}`} src="/assets/Logo.svg" alt="logo" />
        </div>

        {/* Menu */}
        <div className={`px-2 pt-1 pb-5 text-sm overflow-y-auto max-h-[80vh] hidden-scroll ${open ? "" : "hidden"}`}>
          {menu.map((menu, menuIdx) => {
            if (menu.subMenu.length === 0) {
              return (
                <NavLink
                  key={menuIdx}
                  to={menu.menuLink}
                  end={menuIdx === 0 ? true : false}
                >
                  {({ isActive }) => (
                    <div
                      className={`${open
                        ? "flex px-3 py-2 rounded-lg"
                        : "hidden"
                        } ${isActive
                          ? "bg-[#eceff4] text-black"
                          : "shadow-none"
                        } my-1 justify-between items-center w-full transition-all duration-150 hover:bg-[#eceff4] hover:text-black focus:outline-none`}
                    >
                      <span className={`${open ? "flex" : "block"}`}>
                        <span
                          className={` ${open ? "text-lg" : "text-2xl"
                            } flex justify-center items-center`}
                        >
                          {menu.menuIcon}
                        </span>
                        <span className={`${open ? "ml-2" : "hidden"}`}>
                          {menu.menuName}
                        </span>
                      </span>
                    </div>
                  )}
                </NavLink>
              );
            }

            if (menu.subMenu.length >= 0 && open) {
              return (
                <Disclosure key={menuIdx} as={"div"} className="my-1">
                  <>
                    <DisclosureButton
                      onClick={() => navOpen(menu.menuLink)}
                      className={`${navopen[menu.menuLink]
                        ? "bg-[#eceff4] text-black shadow-md"
                        : ""
                        } ${open
                          ? "flex px-3 py-2 rounded-lg"
                          : "hidden"
                        }
                      }  justify-between items-center w-full transition-all duration-150 hover:bg-[#eceff4] hover:text-black`}
                    >
                      <span className={`${open ? "flex" : "block"}`}>
                        <span
                          className={` ${open ? "text-lg" : "text-2xl"
                            } flex justify-center items-center`}
                        >
                          {menu.menuIcon}
                        </span>
                        <span className={`${open ? "ml-2" : "hidden"}`}>
                          {menu.menuName}
                        </span>
                      </span>
                      <BiChevronRight
                        className={`${open ? "" : "hidden"} ${navopen[menu.menuLink] ? "rotate-90" : ""} transition-all`}
                      />
                    </DisclosureButton>
                    <Transition
                      show={navopen[menu.menuLink]}
                      className="overflow-hidden"
                      enter="transition-[max-height] duration-300 ease-in"
                      enterFrom="max-h-0"
                      enterTo="max-h-screen"
                      leave="transition-[max-height] duration-300 ease-out"
                      leaveFrom="max-h-screen"
                      leaveTo="max-h-0"
                    >
                      <DisclosurePanel>
                        {menu.subMenu.map((subMenu, subMenuIdx) => (
                          <NavLink key={subMenuIdx} to={subMenu.subMenuLink}>
                            {({ isActive }) => (
                              <div
                                className={`${isActive
                                  ? "bg-[#eceff4] text-black"
                                  : ""
                                  } px-3 py-2 rounded-lg mt-2 ml-[26px] transition hover:bg-[#eceff4] hover:text-black`}
                              >
                                {subMenu.subMenuName}
                              </div>
                            )}
                          </NavLink>
                        ))}
                      </DisclosurePanel>
                    </Transition>
                  </>
                </Disclosure>
              );
            }

            if (menu.subMenu.length >= 0 && !open) {
              return (
                <Popover key={menuIdx} as={"div"} className="my-1">
                  <PopoverButton
                    onClick={() => navOpen(menu.menuLink)}
                    className={`${navopen[menu.menuLink]
                      ? "bg-[#eceff4] text-black shadow-md"
                      : "hidden"
                      } ${open
                        ? "flex px-3 py-2 rounded-lg"
                        : "block p-2 rounded-full hover:shadow-xl"
                      }
                    }  justify-between items-center w-full transition-all duration-150 hover:bg-[#eceff4] hover:text-black`}
                  >
                    <span className={`${open ? "flex" : "block"}`}>
                      <span
                        className={` ${open ? "text-lg" : "text-2xl"
                          } flex justify-center items-center`}
                      >
                        {menu.menuIcon}
                      </span>
                      <span className={`${open ? "ml-2" : "hidden"}`}>
                        {menu.menuName}
                      </span>
                    </span>
                    <BiChevronRight
                      className={`${open ? "" : "hidden"} ${navopen[menu.menuLink] ? "rotate-90" : ""} transition-all`}
                    />
                  </PopoverButton>
                  <Transition
                    show={navopen[menu.menuLink]}
                    className="absolute left-16 hidden lg:block"
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <PopoverPanel
                      ref={ref}
                      className="bg-white w-36 p-1 rounded-lg shadow-md shadow-black gap-1 flex flex-col"
                    >
                      {menu.subMenu.map((subMenu, subMenuIdx) => (
                        <NavLink key={subMenuIdx} to={subMenu.subMenuLink}>
                          {({ isActive }) => (
                            <div
                              className={`${isActive
                                ? "bg-[#eceff4] text-black"
                                : "hover:bg-[#eceff4] hover:text-black"
                                } px-3 py-2 my-1 transition rounded-lg`}
                            >
                              {subMenu.subMenuName}
                            </div>
                          )}
                        </NavLink>
                      ))}
                    </PopoverPanel>
                  </Transition>
                </Popover>
              );
            }

            return <></>;
          })}
        </div>

        {/* Copyright */}
        {open && (
          <div className="text-[8px] text-center flex w-[260px] mt-auto mb-2 items-center justify-center">
            Copyright &copy; PT. Queen Network Nusantara
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Sidebar;
