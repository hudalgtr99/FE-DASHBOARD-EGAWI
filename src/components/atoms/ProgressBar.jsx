import React from "react";

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gradient-to-r rounded-full from-red-500 via-yellow-500 to-green-500 h-2">
      <div className="h-2 relative" style={{ width: `${progress}%` }}>
        <div className="absolute rounded-md -right-5 -top-6 bg-gray-200 px-4 text-[10px] text-sm font-semibold after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-4 after:border-x-transparent after:border-b-transparent after:border-t-gray-200">
          {progress}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
