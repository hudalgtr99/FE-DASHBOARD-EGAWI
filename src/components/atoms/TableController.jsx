import React, { Fragment } from "react";

// components
import { icons } from "../../../public/icons";

const TableController = ({
  doSearch,
  onAdd,
  onExport,
  filter,
  setFilter,
}) => {
  return (
    <Fragment>
      <div className="flex justify-between">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search"
            className="outline-none text-xs border border-gray-300 py-2 px-3 rounded-lg w-full"
            onChange={(e) => doSearch(e)}
          />
        </div>
        <div className="flex">
          {setFilter && (
            <input
              type="month"
              value={filter}
              className="outline-none text-xs py-2 px-3 rounded-lg bg-[#f3f4f6] mr-2"
              onChange={(e) => setFilter(e.target.value)}
            />
          )}
          {onAdd && (
            <button
              className="px-3 py-2 flex items-center rounded-lg bg-[#f3f4f6] text-xs"
              onClick={onAdd}
            >
              <span>{icons.aioutlineplus}</span>
              <div className="ml-2">Tambah</div>
            </button>
          )}
          {onExport && (
            <button
              className="px-3 py-2 flex items-center rounded-lg bg-[#f3f4f6] text-xs"
              onClick={onExport}
            >
              <span>{icons.fafileexport}</span>
              <div className="ml-2">Export</div>
            </button>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default TableController;
