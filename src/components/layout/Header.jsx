import React, { Fragment, useContext, useEffect } from "react";
import { icons } from "../../../public/icons";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { Link, useLocation } from "react-router-dom";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { ThemeContext } from "@/context/ThemeContext";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/actions/auth";
import { authReducer } from "@/reducers/authReducers";

const Header = ({ open, setOpen }) => {
  const { logoutUserResult } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const arrLocation = location.pathname.split("/");
  const title = capitalizeFirstLetter(arrLocation[arrLocation.length - 1]);

  const { colorMode, setColorMode } = useContext(ThemeContext);

  // Function to toggle color mode
  const toggleColorMode = () => {
    setColorMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const onLogout = (e) => {
    e.preventDefault();
    logoutUser(dispatch);
  };

  useEffect(() => {
    if (logoutUserResult) {
      dispatch(authReducer({ type: "LOGOUT_USER", payload: { data: false } }));
    }
  }, [logoutUserResult, dispatch]);

  return (
    <Fragment>
      <div className="w-full flex py-2 justify-between bg-orange-200 bg-opacity-70 dark:bg-gray-800 items-center px-3 drop-shadow-sm">
        <div
          onClick={() => setOpen(!open)}
          className={`p-1 rounded-lg text-black dark:text-white text-xl flex items-center gap-2 cursor-pointer transition-all`}
        >
          {!open && (
            <div className="flex items-center gap-2">
              <img className="w-8 ml-[5px]" src="/assets/Logo.png" alt="logo" />
              <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white md:block hidden">
                QUEEN
              </span>
              <div className="bg-white dark:bg-gray-700 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600">
                {icons.himenualt2}
              </div>
            </div>
          )}
          {open && <div className="font-medium dark:text-white">{title ? title : "Dashboard"}</div>}
        </div>

        <div className="flex items-center space-x-4">
          {/* Color Mode Toggle Button */}
          <button
            onClick={toggleColorMode}
            className="p-2 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            {colorMode === "light" ? (
              <IoSunnyOutline className="text-yellow-500" />
            ) : (
              <IoMoonOutline className="text-blue-500" />
            )}
          </button>

          <Popover as={"div"} className="flex relative">
            <PopoverButton>
              <div className="w-10 h-10 rounded-full cursor-pointer overflow-hidden">
                <img className="object-cover h-full w-full" src={"https://picsum.photos/200"} alt="user" />
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
              <PopoverPanel className="absolute w-max min-w-[170px] flex flex-col right-3 top-14 rounded-lg shadow-lg bg-white dark:bg-gray-800 pt-3 pb-1 px-1 text-black dark:text-white">
                <div className="px-2 pb-2">
                  <div className="text-xs font-medium">M. Aldi Kurniawan</div>
                  <div className="text-[10px]">Admin</div>
                </div>
                <div className="flex flex-col">
                  <button
                    onClick={onLogout}
                    className="text-xs py-2 px-2 rounded-lg text-left hover:bg-[#eceff4] dark:hover:bg-gray-700 hover:text-black dark:hover:text-white transition-all">
                    Keluar
                  </button>
                </div>
              </PopoverPanel>
            </Transition>
          </Popover>
        </div>
      </div>
    </Fragment>
  );
};

export default Header;
