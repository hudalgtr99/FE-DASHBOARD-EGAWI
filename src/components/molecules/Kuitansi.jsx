import { convertToRupiah } from "@/utils/convertToRupiah";
import angkaTerbilangJs from "@develoka/angka-terbilang-js";
import { forwardRef } from "react";
import PropTypes from "prop-types";
import moment from "moment";

/**
 *
 * @param {{
 * type: 1 | 2 | 3;
 * data: object;
 * logo: any;
 * }}
 *
 */

const Kuitansi = forwardRef(function Kuitansi(props, ref) {
	const { type, data, logo } = props;

	if (type === 1) {
		return (
			<div
				ref={ref}
				className="border-2 border-base-200 dark:border-base-400 overflow-x-auto scrollbar-hide"
			>
				<div className="flex min-w-full w-max">
					<div className="[writing-mode:vertical-lr] [text-orientation:upright] p-6 tracking-tighter font-bold flex justify-center text-white bg-base-200 dark:bg-base-400">
						K W I T A N S I
					</div>
					<div className="flex-1 p-6 text-sm">
						<div className="mb-10">
							<div className="flex gap-2">
								<div className="font-semibold w-40">No. Invoice</div>
								<div className="flex-1">: {data.noInvoice}</div>
							</div>
							<div className="flex gap-2">
								<div className="font-semibold w-40">Telah Terima Dari</div>
								<div className="flex-1">: {data.telahTerimaDari}</div>
							</div>
							<div className="flex gap-2 items-start">
								<div className="font-semibold w-40 pt-1">Uang Sejumlah</div>
								<div className="capitalize flex-1 flex items-start gap-1 pt-1">
									<div className="bg-base-50 dark:bg-base-500 w-full pt-0 min-h-[35px] flex gap-1">
										:{" "}
										<span className="font-bold italic">
											{angkaTerbilangJs(data.uangSejumlah)}
										</span>
									</div>
								</div>
							</div>
							<div className="flex gap-2">
								<div className="font-semibold w-40">Untuk Pembayaran</div>
								<div className="capitalize flex-1">
									: {data.untukPembayaran}
								</div>
							</div>
						</div>

						<div className="flex justify-between gap-28">
							<div>
								<div className="flex gap-2">
									<div className="font-semibold w-40">Metode Bayar</div>
									<div className="capitalize">: {data.metodePembayaran}</div>
								</div>
								<div className="flex gap-2">
									<div className="font-semibold w-40">Jumlah</div>
									<div className="capitalize font-bold">
										: {convertToRupiah(data.uangSejumlah)}
									</div>
								</div>
							</div>

							<div className="relative mr-6 flex justify-end">
								<div>
									<div className="mb-2 relative z-10">
										<div>
											Bandar Lampung,{" "}
											{moment(data.tanggal).format("DD MMMM YYYY")}
										</div>
										<div>Diterima,</div>
									</div>

									<div className="font-bold text-3xl flex justify-center">
										{logo}
									</div>

									<div className="relative z-10 text-center">
										<div>{data.penerima}</div>
										<div>PT QUEEN NETWORK NUSANTARA</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (type === 2) {
		return (
			<div
				ref={ref}
				className="border-2 border-base-200 dark:border-base-400 overflow-x-auto scrollbar-hide"
			>
				<div className="flex min-w-full w-max">
					<div className="[writing-mode:vertical-lr] [text-orientation:upright] p-6 tracking-tighter font-bold flex justify-center bg-base-50 dark:bg-base-500">
						K W I T A N S I
					</div>
					<div className="flex-1 p-6 text-sm">
						<div className="mb-10">
							<div className="flex gap-2">
								<div className="font-semibold w-40">No. Invoice</div>
								<div className="flex-1">: {data.noInvoice}</div>
							</div>
							<div className="flex gap-2">
								<div className="font-semibold w-40">Telah Terima Dari</div>
								<div className="flex-1">: {data.telahTerimaDari}</div>
							</div>
							<div className="flex gap-2 items-start">
								<div className="font-semibold w-40 pt-1">Uang Sejumlah</div>
								<div className="capitalize flex-1 flex items-start gap-1 pt-1">
									<div className="bg-base-50 dark:bg-base-500 w-full pt-0 min-h-[35px] flex gap-1">
										:{" "}
										<span className="font-bold italic">
											{angkaTerbilangJs(data.uangSejumlah)}
										</span>
									</div>
								</div>
							</div>
							<div className="flex gap-2">
								<div className="font-semibold w-40">Untuk Pembayaran</div>
								<div className="capitalize flex-1">
									: {data.untukPembayaran}
								</div>
							</div>
						</div>

						<div className="flex justify-between gap-28">
							<div>
								<div className="flex gap-2">
									<div className="font-semibold w-40">Metode Bayar</div>
									<div className="capitalize">: {data.metodePembayaran}</div>
								</div>
								<div className="flex gap-2">
									<div className="font-semibold w-40">Jumlah</div>
									<div className="capitalize font-bold">
										: {convertToRupiah(data.uangSejumlah)}
									</div>
								</div>
							</div>

							<div className="relative mr-6">
								<div className="mb-2 relative z-10">
									<div>
										Bandar Lampung,{" "}
										{moment(data.tanggal).format("DD MMMM YYYY")}
									</div>
									<div>Diterima,</div>
								</div>

								<div className="flex justify-center items-center">
									<div className="font-bold text-3xl">{logo}</div>
								</div>

								<div className="relative z-10 text-center">
									<div>{data.penerima}</div>
									<div>PT QUEEN NETWORK NUSANTARA</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (type === 3) {
		return (
			<div
				ref={ref}
				className="border-2 border-base-200 dark:border-base-400 overflow-x-auto scrollbar-hide"
			>
				<div className="flex min-w-full w-max">
					<div
						style={{
							backgroundColor: "#3B82F6",
							color: "#ffffff",
						}}
						className="[writing-mode:vertical-lr] [text-orientation:upright] p-6 tracking-tighter font-bold flex justify-center"
					>
						K W I T A N S I
					</div>
					<div className="flex-1 p-6 text-sm">
						<div className="mb-10">
							<div className="flex gap-2">
								<div className="font-semibold w-40">No. Invoice</div>
								<div className="flex-1">: {data.noInvoice}</div>
							</div>
							<div className="flex gap-2">
								<div className="font-semibold w-40">Telah Terima Dari</div>
								<div className="flex-1">: {data.telahTerimaDari}</div>
							</div>
							<div className="flex gap-2 items-start">
								<div className="font-semibold w-40 pt-1">Uang Sejumlah</div>
								<div className="capitalize flex-1 flex items-start gap-1 pt-1">
									<div className="bg-[#3B82F690] text-black w-full pt-0 min-h-[35px] flex gap-1">
										:{" "}
										<span className="font-bold italic">
											{angkaTerbilangJs(data.uangSejumlah)}
										</span>
									</div>
								</div>
							</div>
							<div className="flex gap-2">
								<div className="font-semibold w-40">Untuk Pembayaran</div>
								<div className="capitalize flex-1">
									: {data.untukPembayaran}
								</div>
							</div>
						</div>

						<div className="flex justify-between gap-28">
							<div>
								<div className="flex gap-2">
									<div className="font-semibold w-40">Metode Bayar</div>
									<div className="capitalize">: {data.metodePembayaran}</div>
								</div>
								<div className="flex gap-2">
									<div className="font-semibold w-40">Jumlah</div>
									<div className="capitalize font-bold">
										: {convertToRupiah(data.uangSejumlah)}
									</div>
								</div>
							</div>

							<div className="relative mr-6">
								<div className="mb-2 relative z-10">
									<div>
										Bandar Lampung,{" "}
										{moment(data.tanggal).format("DD MMMM YYYY")}
									</div>
									<div>Diterima,</div>
								</div>

								<div className="flex justify-center items-center">
									<div className="font-bold text-3xl">{logo}</div>
								</div>

								<div className="relative z-10 text-center">
									<div>{data.penerima}</div>
									<div>PT QUEEN NETWORK NUSANTARA</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return null;
});

Kuitansi.propTypes = {
	type: PropTypes.oneOf([1, 2, 3]),
	data: PropTypes.object,
	logo: PropTypes.any,
};

Kuitansi.defaultProps = {
	type: 1,
	data: {},
	logo: "LOGO",
};

export default Kuitansi;
