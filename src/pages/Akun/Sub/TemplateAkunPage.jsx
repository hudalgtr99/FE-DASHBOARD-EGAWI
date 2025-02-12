import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteData, getData, updateData } from "@/actions";
import { userReducer } from "@/reducers/authReducers";
import {
	API_URL_edeluser,
	API_URL_changeactive,
	API_URL_changeoutofarea,
	API_URL_getperusahaan,
	API_URL_getakun,
} from "@/constants";
import { icons } from "../../../../public/icons";
import { Button, Container, Pagination, Tables, Select, TextField, Tooltip, PulseLoading } from "@/components";
import { debounce } from "lodash"; // Import lodash debounce
import { CiSearch } from "react-icons/ci";
import axiosAPI from "@/authentication/axiosApi";
import { FaFileExcel } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { isAuthenticated } from "@/authentication/authenticationApi";
import { Checkbox } from "../../../components";
import { LuKeyRound, LuPencil, LuTrash2 } from "react-icons/lu";
import { useAuth } from "../../../context/AuthContext";

const TemplateAkun = ({ getapiakun, activeTab }) => {
	const { getDataAkunResult, addAkunResult, deleteAkunResult, getDataAkunLoading } = useSelector(
		(state) => state.auth
	);
	const location = useLocation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// States & Variables
	const [limit, setLimit] = useState(10);
	const [pageActive, setPageActive] = useState(0);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);
	const { selectedPerusahaan, loadingPerusahaan } = useAuth();

	// useEffect(() => {
	//   const fetchData = async () => {
	//     try {
	//       if (activeTab === "0") {
	//         url += "?active=true";
	//       } else if (activeTab === "1") {
	//         url += "?active=false";
	//       }
	//     } catch (error) {
	//       console.error("Error fetching perusahaan data:", error);
	//     }
	//   };

	//   fetchData();
	// }, []); // Add activeTab as a dependency to refetch on tab change

	const debouncedSearch = useCallback(
		debounce((value) => {
			const param = {
				param: `?search=${value}&limit=${limit}&offset=${pageActive * limit}`,
			};

			// Jika perusahaan dipilih, tambahkan parameter perusahaan ke dalam query string
			if (selectedPerusahaan) {
				param.param += `&perusahaan=${selectedPerusahaan.value}`;
			}

			get(param);
		}, 1000),
		[limit, pageActive, selectedPerusahaan] // Tambahkan selectedPerusahaan sebagai dependency
	);

	const doSearch = (e) => {
		const { value } = e.target;
		setSearch(value);
		debouncedSearch(value);
		setPageActive(0);
	};

	const onEdit = async (item) => {
		try {
			const getDataUser = await axiosAPI.get(API_URL_getakun + item.id);
			// Store the item in localStorage
			localStorage.setItem("editUserData", JSON.stringify(getDataUser.data));
			navigate(`/kepegawaian/data-pegawai/form/${item.datapribadi.no_identitas}`);
			sessionStorage.setItem("url", location.pathname);
			sessionStorage.setItem("activeTab", activeTab);
		} catch (error) {
			console.log(error);
			alert(error.response.data.error || "Terjadi Kesalahan saat mengambil detail pegawai");
		}
	};

	const onChange = (item) => {
		sessionStorage.setItem("url", location.pathname);
		sessionStorage.setItem("activeTab", activeTab);
		navigate(`/kepegawaian/data-pegawai/changepassword/${item.datapribadi.no_identitas}`);
	};

	const doDelete = (item) => {
		deleteData({ dispatch, redux: userReducer }, item.datapribadi.user_id, API_URL_edeluser, "DELETE_AKUN");
	};

	const get = useCallback(
		async (param) => {
			await getData({ dispatch, redux: userReducer }, param, getapiakun, "GET_AKUN");
			setLoading(false);
		},
		[dispatch]
	);

	const handlePageClick = (page) => {
		const offset = (page - 1) * limit; // Calculate the offset based on the page

		// Menyiapkan parameter pencarian dan perusahaan
		const param = {
			param: `?search=${search || ""}&perusahaan=${
				selectedPerusahaan?.value || ""
			}&limit=${limit}&offset=${offset}`,
		};

		get(param);
		setPageActive(page - 1);
	};

	const handleSwitch = (e, item, index) => {
		if (index === 6) {
			updateData(
				{ dispatch, redux: userReducer },
				{
					pk: item.datapribadi.user_id,
					is_staff: e.target.checked,
				},
				API_URL_changeactive,
				"ADD_AKUN"
			);
		} else if (index === 7) {
			updateData(
				{ dispatch, redux: userReducer },
				{
					pk: item.datapribadi.user_id,
					out_of_area: e.target.checked,
				},
				API_URL_changeoutofarea,
				"ADD_AKUN"
			);
		}
	};

	useEffect(() => {
		const param = selectedPerusahaan
			? {
					param: `?perusahaan=${selectedPerusahaan.value}&limit=${limit}&search=${search || ""}&offset=${
						pageActive * limit
					}`,
			  }
			: {
					param: `?limit=${limit}&search=${search || ""}&offset=${pageActive * limit}`,
			  };
		get(param);
	}, [limit, pageActive, search, selectedPerusahaan, get]);

	useEffect(() => {
		if (addAkunResult || deleteAkunResult) {
			const offset = pageActive * limit;
			const param = search
				? {
						param: `?search=${search}&perusahaan=${
							selectedPerusahaan?.value || ""
						}&limit=${limit}&offset=${offset}`,
				  }
				: {
						param: `?perusahaan=${selectedPerusahaan?.value || ""}&limit=${limit}&offset=${offset}`,
				  };
			get(param);
		}
	}, [addAkunResult, deleteAkunResult, search, selectedPerusahaan, limit, pageActive, get]);

	const dataWithIndex = getDataAkunResult.results
		? getDataAkunResult.results.map((item, index) => ({
				...item,
				index: pageActive * limit + index + 1,
		  }))
		: [];

	const [actions] = useState([
		{
			name: "Edit",
			icon: <LuPencil />,
			color: "success",
			func: onEdit,
		},
		{
			name: "Change Password",
			icon: <LuKeyRound />,
			color: "warning",
			func: onChange,
		},
		{
			name: "Delete",
			// icon: icons.rideletebin6line,
			icon: <LuTrash2 />,
			color: "danger",
			func: doDelete,
		},
	]);

	return (
		<div>
			<Container>
				<div className="mb-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
					<div className={`w-full flex gap-2 sm:w-60`}>
						<TextField onChange={doSearch} placeholder="Search" value={search} icon={<CiSearch />} />
					</div>
					<div className="flex gap-2 items-center">
						{/* <Tooltip tooltip="Import Pegawai">
              <Button
                color="success"
                onClick={() => navigate("/kepegawaian/data-pegawai/import-pegawai")}
                size="40"
              >
                
              </Button>
            </Tooltip> */}
						<Button onClick={() => navigate("/akun/import-pegawai")}>
							<div className="flex items-center gap-2">
								<FaFileExcel className="text-lg text-white" /> Import Pegawai
							</div>
						</Button>
					</div>
				</div>
				{getDataAkunLoading ? (
					<div className="flex justify-center items-center">
						<PulseLoading />
					</div>
				) : (
					<Tables>
						<Tables.Head>
							<tr>
								<Tables.Header>No</Tables.Header>
								<Tables.Header>Nama Perusahaan</Tables.Header>
								{/* <Tables.Header>Id pegawai</Tables.Header> */}
								<Tables.Header>Nama Pribadi</Tables.Header>
								<Tables.Header>Jabatan</Tables.Header>
								<Tables.Header>Email</Tables.Header>
								<Tables.Header>Nomor Telepon</Tables.Header>
								<Tables.Header>Active</Tables.Header>
								<Tables.Header>Out of Area</Tables.Header>
								<Tables.Header center>Actions</Tables.Header>
							</tr>
						</Tables.Head>
						<Tables.Body>
							{dataWithIndex.length > 0 ? (
								dataWithIndex.map((item) => (
									<Tables.Row key={item.datapribadi.user_id}>
										<Tables.Data>{item.index}</Tables.Data>
										<Tables.Data>
											{(item?.datapribadi?.perusahaan && item.datapribadi.perusahaan.nama) || "-"}
										</Tables.Data>
										{/* <Tables.Data>{item.datapegawai?.id_pegawai || "belum ada"}</Tables.Data> */}
										<Tables.Data>{item.datapribadi.nama}</Tables.Data>
										<Tables.Data>{item.datapegawai?.jabatan?.nama || "-"}</Tables.Data>
										<Tables.Data>{item.datapribadi.email}</Tables.Data>
										<Tables.Data>{item.datapribadi.no_telepon}</Tables.Data>
										<Tables.Data>
											<label className="flex items-center justify-center gap-2 cursor-pointer">
												<Checkbox
													color="info"
													type="checkbox"
													checked={item.datapribadi?.is_staff}
													onChange={(e) => handleSwitch(e, item, 6)} // Pass index 6 for is_staff
													className="toggle-switch"
												/>
											</label>
										</Tables.Data>
										<Tables.Data>
											<label className="flex items-center justify-center gap-2 cursor-pointer">
												<Checkbox
													color="info"
													type="checkbox"
													checked={item.datapribadi?.out_of_area}
													onChange={(e) => handleSwitch(e, item, 7)} // Pass index 7 for out_of_area
													className="toggle-switch"
												/>
											</label>
										</Tables.Data>
										<Tables.Data center>
											<div className="flex items-center justify-center gap-2">
												{actions.map((action) => (
													<Tooltip key={action.name} tooltip={action.name}>
														<Button
															size={30}
															variant="tonal"
															color={action.color}
															key={action.name}
															onClick={() => action.func(item)}
															className={`cursor-pointer`}
														>
															{action.icon}
														</Button>
													</Tooltip>
												))}
											</div>
										</Tables.Data>
									</Tables.Row>
								))
							) : (
								<Tables.Row>
									<td colSpan="9" className="text-center">
										Tidak ada data yang tersedia
									</td>
								</Tables.Row>
							)}
						</Tables.Body>
					</Tables>
				)}
				<div className="flex justify-end items-center mt-4">
					<Pagination
						totalCount={getDataAkunResult.count} // Total items count from the API result
						pageSize={limit} // Items per page (limit)
						currentPage={pageActive + 1} // Current page
						onPageChange={handlePageClick} // Page change handler
						siblingCount={1} // Number of sibling pages (adjust as needed)
						activeColor="primary" // Optional: active page color
						rounded="md" // Optional: rounded button style
						variant="flat" // Optional: button variant
						size="md" // Optional: button size
					/>
				</div>
			</Container>
		</div>
	);
};

export default TemplateAkun;
