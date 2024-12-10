import { formatBytes } from "@/utils/bytesToSize";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { TbChecks, TbX } from "react-icons/tb";
import { FaFilePdf, FaFileExcel } from "react-icons/fa6";

/**
 *
 * @param {{
 * height: integer;
 * accept: object;
 * disabled: boolean;
 * maxFiles: integer;
 * minSize: integer;
 * maxSize: integer;
 * multiple: boolean;
 * value: Array;
 * setValue: Function;
 * }}
 *
 */

const FileInput = ({
  height = 260,
  disabled = false,
  multiple = false,
  value = [],
  setValue = () => {},
  accept = null,
  maxFiles,
  minSize,
  maxSize,
}) => {
  const [rejectedFiles, setRejectedFiles] = useState([]);

  const onDrop = (acceptedFiles, fileRejections) => {
    if (!multiple) {
      setValue(acceptedFiles);
      setRejectedFiles(fileRejections);
      return;
    }

    if (value.length + acceptedFiles.length > maxFiles) {
      alert(`You can only upload ${maxFiles} files`);
      return;
    }

    setValue((prev) => [...prev, ...acceptedFiles]);
    setRejectedFiles((prev) => [...prev, ...fileRejections]);
  };

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    accept,
    disabled,
    maxFiles,
    minSize,
    maxSize,
    multiple,
    noClick: true,
  });

  return (
    <div
      {...getRootProps({
        className: `relative w-full flex border-2 border-dashed border-base-100 dark:border-base-400 rounded-md text-center p-6 ${
          disabled ? "" : "cursor-pointer"
        }`,
        style: {
          minHeight: `${height}px`,
          opacity: disabled ? 0.5 : 1,
        },
      })}
    >
      <input {...getInputProps()} />

      <div
        onClick={open}
        className="absolute w-full h-full top-0 left-0 z-0"
      ></div>

      {value.length > 0 || rejectedFiles.length > 0 ? (
        <div className="absolute bottom-1 right-2 text-xs z-10 pointer-events-none">{`${
          value.length
        } / ${value.length + rejectedFiles.length}`}</div>
      ) : null}

      {value.length > 0 || rejectedFiles.length > 0 ? (
        <div className="flex flex-wrap w-full gap-4 justify-center sm:justify-start ">
          {value.map((file, fileIdx) => (
            <div
              className="group/cardfile relative w-full sm:w-36 h-52 rounded cursor-default overflow-clip bg-base-50 dark:bg-base-500 flex flex-col shadow-[rgba(0,0,0,0.12)_0px_1px_3px,_rgba(0,0,0,0.24)_0px_1px_2px] mx-auto"
              key={fileIdx}
            >
              <div className="absolute z-20 right-2 top-2 cursor-pointer text-red-500 transition-opacity opacity-0 group-hover/cardfile:opacity-100">
                <TbX
                  onClick={() => {
                    setValue((prev) =>
                      prev.filter((_, itemIdx) => itemIdx !== fileIdx)
                    );
                  }}
                />
              </div>

              <div className="relative flex-1 flex items-center justify-center text-xs overflow-hidden">
                <div className="absolute bottom-1 right-1 text-2xl drop-shadow-lg text-green-500">
                  <TbChecks />
                </div>

                {typeof file === "string" ? ( // Check if the file is a string (URL)
                  file?.endsWith(".pdf") ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaFilePdf className="text-[4rem]" />
                    </div>
                  ): (
                    <img
                      src={file} // Use URL to display the image
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )
                ) : file?.type?.includes("image") ? (
                  <img
                    src={URL.createObjectURL(file)} // Create an object URL for the image file
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : file?.type?.includes("pdf") ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaFilePdf className="text-[4rem]" />
                  </div>
                ) : file?.type?.includes("sheet") ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaFileExcel className="text-[4rem]" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    No preview
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-base-600 p-2 text-[10px] text-left h-16 border-t border-base-50 dark:border-base-500">
                <div className="line-clamp-3 leading-none mb-1">
                  {typeof file === "string" ? file : file.name}
                </div>
                <div>
                  {typeof file === "string" ? "" : formatBytes(file.size)}
                </div>
              </div>
            </div>
          ))}

          {rejectedFiles.map((file, fileIdx) => (
            <div
              className="group/cardfile relative w-full sm:w-36 h-52 rounded cursor-default overflow-clip bg-base-50 dark:bg-base-500 flex flex-col shadow-[rgba(0,0,0,0.12)_0px_1px_3px,_rgba(0,0,0,0.24)_0px_1px_2px]"
              key={fileIdx}
            >
              <div className="absolute z-20 right-2 top-2 cursor-pointer text-red-500 transition-opacity opacity-0 group-hover/cardfile:opacity-100">
                <TbX
                  onClick={() => {
                    setRejectedFiles((prev) =>
                      prev.filter((_, itemIdx) => itemIdx !== fileIdx)
                    );
                  }}
                />
              </div>

              <div className="relative flex-1 flex items-center justify-center text-xs overflow-hidden">
                <div className="absolute bottom-1 right-1 text-2xl drop-shadow-lg text-red-500">
                  <TbX />
                </div>

                {file?.file?.type?.includes("image") ? (
                  <img
                    src={URL.createObjectURL(file.file)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    No preview
                  </div>
                )}
              </div>

              <div className="relative">
                {file?.errors?.length > 0 && (
                  <div className="absolute z-10 bg-red-500 text-white text-[10px] p-2 w-full h-full text-left transition-opacity opacity-0 group-hover/cardfile:opacity-100">
                    {file?.errors?.map((error, errorIdx) => (
                      <div key={errorIdx}>{error.message}</div>
                    ))}
                  </div>
                )}
                <div className="bg-white dark:bg-base-600 p-2 text-[10px] text-left h-16 border-t border-base-50 dark:border-base-500 relative">
                  <div className="line-clamp-3 leading-none mb-1">
                    {file?.file?.name}
                  </div>
                  <div>{formatBytes(file?.file?.size)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {isDragActive
            ? "Drop the files here ..."
            : "Drag 'n' drop some files here, or click to select files"}
        </div>
      )}
    </div>
  );
};

FileInput.propTypes = {
  height: PropTypes.number,
  accept: PropTypes.object,
  disabled: PropTypes.bool,
  maxFiles: PropTypes.number,
  minSize: PropTypes.number,
  maxSize: PropTypes.number,
  multiple: PropTypes.bool,
  value: PropTypes.array,
  setValue: PropTypes.func,
};

export default FileInput;
