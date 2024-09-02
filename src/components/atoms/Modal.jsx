import React, { useRef } from 'react';
import { useOnClickOutside } from '@/hooks/useOnClickOutside'; // Adjust the import path as needed
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null);

  useOnClickOutside(modalRef, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center overflow-y-auto justify-center z-50 bg-black bg-opacity-50 dark:bg-opacity-75">
      <div
        ref={modalRef}
        className="bg-white rounded-lg pb-6 mx-2 w-full max-w-lg dark:bg-gray-900 dark:text-white"
      >
        <div className="flex bg-gray-100 px-6 py-4 rounded-t-lg justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <FaTimes />
          </button>
        </div>
        <div className="relative px-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
