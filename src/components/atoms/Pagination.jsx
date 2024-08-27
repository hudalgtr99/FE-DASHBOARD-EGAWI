import React, { Fragment } from "react";

// components
import ReactPaginate from "react-paginate";
import { icons } from "../../../public/icons";

const Pagination = ({
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
              className="flex justify-center px-1 bg-white dark:bg-gray-800 text-xs border border-gray-300 dark:border-gray-700 rounded-md h-7 outline-none dark:text-white"
              onChange={(e) => setLimit(parseInt(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          )}

          <div className="ml-1 text-xs dark:text-white">{pageCount} entries</div>
        </div>

        {limit && (
          <ReactPaginate
            className="flex justify-center mt-4 sm:mt-0 sm:justify-end text-gray-800 dark:text-white"
            pageLinkClassName="bg-white dark:bg-gray-800 text-xs border border-gray-300 dark:border-gray-700 mx-1 w-7 h-7 flex rounded-md justify-center items-center outline-none"
            activeLinkClassName="border border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
            previousLinkClassName="bg-white dark:bg-gray-800 text-xs border border-gray-300 dark:border-gray-700 mr-1 w-7 h-7 flex rounded-md justify-center items-center"
            nextLinkClassName="bg-white dark:bg-gray-800 text-xs border border-gray-300 dark:border-gray-700 w-7 ml-1 h-7 flex rounded-md justify-center items-center"
            breakLinkClassName="bg-white dark:bg-gray-800 text-xs border border-gray-300 dark:border-gray-700 w-7 mx-1 h-7 flex rounded-md justify-center items-end"
            disabledLinkClassName="text-white dark:text-gray-500"
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

export default Pagination;
