import { getData, updateData } from "@/actions";
import {
	Button,
	Checkbox,
	Container,
	Pagination,
	Popover,
	PulseLoading,
	Tables,
	TextField,
	Tooltip,
} from "@/components";
import { API_URL_changeactivedata, API_URL_getperusahaan_withPaginations } from "@/constants";
import { perusahaanReducer } from "@/reducers/perusahaanReducers";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
	BsAward,
	BsBriefcase,
	BsCalendar2Date,
	BsClock,
	BsEnvelope,
	BsFileRichtext,
	BsJournalText,
	BsPeople,
	BsThreeDots,
} from "react-icons/bs";
import { LuMapPin, LuPencil } from "react-icons/lu";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext";

const PerusahaanPage = () => {
	const { getperusahaanResult, getperusahaanLoading, addperusahaanResult, deleteperusahaanResult } = useSelector(
		(state) => state.perusahaan
	);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// States & Variables
	const [limit, setLimit] = useState(10);
	const [pageActive, setPageActive] = useState(0);
	const [search, setSearch] = useState("");
	const { perusahaanOptions, updateSelectedPerusahaan } = useAuth();

	const debouncedSearch = useCallback(
		debounce((value) => {
			const param = value
				? {
						param: `?search=${value}&limit=${limit}&offset=${pageActive * limit}`,
				  }
				: { param: `?limit=${limit}&offset=${pageActive * limit}` };
			get(param);
		}, 1000),
		[limit, pageActive]
	);

	const doSearch = (e) => {
		const { value } = e.target;
		setSearch(value);
		debouncedSearch(value);
		setPageActive(0);
	};

	const onAdd = () => {
		navigate("/perusahaan/form");
	};

	const onEdit = (item) => {
		navigate(`/perusahaan/form/${item.slug}`, {
			state: {
				item,
			},
		});
	};

	const get = useCallback(
		async (param) => {
			getData(
				{ dispatch, redux: perusahaanReducer },
				param,
				API_URL_getperusahaan_withPaginations,
				"GET_perusahaan"
			);
		},
		[dispatch]
	);

	const handlePageClick = (page) => {
		const offset = (page - 1) * limit; // Calculate the offset based on the page
		const param = search
			? { param: `?search=${search}&limit=${limit}&offset=${offset}` }
			: { param: `?limit=${limit}&offset=${offset}` };

		get(param);
		setPageActive(page - 1); // Set the active page
	};

	const toMenu = (item, url) => {
		// Cari perusahaan berdasarkan slug
		const perusahaan = perusahaanOptions.find((opt) => opt.value === item.slug);

		// Perbarui selectedPerusahaan
		updateSelectedPerusahaan(perusahaan || null);

		// Navigasi ke URL yang sesuai
		navigate(`/perusahaan/${url}/${item.slug}`);
	};

	const [actions] = useState([
		{
			name: "Edit",
			icon: <LuPencil />,
			color: "success",
			slug: "",
			func: onEdit,
		},
	]);
	const [menu] = useState([
		{
			name: "Jam kerja",
			icon: <BsClock />,
			color: "#8b5cf6",
			slug: "jam-kerja",
			func: toMenu,
		},
		{
			name: "Lokasi absen",
			icon: <LuMapPin />,
			color: "success",
			slug: "lokasi-absen",
			func: toMenu,
		},
		{
			name: "Jabatan",
			icon: <BsAward />,
			color: "warning",
			slug: "jabatan",
			func: toMenu,
		},
		{
			name: "Departemen",
			icon: <BsBriefcase />,
			color: "#d946ef",
			slug: "departemen",
			func: toMenu,
		},
		{
			name: "Daftar pegawai",
			icon: <BsPeople />,
			color: "#14b8a6",
			slug: "pegawai",
			func: toMenu,
		},
		{
			name: "Daftar tugas",
			icon: <BsJournalText />,
			color: "#f97316",
			slug: "penugasan",
			func: toMenu,
		},
		{
			name: "Template surat",
			icon: <BsFileRichtext />,
			color: "#6366f1",
			slug: "master-template",
			func: toMenu,
		},
		{
			name: "Surat penugasan",
			icon: <BsEnvelope />,
			color: "danger",
			slug: "surat-penugasan",
			func: toMenu,
		},
		{
			name: "Kalender",
			icon: <BsCalendar2Date />,
			color: "#22c55e",
			slug: "kalender",
			func: toMenu,
		},
	]);

	useEffect(() => {
		const param = { param: `?limit=${limit}&offset=${pageActive * limit}` };
		if (search) {
			get({
				param: `?search=${search}&limit=${limit}&offset=${pageActive * limit}`,
			});
		} else {
			get(param);
		}
	}, [limit, pageActive, search, get]);

	useEffect(() => {
		if (addperusahaanResult || deleteperusahaanResult) {
			const param = search
				? {
						param: `?search=${search}&limit=${limit}&offset=${pageActive * limit}`,
				  }
				: { param: `?limit=${limit}&offset=${pageActive * limit}` };
			get(param);
		}
	}, [addperusahaanResult, deleteperusahaanResult, search, limit, pageActive, get]);

	const dataWithIndex = getperusahaanResult.results
		? getperusahaanResult.results.map((item, index) => ({
				...item,
				index: pageActive * limit + index + 1,
		  }))
		: [];

	function handleActive(e, item) {
		Swal.fire({
			title: "Apakah Anda yakin?",
			text: "Ingin mengubah status perusahaan ini?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#6a82fb",
			cancelButtonColor: "#d33",
			confirmButtonText: "Ya, ubah!",
			cancelButtonText: "Batal",
			customClass: {
				container: "z-[99999]",
			},
		}).then((result) => {
			if (result.isConfirmed) {
				const data = updateData(
					{ dispatch, redux: perusahaanReducer },
					{
						pk: "perusahaan",
						slug: item.slug,
					},
					API_URL_changeactivedata,
					"ADD_perusahaan"
				);
			}
		});
	}

	return (
		<div>
			<Container>
				<div className="mb-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
					<div className="w-full sm:w-60">
						<TextField onChange={doSearch} placeholder="Search" value={search} icon={<CiSearch />} />
					</div>
					<Button type="tonal" onClick={onAdd}>
						<div className="flex items-center gap-2">
							<FaPlus /> Tambah Perusahaan
						</div>
					</Button>
				</div>

				{getperusahaanLoading ? (
					<div className="flex justify-center py-4">
						<PulseLoading />
					</div>
				) : (
					<Tables style={{ overflow: "auto" }}>
						<Tables.Head>
							<tr>
								<Tables.Header>No</Tables.Header>
								<Tables.Header>Nama perusahaan</Tables.Header>
								<Tables.Header>No Telepon</Tables.Header>
								<Tables.Header>Alamat</Tables.Header>
								<Tables.Header>Active</Tables.Header>
								<Tables.Header center>Actions</Tables.Header>
							</tr>
						</Tables.Head>
						<Tables.Body>
							{dataWithIndex.length > 0 ? (
								dataWithIndex.map((item) => (
									<Tables.Row key={item.pk}>
										<Tables.Data>{item.index}</Tables.Data>
										<Tables.Data>{item.nama}</Tables.Data>
										<Tables.Data>{item.no_telepon}</Tables.Data>
										<Tables.Data>{item.alamat}</Tables.Data>
										<Tables.Data center>
											<label className="flex items-center justify-center gap-2 cursor-pointer">
												<Checkbox
													type="checkbox"
													color="info"
													checked={item.is_active ? true : false}
													onChange={(e) => handleActive(e, item)}
													className="toggle-switch"
												/>
											</label>
										</Tables.Data>
										<Tables.Data center style={{ position: "relative" }}>
											<div className="flex items-center justify-center gap-2">
												{actions.map((action, i) => (
													<Tooltip key={i} tooltip={action.name} placement="top-end">
														<Button
															size={30}
															variant="tonal"
															color={`${action.color}`}
															onClick={() => action.func(item, action.slug)}
															className={`cursor-pointer`}
														>
															{action.icon}
														</Button>
													</Tooltip>
												))}
												<div className="flex items-center justify-center gap-2">
													<Popover
														placement="bottom-end"
														button={
															<Tooltip tooltip="Menu" placement="top-end">
																<Button
																	size={30}
																	variant="tonal"
																	color="info"
																	className="cursor-pointer"
																>
																	<BsThreeDots size={20} />
																</Button>
															</Tooltip>
														}
													>
														<div className="rounded text-sm shadow-lg flex flex-col">
															{menu.map((action, i) => (
																<Button
																	size="md"
																	variant="text"
																	rounded="none"
																	color={action.color}
																	key={i}
																	onClick={() => action.func(item, action.slug)}
																>
																	<div
																		onClick={() => action.func(item, action.slug)}
																		className="flex gap-2 items-center"
																	>
																		<div
																			className={`text-base ${action.color} cursor-pointer`}
																		>
																			{action.icon}
																		</div>
																		<h2 className="text-xs whitespace-nowrap font-medium">
																			{action.name}
																		</h2>
																	</div>
																</Button>
															))}
														</div>
													</Popover>
												</div>
											</div>
										</Tables.Data>
									</Tables.Row>
								))
							) : (
								<Tables.Row>
									<td className="text-center" colSpan="5">
										<p>Tidak ada data yang tersedia</p>
									</td>
								</Tables.Row>
							)}
						</Tables.Body>
					</Tables>
				)}

				<div className="flex justify-end items-center mt-4">
					<Pagination
						totalCount={getperusahaanResult.count}
						pageSize={limit}
						currentPage={pageActive + 1}
						onPageChange={handlePageClick}
						siblingCount={1}
						activeColor="primary"
						rounded="md"
						variant="flat"
						size="md"
					/>
				</div>
			</Container>
		</div>
	);
};

export default PerusahaanPage;
