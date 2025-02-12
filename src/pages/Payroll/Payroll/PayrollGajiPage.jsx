import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteData, encrypted_id, getData } from "@/actions";
import { API_URL_edeluser, API_URL_generatepayroll, API_URL_payroll } from "@/constants";
import { Button, Container, Pagination, Tables, Tooltip, PulseLoading } from "@/components";
import { debounce } from "lodash"; // Import lodash debounce
import { FaTelegramPlane } from "react-icons/fa";

import { AuthContext, useAuth } from "@/context/AuthContext";
import { LuEye, LuPencil } from "react-icons/lu";
import { Modal } from "../../../components";
import axiosAPI from "../../../authentication/axiosApi";
import { masterGajiReducer } from "@/reducers/masterGajiReducers";
import formatRupiah from "@/utils/formatRupiah";
import { FaCalendar } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import id from "date-fns/locale/id";
import { format } from "date-fns";
import moment from "moment";
import { payrollReducer } from "@/reducers/payrollReducers";
import SelectMonthYear from "@/components/atoms/SelectMonthYear";
import { TbLoader2 } from "react-icons/tb";
import { showToast } from "@/utils/showToast";

const PayrollGajiPage = () => {
	const [periodeMonth, setPeriodeMonth] = useState(new Date());
	const [payrollPeriod, setPayrollPeriod] = useState(null);
	const [loadingRunPayroll, setLoadingRunPayroll] = useState(false);

	const { getPayrollResult, addPayrollResult, deletePayrollResult, getPayrollLoading } = useSelector(
		(state) => state.payroll
	);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	// States & Variables
	const [limit, setLimit] = useState(10);
	const [pageActive, setPageActive] = useState(0);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);
	const [loadingModal, setLoadingModal] = useState(false);
	const { slug } = useParams();
	const { selectedPerusahaan, loadingPerusahaan } = useAuth();
	const [showModal, setShowModal] = useState(false);
	const [detailGaji, setDetailGaji] = useState("");

	const { jwt } = useContext(AuthContext);

	const debouncedSearch = useCallback(
		debounce((value) => {
			const param = {
				param: `?search=${value}&limit=${limit}&offset=${pageActive * limit}`,
			};

			// Jika perusahaan dipilih, tambahkan parameter perusahaan ke dalam query string
			if (selectedPerusahaan) {
				param.param += `&perusahaan=${selectedPerusahaan.value}`;
			}

			if (periodeMonth instanceof Date && !isNaN(periodeMonth)) {
				param.param += `&periode=${moment(periodeMonth).format("YYYY-MM")}`;
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

	const onEdit = (item) => {
		// Store the item in localStorage
		navigate(`/payroll/payrollgaji/form/${encrypted_id(item.id)}`);
	};

	const onDetail = (item) => {
		navigate(`/payroll/payrollgaji/detail/${encrypted_id(item.id)}`);
	};

	const doDelete = (item) => {
		deleteData({ dispatch, redux: payrollReducer }, item.id, API_URL_edeluser, "DELETE_AKUN");
	};

	const get = useCallback(
		async (param) => {
			await getData({ dispatch, redux: payrollReducer }, param, API_URL_payroll, "GET_PAYROLL");
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

		if (periodeMonth instanceof Date && !isNaN(periodeMonth)) {
			param.param += `&periode=${moment(periodeMonth).format("YYYY-MM")}`;
		}
		get(param);
		setPageActive(page - 1);
	};

	const handleRunPayroll = async () => {
		try {
			setShowModal(false);
			setLoadingRunPayroll(true);
			const res = await axiosAPI.post(API_URL_generatepayroll, {
				payroll_period: moment(payrollPeriod).format("YYYY-MM"),
			});
			showToast("Run Payroll Berhasil Dilakukan");
		} catch (error) {
			showToast(error);
			console.log(error);
			setLoadingRunPayroll(false);
		} finally {
			setLoadingRunPayroll(false);
			setLoading(false);
		}
	};

	useEffect(() => {
		const offset = pageActive * limit;

		// Menyiapkan parameter pencarian berdasarkan kondisi slug
		const param = selectedPerusahaan?.value
			? {
					param: `?search=${search || ""}&perusahaan=${
						selectedPerusahaan?.value || ""
					}&limit=${limit}&offset=${offset}`,
			  }
			: { param: `?limit=${limit}&search=${search || ""}&offset=${offset}` };

		if (periodeMonth) {
			param.param += `&periode=${moment(periodeMonth).format("YYYY-MM")}`;
		}

		get(param);
	}, [slug, selectedPerusahaan, limit, pageActive, get, periodeMonth]);

	useEffect(() => {
		if (addPayrollResult || deletePayrollResult) {
			const param = search
				? {
						param: `?search=${search}&perusahaan=${selectedPerusahaan?.value || ""}&limit=${limit}&offset=${
							pageActive * limit
						}`,
				  }
				: {
						param: `?perusahaan=${selectedPerusahaan?.value || ""}&limit=${limit}&offset=${
							pageActive * limit
						}`,
				  };
			if (periodeMonth) {
				param.param += `&periode=${moment(periodeMonth).format("YYYY-MM")}`;
			}
			get(param);
		}
	}, [addPayrollResult, deletePayrollResult, search, limit, pageActive, get]);

	const dataWithIndex = getPayrollResult.results
		? getPayrollResult.results.map((item, index) => ({
				...item,
				index: pageActive * limit + index + 1,
		  }))
		: [];

	const [actions] = useState([
		{
			name: "Detail",
			icon: <LuEye />,
			color: "primary",
			func: onDetail,
		},
		{
			name: "Edit",
			icon: <LuPencil />,
			color: "success",
			func: onEdit,
		},
	]);

	const onAdd = () => {
		navigate(`/payroll/master-gaji/form`);
	};

	return (
		<div>
			<Container>
				<div className="flex flex-row flex-wrap md:flex-nowrap items-center gap-4 justify-between">
					{/* <div className="flex flex-row items-center gap-4">
            <button
              onClick={() => alert("hello")}
              className="flex text-sm flex-row rounded items-center gap-2 bg-orange-500 text-white w-fit px-2 py-1 hover:bg-orange-600"
            >
              <FaCogs />
              Pengaturan
            </button>
          </div> */}

					<div>
						<label className="text-sm">Periode : </label>
						<div className="">
							{/* <DatePicker
                showIcon
                className="border border-gray-200 text-sm w-[10rem] rounded-lg"
                icon=<FaCalendar />
                selected={periodeMonth}
                onChange={(date) => setPeriodeMonth(date)}
                dateFormat=" MMMM yyyy"
                showMonthYearPicker
                showFullMonthYearPicker
                locale={id}
                showTwoColumnMonthYearPicker
              /> */}
							<SelectMonthYear
								selected={periodeMonth}
								onChange={(date) => {
									const validDate = date ? new Date(date) : null;
									setPeriodeMonth(validDate && !isNaN(validDate) ? validDate : null);
								}}
							/>
						</div>
					</div>

					<button
						disabled={loadingRunPayroll}
						onClick={() => setShowModal(true)}
						className="flex text-[14px] flex-row rounded items-center gap-2 bg-sky-500 text-white w-fit px-2 py-1 hover:bg-sky-600"
					>
						{loadingRunPayroll ? <TbLoader2 className="animate-spin" /> : <FaTelegramPlane />}
						Jalankan Payroll
					</button>
				</div>

				{getPayrollLoading ? ( // Show loading indicator if loading is true
					<div className="flex justify-center py-4">
						<PulseLoading />
					</div>
				) : (
					<Tables>
						<Tables.Head>
							<tr>
								<Tables.Header>No</Tables.Header>
								{jwt?.level === "Super Admin" && <Tables.Header>Perusahaan</Tables.Header>}
								<Tables.Header>Nama Pegawai</Tables.Header>
								<Tables.Header>Jabatan</Tables.Header>
								<Tables.Header>Gaji Pokok</Tables.Header>
								<Tables.Header>Tambahan</Tables.Header>
								<Tables.Header>Potongan</Tables.Header>
								<Tables.Header>Total</Tables.Header>
								<Tables.Header center>Actions</Tables.Header>
							</tr>
						</Tables.Head>
						<Tables.Body>
							{dataWithIndex.length > 0 ? (
								dataWithIndex.map((item) => (
									<Tables.Row key={item.id}>
										<Tables.Data>{item.index || "-"}</Tables.Data>
										{jwt?.level === "Super Admin" && (
											<Tables.Data>{item?.company_name || "N/A"}</Tables.Data>
										)}
										<Tables.Data>{item?.employee_first_name || "Nama tidak tersedia"}</Tables.Data>
										<Tables.Data>{item?.jabatan_pegawai || "-"}</Tables.Data>
										<Tables.Data>{formatRupiah(item?.basic_salary)}</Tables.Data>
										<Tables.Data>
											<span className="text-green-600">{formatRupiah(item?.total_income)}</span>
										</Tables.Data>
										<Tables.Data>
											<span className="text-red-600">{formatRupiah(item?.total_deduction)}</span>
										</Tables.Data>
										<Tables.Data>
											<span className="text-gray-800">{formatRupiah(item?.total_salary)}</span>
										</Tables.Data>
										<Tables.Data center>
											<div className="flex items-center justify-center gap-2">
												{actions.map((action) => (
													<Tooltip key={action.name} tooltip={action.name}>
														<Button
															size={30}
															variant="tonal"
															color={action.color}
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
										Tidak ada data pada Periode {format(periodeMonth, "MMMM yyyy", { locale: id })}
									</td>
								</Tables.Row>
							)}
						</Tables.Body>
					</Tables>
				)}
				<div className="flex justify-end items-center mt-4">
					<Pagination
						totalCount={getPayrollResult.count} // Total items count from the API result
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

			<Modal show={showModal} setShow={setShowModal} width="md" height="md" btnClose={true} persistent={false}>
				<div className="p-6 bg-white dark:bg-base-600 dark:border-base-500 dark:text-base-200 rounded-lg shadow-lg">
					<h2 className="text-2xl font-semibold mb-4 text-center">Pilih Bulan Priode Gaji</h2>

					<div className="flex justify-center">
						<DatePicker
							showIcon
							className="border border-gray-200 text-sm w-full rounded-lg"
							icon=<FaCalendar />
							selected={payrollPeriod}
							onChange={(date) => setPayrollPeriod(date)}
							dateFormat=" MMMM yyyy"
							showMonthYearPicker
							showFullMonthYearPicker
							locale={id}
							showTwoColumnMonthYearPicker
							placeholderText="Pilih Bulan & Tahun"
						/>

						{/* <SelectMonthYear
                selected={periodeMonth}
                onChange={(date) => {
                  const validDate = date ? new Date(date) : null;
                  setPeriodeMonth(
                    validDate && !isNaN(validDate) ? validDate : null
                  );
                }}
              /> */}
					</div>

					<div className="mt-4 flex flex-row justify-between">
						<Button color="base" onClick={() => setShowModal(false)}>
							Batal
						</Button>
						<Button color="primary" onClick={() => handleRunPayroll()}>
							Submit
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default PayrollGajiPage;
