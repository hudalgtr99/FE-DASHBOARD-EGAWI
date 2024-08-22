import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../store/themeConfigSlice';
import { useState, useEffect, useCallback } from 'react';
import { PiCaretDoubleDown, PiCaretDown } from 'react-icons/pi';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { MdOutlineSpaceDashboard } from 'react-icons/md';
import AnimateHeight from 'react-animate-height';

const CompSidebar = () => {
    const [currentMenu, setCurrentMenu] = useState('');
    const themeConfig = useSelector((state) => state.themeConfig);
    const { sidebar, semidark } = themeConfig;
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const toggleMenu = useCallback((value) => {
        setCurrentMenu((prev) => (prev === value ? '' : value));
    }, []);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`fixed top-0 h-full z-50 transform transition-transform duration-300 ${sidebar ? 'translate-x-0' : '-translate-x-full'} ${semidark ? 'text-white' : 'text-black'} bg-white dark:bg-gray-900 shadow-lg w-64 lg:w-64 lg:translate-x-0 ${sidebar ? 'lg:translate-x-0' : 'lg:-translate-x-full'}`}
            >
                <div className="h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/" className="flex items-center gap-2">
                            <img className="w-8 ml-[5px] flex-none" src="/assets/Logo.svg" alt="logo" />
                            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">{t('Queen')}</span>
                        </NavLink>
                        <button
                            type="button"
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
                            onClick={() => {
                                dispatch(toggleSidebar());
                            }}
                        >
                            <PiCaretDoubleDown className={`transform transition-transform ${sidebar ? 'rotate-90' : 'rotate-0'}`} />
                        </button>
                    </div>
                    <PerfectScrollbar className="h-[calc(100vh-80px)]">
                        <ul className="space-y-2 p-4">
                            <li className="menu">
                                <button
                                    type="button"
                                    className={`flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition ${currentMenu === 'dashboard' ? 'bg-gray-200 dark:bg-gray-800' : ''
                                        }`}
                                    onClick={() => toggleMenu('dashboard')}
                                >
                                    <div className="flex items-center">
                                        <MdOutlineSpaceDashboard className="text-lg" />
                                        <span className="pl-3 capitalize">{t('dashboard')}</span>
                                    </div>
                                    <PiCaretDown
                                        className={`transform transition-transform ${currentMenu !== 'dashboard' ? '-rotate-90' : 'rotate-0'
                                            }`}
                                    />
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'dashboard' ? 'auto' : 0}>
                                    <ul className="pl-8 space-y-1 text-gray-600 dark:text-gray-400">
                                        <li>
                                            <NavLink
                                                to="/"
                                                className="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                {t('sales')}
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/analytics"
                                                className="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                {t('analytics')}
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/finance"
                                                className="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                {t('finance')}
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/crypto"
                                                className="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                {t('crypto')}
                                            </NavLink>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
            <main className={`transition-all duration-300 lg:ml-64 ${sidebar ? 'lg:ml-64' : 'lg:ml-0'} `}>
                {/* Your main content goes here */}
            </main>
        </div>
    );
};

export default CompSidebar;
