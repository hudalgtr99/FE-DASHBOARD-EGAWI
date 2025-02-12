import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import MyPerusahaan from "./MyPerusahaan";
import PerusahaanList from "./PerusahaanList";

export default function PerusahaanPage() {
	const { jwt } = useContext(AuthContext);

	return <>{jwt && jwt?.level === "Super Admin" ? <PerusahaanList /> : <MyPerusahaan />}</>;
}
