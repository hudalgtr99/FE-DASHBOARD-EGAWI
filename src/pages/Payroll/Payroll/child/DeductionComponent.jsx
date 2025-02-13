import React, { useState } from "react";
import { FaPencil, FaPlus, FaTrash, FaX } from "react-icons/fa6";
import { showSweetAlert } from "@/utils/showSweetAlert";
import formatRupiah from "@/utils/formatRupiah";
import CurrencyInput from "@/components/atoms/CurrencyInput";
import { Select } from "@/components";
import { FaSave } from "react-icons/fa";

const DeductionComponent = ({
  totalDeduction,
  deductions,
  setDeductions,
  listOptionPemotongan,
}) => {
  const [newDeduction, setNewDeduction] = useState({
    deduction_type: "",
    deductiontype_name: "",
    amount: "",
  });
  const [editDeduction, setEditDeduction] = useState({
    deduction_type: "",
    deductiontype_name: "",
    amount: "",
  });
  const [editingIndexDeduction, setEditingIndexDeduction] = useState(null);

  const handleAddDeduction = () => {
    if (newDeduction.deduction_type && newDeduction.amount) {
      setDeductions([...deductions, newDeduction]);
      setNewDeduction({
        deduction_type: "",
        deductiontype_name: "",
        amount: "",
      }); // Reset input fields
    }
  };

  const handleEditDeduction = (deduction, index) => {
    // Set nilai potongan yang sedang diedit
    setEditDeduction({
      deduction_type: deduction.deduction_type,
      deductiontype_name: deduction.deductiontype_name,
      amount: deduction.amount,
    });
    setEditingIndexDeduction(index); // Menyimpan index potongan yang sedang diedit
  };
  const handleSaveDeduction = () => {
    if (editingIndexDeduction !== null) {
      const updatedDeductions = deductions.map((deduction, index) => {
        if (index === editingIndexDeduction) {
          return {
            ...deduction,
            deduction_type: editDeduction.deduction_type,
            deductiontype_name: editDeduction.deductiontype_name,
            amount: editDeduction.amount,
          };
        }
        return deduction;
      });
      setDeductions(updatedDeductions);
      setEditingIndexDeduction(null); // Reset index setelah menyimpan
      setEditDeduction({
        deduction_type: "",
        deductiontype_name: "",
        amount: "",
      });
      setNewDeduction({
        deduction_type: "",
        deductiontype_name: "",
        amount: "",
      });
    }
  };

  const handleCancelEditing = () => {
    setEditingIndexDeduction(null);
    setEditDeduction({
      deduction_type: "",
      deductiontype_name: "",
      amount: "",
    });
    setNewDeduction({ deduction_type: "", deductiontype_name: "", amount: "" });
  };

  const handleDeleteDeduction = (deduction, index) => {
    showSweetAlert(
      `Apakah Anda yakin ingin menghapus komponen ${deduction.deductiontype_name}`,
      () => {
        const updatedDeductions = deductions.filter((_, i) => i !== index);
        setDeductions(updatedDeductions);
      }
    );
  };

  return (
    <div className="border p-3 rounded mb-4">
      <div className="mb-4 font-semibold border-b-2 border-red-300 w-fit">
        Potongan
      </div>
      <div className="mb-4 flex flex-row flex-wrap gap-1">
        <div className="">
          <Select
            placeholder={"Pilih Tipe Potongan"}
            options={listOptionPemotongan}
            value={listOptionPemotongan?.filter(
              (item) => item.value === newDeduction.deduction_type
            )}
            onChange={(option) =>
              setNewDeduction({
                ...newDeduction,
                deduction_type: option.value,
                deductiontype_name: option.label,
              })
            }
          />
        </div>
        <div>
          <CurrencyInput
            placeholder="Jumlah"
            value={newDeduction.amount}
            onChange={(e) =>
              setNewDeduction({
                ...newDeduction,
                amount: e,
              })
            }
          />
        </div>
        <button
          onClick={handleAddDeduction}
          className="bg-blue-500 text-white p-1.5 rounded hover:bg-blue-600 text-sm"
        >
          <FaPlus />
        </button>
      </div>
      <div className="mb-4">
        {deductions?.map((deduction, index) => (
          <div
            key={index}
            className="flex justify-start items-center border-b py-2 gap-4 w-fit"
          >
            {index === editingIndexDeduction ? (
              <>
                <div className="w-full md:w-[25rem] flex flex-row gap-4 items-center justify-between">
                  <div className="flex flex-row gap-2">
                    <Select
                      placeholder={"Pilih Tipe Potongan"}
                      options={listOptionPemotongan}
                      value={listOptionPemotongan?.filter(
                        (item) => item.value === editDeduction.deduction_type
                      )}
                      onChange={(option) => {
                        setEditDeduction({
                          ...editDeduction,
                          deduction_type: option.value,
                          deductiontype_name: option.label,
                        });
                      }}
                    />
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <CurrencyInput
                      placeholder="Nilai"
                      value={editDeduction.amount}
                      onChange={(e) =>
                        setEditDeduction({
                          ...editDeduction,
                          amount: e,
                        })
                      }
                    />
                  </div>
                </div>

                <button
                  className="text-white text-xs bg-gray-500 hover:bg-gray-600 flex flex-row gap-2 items-center p-1 rounded-lg"
                  onClick={() => handleCancelEditing(deduction, index)}
                >
                  <FaX /> Batal
                </button>
                <button
                  className="text-white text-xs bg-green-500 hover:bg-green-600 flex flex-row gap-2 items-center p-1 rounded-lg"
                  onClick={() => handleSaveDeduction(deduction, index)}
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
                      placeholder={"Pilih Tipe Potongan"}
                      options={listOptionPemotongan}
                      value={listOptionPemotongan?.filter(
                        (item) => item.value === deduction.deduction_type
                      )}
                    />
                  </div>
                  <div className="flex flex-row gap-2">
                    <div>{formatRupiah(deduction.amount)}</div>
                  </div>
                </div>
                <div className="flex flex-row flex-wrap gap-2">
                  <button
                    className="text-white text-xs bg-orange-500 hover:bg-orange-600 flex flex-row gap-2 items-center p-1 rounded-lg"
                    onClick={() => handleEditDeduction(deduction, index)}
                  >
                    <FaPencil /> Edit
                  </button>
                  <button
                    className="text-white text-xs bg-red-500 hover:bg-red-600 flex flex-row gap-2 items-center p-1 rounded-lg"
                    onClick={() => handleDeleteDeduction(deduction, index)}
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
              <div className="font-semibold">Total Potongan:</div>{" "}
            </div>
            <div className="flex flex-row gap-2">
              <div className=" text-red-600">
                {formatRupiah(totalDeduction)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeductionComponent;
