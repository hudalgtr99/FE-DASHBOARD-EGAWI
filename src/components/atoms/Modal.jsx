// src/components/Modal.jsx

import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 mx-2 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
