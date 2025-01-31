import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Slip } from "@/components";
import { useSelector } from "react-redux";
import { decrypted_id } from "@/actions";
import { API_URL_payroll } from "@/constants";
import { AuthContext } from "@/context/AuthContext";
import axiosAPI from "@/authentication/axiosApi";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import { FaPrint } from "react-icons/fa6";
import SlipGaji from "@/pages/MasterData/Gaji/SlipGaji";
// import SlipGaji from "./child/SlipGaji";

const DetailPayrollGajiPage = () => {
  const { pk } = useParams();
  const { getMasterGajiLoading } = useSelector((state) => state.mastergaji);
  const navigate = useNavigate();
  const [detailPayroll, setDetailPayroll] = useState(null);
  const { jwt } = useContext(AuthContext);

  const ref = useRef();

  const handlePrint = useReactToPrint({
    content: () => ref.current,
    documentTitle: `Slip Gaji ${
      detailPayroll?.employee_first_name
    } Periode ${moment(detailPayroll?.payroll_period, "YYYY-MM").format(
      "MMMM YYYY"
    )}`, // Set the document title directly
  });

  // Jika ada Pk maka Fetching data lama
  const get = useCallback(async () => {
    if (decrypted_id(pk)) {
      const response = await axiosAPI.get(
        API_URL_payroll + decrypted_id(pk) + "/"
      );
      const dataResponse = response.data;

      setDetailPayroll(dataResponse);
    } else {
      navigate(-1);
    }
  }, [pk]);

  useEffect(() => {
    if (pk) {
      get();
    }
  }, [pk]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button
          className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
          onClick={() => navigate(-1)}
        >
          <IoMdReturnLeft />
        </button>
        <h1>Detail Payroll Pegawai</h1>
      </div>
      <div className="shadow-lg rounded-lg bg-white dark:bg-base-600 overflow-hidden">
        <div className=" flex items-start justify-center px-6 md:px-10">
          <Button
            className={"flex flex-row items-center gap-2"}
            size="xs"
            onClick={handlePrint}
          >
            <FaPrint /> Print
          </Button>
        </div>
        <div className="flex justify-center">
          {detailPayroll && <Slip ref={ref} data={detailPayroll} />}
        </div>
      </div>
    </div>
  );
};

export default DetailPayrollGajiPage;
