import React, { Fragment } from "react";

// components
import { CompCardContainer, CompPagination, CompTable } from "@/components";

const CompCardTable = ({
  icon,
  title,
  cardColor,
  dataColumns,
  dataTables,
  filter,
  directionColor,
  filterValue,
  setFilterValue,
  handlePageClick,
  pageCount,
  limit,
  setLimit,
  offset,
}) => {
  return (
    <Fragment>
      <CompCardContainer cardColor={cardColor} directionColor={directionColor}>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm font-medium">
            <span className="mr-2 p-3 dark:bg-custom-black rounded-xl">
              {icon}
            </span>
            {title}
          </div>
          {filter && (
            <input
              className="bg-white text-sm outline-none font-light"
              type="date"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          )}
        </div>
        <div className="h-72 overflow-y-auto hidden-scroll">
          <CompTable
            dataColumns={dataColumns}
            dataTables={dataTables}
            offset={offset}
          />
        </div>
        <CompPagination
          handlePageClick={handlePageClick}
          pageCount={pageCount}
          limit={limit}
          setLimit={setLimit}
        />
      </CompCardContainer>
    </Fragment>
  );
};

export default CompCardTable;
