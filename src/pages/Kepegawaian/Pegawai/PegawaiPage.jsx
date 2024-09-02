import React, { useState } from 'react';
import { Modal } from "@/components";

const PegawaiPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="p-4">
            {/* Button to open the modal */}
            <button
                onClick={() => setModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Open Modal
            </button>

            {/* Modal component */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Ini Modal"
            >

                {/* Tabs */}
                <div className="pt-4">
                    <ul className="flex border-b">
                        <li
                            className={`cursor-pointer py-2 px-4 text-sm font-medium ${activeTab === 0 ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
                                }`}
                            onClick={() => setActiveTab(0)}
                        >
                            Tab 1
                        </li>
                        <li
                            className={`cursor-pointer py-2 px-4 text-sm font-medium ${activeTab === 1 ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
                                }`}
                            onClick={() => setActiveTab(1)}
                        >
                            Tab 2
                        </li>
                        <li
                            className={`cursor-pointer py-2 px-4 text-sm font-medium ${activeTab === 2 ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
                                }`}
                            onClick={() => setActiveTab(2)}
                        >
                            Tab 3
                        </li>
                    </ul>

                    {/* Tab content */}
                    <div className="pt-4">
                        {activeTab === 0 && <div>Content for Tab 1</div>}
                        {activeTab === 1 && <div>Content for Tab 2</div>}
                        {activeTab === 2 && <div>Content for Tab 3</div>}
                    </div>
                </div>

                {/* Modal footer */}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={() => setModalOpen(false)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Close
                    </button>
                </div>
            </Modal >
        </div>
    );
};

export default PegawaiPage;
