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
        className={`${open ? "translate-x-0 w-[260px]" : "w-0"} fixed lg:relative h-screen flex flex-col bg-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 z-40 shadow-lg text-white transition-all duration-150 ease-in-out`}
      >
        {/* Logo */}
        <div className={`${open ? "flex items-center justify-between w-full py-2 px-3" : "hidden"}`}>
          <div className="flex items-center gap-2">
            <img className="w-12" src="/assets/Logo.png" alt="logo" />
            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline text-black dark:text-white">
              QUEEN
            </span>
          </div>
          <div onClick={() => setOpen(!open)} className="cursor-pointer text-black dark:hover:text-white rounded-full p-2">
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
                      className={`${isActive ? "bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 text-black dark:bg-gray-600 dark:text-white" : ""} px-3 py-2 rounded-lg mt-2 transition hover:bg-gradient-to-r text-black hover:from-orange-100 hover:via-pink-100 hover:to-purple-100 hover:text-black dark:hover:bg-gray-600 dark:hover:text-white`}
                    >
                      <span className="flex items-center">
                        <span className="text-lg flex justify-center items-center">
                          {menu.menuIcon}
                        </span>
                        <span className="ml-2">{menu.menuName}</span>
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
                    className={`${navopen[menu.menuLink] ? "bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 text-black shadow-md dark:bg-gray-600 dark:text-white" : ""} flex px-3 py-2 rounded-lg justify-between items-center w-full transition-all duration-150 hover:bg-white hover:bg-gradient-to-r text-black hover:from-orange-100 hover:via-pink-100 hover:to-purple-100 hover:text-black dark:hover:bg-gray-600 dark:hover:text-white`}
                  >
                    <span className="flex">
                      <span className="text-lg flex justify-center items-center">
                        {menu.menuIcon}
                      </span>
                      <span className="ml-2">{menu.menuName}</span>
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
                              className={`${isActive ? "bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 text-black dark:bg-gray-600 dark:text-white" : ""} px-3 py-2 rounded-lg mt-2 ml-[26px] transition hover:bg-white hover:text-black dark:hover:bg-gray-600 dark:hover:text-white flex items-center gap-1 hover:bg-gradient-to-r text-black hover:from-orange-100 hover:via-pink-100 hover:to-purple-100 `}
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
          <div className="text-[8px] text-center flex w-[260px] mt-auto mb-2 items-center text-black justify-center dark:text-gray-400">
            Copyright &copy; PT. Queen Network Nusantara
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Sidebar;
