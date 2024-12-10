import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

const Tabs = ({ tabs }) => {
    // State to keep track of the active tab
    const [activeTab, setActiveTab] = useState(tabs.listTabs[0].linkTabs);

    const handleTabClick = (tab) => {
        if (!tab.disabled) {
            setActiveTab(tab.linkTabs);
        }
    };

    return (
        <Fragment>
            {/* Tab headers */}
            <ul className="flex flex-wrap list-none border-b border-gray-200 dark:border-gray-700" role="tablist">
                {tabs.listTabs.map((tab, tabIdx) => (
                    <li
                        key={tabIdx}
                        className="flex-auto sm:flex-none text-center"
                        role="presentation"
                    >
                        <Link
                            to={`#${tab.linkTabs}`}
                            className={`-mb-px flex font-medium items-center p-5 py-3 
                            ${tab.disabled
                                    ? "text-gray-400 cursor-not-allowed dark:text-gray-500"
                                    : "hover:border-b hover:border-gray-600 hover:text-gray-600 dark:hover:border-gray-600 dark:hover:text-gray-600"
                                } 
                            ${activeTab === tab.linkTabs && !tab.disabled
                                    ? "border-b border-gray-600 text-gray-600 dark:border-gray-600 dark:text-gray-600 outline-none"
                                    : "text-[#BABCBD] dark:text-gray-300"
                                }`}
                            onClick={() => handleTabClick(tab)}
                            role="tab"
                            aria-selected={activeTab === tab.linkTabs}
                            aria-disabled={tab.disabled ? "true" : "false"}
                        >
                            {tab.nameTabs}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Tab content */}
            <div className="mt-4">
                {tabs.listTabs.map((content, contentIdx) => (
                    <div
                        key={contentIdx}
                        className={`transition-all duration-500 ease-in-out transform 
                        ${activeTab === content.linkTabs ? "block fade-in-slide-up" : "hidden fade-out-slide-down"}`}
                        id={content.linkTabs}
                        role="tabpanel"
                    >
                        {content.contentTabs}
                    </div>
                ))}
            </div>
        </Fragment>
    );
};

export default Tabs;
