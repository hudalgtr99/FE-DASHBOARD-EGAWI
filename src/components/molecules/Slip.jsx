import { convertToRupiah } from "@/utils/convertToRupiah";
import { forwardRef } from "react";
import PropTypes from "prop-types";
import moment from "moment";

/**
 *
 * @param {{
 * data: object;
 * company: object;
 * logo: any;
 * }}
 *
 */

const Slip = forwardRef(({ logo, data }, ref) => {
  return (
    <div ref={ref} className="px-6 sm:px-10 overflow-x-auto">
      <div className="min-w-max w-fit">
        <div className="mb-4">
          {/* Logo */}
          <div>
            <div className="font-bold text-4xl">{logo}</div>
          </div>
          <div className="text-sm mt-4">
            <div className="uppercase font-semibold">{data.company_name}</div>
            <div className="text-xs">{data.company_address}</div>
          </div>
        </div>
        <div className="mb-4 flex justify-center">
          <div className="font-bold">
            Slip Gaji Periode{" "}
            {moment(data?.payroll_period, "YYYY-MM").format("MMMM YYYY")}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-20 gap-y-2 mb-8">
          <div className="text-sm">
            <div>Nama</div>
            <div>ID Pegawai</div>
            <div>Departemen / Jabatan</div>
            <div>Tanggal Mulai Bekerja</div>
            <div>Periode Gaji</div>
          </div>
          <div className="text-sm">
            <div>{data?.employee_first_name}</div>
            <div>{data?.id_pegawai}</div>
            <div>
              {data?.departemen_pegawai} / {data?.jabatan_pegawai}
            </div>
            <div>{moment(data?.tgl_bergabung).format("DD MMMM YYYY")}</div>
            <div>
              {moment(data?.payroll_period, "YYYY-MM").format("MMMM YYYY")}
            </div>
          </div>
        </div>

        <div className="text-sm mb-8 overflow-x-auto scrollbar-hide">
          <table className="w-full">
            <tbody>
              {/* Pendapatan Section */}
              <tr>
                <td colSpan={5} className="font-bold">
                  Pendapatan
                </td>
              </tr>
              {/* ADD Gaji Pokok  */}
              <tr>
                <td colSpan={4} className="p-2">
                  {"Gaji Pokok"}
                </td>
                <td className="p-2 text-right">
                  {convertToRupiah(data?.basic_salary)}
                </td>
              </tr>
              {data?.income_details?.map((item, itemIdx) => (
                <tr key={itemIdx}>
                  <td colSpan={4} className="p-2">
                    {item?.incometype_name}
                  </td>
                  <td className="p-2 text-right">
                    {convertToRupiah(item?.amount)}
                  </td>
                </tr>
              ))}

              <tr className="border-t border-b dark:border-base-400">
                <td colSpan={4} className="pt-2 px-2 text-right">
                  Total Pendapatan
                </td>
                <td className="pt-2 px-2 text-right text-green-600 font-semibold">
                  {convertToRupiah(data?.total_income + data?.basic_salary)}
                </td>
              </tr>

              {/* Potongan Section */}
              <tr>
                <td colSpan={5} className="font-bold">
                  Potongan
                </td>
              </tr>
              {data?.deduction_details?.map((item, itemIdx) => (
                <tr key={itemIdx}>
                  <td colSpan={4} className="p-2">
                    {item?.deductiontype_name}
                  </td>
                  <td className="p-2 text-right">
                    {convertToRupiah(item?.amount)}
                  </td>
                </tr>
              ))}

              <tr className="border-t dark:border-base-400">
                <td colSpan={4} className="pt-2 px-2 text-right">
                  Total Potongan
                </td>
                <td className="pt-2 px-2 text-right text-red-600 font-semibold">
                  {convertToRupiah(data?.total_deduction)}
                </td>
              </tr>

              {/* Grand Total Section */}
              <tr className="border-t border-b dark:border-base-400">
                <td colSpan={4} className="pt-2 px-2 text-right font-bold">
                  TOTAL GAJI
                </td>
                <td className="px-2 text-right font-bold">
                  {convertToRupiah(data?.total_salary)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-right text-sm relative mb-8 flex justify-end">
          <div>
            <div className="mb-2">
              Bandar Lampung, {moment(data?.created_at).format("DD MMMM YYYY")}
            </div>
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
