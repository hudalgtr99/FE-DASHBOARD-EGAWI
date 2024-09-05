import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  addData,
  deleteData,
  getData,
  updateData,
} from '@/actions';
import { pangkatReducers } from '@/reducers/strataReducers';
import {
  API_URL_createpangkat,
  API_URL_edelpangkat,
  API_URL_getpangkat,
} from '@/constants';
import { icons } from "../../../../../public/icons";
import {
  Button,
  Container,
  Pagination,
  Tables,
} from '@/components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const PangkatSub = () => {
  const {
    getPangkatResult,
    getPangkatLoading,
    getPangkatError,
    addPangkatResult,
    addJabatanResult,
    deleteJabatanResult,
    deletePangkatResult,
  } = useSelector((state) => state.strata);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // States & Variables
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");

  const validationSchema = Yup.object({
    nama_pangkat: Yup.string().required("Nama Pangkat is required"),
    grade: Yup.string().required("Grade is required"),
    level: Yup.number()
      .typeError("Level must be a number")
      .required("Level is required")
      .positive("Level must be a positive number")
      .integer("Level must be an integer")
  });

  const doSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    setLimit(10);
    setPageActive(0);
    get({ param: "?search=" + value });
  };

  const onAdd = () => {
    navigate('/pangkat/form');
  };

  const onEdit = (item) => {
    navigate(`/pangkat/form/${item.pk}`);
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: pangkatReducers },
      item.pk,
      API_URL_edelpangkat,
      "DELETE_PANGKAT"
    );
  };

  const get = useCallback(
    async (param) => {
      getData(
        { dispatch, redux: pangkatReducers },
        param,
        API_URL_getpangkat,
        "GET_PANGKAT"
      );
    },
    [dispatch]
  );

  const handlePageClick = (e) => {
    const offset = e.selected * limit;
    const param =
      search === ""
        ? { param: "?limit=" + limit + "&offset=" + offset }
        : {
          param:
            "?search=" + search + "&limit=" + limit + "&offset=" + offset,
        };
    get(param);
    setPageActive(e.selected);
  };

  const handleSelect = (e) => {
    const param =
      search === ""
        ? { param: "?limit=" + e }
        : {
          param: "?search=" + search + "&limit=" + e,
        };
    get(param);
    setLimit(e);
    setPageActive(0);
  };

  const [actions] = useState([
    {
      name: "edit",
      icon: icons.fiedit,
      color: "text-blue-500",
      func: onEdit,
    },
    {
      name: "delete",
      icon: icons.rideletebin6line,
      color: "text-red-500",
      func: doDelete,
    },
  ]);

  useEffect(() => {
    const param = { param: "?limit=" + limit + "&offset=" + pageActive * limit };
    get(param);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (
      addJabatanResult ||
      addPangkatResult ||
      deleteJabatanResult ||
      deletePangkatResult
    ) {
      const offset = pageActive * limit;
      const param =
        search === ""
          ? { param: "?limit=" + limit + "&offset=" + offset }
          : {
            param:
              "?search=" + search + "&limit=" + limit + "&offset=" + offset,
          };
      get(param);
    }
  }, [
    addJabatanResult,
    addPangkatResult,
    deleteJabatanResult,
    deletePangkatResult,
    dispatch,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  const dataWithIndex = getPangkatResult.results
    ? getPangkatResult.results.map((item, index) => ({
      ...item,
      index: pageActive * limit + index + 1,
    }))
    : [];

  return (
    <div>
      <Container>
        <Button onClick={onAdd}>Add Pangkat</Button>
        <Tables>
          <Tables.Head>
            <tr>
              <Tables.Header>No</Tables.Header>
              <Tables.Header>Nama Pangkat</Tables.Header>
              <Tables.Header>Grade</Tables.Header>
              <Tables.Header>Level</Tables.Header>
              <Tables.Header>Keterangan</Tables.Header>
              <Tables.Header>Actions</Tables.Header>
            </tr>
          </Tables.Head>
          <Tables.Body>
            {dataWithIndex.map((item) => (
              <Tables.Row key={item.pk}>
                <Tables.Data>{item.index}</Tables.Data>
                <Tables.Data>{item.nama}</Tables.Data>
                <Tables.Data>{item.grade}</Tables.Data>
                <Tables.Data>{item.level}</Tables.Data>
                <Tables.Data>{item.keterangan}</Tables.Data>
                <Tables.Data>
                  {actions.map((action) => (
                    <Button
                      key={action.name}
                      onClick={() => action.func(item)}
                      className={action.color}
                    >
                      <img src={action.icon} alt={action.name} />
                    </Button>
                  ))}
                </Tables.Data>
              </Tables.Row>
            ))}
          </Tables.Body>
        </Tables>
        <Pagination
          pageCount={Math.ceil(getPangkatResult.count / limit)}
          onPageChange={handlePageClick}
          onSelectChange={handleSelect}
          currentPage={pageActive}
          limit={limit}
        />
      </Container>
    </div>
  );
};
export default PangkatSub;