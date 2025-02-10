import {
	Button,
	Container,
	Limit,
	Loading,
	Pagination,
	Tables,
	TextField,
	Tooltip,
} from "@/components";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { TbPlus } from "react-icons/tb";
import { useSelector } from "react-redux";

const DaftarCalonTugasTable = ({
	search,
	handleSearch,
	handlePageClick,
	handleSelect,
	limit,
	setLimit,
	pageActive,
	action,
	handleAdd,
}) => {
	const { getDelegationResult, getDelegationLoading, getDelegationError } =
		useSelector((state) => state.delegation);

	const { jwt } = useContext(AuthContext);

	return (
		<Container>
			{/* Control Top */}
			<div className="mb-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
				<div className="w-full sm:w-60">
					<TextField
						placeholder="Search"
						value={search}
						onChange={handleSearch}
					/>
				</div>

				<div className="flex gap-2">
					<Button onClick={handleAdd} variant="flat" color="primary">
						<div className="flex flex-row items-center gap-2">
							<TbPlus size={16} />
							Tambah Calon Tugas
						</div>
					</Button>
				</div>
			</div>
			{/* Tables */}
			<Tables>
				<Tables.Head>
					<Tables.Row>
						<Tables.Header>No</Tables.Header>
						{jwt?.level === "Super Admin" && (
							<Tables.Header>Nama perusahaan</Tables.Header>
						)}
						<Tables.Header>Nama Pembuat</Tables.Header>
						<Tables.Header>Jabatan</Tables.Header>
						<Tables.Header>Judul</Tables.Header>
						<Tables.Header>Deskripsi</Tables.Header>
						<Tables.Header center>Aksi</Tables.Header>
					</Tables.Row>
				</Tables.Head>
				<Tables.Body>
					{getDelegationLoading ? (
						<Tables.Row>
							<Tables.Data colspan={100}>
								<div className="flex justify-center items-center p-10">
									<Loading loading={true} size={20} />
								</div>
							</Tables.Data>
						</Tables.Row>
					) : getDelegationResult?.count > 0 ? (
						getDelegationResult.results.map((item, itemIdx) => (
							<Tables.Row key={itemIdx}>
								<Tables.Data>
									{itemIdx + 1 + (pageActive - 1) * limit}
								</Tables.Data>
								{jwt?.level === "Super Admin" && (
									<Tables.Data>
										{item?.company_name || "N/A"}
									</Tables.Data>
								)}
								<Tables.Data>
									{item?.createdbydetail?.first_name ||
										"belum ada"}
								</Tables.Data>
								<Tables.Data>
									{item?.jabatan_pegawai || "belum ada"}
								</Tables.Data>
								<Tables.Data>
									<div className="capitalize">
										{item?.title || "Nama tidak tersedia"}
									</div>
								</Tables.Data>
								<Tables.Data>
									{item?.description || "-"}
								</Tables.Data>
								{action && (
									<Tables.Data center>
										<div className="flex items-center justify-center gap-1">
											{action.map(
												(subItem, subItemIdx) =>
													subItem.show && (
														<Tooltip
															key={subItemIdx}
															placement="top-end"
															tooltip={
																subItem.name
															}
														>
															<Button
																type="button"
																stopPropagation
																variant="tonal"
																color={
																	subItem.color
																}
																size="30"
																onClick={() =>
																	subItem.func(
																		item
																	)
																}
															>
																{subItem.icon}
															</Button>
														</Tooltip>
													)
											)}
										</div>
									</Tables.Data>
								)}
							</Tables.Row>
						))
					) : getDelegationError ? (
						<Tables.Row>
							<Tables.Data colspan={100}>
								<div className="flex justify-center items-center text-danger p-10">
									{getDelegationError}
								</div>
							</Tables.Data>
						</Tables.Row>
					) : (
						<Tables.Row>
							<Tables.Data colspan={100}>
								<div className="flex justify-center items-center p-10">
									Data tidak ditemukan
								</div>
							</Tables.Data>
						</Tables.Row>
					)}
				</Tables.Body>
			</Tables>

			{/* Control Bottom */}
			<div className="mt-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
				<div className="flex gap-2 items-baseline text-sm">
					<Limit
						limit={limit}
						setLimit={setLimit}
						onChange={handleSelect}
					/>
					{getDelegationResult?.count || 0}
					entries
				</div>

				<Pagination
					totalCount={getDelegationResult?.count || 0}
					onPageChange={handlePageClick}
					currentPage={pageActive}
					pageSize={limit}
				/>
			</div>
		</Container>
	);
};

export default DaftarCalonTugasTable;
