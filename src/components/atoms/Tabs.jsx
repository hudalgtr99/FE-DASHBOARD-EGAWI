import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

const Tabs = ({ tabs }) => {
    // State to keep track of the active tab
    const [activeTab, setActiveTab] = useState(tabs.listTabs[0].linkTabs);

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
                            className={`-mb-px flex items-center p-5 py-3 hover:border-b hover:border-purple-500 hover:text-purple-500 ${activeTab === tab.linkTabs
                                    ? "border-b border-purple-500 text-purple-500 outline-none"
                                    : ""
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
