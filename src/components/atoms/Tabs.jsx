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
            <ul className="flex flex-wrap list-none border-b" role="tablist">
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
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "hover:border-b hover:border-blue-500 hover:text-blue-500"
                                } 
                ${activeTab === tab.linkTabs && !tab.disabled
                                    ? "border-b border-blue-500 text-blue-500 outline-none"
                                    : ""
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
            <div className="tab-content mt-4">
                {tabs.listTabs.map((content, contentIdx) => (
                    <div
                        key={contentIdx}
                        className={`transition-opacity duration-300 ease-in-out ${activeTab === content.linkTabs ? "block opacity-100" : "hidden opacity-0"
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
