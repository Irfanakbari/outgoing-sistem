import { BiPrinter, BiRefresh, BiSolidUpArrow } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import { AiFillFileExcel } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useExcelJS } from "react-use-exceljs";
import PaginationSelect from "@/components/PaginationSelect";

export default function LapRiwayat() {
    const [dataHistory, setDataHistory] = useState([]);
    const [dataCustomer, setDataCustomer] = useState([]);
    const [dataProject, setDataProject] = useState([]);

    const [selectedCell, setSelectedCell] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState([]);

    const custFilter = useRef(null);
    const vehicleFilter = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);

    const getHistory = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.get(`/api/history?customer=${custFilter.current.value}&vehicle=${vehicleFilter.current.value}&page=1`);
            setDataHistory(response.data);
            setFilters(response.data['data']);
        } catch (error) {
            showErrorToast("Gagal Fetch Data");
        }
    };

    const fetchData = async () => {
        try {
            const response1 = await axios.get('/api/customers');
            setDataCustomer(response1.data['data']);
            const response2 = await axios.get('/api/vehicle');
            setDataProject(response2.data['data']);
            const response = await axios.get(`/api/history?page=1`);
            setDataHistory(response.data);
            setFilters(response.data['data']);
        } catch (error) {
            showErrorToast("Gagal Fetch Data");
        }
    };

    const searchValue = (value) => {
        if (value.trim() === '') {
            return dataHistory.data;
        }

        const searchValueLowerCase = value.toLowerCase();

        return dataHistory.data.filter((item) => {
            for (let key in item) {
                if (typeof item[key] === 'string' && item[key].toLowerCase().includes(searchValueLowerCase)) {
                    return true;
                }
            }
            return false;
        });
    };

    const handlePageChange = async (selectedPage) => {
        // Lakukan perubahan halaman di sini
        const response3 = await axios.get(`/api/history?customer=${custFilter.current.value}&vehicle=${vehicleFilter.current.value}&page=` + selectedPage);
        setDataHistory(response3.data);
        setFilters(response3.data['data'])
    };

    const handleSearch = () => {
        const searchResult = searchValue(searchTerm);
        setFilters(searchResult);
    };

    const excel = useExcelJS({
        filename: "lap_riwayat.xlsx",
        worksheets: [
            {
                name: "Data Riwayat",
                columns: [
                    {
                        header: "No",
                        key: "no",
                        width: 10,
                    },
                    {
                        header: "Kode Pallet",
                        key: "id",
                        width: 32,
                    },
                    {
                        header: "Customer",
                        key: "customer",
                        width: 10,
                    },
                    {
                        header: "Vehicle",
                        key: "vehicle",
                        width: 32,
                    },
                    {
                        header: "Part",
                        key: "part",
                        width: 32,
                    },
                    {
                        header: "Keluar",
                        key: "keluar",
                        width: 32,
                    },
                    {
                        header: "Operator Out",
                        key: "user_out",
                        width: 32,
                    },
                    {
                        header: "Masuk",
                        key: "masuk",
                        width: 32,
                    },
                    {
                        header: "Operator In",
                        key: "user_in",
                        width: 32,
                    },
                ],
            },
        ],
    });

    const onClick = async (e) => {
        e.preventDefault();
        const data = filters.map((item, index) => ({
            no: index + 1,
            id: item.id_pallet,
            customer: `${item['Pallet']['Customer'].kode} - ${item['Pallet']['Customer'].name}`,
            vehicle: `${item['Pallet']['Vehicle'].kode} - ${item['Pallet']['Vehicle'].name}`,
            part: `${item['Pallet']['Part'].kode} - ${item['Pallet']['Part'].name}`,
            keluar: item['keluar'] ? dayjs(item['keluar']).locale('id').format('DD MMMM YYYY HH:mm') : '-',
            user_out: item['user_out'],
            masuk: item['masuk'] ? dayjs(item['masuk']).locale('id').format('DD MMMM YYYY HH:mm') : '-',
            user_in: item['user_in'],
        }));
        await excel.download(data);
    };

    const showErrorToast = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    };

    return (
        <div className="h-full bg-white">
            <div className="bg-[#2589ce] py-1.5 px-2 text-white flex flex-row justify-between">
                <h2 className="font-bold text-[14px]">Filter</h2>
                <div className="flex items-center">
                    <BiSolidUpArrow size={10} />
                </div>
            </div>
            <div className="w-full gap-8 flex items-center bg-white px-3 py-2">
                <div className="flex flex-row items-center">
                    <label className="text-sm font-semibold mr-3">Cari :</label>
                    <input
                        type="text"
                        className="border border-gray-300 rounded mr-3"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <ImCross
                        className="hover:cursor-pointer text-blue-700 mr-4"
                        onClick={() => setSearchTerm('')}
                    />
                    <button
                        className="bg-green-500 py-1 px-2 text-white font-semibold text-sm"
                        onClick={handleSearch}
                    >
                        Dapatkan Data
                    </button>
                </div>
                <div className="flex flex-row items-center">
                    <label className="text-sm font-semibold mr-3">Customer :</label>
                    <select ref={custFilter} className="border border-gray-300 rounded p-1 text-sm">
                        <option className="text-sm" value="">
                            Semua
                        </option>
                        {dataCustomer.map((e, index) => (
                            <option className="text-sm p-4" key={index} value={e['kode']}>
                                {`${e['kode']} - ${e['name']}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-row items-center">
                    <label className="text-sm font-semibold mr-3">Vehicle :</label>
                    <select ref={vehicleFilter} className="border border-gray-300 rounded p-1 text-sm">
                        <option className="text-sm" value="">
                            Semua
                        </option>
                        {dataProject.map((e, index) => (
                            <option className="text-sm" key={index} value={e['kode']}>
                                {`${e['kode']} - ${e['name']}`}
                            </option>
                        ))}
                    </select>
                    <button
                        className="ml-3 bg-green-500 py-1 px-2 text-white font-semibold text-sm"
                        onClick={getHistory}
                    >
                        Dapatkan Data
                    </button>
                </div>
            </div>
            <div className="w-full bg-white h-4 border border-gray-500" />
            <div className="w-full bg-white p-2">
                <div className="w-full bg-[#3da0e3] py-0.5 px-1 text-white flex flex-row">
                    <div className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer">
                        <BiPrinter size={12} />
                        <p className="text-white font-bold text-sm">Cetak</p>
                    </div>
                    <div onClick={onClick} className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer">
                        <AiFillFileExcel size={12} />
                        <p className="text-white font-bold text-sm">Excel</p>
                    </div>
                    <div onClick={fetchData} className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer">
                        <BiRefresh size={12} />
                        <p className="text-white font-bold text-sm">Refresh</p>
                    </div>
                </div>
                <table className="w-full">
                    <thead>
                    <tr>
                        <th className="py-2 bg-gray-100 text-left w-10">#</th>
                        <th className="py-2 bg-gray-100 text-left">Kode Pallet</th>
                        <th className="py-2 bg-gray-100 text-left">Customer</th>
                        <th className="py-2 bg-gray-100 text-left">Vehicle</th>
                        <th className="py-2 bg-gray-100 text-left">Part</th>
                        <th className="py-2 bg-gray-100 text-left">Keluar</th>
                        <th className="py-2 bg-gray-100 text-left">Operator Out</th>
                        <th className="py-2 bg-gray-100 text-left">Masuk</th>
                        <th className="py-2 bg-gray-100 text-left">Operator In</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        filters.map((e, index) => (
                            <tr
                                className={`${selectedCell === index ? 'bg-[#85d3ff]' : ''} text-sm font-semibold border-b border-gray-500`}
                                key={index}
                                onClick={() => setSelectedCell(index)}
                            >
                                <td className="text-center p-1.5">{index + 1}</td>
                                <td>{e['id_pallet']}</td>
                                <td>{e['Pallet']['Customer']['kode'] + ' - ' + e['Pallet']['Customer']['name']}</td>
                                <td>{e['Pallet']['Vehicle']['kode'] + ' - ' + e['Pallet']['Vehicle']['name']}</td>
                                <td>{e['Pallet']['Part']['kode'] + ' - ' + e['Pallet']['Part']['name']}</td>
                                <td>{e['keluar'] ? dayjs(e['keluar']).locale('id').format('DD MMMM YYYY HH:mm') : '-'}</td>
                                <td>{e['user_out'] ?? '-'}</td>
                                <td>{e['masuk'] ? dayjs(e['masuk']).locale('id').format('DD MMMM YYYY HH:mm') : '-'}</td>
                                <td className="px-4">{e['user_in'] ?? '-'}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
                <br/>
                <PaginationSelect
                    totalPages={dataHistory['totalPages']}
                    currentPage={dataHistory['currentPage']}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
