import { Layout } from "@/components";
import { menu } from "@/constants/menu";
import LoginPage from "@/pages/Login/LoginPage";
import PrivateRoute from "@/pages/Login/PrivateRoute";
import LoginPrivateRoute from "@/pages/Login/LoginPrivateRoute"; // Import the new PrivateRoute
import { BrowserRouter, Route, Routes } from "react-router-dom";

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
