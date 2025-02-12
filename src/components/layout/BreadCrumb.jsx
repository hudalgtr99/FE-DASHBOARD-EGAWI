import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useEffect, useState } from "react";
import { TbArrowNarrowLeft, TbChevronRight } from "react-icons/tb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "..";

const BreadCrumb = () => {
	const { themeColor } = useContext(ThemeContext);
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const pathMenu = pathname.split("/").filter((item) => item);

	const [isHover, setIsHover] = useState([{ status: false }]);

	useEffect(() => {
		setIsHover(pathMenu.map(() => ({ status: false })));
	}, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="capitalize line-clamp-1 font-medium">
			{pathMenu.length === 0 && <div>Dashboard</div>}
			{pathMenu.length === 1 && <div>{pathMenu[0]}</div>}
			{pathMenu.length === 2 && <div>{pathMenu[1].split("-").join(" ")}</div>}
			{pathMenu.length > 2 && (
				<div className="flex gap-2 items-center">
					<Button rounded="full" size="40" variant="text" onClick={() => navigate(-1)} color="primary">
						<TbArrowNarrowLeft size={20} />
					</Button>
					{pathMenu.map((item, itemIdx) => {
						if (itemIdx !== 0 && itemIdx + 1 !== pathMenu.length) {
							return (
								<div key={itemIdx} className="flex items-center gap-x-2 text-base-100">
									<div
										onMouseEnter={() => {
											if (itemIdx + 1 !== pathMenu.length) {
												const tmp = [...isHover];
												tmp[itemIdx].status = true;
												setIsHover(tmp);
											}
										}}
										onMouseLeave={() => {
											if (itemIdx + 1 !== pathMenu.length) {
												const tmp = [...isHover];
												tmp[itemIdx].status = false;
												setIsHover(tmp);
											}
										}}
										style={{
											color: isHover[itemIdx]?.status ? themeColor : "inherit",
										}}
										className="capitalize line-clamp-1 hover:text-base-300 cursor-pointer"
										onClick={() => {
											if (item === "form") return;
											navigate(`/${pathMenu.slice(0, itemIdx + 1).join("/")}`);
										}}
									>
										{item.split("-").join(" ")}
									</div>
									<TbChevronRight size={16} />
								</div>
							);
						}
						if (itemIdx + 1 === pathMenu.length) {
							return (
								<div key={itemIdx} className="capitalize line-clamp-1">
									{item.split("-").join(" ")}
								</div>
							);
						}
						return null;
					})}
				</div>
			)}
		</div>
	);
};

export default BreadCrumb;
