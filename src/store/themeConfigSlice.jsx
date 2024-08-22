import { createSlice } from '@reduxjs/toolkit';
import i18next from 'i18next';
import themeConfig from '../theme.config';

const initialState = {
    isDarkMode: false,
    mainLayout: 'app',
    theme: localStorage.getItem('theme') || themeConfig.theme || 'light',
    menu: localStorage.getItem('menu') || themeConfig.menu || 'vertical',
    layout: localStorage.getItem('layout') || themeConfig.layout || 'full',
    rtlClass: localStorage.getItem('rtlClass') || themeConfig.rtlClass || 'ltr',
    animation: localStorage.getItem('animation') || themeConfig.animation || '',
    navbar: localStorage.getItem('navbar') || themeConfig.navbar || 'navbar-sticky',
    locale: localStorage.getItem('i18nextLng') || themeConfig.locale || 'en',
    sidebar: JSON.parse(localStorage.getItem('sidebar')) || themeConfig.sidebar || false,
    semidark: JSON.parse(localStorage.getItem('semidark')) || themeConfig.semidark || false,
    languageList: [
        { code: 'zh', name: 'Chinese' },
        { code: 'da', name: 'Danish' },
        { code: 'en', name: 'English' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'el', name: 'Greek' },
        { code: 'hu', name: 'Hungarian' },
        { code: 'it', name: 'Italian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'pl', name: 'Polish' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'es', name: 'Spanish' },
        { code: 'sv', name: 'Swedish' },
        { code: 'tr', name: 'Turkish' },
        { code: 'ae', name: 'Arabic' },
    ],
};

const themeConfigSlice = createSlice({
    name: 'themeConfig',
    initialState,
    reducers: {
        toggleTheme(state, { payload }) {
            const theme = payload || state.theme;
            localStorage.setItem('theme', theme);
            state.theme = theme;

            if (theme === 'light') {
                state.isDarkMode = false;
            } else if (theme === 'dark') {
                state.isDarkMode = true;
            } else if (theme === 'system') {
                state.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            }

            document.body.classList.toggle('dark', state.isDarkMode);
        },
        toggleMenu(state, { payload }) {
            const menu = payload || state.menu;
            localStorage.setItem('menu', menu);
            state.menu = menu;
            state.sidebar = false; // Reset sidebar state when menu changes
        },
        toggleLayout(state, { payload }) {
            const layout = payload || state.layout;
            localStorage.setItem('layout', layout);
            state.layout = layout;
        },
        toggleRTL(state, { payload }) {
            const rtlClass = payload || state.rtlClass;
            localStorage.setItem('rtlClass', rtlClass);
            state.rtlClass = rtlClass;
            document.documentElement.setAttribute('dir', rtlClass);
        },
        toggleAnimation(state, { payload }) {
            const animation = (payload || state.animation).trim();
            localStorage.setItem('animation', animation);
            state.animation = animation;
        },
        toggleNavbar(state, { payload }) {
            const navbar = payload || state.navbar;
            localStorage.setItem('navbar', navbar);
            state.navbar = navbar;
        },
        toggleSemidark(state, { payload }) {
            const semidark = payload === true || payload === 'true';
            localStorage.setItem('semidark', semidark);
            state.semidark = semidark;
        },
        toggleLocale(state, { payload }) {
            const locale = payload || state.locale;
            localStorage.setItem('i18nextLng', locale);
            i18next.changeLanguage(locale);
            state.locale = locale;
        },
        toggleSidebar(state) {
            state.sidebar = !state.sidebar;
            localStorage.setItem('sidebar', state.sidebar);
        },
        setPageTitle(state, { payload }) {
            document.title = `${payload} | Kepegawaian New`;
        },
    },
});

export const { toggleTheme, toggleMenu, toggleLayout, toggleRTL, toggleAnimation, toggleNavbar, toggleSemidark, toggleLocale, toggleSidebar, setPageTitle } = themeConfigSlice.actions;

export default themeConfigSlice.reducer;
