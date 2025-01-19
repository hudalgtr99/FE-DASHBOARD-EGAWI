import { getToken } from "@/authentication/authenticationApi";
import useDebounce from "@/hooks/useDebounce";
import axios from "axios";
import { upperFirst } from "lodash";
import { useCallback } from "react";
import AsyncSelect from "react-select/async";

const SelectSync = ({
  className = "",
  label,
  url,
  fieldName,
  setSelect,
  select,
  limit = 50,
  error,
  data = false,
  required = false,
  withLabel = true,
  addParams = "",
}) => {
  const handleChange = (selected) => {
    setSelect(selected);
  };

  //eslint-disable-next-line
  const loadOptionsData = useCallback(
    useDebounce((inputValue, callback) => {
      if (data) {
        const filterData = (inputValue) => {
          return data.filter((i) =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
          );
        };
        callback(filterData(inputValue));
      }

      const token = getToken();
      if (url) {
        axios({
          method: "GET",
          url: `${url}?limit=${limit}&offset=0&search=${inputValue}${addParams}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            const options = response?.data?.results?.map((value) => ({
              value: value.id,
              label: value[fieldName],
            }));
            callback(options);
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
    }, 100),
    []
  );

  return (
    <div className={className}>
      {withLabel && (
        <label className="text-sm">
          {upperFirst(label)}{" "}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <AsyncSelect
        isClearable
        className={`text-sm rounded ${
          error ? "border-red-500 border rounded" : ""
        }`}
        placeholder={`Input & Cari`}
        cacheOptions
        loadOptions={loadOptionsData}
        defaultOptions
        onChange={handleChange}
        value={select}
      />

      {error && <div className="text-red-500 mt-1 text-xs">{error}</div>}
    </div>
  );
};

export default SelectSync;
