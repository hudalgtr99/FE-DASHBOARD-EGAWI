import React, { Fragment } from "react";

const Table = ({
  dataColumns,
  actions,
}) => {
  return (
    <Fragment>
      <div className="py-2 w-auto">
        <div className="overflow-x-auto custom-scroll">
          <table className="w-full">
            <thead className="bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
              <tr>
                {dataColumns &&
                  dataColumns.map((header, headerIdx) => (
                    <th
                      key={headerIdx}
                      className="text-xs text-gray-800 dark:text-gray-300 p-2 text-left whitespace-nowrap"
                    >
                      {header.name}
                    </th>
                  ))}
                {actions && (
                  <th className="text-xs text-gray-800 dark:text-gray-300 p-2 text-center">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
};

export default Table;
