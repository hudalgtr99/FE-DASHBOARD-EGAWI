import React, { Fragment } from "react";

// components
import ReactPaginate from "react-paginate";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const CompPagination = ({ handlePageClick, pageCount, limit, setLimit }) => {
  return (
    <Fragment>
      <div className="sm:flex justify-between items-center mt-4">
        <div className="flex items-center">
          <select
            value={limit}
            className="flex justify-center px-1 bg-white text-xs border border-grey-300 rounded-md h-7 outline-none"
            onChange={(e) => setLimit(parseInt(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <div className="ml-1 text-xs">{pageCount} entries</div>
        </div>
        <ReactPaginate
          className="flex justify-center mt-4 sm:mt-0 sm:justify-end text-grey-800"
          pageLinkClassName="text-xs border border-grey-300 mx-1 w-7 h-7 flex rounded-md justify-center items-center outline-none"
          activeLinkClassName="border border-blue-400 bg-blue-500 text-white"
          previousLinkClassName="text-xs border border-grey-300 mr-1 w-7 h-7 flex rounded-md justify-center items-center"
          nextLinkClassName="text-xs border border-grey-300 w-7 ml-1 h-7 flex rounded-md justify-center items-center"
          breakLinkClassName="text-xs border border-grey-300 w-7 mx-1 h-7 flex rounded-md justify-center items-end"
          disabledLinkClassName="text-grey-300"
          breakLabel={<HiOutlineDotsHorizontal />}
          renderOnZeroPageCount={null}
          previousLabel={<MdKeyboardArrowLeft />}
          nextLabel={<MdKeyboardArrowRight />}
          pageCount={Math.ceil(pageCount / limit)}
          onPageChange={(e) => handlePageClick(e)}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
        />
      </div>
    </Fragment>
  );
};

export default CompPagination;
