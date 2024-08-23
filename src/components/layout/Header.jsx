import React, { Fragment } from "react";
import { icons } from "../../../public/icons";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";

const Header = ({ open, setOpen }) => {
  return (
    <Fragment>
      <div className="w-full flex py-2 justify-between items-center px-3 drop-shadow-sm">
        <div
          onClick={() => setOpen(!open)}
          className={`p-1 rounded-lg text-black text-xl flex items-center gap-2 cursor-pointer transition-all`}
        >
          {!open && ( // Hide the logo when the sidebar is open
            <div className="flex items-center gap-2">
              <img className="w-8 ml-[5px]" src="/assets/Logo.svg" alt="logo" />
              <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light sm:block hidden">
                QUEEN
              </span>
              <div className="bg-gray-100 p-1 rounded-full hover:bg-gray-200">
                {icons.himenualt2}
              </div>
            </div>
          )}
        </div>
        <Popover as={"div"} className="flex relative">
          <PopoverButton>
            <div className="w-10 h-10 rounded-full cursor-pointer overflow-hidden">
              <img
                className="object-cover h-full w-full"
                src={"https://picsum.photos/200"}
                alt="user"
              />
            </div>
          </PopoverButton>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <PopoverPanel className="absolute w-max min-w-[170px] flex flex-col right-3 top-14 rounded-lg shadow-lg bg-white pt-3 pb-1 px-1 text-black">
              <div className="px-2 pb-2">
                <div className="text-xs font-medium">
                  M. Aldi Kurniawan
                </div>
                <div className="text-[10px]">Admin</div>
              </div>
              <div className="flex flex-col">
                <button
                  className="text-xs py-2 px-2 rounded-lg text-left hover:bg-[#eceff4] hover:text-black transition-all"
                >
                  Keluar
                </button>
              </div>
            </PopoverPanel>
          </Transition>
        </Popover>
      </div>
    </Fragment>
  );
};

export default Header;
