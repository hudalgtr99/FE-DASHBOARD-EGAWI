import { logoutUser } from "@/actions/auth";
import { Avatar, Badge, ButtonDarkMode, ButtonRipple, List, Popover, Select, Tooltip } from "@/components";
import { fetchUserDetails } from "@/constants/user";
import { ThemeContext } from "@/context/ThemeContext";
import { authReducer } from "@/reducers/authReducers";
import { useCallback, useContext, useEffect, useState } from "react";
import { HiOutlineMenu } from "react-icons/hi";
import { TbBuilding, TbLogout, TbUser } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AuthContext, useAuth } from "../../context/AuthContext";
import BreadCrumb from "./BreadCrumb";

const Header = () => {
	const { themeSkin, navbarType, colorMode, setSideOpen } = useContext(ThemeContext);

	const { logoutUserResult } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const [user, setUser] = useState([]);
	const [loading, setLoading] = useState(true);
	const { jwt } = useContext(AuthContext);

	const { perusahaanOptions, selectedPerusahaan, updateSelectedPerusahaan } = useAuth();

	const fetchData = useCallback(async () => {
		setLoading(true);
		try {
			const userData = await fetchUserDetails();
			setUser(userData?.datapribadi);
		} catch (error) {
			console.error("Error fetching user details:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// const [dataNotif, setDataNotif] = useState([
	// 	// Data notifikasi
	// ]);

	const onLogout = (e) => {
		e.preventDefault();
		logoutUser(dispatch);
	};

	useEffect(() => {
		if (logoutUserResult) {
			dispatch(authReducer({ type: "LOGOUT_USER", payload: { data: false } }));
		}
	}, [logoutUserResult, dispatch]);

	const handleSelect = (selectedOption) => {
		updateSelectedPerusahaan(selectedOption);
	};

	return (
		<header
			className={`bg-base-50/30 dark:bg-neutral-900/10 backdrop-blur-sm h-20 px-6 pt-4 pb-0 top-0 w-full z-30 relative ${navbarType}`}
		>
			<div
				className={`w-full h-full flex justify-between items-center px-6 bg-white/80 dark:bg-base-600/80 backdrop-blur-sm rounded-md ${
					themeSkin === "default" ? "shadow-lg" : themeSkin
				}`}
			>
				<div>
					<div onClick={() => setSideOpen(true)} className="cursor-pointer block lg:hidden">
						<HiOutlineMenu className="text-2xl" />
					</div>
					<div className="hidden lg:flex items-center gap-2 text-base">
						<BreadCrumb />
					</div>
				</div>

				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						{jwt && jwt?.level === "Super Admin" && (
							<div className=" hidden md:block w-60 mr-3">
								<Select
									options={perusahaanOptions}
									placeholder="Filter perusahaan"
									onChange={handleSelect} // Memanggil handleSelect saat ada perubahan
									value={selectedPerusahaan} // Menampilkan perusahaan yang dipilih
								/>
							</div>
						)}
						{/* Dark Mode */}
						<Tooltip tooltip={colorMode === "light" ? "Dark Mode" : "Light Mode"} delay={500}>
							<ButtonDarkMode />
						</Tooltip>
					</div>

					{/* Profile */}
					<Popover
						placement="bottom-end"
						spacing={20}
						rounded="md"
						button={
							<ButtonRipple className="rounded-full">
								<Badge size="sm" placement="right-end" color="success">
									{user?.photo ? (
										<Avatar color="primary" className="object-cover">
											{loading ? (
												""
											) : (
												<img src={user?.photo} alt="" className="w-full h-full object-cover" />
											)}
										</Avatar>
									) : (
										<Avatar color="primary">
											{loading && user ? "" : user?.nama?.substring(0, 2).toUpperCase()}
										</Avatar>
									)}
								</Badge>
							</ButtonRipple>
						}
					>
						<div className="text-sm w-full md:min-w-[260px]">
							<div className="p-4 border-b dark:border-base-500">
								{loading ? (
									<div className="text-center">Loading user details...</div> // Tampilkan loading
								) : (
									<Link to="/profile" className="flex gap-2 items-center">
										<div className="w-fit">
											{user?.photo ? (
												<Avatar color="primary" className="object-cover">
													{loading ? (
														""
													) : (
														<img
															src={user?.photo}
															alt=""
															className="w-full h-full object-cover"
														/>
													)}
												</Avatar>
											) : (
												<Avatar color="primary">
													{loading && user ? "" : user?.nama?.substring(0, 2).toUpperCase()}
												</Avatar>
											)}
										</div>
										<div>
											<div className="text-sm font-semibold whitespace-nowrap line-clamp-1">
												{user?.nama}
											</div>
											<div className="text-xs line-clamp-1">{user?.email}</div>
										</div>
									</Link>
								)}
							</div>
							<div className="p-2 font-medium border-b dark:border-base-500">
								<Link to={"/profile"}>
									<List prefix={<TbUser />} density="loose">
										<div className="line-clamp-1">{user?.groups?.name}</div>
									</List>
								</Link>
							</div>
							{user?.perusahaan && (
								<div className="p-2 font-medium border-b dark:border-base-500">
									<List prefix={<TbBuilding />} density="loose">
										<div className=" line-clamp-1">{user?.perusahaan.nama}</div>
									</List>
								</div>
							)}
							<div className="p-2 font-medium">
								<List onClick={onLogout} color="danger" prefix={<TbLogout />} density="loose">
									Logout
								</List>
							</div>
						</div>
					</Popover>
				</div>
			</div>
		</header>
	);
};

export default Header;
