import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { toggleRTL, toggleTheme, toggleSidebar } from '../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import Dropdown from "../components/CompDropdown"; // Import Dropdown component
import { FaLaptop } from 'react-icons/fa';
import { IoMenu, IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';

const CompHeader = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const themeConfig = useSelector((state) => state.themeConfig);
  const isRtl = themeConfig.rtlClass === 'rtl';

  const [messages, setMessages] = useState([
    // Your messages data here...
  ]);

  const [notifications, setNotifications] = useState([
    // Your notifications data here...
  ]);

  const [search, setSearch] = useState(false);
  const [flag, setFlag] = useState(themeConfig.locale);

  const { t } = useTranslation();

  useEffect(() => {
    const selector = document.querySelector(`ul.horizontal-menu a[href="${window.location.pathname}"]`);
    if (selector) {
      selector.classList.add('active');
      const all = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
      all.forEach(el => el.classList.remove('active'));
      const ul = selector.closest('ul.sub-menu');
      if (ul) {
        let ele = ul.closest('li.menu').querySelectorAll('.nav-link');
        if (ele) {
          ele = ele[0];
          setTimeout(() => ele?.classList.add('active'));
        }
      }
    }
  }, [location]);

  const removeMessage = (id) => {
    setMessages(messages.filter(message => message.id !== id));
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const setLocale = (flag) => {
    setFlag(flag);
    if (flag.toLowerCase() === 'ae') {
      dispatch(toggleRTL('rtl'));
    } else {
      dispatch(toggleRTL('ltr'));
    }
  };

  return (
    <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
      <div className="shadow-sm">
        <div className="relative bg-white flex w-full items-center px-5 py-2.5 dark:bg-black">
          <div className="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
            <Link to="/" className="main-logo flex items-center shrink-0">
              <img className="w-8 ltr:-ml-1 rtl:-mr-1 inline" src="/assets/images/logo.svg" alt="logo" />
              <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle hidden md:inline dark:text-white-light transition-all duration-300">VRISTO</span>
            </Link>
            <button
              type="button"
              className="collapse-icon flex-none dark:text-[#d0d2d6] hover:text-primary dark:hover:text-primary flex lg:hidden ltr:ml-2 rtl:mr-2 p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
              onClick={() => dispatch(toggleSidebar())}
            >
              <IoMenu className="w-5 h-5" />
            </button>
          </div>

          <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
            <div>
              {themeConfig.theme === 'light' ? (
                <button
                  className={`${themeConfig.theme === 'light' &&
                    'flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                    }`}
                  onClick={() => dispatch(toggleTheme('dark'))}
                >
                  <IoSunnyOutline />
                </button>
              ) : null}
              {themeConfig.theme === 'dark' && (
                <button
                  className={`${themeConfig.theme === 'dark' &&
                    'flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                    }`}
                  onClick={() => dispatch(toggleTheme('system'))}
                >
                  <IoMoonOutline />
                </button>
              )}
              {themeConfig.theme === 'system' && (
                <button
                  className={`${themeConfig.theme === 'system' &&
                    'flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                    }`}
                  onClick={() => dispatch(toggleTheme('light'))}
                >
                  <FaLaptop />
                </button>
              )}
            </div>
            {/* <div className="dropdown shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
                button={<IconMailDot />}
                menu={<div>Your messages dropdown</div>}
                className="p-2"
              />
            </div>
            <div className="dropdown shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
                button={<IconBellBing />}
                menu={<div>Your notifications dropdown</div>}
                className="p-2"
              />
            </div>
            <div className="dropdown shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
                button={<IconUser />}
                menu={<div>Your profile dropdown</div>}
                className="p-2"
              />
            </div>
            <div className="dropdown shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
                button={<IconInfoCircle />}
                menu={<div>Your info dropdown</div>}
                className="p-2"
              />
            </div> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default CompHeader;
