import React, { Fragment } from "react";

// components
import { PulseLoader } from "react-spinners";
import { ProgressBar } from "@/components";

// functions
import { getItem } from "@/actions";
import { baseurl } from "@/constants";
import moment from "moment";

const Table = ({
  dataColumns,
  dataTables,
  actions,
  isLoading,
  isError,
  offset,
  status,
  handleSwitch,
}) => {
  return (
    <Fragment>
      <div className="py-2 w-auto">
        <div className="overflow-x-auto custom-scroll">
          <table className="w-full">
            <thead className="bg-white dark:bg-transparent border-b border-gray-300">
              <tr>
                {dataColumns &&
                  dataColumns.map((header, headerIdx) => (
                    <th
                      key={headerIdx}
                      className="text-xs text-gray-800 dark:text-white p-2 text-left whitespace-nowrap"
                    >
                      {header.name}
                    </th>
                  ))}
                {actions && (
                  <th className="text-xs text-gray-800 dark:text-white p-2 text-center">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {dataTables !== null ? (
                dataTables.map((itemTable, itemTableIdx) => (
                  <tr
                    key={itemTableIdx}
                    className="bg-white dark:bg-transparent text-xs md:text-sm border-b border-gray-300 transition duration-300 ease-in-out"
                  >
                    {dataColumns.map((colItem, colItemIdx) => {
                      if (colItem.progress) {
                        return (
                          <td key={colItemIdx} className="p-2 text-gray-800 dark:text-white">
                            <ProgressBar
                              progress={getItem(colItem.value, itemTable)}
                            />
                          </td>
                        );
                      }

                      if (colItem.prioritas) {
                        return (
                          <td key={colItemIdx} className="p-2 text-gray-800 dark:text-white">
                            {getItem(colItem.value, itemTable) === "1" ? (
                              <span className="text-xs inline-block py-1 px-2.5 leading-none align-baseline text-center font-bold bg-red-500 text-white rounded-full">
                                Tinggi
                              </span>
                            ) : getItem(colItem.value, itemTable) === "2" ? (
                              <span className="text-xs inline-block py-1 px-2.5 leading-none align-baseline text-center font-bold bg-amber-500 text-white rounded-full">
                                Sedang
                              </span>
                            ) : (
                              <span className="text-xs inline-block py-1 px-2.5 leading-none align-baseline text-center font-bold bg-green-500 text-white rounded-full">
                                Rendah
                              </span>
                            )}
                          </td>
                        );
                      }

                      if (colItem.switch) {
                        return (
                          <td key={colItemIdx} className="p-2 text-gray-800 dark:text-white">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm"
                                type="checkbox"
                                role="switch"
                                id={itemTableIdx}
                                onChange={(e) =>
                                  handleSwitch(e, itemTable, colItemIdx)
                                }
                                checked={getItem(colItem.value, itemTable)}
                              />
                            </div>
                          </td>
                        );
                      }

                      if (colItem.status) {
                        return (
                          <td key={colItemIdx} className="p-2 text-gray-800 dark:text-white">
                            <span
                              className={`text-xs inline-block py-1 px-2.5 leading-none align-baseline text-center font-bold ${colItem.status.filter(
                                (item) =>
                                  item.value ===
                                  getItem(colItem.value, itemTable)
                              )[0]?.color
                                } text-white rounded-full`}
                            >
                              {
                                colItem.status.filter(
                                  (item) =>
                                    item.value ===
                                    getItem(colItem.value, itemTable)
                                )[0]?.label
                              }
                            </span>
                          </td>
                        );
                      }

                      if (colItem.array) {
                        return (
                          <td key={colItemIdx} className="p-2 text-gray-800 dark:text-white">
                            {itemTable[colItem.value].map((item, idx) => {
                              if (idx === itemTable[colItem.value].length - 1) {
                                return (
                                  <span key={idx}>{item[colItem.array]}</span>
                                );
                              }
                              return (
                                <span key={idx}>{item[colItem.array]}, </span>
                              );
                            })}
                          </td>
                        );
                      }

                      return (
                        <td key={colItemIdx} className="p-2 text-gray-800 dark:text-white">
                          {colItem.value === "no" ? (
                            (offset += 1)
                          ) : colItem.value === "file" ? (
                            getItem(colItem.value, itemTable) ? (
                              <a
                                target="_blank"
                                rel="noreferrer"
                                href={
                                  baseurl + getItem(colItem.value, itemTable)
                                }
                                className="text-xs text-blue-500"
                              >
                                <span className="text-xs inline-block py-1 px-2.5 leading-none text-center align-baseline font-bold bg-green-500 text-white rounded">
                                  Lihat File
                                </span>
                              </a>
                            ) : (
                              <span className="text-xs inline-block py-1 px-2.5 leading-none text-center align-baseline font-bold bg-red-500 text-white rounded">
                                No File
                              </span>
                            )
                          ) : colItem.value === "created_at" ? (
                            moment(getItem(colItem.value, itemTable)).format(
                              "l"
                            )
                          ) : (
                            getItem(colItem.value, itemTable)
                          )}
                        </td>
                      );
                    })}

                    {actions && (
                      <td className="p-2 flex justify-center items-center text-sm sm:text-lg">
                        {actions.map((action, actionIdx) => (
                          <button
                            key={actionIdx}
                            className={`mx-1 ${action.color}`}
                            onClick={() => action.func(itemTable)}
                          >
                            {action.icon}
                          </button>
                        ))}
                      </td>
                    )}
                  </tr>
                ))
              ) : isLoading ? (
                <tr>
                  <td
                    className="text-center py-5"
                    colSpan={dataColumns.length + 1}
                  >
                    <div className="pt-10 pb-6 flex justify-center items-center">
                      <PulseLoader loading={isLoading} color="#111827" />
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td className="text-center" colSpan={dataColumns.length + 1}>
                    <div className="pt-10 pb-6 flex justify-center items-center text-xs text-red-500">
                      {isError}
                    </div>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td
                    className="text-center text-gray-800"
                    colSpan={dataColumns.length + 1}
                  >
                    <div className="pt-10 pb-6 flex justify-center items-center">
                      <div>
                        <img
                          className="w-32"
                          src={"/assets/nodata.svg"}
                          alt="LogoQNN"
                        />
                        <div className="font-medium mt-2 text-xs md:text-sm dark:text-white">
                          No Data
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
};

export default Table;
