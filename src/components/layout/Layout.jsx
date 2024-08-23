import React, { Fragment, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

const Layout = () => {
    const [open, setOpen] = useState(false);

    return (
        <Fragment>
            <div className="flex">
                <Sidebar open={open} setOpen={setOpen} />
                <div className="w-full min-h-screen overflow-clip">
                    <Header open={open} setOpen={setOpen} />
                    <div className="p-6 h-full overflow-y-auto bg-gradient-to-b from-orange-100 via-pink-100 to-purple-100 custom-scroll">
                        <Outlet />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Layout