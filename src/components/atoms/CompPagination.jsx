import React, { Fragment } from "react";

// components
import ReactPaginate from "react-paginate";
import { icons } from "../../../public/icons";

const CompPagination = ({
  handlePageClick,
  pageCount,
  limit,
  setLimit,
  pageActive,
}) => {
  return (
    <Fragment>
      <div className="sm:flex justify-between items-center mt-2">
        <div className="flex items-center">
          {limit && (
            <select
              value={limit}
              className="flex justify-center px-1 bg-white text-xs border border-gray-300 rounded-md h-7 outline-none"
              onChange={(e) => setLimit(parseInt(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          )}

          <div className="ml-1 text-xs">{pageCount} entries</div>
        </div>

        {limit && (
          <ReactPaginate
            className="flex justify-center mt-4 sm:mt-0 sm:justify-end text-gray-800"
            pageLinkClassName="bg-white text-xs border border-gray-300 mx-1 w-7 h-7 flex rounded-md justify-center items-center outline-none"
            activeLinkClassName="border border-gray-400 bg-gray-100"
            previousLinkClassName="bg-white text-xs border border-gray-300 mr-1 w-7 h-7 flex rounded-md justify-center items-center"
            nextLinkClassName="bg-white text-xs border border-gray-300 w-7 ml-1 h-7 flex rounded-md justify-center items-center"
            breakLinkClassName="bg-white text-xs border border-gray-300 w-7 mx-1 h-7 flex rounded-md justify-center items-end"
            disabledLinkClassName="text-gray-300"
            breakLabel={icons.hioutlinedotshorizontal}
            renderOnZeroPageCount={null}
            previousLabel={icons.mdkeyboardarrowleft}
            nextLabel={icons.mdkeyboardarrowright}
            pageCount={Math.ceil(pageCount / limit)}
            onPageChange={(e) => handlePageClick(e)}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            forcePage={pageActive}
          />
        )}
      </div>
    </Fragment>
  );
};

export default CompPagination;
