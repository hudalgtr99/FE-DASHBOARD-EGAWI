import { API_URL_getdetailtugas } from "@/constants";
import axiosAPI from "@/authentication/axiosApi";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PulseLoading } from "../../../components";

const PenugasanPDF = () => {
  const [detail, setDetail] = useState({});
  const [loading, setLoading] = useState(true); // State untuk loading
  const { pk } = useParams();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true); // Mulai loading
        const res = await axiosAPI.post(API_URL_getdetailtugas, {
          tugas_id: pk,
        });
        setDetail(res.data);
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [pk]);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <PulseLoading />
      </div>
    );
  }

  return (
    <button onClick={() => window.open(detail.file, "_blank")}>Open PDF</button>
  );
};

export default PenugasanPDF;
