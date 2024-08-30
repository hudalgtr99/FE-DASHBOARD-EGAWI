import React from "react";

// components
import { PulseLoader } from "react-spinners";

const Button = ({ btnName, doClick, onLoading }) => {
  return (
    <button
      className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-2"
      onClick={doClick}
      disabled={onLoading}
    >
      {onLoading ? (
        <PulseLoader color="#FFF" size="4px" loading={onLoading} />
      ) : (
        <div>{btnName}</div>
      )}
    </button>
  );
};

export default Button;
