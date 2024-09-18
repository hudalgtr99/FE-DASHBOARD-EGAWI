import React, { Fragment, useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useWindowSize } from "@/hooks/useWindowSize";
import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from "@headlessui/react";
import { BiChevronRight } from "react-icons/bi";
import { menu } from "@/constants/menu";
import { BsChevronDoubleLeft } from "react-icons/bs";
import { TiMinus } from "react-icons/ti";

const Sidebar = ({ open, setOpen }) => {
  const initNav = {
    perusahaan: false,
    masterdata: false,
    kepegawaian: false,
    asesmen: false,
    kompetensi: false,
    kemitraan: false,
    dokumentasi: false,
    api: false,
  };

  const { width } = useWindowSize();
  const [navopen, setNavopen] = useState(initNav);

  const navOpen = (data) => {
    setNavopen({ ...initNav, [data]: !navopen[data] });
  };

  const ref = useRef();
  useOnClickOutside(ref, () => setNavopen(initNav));

  useEffect(() => {
    if (width < 1024) {
      setOpen(false);
    }
  }, [width, setOpen]);

  useEffect(() => {
    if (width > 1024) {
      setOpen(true);
    }
  }, [width, setOpen]);

  return (
    <Fragment>
      {/* Overlay for mobile view */}
      <div
        onClick={() => setOpen(!open)}
        className={`fixed w-screen h-screen transition-opacity duration-150 ${open ? "bg-black bg-opacity-50 min-[1000px]:hidden z-10" : "opacity-0 pointer-events-none"}`}
      ></div>

      {/* Sidebar */}
      <div
        className={`${open ? "translate-x-0 w-[260px]" : "w-0"} fixed lg:relative h-screen flex flex-col bg-gradient-to-b from-orange-400 via-pink-400 to-purple-400 dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 z-40 shadow-xl transition-all duration-150 ease-in-out`}
      >
        {/* Logo */}
        <div className={`${open ? "flex items-center justify-between w-full py-2 px-3" : "hidden"}`}>
          <div className="flex items-center gap-2">
            <img className="w-12" src="/assets/Logo.png" alt="logo" />
            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline text-white dark:text-white">
              QUEEN
            </span>
          </div>
          <div onClick={() => setOpen(!open)} className="cursor-pointer text-white hover:bg-white hover:text-gray-900 dark:text-white dark:hover:bg-gray-600 rounded-full p-2">
            <BsChevronDoubleLeft />
          </div>
        </div>

        {/* Menu */}
        <div className={`px-2 pt-1 pb-5 text-sm overflow-y-auto max-h-[80vh] hidden-scroll ${open ? "" : "hidden"}`}>
          {menu.map((menu, menuIdx) => {
            // If there are no submenu items, skip rendering the Disclosure
            if (menu.subMenu.length === 0) {
              return (
                <NavLink key={menuIdx} to={menu.menuLink}>
                  {({ isActive }) => (
                    <div
                      className={`${isActive ? "bg-white text-gray-900 dark:bg-gray-600 dark:text-white" : "text-white"} px-3 py-2 rounded-lg mt-2 transition hover:bg-white dark:hover:bg-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white`}
                    >
                      <span className="flex items-center">
                        <span className="text-lg flex justify-center items-center">
                          {menu.menuIcon}
                        </span>
                        <span className="ml-2 font-medium">{menu.menuName}</span>
                      </span>
                    </div>
                  )}
                </NavLink>
              );
            }

            // If there are submenu items, render Disclosure
            return (
              <Disclosure key={menuIdx} as={"div"} className="my-1">
                <>
                  <DisclosureButton
                    onClick={() => navOpen(menu.menuLink)}
                    className={`${navopen[menu.menuLink] ? "bg-white text-gray-900 dark:bg-gray-600 dark:text-white" : "text-white"} flex px-3 py-2 rounded-lg justify-between items-center w-full transition-all duration-150 hover:bg-white dark:hover:bg-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white`}
                  >
                    <span className="flex">
                      <span className="text-lg flex justify-center items-center">
                        {menu.menuIcon}
                      </span>
                      <span className="ml-2 font-medium">{menu.menuName}</span>
                    </span>
                    <BiChevronRight
                      className={`${navopen[menu.menuLink] ? "rotate-90" : ""} transition-all`}
                    />
                  </DisclosureButton>
                  <Transition
                    show={navopen[menu.menuLink]}
                    className="overflow-hidden"
                    enter="transition-[max-height] duration-150 ease-in"
                    enterFrom="max-h-0"
                    enterTo="max-h-screen"
                    leave="transition-[max-height] duration-150 ease-out"
                    leaveFrom="max-h-screen"
                    leaveTo="max-h-0"
                  >
                    <DisclosurePanel>
                      {menu.subMenu.map((subMenu, subMenuIdx) => (
                        <NavLink key={subMenuIdx} to={subMenu.subMenuLink}>
                          {({ isActive }) => (
                            <div
                              className={`${isActive ? "text-gray-900 bg-white dark:bg-gray-600 dark:text-white" : "text-white"} px-3 py-2 rounded-lg mt-2 ml-[26px] transition hover:bg-white dark:hover:bg-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 font-medium`}
                            >
                              <TiMinus /> {subMenu.subMenuName}
                            </div>
                          )}
                        </NavLink>
                      ))}
                    </DisclosurePanel>
                  </Transition>
                </>
              </Disclosure>
            );
          })}
        </div>

        {/* Copyright */}
        {open && (
          <div className="text-[8px] text-center flex w-[260px] mt-auto mb-2 items-center font-medium text-white dark:text-gray-400 justify-center">
            Copyright &copy; PT. Queen Network Nusantara
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Sidebar;
