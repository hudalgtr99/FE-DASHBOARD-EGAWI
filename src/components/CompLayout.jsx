import React, { Fragment } from 'react'
import { Outlet } from 'react-router-dom'
import CompHeader from './CompHeader'
import CompSidebar from './CompSidebar'

const CompLayout = () => {
    return (
        <Fragment>
            <div className="flex ">
                <CompSidebar />
                <div className="w-full h-screen overflow-clip">
                    <CompHeader />
                    <div className="p-6 h-[90vh] overflow-y-auto bg-gray-100 custom-scroll">
                        <Outlet />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default CompLayout