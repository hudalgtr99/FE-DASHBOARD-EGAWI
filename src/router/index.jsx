import { Layout } from "@/components";
import { menu } from "@/constants/menu";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					{menu.map((item, index) => {
						if (item.sub?.length > 0) {
							return item.sub.map((sub, index) => {
								return (
									<Route key={index} path={sub.path} element={sub.element} />
								);
							});
						} else {
							return (
								<Route key={index} path={item.path} element={item.element} />
							);
						}
					})}
				</Route>

				<Route path="*" element={<h1>404</h1>} />
			</Routes>
		</BrowserRouter>
	);
};

export default Router;
