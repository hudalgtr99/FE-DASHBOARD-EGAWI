import React, { Fragment } from "react";

// components
import { CardContainer, Pagination, Table } from "@/components";

const CardTable = ({
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
      <CardContainer cardColor={cardColor} directionColor={directionColor}>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm font-medium dark:text-white">
            <span className="mr-2 p-3 dark:bg-gray-700 rounded-xl">
              {icon}
            </span>
            {title}
          </div>
          {filter && (
            <input
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 text-sm outline-none font-light dark:text-white"
              type="date"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          )}
        </div>
        <div className="h-72 overflow-y-auto hidden-scroll">
          <Table
            dataColumns={dataColumns}
            dataTables={dataTables}
            offset={offset}
          />
        </div>
        <Pagination
          handlePageClick={handlePageClick}
          pageCount={pageCount}
          limit={limit}
          setLimit={setLimit}
        />
      </CardContainer>
    </Fragment>
  );
};

export default CardTable;
