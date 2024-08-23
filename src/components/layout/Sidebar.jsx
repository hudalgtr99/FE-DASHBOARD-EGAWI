import React, { Fragment, useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useWindowSize } from "@/hooks/useWindowSize";
import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from "@headlessui/react";
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
      <div
        onClick={() => setOpen(!open)}
        className={`fixed w-screen h-screen lg:hidden ${open ? "" : "hidden"}`}
      ></div>

      {/* Sidebar */}
      <div
        className={`${open ? "translate-x-0 w-[260px]" : "w-0"} z-10 fixed lg:relative h-screen flex flex-col bg-white shadow-lg text-black transition-all duration-300 ease-in-out`}
      >
        {/* Logo */}
        <div className={`${open ? "w-full flex justify-center py-2" : "hidden"}`}>
          <img className="w-32" src="/assets/Logo.svg" alt="logo" />
        </div>

        {/* Menu */}
        <div className={`px-2 pt-1 pb-5 text-sm overflow-y-auto max-h-[80vh] ${open ? "" : "hidden"}`}>
          {menu.map((menu, menuIdx) => (
            <Disclosure key={menuIdx} as={"div"} className="my-1">
              <>
                <DisclosureButton
                  onClick={() => navOpen(menu.menuLink)}
                  className={`${navopen[menu.menuLink] ? "bg-[#eceff4] text-black shadow-md" : ""} flex px-3 py-2 rounded-lg justify-between items-center w-full transition-all duration-150 hover:bg-[#eceff4] hover:text-black`}
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
                            className={`${isActive ? "bg-[#eceff4] text-black" : ""} px-3 py-2 rounded-lg mt-2 ml-[26px] transition hover:bg-[#eceff4] hover:text-black`}
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
          ))}
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
