import React, { Fragment, useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { PulseLoader } from 'react-spinners';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const Layout = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Simulate loading effect
    useEffect(() => {
        const simulateLoading = () => {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        };

        simulateLoading();
    }, []);

    // Scroll to top on route change
    useEffect(() => {
        const scrollToTop = () => {
            const container = document.getElementById('content-container');
            if (container) {
                container.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        scrollToTop();
    }, [location]);

    return (
        <Fragment>
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
                    <PulseLoader color="#3498db" />
                </div>
            )}
            <div className="flex dark:bg-gray-900">
                <Sidebar open={open} setOpen={setOpen} />
                <div className="w-full h-screen overflow-clip">
                    <Header open={open} setOpen={setOpen} />
                    <div
                        id="content-container"
                        className="p-6 h-[92vh] max-[450px]:h-[94vh] overflow-y-auto bg-gradient-to-b from-orange-100 via-pink-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 custom-scroll"
                    >
                        {/* <TransitionGroup>
                            <CSSTransition
                                key={location.key}
                                classNames="fade-up"
                                timeout={500}
                            > */}
                                <Outlet />
                            {/* </CSSTransition>
                        </TransitionGroup> */}
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Layout;
