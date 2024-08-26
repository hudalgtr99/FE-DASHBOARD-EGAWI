import React, { Fragment, useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { PulseLoader } from 'react-spinners';

const Layout = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Simulate loading effect
    useEffect(() => {
        const simulateLoading = () => {
            setLoading(true);
            // Simulate a loading process (e.g., data fetching)
            setTimeout(() => {
                setLoading(false);
            }, 1000); // Adjust the timeout as needed
        };

        simulateLoading();
    }, []);

    return (
        <Fragment>
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
                    <PulseLoader color="#3498db" />
                </div>
            )}
            <div className="flex dark:bg-gray-900">
                <Sidebar open={open} setOpen={setOpen} />
                <div className="w-full min-screen overflow-clip">
                    <Header open={open} setOpen={setOpen} />
                    <div className="p-6 h-full overflow-y-auto bg-gradient-to-b from-orange-100 via-pink-100 to-purple-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 custom-scroll">
                        <Outlet />
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Layout;
