import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

const Tabs = ({ tabs }) => {
    // State to keep track of the active tab
    const [activeTab, setActiveTab] = useState(tabs.listTabs[0].linkTabs);

    return (
        <Fragment>
            <ul className="flex flex-wrap list-none border-b border-orange-200 dark:border-gray-700" role="tablist">
                {tabs.listTabs.map((tab, tabIdx) => (
                    <li
                        key={tabIdx}
                        className="flex-auto sm:flex-none text-center"
                        role="presentation"
                    >
                        <Link
                            to={`#${tab.linkTabs}`}
                            className={`block px-4 py-2 rounded-t-lg transition-colors duration-300 ${activeTab === tab.linkTabs
                                    ? "bg-white text-black dark:bg-gray-800 dark:text-white"
                                    : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                            onClick={() => setActiveTab(tab.linkTabs)}
                            role="tab"
                            aria-selected={activeTab === tab.linkTabs}
                        >
                            {tab.nameTabs}
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="tab-content mt-4">
                {tabs.listTabs.map((content, contentIdx) => (
                    <div
                        key={contentIdx}
                        className={`transition-opacity duration-300 ease-in-out ${activeTab === content.linkTabs
                                ? "block opacity-100"
                                : "hidden opacity-0"
                            }`}
                        id={content.linkTabs}
                        role="tabpanel"
                        aria-labelledby={`tab-${contentIdx}`}
                    >
                        {content.contentTabs}
                    </div>
                ))}
            </div>
        </Fragment>
    );
};

export default Tabs;
