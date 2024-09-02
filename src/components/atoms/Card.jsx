import React from "react";

// components
import { icons } from "../../../public/icons";
import TextTruncate from "react-text-truncate";

const Card = ({ children, deleted, doDelete, onClick, data }) => {
  return (
    <div className="flex h-full group relative bg-white text-gray-800 rounded-2xl shadow-lg hover:scale-95 transition-all cursor-pointer">
      {deleted && (
        <div
          onClick={() => doDelete(data.pk)}
          className="absolute -right-2 -top-2 z-10 text-red-500 text-xl bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
        >
          {icons.fixcircle}
        </div>
      )}
      <div onClick={() => onClick(data)} className="flex">
        <div className="w-10 bg-gradient-to-b from-gradient-yellow-100 to-gradient-pink-100 rounded-l-2xl"></div>
        <div className="w-full">
          <div className="p-3 border-b border-gray-100 font-medium">
            {data.nama}
          </div>
          <div className="text-xs font-extralight p-3 text-justify">
            <TextTruncate
              line={3}
              element="span"
              truncateText="…"
              text={children}
            />
            <div>
              {data.no_telepon && (
                <div className="pt-4">Nomor Telepon : {data.no_telepon}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
