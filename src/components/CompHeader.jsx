import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { toggleRTL, toggleTheme, toggleSidebar } from '../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';
import { FaLaptop } from 'react-icons/fa';
import { IoMenu, IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';

const CompHeader = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const themeConfig = useSelector((state) => state.themeConfig);
  const isRtl = themeConfig.rtlClass === 'rtl';

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
    dispatch(toggleRTL(flag.toLowerCase() === 'ae' ? 'rtl' : 'ltr'));
  };

  return (
    <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
      <div className="shadow-sm bg-white dark:bg-black">
        <div className="relative flex items-center px-5 py-2.5">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 mx-2">
              <img className="w-8" src="/assets/Logo.svg" alt="logo" />
              <span className="text-2xl font-semibold md:inline dark:text-white">
                Queen
              </span>
            </Link>
            <button
              type="button"
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() => dispatch(toggleSidebar())}
            >
              <IoMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-end space-x-1.5 dark:text-gray-300">
            {themeConfig.theme === 'light' && (
              <button
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => dispatch(toggleTheme('dark'))}
              >
                <IoSunnyOutline className="text-gray-600 dark:text-gray-300" />
              </button>
            )}
            {themeConfig.theme === 'dark' && (
              <button
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => dispatch(toggleTheme('system'))}
              >
                <IoMoonOutline className="text-gray-600 dark:text-gray-300" />
              </button>
            )}
            {themeConfig.theme === 'system' && (
              <button
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => dispatch(toggleTheme('light'))}
              >
                <FaLaptop className="text-gray-600 dark:text-gray-300" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default CompHeader;
