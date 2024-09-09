import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cabangReducer } from "@/reducers/cabangReducers";
import axiosAPI from "@/authentication/axiosApi";
import { deleteData } from "@/actions";
import { API_URL_getcabang, API_URL_edelcabang } from "@/constants";
import { FaPlus } from "react-icons/fa";
import { Container, Button, TextField, Card } from "@/components";

const CabangPage = () => {
  const { deleteCabangResult } = useSelector((state) => state.cabang);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [card, setCard] = useState([]);

  const fetchData = useCallback(async () => {
    const response = await axiosAPI.get(API_URL_getcabang);
    setCard(response.data);
  }, []);

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (deleteCabangResult) {
      fetchData();
    }
  }, [deleteCabangResult, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const onAdd = () => {
    navigate("/cabang/form"); // Navigate to the add form
  };

  const onEdit = (pk) => {
    navigate(`/cabang/form/${pk}`); // Navigate to the edit form
  };

  const doDelete = (id) => {
    deleteData({ dispatch, redux: cabangReducer }, id, API_URL_edelcabang, "DELETE_CABANG");
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        <Container>
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
            <div className="w-full sm:w-60">
              <TextField placeholder="Search" />
            </div>
            <Button onClick={onAdd}>
              <div className="flex items-center gap-2">
                <FaPlus />Tambah Cabang
              </div>
            </Button>
          </div>
        </Container>
        <div className="grid grid-cols-6 gap-3">
          {card.map((item, itemIdx) => (
            <div key={itemIdx} className="col-span-full sm:col-span-3 lg:col-span-2">
              <Card
                onClick={() => onEdit(item.pk)}
                deleted
                doDelete={() => doDelete(item.pk)}
                data={item}
              >
                {item.alamat}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CabangPage;
