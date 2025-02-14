import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Container, Tables } from "@/components";
import { useSelector } from "react-redux";
import { decrypted_id } from "@/actions";
import {
  API_URL_deductiontypes,
  API_URL_incometypes,
  API_URL_payroll,
} from "@/constants";
import { AuthContext, useAuth } from "@/context/AuthContext";
import axiosAPI from "@/authentication/axiosApi";
import formatRupiah from "@/utils/formatRupiah";
import { useGetData, usePutData } from "@/actions/auth";
import DeductionComponent from "./child/DeductionComponent";
import IncomeComponent from "./child/IncomeComponent";
import { showToast } from "@/utils/showToast";

const FormPayrollGajiPage = () => {
  const { pk } = useParams();
  const { getMasterGajiLoading } = useSelector((state) => state.mastergaji);
  const { selectedPerusahaan } = useAuth();
  const navigate = useNavigate();
  const [detailPayroll, setDetailPayroll] = useState([]);
  const { jwt } = useContext(AuthContext);

  //list data Komponen
  const [listOptionPendapatan, setListOptionPendapatan] = useState([]);
  const [listOptionPemotongan, setListOptionPemotongan] = useState([]);

  const getIncomeTypes = useGetData(
    API_URL_incometypes,
    ["incometypes", selectedPerusahaan],
    {
      limit: 999999,
      perusahaan: selectedPerusahaan?.value,
    }
  );

  const getDeductionTypes = useGetData(
    API_URL_deductiontypes,
    ["deductiontypes", selectedPerusahaan],
    {
      limit: 99999,
      peruasahaan: selectedPerusahaan?.value,
    }
  );
  // Handle Tambah dan Hapus Komponen Gaji
  const [deductions, setDeductions] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [totalDeduction, setTotalDeduction] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  // Jika ada Pk maka Fetching data lama
  const get = useCallback(async () => {
    if (decrypted_id(pk)) {
      const response = await axiosAPI.get(
        API_URL_payroll + decrypted_id(pk) + "/"
      );
      const dataResponse = response.data;

      setDetailPayroll(dataResponse);
    } else {
      navigate(-1);
    }
  }, [pk]);

  const updatePayrollApi = usePutData(API_URL_payroll + decrypted_id(pk) + "/");

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("deductions", JSON.stringify(deductions));
    formData.append("incomes", JSON.stringify(incomes));

    updatePayrollApi.mutate(formData, {
      onSuccess: (res) => {
        showToast(res.message, "success", 3000);
        navigate(-1);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  useEffect(() => {
    if (detailPayroll) {
      setDeductions(detailPayroll?.deduction_details);
      setIncomes(detailPayroll?.income_details);
    }
  }, [detailPayroll]);

  useEffect(() => {
    if (deductions) {
      let totalAmount = 0;
      deductions.forEach((deduction) => {
        totalAmount = Number(deduction.amount) + totalAmount;
      });
      setTotalDeduction(totalAmount);
    }

    if (incomes) {
      let totalAmount = 0;
      incomes.forEach((income) => {
        totalAmount = Number(income.amount) + totalAmount;
      });
      setTotalIncome(totalAmount);
    }
  }, [deductions, incomes]);

  useEffect(() => {
    if (pk) {
      get();
    }
  }, [pk]);

  useEffect(() => {
    if (getIncomeTypes.data) {
      const options =
        getIncomeTypes.data?.results.map((item) => ({
          value: item.id, // Ganti 'id' dengan nama field yang sesuai
          label: item.name, // Ganti 'name' dengan nama field yang sesuai
        })) || [];
      setListOptionPendapatan(options);
    }
  }, [getIncomeTypes.data]);

  useEffect(() => {
    if (getDeductionTypes.data) {
      let options = [];
      options =
        getDeductionTypes.data?.results.map((item) => ({
          value: item.id, // Ganti 'id' dengan nama field yang sesuai
          label: item.name, // Ganti 'name' dengan nama field yang sesuai
        })) || [];
      setListOptionPemotongan(options);
    }
  }, [getDeductionTypes.data]);

  return (
    <div>
      <Container>
        <div className="flex items-center gap-2 mb-4">
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => navigate(-1)}
          >
            <IoMdReturnLeft />
          </button>
          <h1>{pk ? "Edit Payroll Pegawai" : "Tambah Payroll Pegawai"}</h1>
        </div>
        <div>
          <div className="border p-3 rounded mb-4">
            <div className="font-semibold border-b-2 border-blue-300 w-fit">
              Ringkasan{" "}
            </div>
            <div>
              <Tables>
                <Tables.Head>
                  <tr>
                    {jwt?.level === "Super Admin" && (
                      <Tables.Header>Perusahaan</Tables.Header>
                    )}
                    <Tables.Header>Nama Pegawai</Tables.Header>
                    <Tables.Header>Jabatan</Tables.Header>
                    <Tables.Header>Gaji Pokok</Tables.Header>
                    <Tables.Header>Tambahan</Tables.Header>
                    <Tables.Header>Potongan</Tables.Header>
                    <Tables.Header>Total</Tables.Header>
                  </tr>
                </Tables.Head>
                <Tables.Body>
                  <Tables.Row>
                    {jwt?.level === "Super Admin" && (
                      <Tables.Data>
                        {detailPayroll?.company_name || "N/A"}
                      </Tables.Data>
                    )}
                    <Tables.Data>
                      {detailPayroll?.employee_first_name ||
                        "Nama tidak tersedia"}
                    </Tables.Data>
                    <Tables.Data>
                      {detailPayroll?.jabatan_pegawai || "-"}
                    </Tables.Data>
                    <Tables.Data>
                      {formatRupiah(detailPayroll?.basic_salary)}
                    </Tables.Data>
                    <Tables.Data>
                      <span className="text-green-600">
                        {formatRupiah(totalIncome)}
                      </span>
                    </Tables.Data>
                    <Tables.Data>
                      <span className="text-red-600">
                        {formatRupiah(totalDeduction)}
                      </span>
                    </Tables.Data>
                    <Tables.Data>
                      <span className="text-gray-800">
                        {formatRupiah(
                          detailPayroll?.basic_salary +
                            totalIncome -
                            totalDeduction
                        )}
                      </span>
                    </Tables.Data>
                  </Tables.Row>
                </Tables.Body>
              </Tables>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <IncomeComponent
              totalIncome={totalIncome}
              incomes={incomes}
              setIncomes={setIncomes}
              listOptionPendapatan={listOptionPendapatan}
            />
            <DeductionComponent
              totalDeduction={totalDeduction}
              deductions={deductions}
              setDeductions={setDeductions}
              listOptionPemotongan={listOptionPemotongan}
            />
          </div>

          <div className=" justify-between flex flex-row gap-3">
            <Button color="base" onClick={() => navigate(-1)}>
              Batal
            </Button>
            <Button
              onClick={() => handleSubmit()}
              loading={getMasterGajiLoading}
            >
              Simpan
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FormPayrollGajiPage;
