import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    getData,
} from '@/actions';
import { kehadiranReducer } from '@/reducers/kepegawaianReducers';
import {
    API_URL_getdatakehadiran,
} from '@/constants';
import {
    Button,
    Container,
    Pagination,
    Tables,
    Limit,
    TextField,
    Tooltip,
} from '@/components';
import { debounce } from 'lodash'; // Import lodash debounce
import { CiSearch } from 'react-icons/ci';
import moment from "moment";
import { icons } from "../../../../public/icons";

const KehadiranPage = () => {
    const { getKehadiranResult } = useSelector((state) => state.kepegawaian);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // States & Variables
    const [limit, setLimit] = useState(10);
    const [pageActive, setPageActive] = useState(0);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState(moment(new Date()).format("YYYY-MM"));
    const [firstFetch, setFirstFetch] = useState(false);

    const get = useCallback(
        async (param) => {
            getData(
                { dispatch, redux: kehadiranReducer },
                param,
                API_URL_getdatakehadiran,
                "GET_KEHADIRAN"
            );
        },
        [dispatch]
    );

    // Debounce search
    const debouncedSearch = useCallback(
        debounce((value) => {
            const param = value
                ? { param: `?search=${value}&limit=${limit}&offset=${pageActive * limit}&date-month=${filter}` }
                : { param: `?limit=${limit}&offset=${pageActive * limit}&date-month=${filter}` };
            get(param);
        }, 300),
        [limit, pageActive, filter, get]
    );

    // Handle search input
    const doSearch = (e) => {
        const { value } = e.target;
        setSearch(value);
        debouncedSearch(value); // Trigger debounced search
    };

    const doDetail = (item) => {
        navigate("/asesmen/kehadiran/detail", {
            state: { user_id: item.id, date: item.date },
        });
    };

    const onExport = (item) => {
        navigate("/asesmen/kehadiran/export", {
            state: { user_id: item.id, date: item.date },
        });
    };

    const handleFilterDate = (e) => {
        const param =
            search === ""
                ? { param: "?date-month=" + e + "&limit=" + limit }
                : {
                    param: "?search=" + search + "&date-month=" + e + "&limit=" + limit,
                };
        setFilter(e);
        get(param);
    };

    const [actions] = useState([
        {
            name: "Detail",
            icon: icons.aifilleye,
            color: "text-blue-500",
            func: doDetail,
        },
    ]);

    const handlePageClick = (e) => {
        setPageActive(e.selected);
    };

    const handleSelect = (e) => {
        setLimit(e);
        setPageActive(0); // Reset to first page on limit change
    };

    // Fetch data on limit, page, search, or filter changes
    useEffect(() => {
        if (firstFetch) {
            const param = search
                ? { param: `?search=${search}&date-month=${filter}&limit=${limit}&offset=${pageActive * limit}` }
                : { param: `?date-month=${filter}&limit=${limit}&offset=${pageActive * limit}` };
            get(param);
        } else {
            setFirstFetch(true);
        }
    }, [search, limit, pageActive, filter, get, firstFetch]);

    const dataWithIndex = getKehadiranResult?.results?.map((item, index) => ({
        ...item,
        index: pageActive * limit + index + 1,
    })) || [];

    // console.log(dataWithIndex)

    return (
        <div>
            <Container>
                <div className="mb-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
                    <div className="w-full sm:w-60">
                        <TextField
                            onChange={doSearch}
                            placeholder="Search"
                            value={search}
                            icon={<CiSearch />}
                        />
                    </div>
                    <div className='flex gap-4'>
                        <TextField
                            type="month"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                        <button
                            className="px-3 py-2 flex items-center rounded-lg bg-[#f3f4f6] text-xs"
                            onClick={onExport}
                        >
                            <span>{icons.fafileexport}</span>
                            <div className="ml-2">Export</div>
                        </button>
                    </div>
                </div>
                <Tables>
                    <Tables.Head>
                        <tr>
                            <Tables.Header>No</Tables.Header>
                            <Tables.Header>Nama Pegawai</Tables.Header>
                            <Tables.Header>Jabatan</Tables.Header>
                            <Tables.Header>Presensi</Tables.Header>
                            <Tables.Header>Cuti</Tables.Header>
                            <Tables.Header>Alfa</Tables.Header>
                            <Tables.Header>Jam Kerja</Tables.Header>
                            <Tables.Header>Jam Terlambat</Tables.Header>
                            <Tables.Header>Point</Tables.Header>
                            <Tables.Header center>Actions</Tables.Header>
                        </tr>
                    </Tables.Head>
                    <Tables.Body>
                        {dataWithIndex.map((item) => (
                            <Tables.Row key={item.id}>
                                <Tables.Data>{item.index}</Tables.Data>
                                <Tables.Data>{item.first_name}</Tables.Data>
                                <Tables.Data>{item.jabatan || "-"}</Tables.Data>
                                <Tables.Data>{item.statistik.hadir}</Tables.Data>
                                <Tables.Data>{item.statistik.cuti}</Tables.Data>
                                <Tables.Data>{item.statistik.alfa}</Tables.Data>
                                <Tables.Data>{item.statistik.jam_kerja}</Tables.Data>
                                <Tables.Data>{item.statistik.jam_terlambat}</Tables.Data>
                                <Tables.Data>{item.statistik.point}</Tables.Data>
                                <Tables.Data center>
                                    <div className="flex items-center justify-center gap-2">
                                        {actions.map((action) => (
                                            <Tooltip key={action.name} tooltip={action.name}>
                                                <div
                                                    key={action.name}
                                                    onClick={() => action.func(item)}
                                                    className={action.color}
                                                >
                                                    {action.icon}
                                                </div>
                                            </Tooltip>
                                        ))}
                                    </div>
                                </Tables.Data>
                            </Tables.Row>
                        ))}
                    </Tables.Body>
                </Tables>
                <div className="flex justify-between items-center mt-4">
                    <Limit limit={limit} setLimit={setLimit} onChange={handleSelect} />
                    <Pagination
                        totalCount={getKehadiranResult?.count || 0} // Total items count from the API result
                        pageSize={limit} // Items per page (limit)
                        currentPage={pageActive + 1} // Current page
                        onPageChange={handlePageClick} // Page change handler
                        siblingCount={1} // Number of sibling pages (adjust as needed)
                        activeColor="primary" // Optional: active page color
                        rounded="md" // Optional: rounded button style
                        variant="flat" // Optional: button variant
                        size="md" // Optional: button size
                    />
                </div>
            </Container>
        </div>
    );
};

export default KehadiranPage;
