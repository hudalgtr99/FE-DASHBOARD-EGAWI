import { FaRegFaceDizzy } from "react-icons/fa6";
import { Button } from "../../components";
import { useNavigate } from "react-router-dom";

export default function page404() {
    const navigate = useNavigate();
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <FaRegFaceDizzy className="text-6xl text-gray-800" />
      <div className="flex flex-col items-center justify-center">
        <p className="text-3xl md:text-4xl text-gray-800 mt-10">
            Page Not Found
        </p>
        <p className="md:text-lg lg:text-xl text-gray-600 mt-8">
          Maaf, halaman yang Anda cari tidak dapat ditemukan.
        </p>
        <div className="mt-10">
          <Button onClick={() => navigate("/")}>Kembali ke Dashboard</Button>
        </div>
      </div>
    </div>
  );
}
