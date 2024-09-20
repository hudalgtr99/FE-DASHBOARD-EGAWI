import { Layout } from "@/components";
import { menu } from "@/constants/menu";
import LoginPage from "@/pages/Login/LoginPage";
import PrivateRoute from "@/pages/Login/PrivateRoute";
import LoginPrivateRoute from "@/pages/Login/LoginPrivateRoute"; // Import the new PrivateRoute
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PangkatSubForm from "@/pages/MasterData/Strata/Sub/PangkatSubForm";
import JabatanSubForm from "@/pages/MasterData/Strata/Sub/JabatanSubForm";
import DepartemenSubForm from "@/pages/MasterData/Organ/Sub/DepartemenSubForm";
import DivisiSubForm from "@/pages/MasterData/Organ/Sub/DivisiSubForm";
import UnitSubForm from "@/pages/MasterData/Organ/Sub/UnitSubForm";
import PegawaiForm from "@/pages/Kepegawaian/Pegawai/PegawaiForm";
import CabangForm from "@/pages/MasterData/Cabang/CabangForm";
import KalenderForm from "@/pages/MasterData/Kalender/KalenderForm";
import GajiForm from "@/pages/MasterData/Gaji/GajiForm";

const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={
						<PrivateRoute>
							<Layout />
						</PrivateRoute>
					}
				>
					{menu.map((item, index) => (
						item.subMenu && item.subMenu.length > 0 ? (
							item.subMenu.map((sub, subIndex) => (
								<Route
									key={`sub-${subIndex}`}
									path={sub.subMenuLink}
									element={sub.element || <h1 className="dark:text-white">Menu Not Implemented</h1>}
								/>
							))
						) : (
							<Route
								key={index}
								path={item.menuLink}
								element={item.element || <h1 className="dark:text-white">Page Not Implemented</h1>}
							/>
						)
					))}
					{/* Strata */}
					<Route path="/pangkat/form" element={<PangkatSubForm />} />
					<Route path="/pangkat/form/:pk" element={<PangkatSubForm />} />
					<Route path="/jabatan/form" element={<JabatanSubForm />} />
					<Route path="/jabatan/form/:pk" element={<JabatanSubForm />} />

					{/* Organ */}
					<Route path="/departemen/form" element={<DepartemenSubForm />} />
					<Route path="/departemen/form/:pk" element={<DepartemenSubForm />} />
					<Route path="/divisi/form" element={<DivisiSubForm />} />
					<Route path="/divisi/form/:pk" element={<DivisiSubForm />} />
					<Route path="/unit/form" element={<UnitSubForm />} />
					<Route path="/unit/form/:pk" element={<UnitSubForm />} />

					{/* Pegawai */}
					<Route path="/pegawai/form" element={<PegawaiForm />} />
					<Route path="/pegawai/form/:pk" element={<PegawaiForm />} />

					{/* Cabang */}
					<Route path="/cabang/form" element={<CabangForm />} />
					<Route path="/cabang/form/:pk" element={<CabangForm />} />

					{/* Kalender */}
					<Route path="/kalender/form" element={<KalenderForm />} />

					{/* Gaji */}
					<Route path="/gaji/form" element={<GajiForm />} />
				</Route>

				{/* Protect the login route with the LoginPrivateRoute */}
				<Route
					path="/login"
					element={
						<LoginPrivateRoute>
							<LoginPage />
						</LoginPrivateRoute>
					}
				/>

				<Route path="*" element={<h1>404 - Page Not Found</h1>} />
			</Routes>
		</BrowserRouter>
	);
};

export default Router;
