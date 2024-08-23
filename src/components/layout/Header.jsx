import React, { Fragment } from "react";
import { icons } from "../../../public/icons";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";

const Header = ({ open, setOpen }) => {

  return (
    <Fragment>
      <div className="w-full flex bg-white py-2 justify-between items-center px-3 drop-shadow-sm">
        <div
          onClick={() => setOpen(!open)}
          className={`p-1 rounded-lg bg-white text-slate-600 text-xl flex items-center gap-2 cursor-pointer hover:bg-slate-100 transition-all`}
        >
          <div>
            {icons.himenualt2}
          </div>
          <div className="font-medium">Dashboard</div>
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
