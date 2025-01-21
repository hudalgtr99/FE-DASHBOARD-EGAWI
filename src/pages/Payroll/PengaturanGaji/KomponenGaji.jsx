import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Container, Modal, Tables, TextField } from "@/components";
import { useDispatch } from "react-redux";
import { API_URL_incometypes } from "@/constants";
import * as Yup from "yup";
import {
  useDeleteData,
  useGetData,
  usePostData,
  usePutData,
} from "@/actions/auth";
import { debounce } from "lodash";
import {
  BiEdit,
  BiSearch,
  BiSortDown,
  BiSortUp,
  BiTrash,
} from "react-icons/bi";
import CompPagination from "@/components/atoms/CompPagination";
import { SyncLoader } from "react-spinners";
import { CiSearch } from "react-icons/ci";
import { showSweetAlert } from "@/utils/showSweetAlert";
import { showToast } from "@/utils/showToast";
import TypePendapatan from "./child/TypePendapatan";
import TypePotongan from "./child/TypePotongan";
import { IoCogSharp } from "react-icons/io5";
import SalaryComponentManager from "./child/SalaryComponentManager";

const KomponenGaji = () => {
  const navigate = useNavigate();
  const [showModalPendapatan, setShowModalPendapatan] = useState(false);
  const [showModalPemotongan, setShowModalPemotongan] = useState(false);

  return (
    <div>
      <Container>
        {/* Content */}
        <div className="">
          <div className="flex flex-row items-center mb-4">
            <div className="flex flex-row gap-2">
              <Button
                size="xs"
                color="danger"
                onClick={() => setShowModalPemotongan(true)}
              >
                <div className="flex gap-1 items-center">
                  <IoCogSharp />
                  Pengaturan Tipe Pemotongan
                </div>
              </Button>
              <Button
                size="xs"
                color="success"
                onClick={() => setShowModalPendapatan(true)}
              >
                <div className="flex gap-1 items-center">
                  <IoCogSharp />
                  Pengaturan Tipe Pendapatan
                </div>
              </Button>
            </div>
          </div>
          {/* <div className="py-2">
            <label>Gajian Bulanan Dihitung setiap Tanggal ?</label>
            <div className="w-full md:w-16">
              <TextField label="" value={2} onChange={() => onkeydown()} />
            </div>
          </div> */}
          <div className=" bg-gray-200">
            <SalaryComponentManager />
          </div>
        </div>
      </Container>

      <div className="flex flex-row flex-wrap md:flex-nowrap justify-between gap-4"></div>
      <Modal show={showModalPendapatan} setShow={setShowModalPendapatan}>
        <div className="p-5">
          <TypePendapatan />
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              size={"sm"}
              onClick={() => setShowModalPendapatan(false)}
              color="base"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal show={showModalPemotongan} setShow={setShowModalPemotongan}>
        <div className="p-5">
          <TypePotongan />

          <div className="flex justify-end space-x-2 mt-4">
            <Button
              size={"sm"}
              onClick={() => setShowModalPemotongan(false)}
              color="base"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default KomponenGaji;
