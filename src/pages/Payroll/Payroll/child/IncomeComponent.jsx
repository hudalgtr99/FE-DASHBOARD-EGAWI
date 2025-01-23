import React, { useState } from "react";
import { FaPencil, FaPlus, FaTrash, FaX } from "react-icons/fa6";
import { showSweetAlert } from "@/utils/showSweetAlert";
import formatRupiah from "@/utils/formatRupiah";
import CurrencyInput from "@/components/atoms/CurrencyInput";
import { Select } from "@/components";
import { FaSave } from "react-icons/fa";

const IncomeComponent = ({
  totalIncome,
  incomes,
  setIncomes,
  listOptionPendapatan,
}) => {
  const [newIncome, setNewIncome] = useState({
    income_type: "",
    incometype_name: "",
    amount: "",
  });
  const [editIncome, setEditIncome] = useState({
    income_type: "",
    incometype_name: "",
    amount: "",
  });
  const [editingIndexIncome, setEditingIndexIncome] = useState(null);

  const handleAddIncome = () => {
    if (newIncome.income_type && newIncome.amount) {
      setIncomes([...incomes, newIncome]);
      setNewIncome({
        income_type: "",
        incometype_name: "",
        amount: "",
      }); // Reset input fields
    }
  };

  const handleEditIncome = (income, index) => {
    // Set nilai potongan yang sedang diedit
    setEditIncome({
      income_type: income.income_type,
      incometype_name: income.incometype_name,
      amount: income.amount,
    });
    setEditingIndexIncome(index); // Menyimpan index potongan yang sedang diedit
  };
  const handleSaveIncome = () => {
    if (editingIndexIncome !== null) {
      const updatedIncomes = incomes.map((income, index) => {
        if (index === editingIndexIncome) {
          return {
            ...income,
            income_type: editIncome.income_type,
            incometype_name: editIncome.incometype_name,
            amount: editIncome.amount,
          };
        }
        return income;
      });
      setIncomes(updatedIncomes);
      setEditingIndexIncome(null); // Reset index setelah menyimpan
      setEditIncome({
        income_type: "",
        incometype_name: "",
        amount: "",
      });
      setNewIncome({
        income_type: "",
        incometype_name: "",
        amount: "",
      });
    }
  };

  const handleCancelEditing = () => {
    setEditingIndexIncome(null);
    setEditIncome({
      income_type: "",
      incometype_name: "",
      amount: "",
    });
    setNewIncome({ income_type: "", incometype_name: "", amount: "" });
  };

  const handleDeleteIncome = (income, index) => {
    showSweetAlert(
      `Apakah Anda yakin ingin menghapus komponen ${income.incometype_name}`,
      () => {
        const updatedIncomes = incomes.filter((_, i) => i !== index);
        setIncomes(updatedIncomes);
      }
    );
  };

  return (
    <div className="border p-3 rounded mb-4 ">
      <div className="mb-4 font-semibold border-b-2 border-red-300 w-fit">
        Tambahan
      </div>
      <div className="mb-4 flex flex-row flex-wrap gap-1">
        <div className="">
          <Select
            placeholder={"Pilih Tipe Tambahan"}
            options={listOptionPendapatan}
            value={listOptionPendapatan?.filter(
              (item) => item.value === newIncome.income_type
            )}
            onChange={(option) =>
              setNewIncome({
                ...newIncome,
                income_type: option.value,
                incometype_name: option.label,
              })
            }
          />
        </div>
        <div>
          <CurrencyInput
            placeholder="Jumlah"
            value={newIncome.amount}
            onChange={(e) =>
              setNewIncome({
                ...newIncome,
                amount: e,
              })
            }
          />
        </div>
        <button
          onClick={handleAddIncome}
          className="flex flex-row items-center gap-1 bg-blue-500 text-white p-1.5 rounded hover:bg-blue-600 text-sm"
        >
          <FaPlus />
        </button>
      </div>
      <div className="mb-4">
        {incomes?.map((income, index) => (
          <div
            key={index}
            className="flex justify-start items-center border-b py-2 gap-4 w-fit"
          >
            {index === editingIndexIncome ? (
              <>
                <div className="w-full md:w-[25rem] flex flex-row gap-4 items-center justify-between">
                  <div className="flex flex-row gap-2">
                    <Select
                      placeholder={"Pilih Tipe Tambahan"}
                      options={listOptionPendapatan}
                      value={listOptionPendapatan?.filter(
                        (item) => item.value === editIncome.income_type
                      )}
                      onChange={(option) => {
                        setEditIncome({
                          ...editIncome,
                          income_type: option.value,
                          incometype_name: option.label,
                        });
                      }}
                    />
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <CurrencyInput
                      placeholder="Nilai"
                      value={editIncome.amount}
                      onChange={(e) =>
                        setEditIncome({
                          ...editIncome,
                          amount: e,
                        })
                      }
                    />
                  </div>
                </div>

                <button
                  className="text-white text-xs bg-gray-500 hover:bg-gray-600 flex flex-row gap-2 items-center p-1 rounded-lg"
                  onClick={() => handleCancelEditing(income, index)}
                >
                  <FaX /> Batal
                </button>
                <button
                  className="text-white text-xs bg-green-500 hover:bg-green-600 flex flex-row gap-2 items-center p-1 rounded-lg"
                  onClick={() => handleSaveIncome(income, index)}
                >
                  <FaSave /> Simpan
                </button>
              </>
            ) : (
              <>
                <div className="w-full md:w-[25rem] flex flex-row flex-wrap gap-4 items-center justify-between">
                  <div className="flex flex-row gap-2">
                    <Select
                      disabled={true}
                      placeholder={"Pilih Tipe Tambahan"}
                      options={listOptionPendapatan}
                      value={listOptionPendapatan?.filter(
                        (item) => item.value === income.income_type
                      )}
                    />
                  </div>
                  <div className="flex flex-row gap-2">
                    <div>{formatRupiah(income.amount)}</div>
                  </div>
                </div>
                <div className="flex flex-row flex-wrap gap-2">
                  <button
                    className="text-white text-xs bg-orange-500 hover:bg-orange-600 flex flex-row gap-2 items-center p-1 rounded-lg"
                    onClick={() => handleEditIncome(income, index)}
                  >
                    <FaPencil /> Edit
                  </button>
                  <button
                    className="text-white text-xs bg-red-500 hover:bg-red-600 flex flex-row gap-2 items-center p-1 rounded-lg"
                    onClick={() => handleDeleteIncome(income, index)}
                  >
                    <FaTrash /> Hapus
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="mb-4">
        <div className="flex justify-start items-center py-2 gap-4 border-b w-fit">
          <div className="w-full md:w-[25rem] flex flex-row gap-4 items-center justify-between">
            <div className="flex flex-row gap-2">
              <div className="font-semibold">Total Tambahan:</div>{" "}
            </div>
            <div className="flex flex-row gap-2">
              <div className=" text-green-600">{formatRupiah(totalIncome)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeComponent;
