import { useCallback, useEffect } from "react";
import PerusahaanList from "./PerusahaanList";
import MyPerusahaan from "./MyPerusahaan";
import axiosAPI from "@/authentication/axiosApi";
import { API_URL_getperusahaan } from "@/constants";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function PerusahaanPage() {
  const { jwt } = useContext(AuthContext);

  return (
    <>
      {jwt && jwt?.level === "Super Admin" ? (
        <PerusahaanList />
      ) : (
        <MyPerusahaan />
      )}
    </>
  );
}
