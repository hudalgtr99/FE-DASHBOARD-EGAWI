import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { deleteData, getData } from "@/actions";
import { divisiReducers } from "@/reducers/organReducers";
import { API_URL_edeldepartemen, API_URL_getdepartemen, API_URL_getperusahaan } from "@/constants";
import {
	Button,
	Container,
	Pagination,
	Tables,
	TextField,
	Tooltip,
	PulseLoading, // Import PulseLoading component
} from "@/components";
import { debounce } from "lodash"; // Import lodash debounce
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../../../context/AuthContext";
import { LuPencil, LuTrash2 } from "react-icons/lu";

const DivisiSub = () => {
	const { getDivisiResult, addDivisiResult, deleteDivisiResult, getDivisiLoading } = useSelector(
		(state) => state.organ
	); // reducer departemen gabisa, jadi pakai departemen
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { selectedPerusahaan, loadingPerusahaan } = useAuth();

	// States & Variables
	const [limit, setLimit] = useState(10);
	const [pageActive, setPageActive] = useState(0);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true); // Loading state
	const [jwt, setJwt] = useState({}); // Initialize jwt variable
	const { slug } = useParams();

	useEffect(() => {
		if (isAuthenticated()) {
			const token = isAuthenticated();
			setJwt(jwtDecode(token));
		}
	}, []);

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

	const onAdd = () => navigate("/master-data/departemen/form");

	const onEdit = (item) => {
		(item.perusahaan = item.perusahaan.id),
			navigate(`/master-data/departemen/form/${item.slug}`, {
				state: { item },
			});
	};

	const doDelete = (item) => {
		deleteData(
			{ dispatch, redux: divisiReducers },
			item.slug,
			API_URL_edeldepartemen,
			"DELETE_DIVISI"
			// reducer departemen gabisa, jadi pakai divisi
		);
	};

	const get = useCallback(
		async (param) => {
			setLoading(true); // Set loading to true
			await getData(
				{ dispatch, redux: divisiReducers },
				param,
				API_URL_getdepartemen,
				"GET_DIVISI"
				// reducer departemen gabisa, jadi pakai divisi
			);
			setLoading(false); // Set loading to false after fetching
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

	const [actions] = useState([
		{
			name: "Edit",
			icon: <LuPencil />,
			color: "success",
			func: onEdit,
		},
		{
			name: "Delete",
			icon: <LuTrash2 />,
			color: "danger",
			func: doDelete,
		},
	]);

	useEffect(() => {
		const offset = pageActive * limit;

		// Menyiapkan parameter pencarian berdasarkan kondisi slug
		const param = selectedPerusahaan
			? `?search=${search || ""}&perusahaan=${selectedPerusahaan?.value || ""}&limit=${limit}&offset=${offset}`
			: `?limit=${limit}&search=${search || ""}&offset=${offset}`;

		get({ param });
	}, [slug, selectedPerusahaan, limit, pageActive, search, get]);

	useEffect(() => {
		if (addDivisiResult || deleteDivisiResult) {
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
	}, [addDivisiResult, deleteDivisiResult, selectedPerusahaan, search, limit, pageActive, get]); // reducer departemen gabisa, jadi pakai departemen

	const dataDepartemen = getDivisiResult.results
		? getDivisiResult.results.map((item, index) => ({
				...item,
				index: pageActive * limit + index + 1,
		  }))
		: []; // reducer departemen gabisa, jadi pakai divisi

	return (
		<div>
			<Container>
				<div className="mb-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
					<div className={`w-full flex gap-2 sm:w-60`}>
						<TextField onChange={doSearch} placeholder="Search" value={search} icon={<CiSearch />} />
					</div>
					<Button onClick={onAdd}>
						<div className="flex items-center gap-2">
							<FaPlus /> Tambah Departemen
						</div>
					</Button>
				</div>
				{getDivisiLoading ? ( // Show loading indicator if loading is true
					<div className="flex justify-center py-4">
						<PulseLoading />
					</div>
				) : (
					<Tables>
						<Tables.Head>
							<tr>
								<Tables.Header>No</Tables.Header>
								{!jwt?.perusahaan && <Tables.Header>Nama Perusahaan</Tables.Header>}
								<Tables.Header>Nama Departemen</Tables.Header>
								<Tables.Header center>Actions</Tables.Header>
							</tr>
						</Tables.Head>
						<Tables.Body>
							{dataDepartemen.length > 0 ? (
								dataDepartemen.map((item) => (
									<Tables.Row key={item.pk}>
										<Tables.Data>{item.index}</Tables.Data>
										{!jwt?.perusahaan && <Tables.Data>{item?.perusahaan?.nama}</Tables.Data>}
										<Tables.Data>{item.nama}</Tables.Data>
										<Tables.Data center>
											<div className="flex items-center justify-center gap-2">
												{actions.map((action, i) => (
													<Tooltip key={`${action.name}-${i}`} tooltip={action.name}>
														<Button
															size={30}
															variant="tonal"
															color={action.color}
															onClick={() => action.func(item)}
															className={`${action.color} cursor-pointer`}
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
									<td className="text-center" colSpan="4">
										<p>Tidak ada data yang tersedia</p>
									</td>
								</Tables.Row>
							)}
						</Tables.Body>
					</Tables>
				)}
				<div className="flex justify-end items-center mt-4">
					<Pagination
						totalCount={getDivisiResult.count} // Total items count from the API result
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

export default DivisiSub;
