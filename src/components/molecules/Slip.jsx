import { convertToRupiah } from "@/utils/convertToRupiah";
import { forwardRef } from "react";
import PropTypes from "prop-types";

/**
 *
 * @param {{
 * data: object;
 * company: object;
 * logo: any;
 * }}
 *
 */

const Slip = forwardRef(({ logo, data, company }, ref) => {
	return (
		<div ref={ref} className="p-6 sm:p-10 overflow-x-auto">
			<div className="min-w-full w-max">
				<div className="flex justify-between items-start gap-x-20 gap-y-2 mb-8">
					<div>
						{/* Logo */}
						<div>
							<div className="font-bold text-4xl">{logo}</div>
						</div>
						<div className="text-sm mt-4">
							<div className="uppercase font-semibold">{company.name}</div>
							<div className="text-xs">{company.address}</div>
						</div>
					</div>
					<div className="w-fit text-left sm:text-right">
						<div className="font-bold text-4xl tracking-wider">SLIP GAJI</div>
					</div>
				</div>

				<div className="flex flex-wrap gap-x-20 gap-y-2 mb-8">
					<div className="text-sm">
						<div>Nama / ID Pegawai</div>
						<div>Dept / Jabatan</div>
						<div>Tgl Mulai Bekerja</div>
						<div>Periode Gaji</div>
					</div>
					<div className="text-sm">
						<div>{data.pegawai.name}</div>
						<div>{data.pegawai.address}</div>
						<div>{data.pegawai.tgl_masuk}</div>
						<div>{data.pegawai.periode_gaji}</div>
					</div>
				</div>

				<div className="text-sm mb-8 overflow-x-auto scrollbar-hide">
					<table className="w-full">
						<tbody>
							{/* Pendapatan Section */}
							<tr>
								<td colSpan={5} className="font-bold">Pendapatan</td>
							</tr>
							{data.pendapatan.map((item, itemIdx) => (
								<tr key={itemIdx}>
									<td className="p-2">{item.name}</td>
									<td className="p-2"></td>
									<td className="p-2"></td>
									<td className="p-2">{convertToRupiah(item.price)}</td>
									<td className="p-2 text-right">{convertToRupiah(item.price)}</td>
								</tr>
							))}

							<tr className="border-t border-b dark:border-base-400">
								<td colSpan={4} className="pt-2 px-2 text-right">Total Pendapatan</td>
								<td className="pt-2 px-2 text-right">
									{convertToRupiah(
										data.pendapatan.reduce((acc, item) => acc + item.price, 0)
									)}
								</td>
							</tr>

							{/* Potongan Section */}
							<tr>
								<td colSpan={5} className="font-bold">Potongan</td>
							</tr>
							{data.potongan.map((item, itemIdx) => (
								<tr key={itemIdx}>
									<td className="p-2">{item.name}</td>
									<td className="p-2"></td>
									<td className="p-2"></td>
									<td className="p-2">{convertToRupiah(item.price)}</td>
									<td className="p-2 text-right">{convertToRupiah(item.price)}</td>
								</tr>
							))}

							<tr className="border-t dark:border-base-400">
								<td colSpan={4} className="pt-2 px-2 text-right">Total Potongan</td>
								<td className="pt-2 px-2 text-right">
									{convertToRupiah(
										data.potongan.reduce((acc, item) => acc + item.price, 0)
									)}
								</td>
							</tr>

							{/* Grand Total Section */}
							<tr className="border-t border-b dark:border-base-400">
								<td colSpan={4} className="pt-2 px-2 text-right font-bold">TOTAL GAJI</td>
								<td className="px-2 text-right font-bold">
									{convertToRupiah(
										data.pendapatan.reduce((acc, item) => acc + item.price, 0) -
										data.potongan.reduce((acc, item) => acc + item.price, 0)
									)}
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div className="text-right text-sm relative mb-8 flex justify-end">
					<div>
						<div className="mb-2">Bandar Lampung, {data.date}</div>
						<div className="flex flex-col items-center">
							<div className="font-bold text-3xl mb-2">{logo}</div>
							<div>HRD</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

Slip.propTypes = {
	data: PropTypes.object,
	company: PropTypes.object,
	logo: PropTypes.any,
};

export default Slip;
