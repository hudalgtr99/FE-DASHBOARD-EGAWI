import {
  AiFillFile,
  AiFillFileExcel,
  AiFillFilePdf,
  AiFillFileWord,
} from "react-icons/ai";

const getFileIcon = (file) => {
  const extension = file?.split(".").pop()?.toLowerCase() || null;

  if (extension === null) {
    return "-";
  }

  if (extension === "pdf") {
    return <AiFillFilePdf className="text-red-600 text-xl" size={30} />; // Ikon PDF
  }

  if (extension === "doc" || extension === "docx") {
    return <AiFillFileWord className="text-blue-600 text-xl" size={30} />; // Ikon Word
  }

  if (extension === "xls" || extension === "xlsx") {
    return <AiFillFileExcel className="text-green-600 text-xl" size={30} />; // Ikon Excel
  }

  // Default untuk file lain
  return <AiFillFile className="text-gray-600 text-xl" size={30} />;
};

export default getFileIcon;
