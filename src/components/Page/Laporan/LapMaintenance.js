import {BiPrinter, BiRefresh, BiSolidUpArrow} from "react-icons/bi";
import {ImCross} from "react-icons/im";
import {AiFillFileExcel} from "react-icons/ai";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import { useExcelJS } from "react-use-exceljs"
import PaginationSelect from "@/components/PaginationSelect";
import {showErrorToast} from "@/utils/toast";


export default function LapMaintenance() {
    const [dataMaintenance, setDataMaintenance] = useState([])
    const [dataCustomer, setDataCustomer] = useState([])
    const [dataProject, setDataProject] = useState([])

    const [selectedCell, setSelectedCell] = useState(null)

    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState([])

    const selectKodeCust = useRef(null);
    const selectKodeProj = useRef(null);


    useEffect(() => {
        fetchData();
    }, [])
    const fetchData = async () => {
        try {
            const response1 = await axios.get('/api/customers');
            setDataCustomer(response1.data['data']);
            const response2 = await axios.get('/api/vehicle');
            setDataProject(response2.data['data']);
            const response = await axios.get('/api/repairs?page=1');
            setDataMaintenance(response.data);
            setFilters(response.data['data'])
        } catch (error) {
            showErrorToast("Gagal Fetch Data");
        }
    };

    function searchValue(value) {
        if (value.trim() === '') {
            return dataMaintenance.data;
        }

        const searchValueLowerCase = value.toLowerCase();

        return dataMaintenance.data.filter((item) => {
            for (let key in item) {
                if (typeof item[key] === 'string' && item[key].toLowerCase().includes(searchValueLowerCase)) {
                    return true;
                }
            }
            return false;
        });
    }

    const excel = useExcelJS({
        filename: "lap_maintenance.xlsx",
        worksheets: [
            {
                name: "Data Maintenance",
                columns: [
                    {
                        header: "No",
                        key: "no",
                        width: 10,
                    },
                    {
                        header: "Id Pallet",
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
                        header: "Status",
                        key: "status",
                        width: 32,
                    },
                ],
            },
        ],
    })

    const handlePageChange = async (selectedPage) => {
        // Lakukan perubahan halaman di sini
        const response3 = await axios.get(`/api/repairs?page=` + selectedPage);
        setDataMaintenance(response3.data);
        setFilters(response3.data['data'])
    };

    const onClick = async (e) => {
        e.preventDefault();
        const data = filters.map((item, index) => ({
            no: index + 1,
            id: item.kode,
            customer: item.customer,
            vehicle: item.vehicle,
            part: item.part,
            status: "Maintenance"
        }));
        await excel.download(data)
    }

    const handleSearch = () => {
        const searchResult = searchValue(searchTerm);
        setFilters(searchResult);
    };

    const getHistory = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.get(`/api/filters?customer=${selectKodeCust.current.value}&vehicle=${selectKodeProj.current.value}&page=1`);
            setDataMaintenance(response.data);
            setFilters(response.data['data']);
        } catch (error) {
            showErrorToast("Gagal Fetch Data");
        }
    };


    return(
        <div className={`h-full bg-white`}>
            <div className={`bg-[#2589ce] py-1.5 px-2 text-white flex flex-row justify-between`}>
                <h2 className={`font-bold text-[14px]`}>Filter</h2>
                <div className={`flex items-center`}>
                    <BiSolidUpArrow  size={10}/>
                </div>
            </div>
            <div className={`w-full gap-8 flex items-center bg-white px-3 py-2`}>
                <div className={`flex flex-row items-center`}>
                    <label className={`text-sm font-semibold mr-3`}>Cari : </label>
                    <input
                        type="text"
                        className="h-6 border-gray-500 mr-3"
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
                <div className={`flex flex-row items-center`}>
                    <label className={`text-sm font-semibold mr-3`}>Customer : </label>
                    <select
                        ref={selectKodeCust}
                        className="border border-gray-300 rounded p-1 text-sm"
                    >
                        <option className={`text-sm`} value={''}>
                            Semua
                        </option>
                        {
                            dataCustomer.map((e,index) =>(
                                <option className={`text-sm`} key={index} value={e['kode']}>
                                    {
                                        `${e['kode']} - ${e['name']}`
                                    }
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div className={`flex flex-row items-center`}>
                    <label className={`text-sm font-semibold mr-3`}>Project/Line : </label>
                    <select
                        ref={selectKodeProj}
                        className="border border-gray-300 rounded p-1 text-sm"
                    >
                        <option className={`text-sm`} value={''}>
                            Semua
                        </option>
                        {
                            dataProject.map((e,index) =>(
                                <option className={`text-sm`} key={index} value={e['kode']}>
                                    {
                                        `${e['kode']} - ${e['name']}`
                                    }
                                </option>
                            ))
                        }
                    </select>
                </div>
                <button
                    className="ml-3 bg-green-500 py-1 px-2 text-white font-semibold text-sm"
                    onClick={getHistory}
                >
                    Dapatkan Data
                </button>
            </div>
            <div className={`w-full bg-white h-4 border border-gray-500`} />
            <div className={`w-full bg-white p-2`}>
                <div className={`w-full bg-[#3da0e3] py-0.5 px-1 text-white flex flex-row`}>
                    <div className={`flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer`}>
                        <BiPrinter size={12} />
                        <p className={`text-white font-bold text-sm`}>Cetak</p>
                    </div>
                    <div
                        onClick={onClick}
                        className={`flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer`}>
                        <AiFillFileExcel size={12} />
                        <p className={`text-white font-bold text-sm`}>Excel</p>
                    </div>
                    <div
                        onClick={()=> fetchData()}
                        className={`flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer`}>
                        <BiRefresh size={12} />
                        <p className={`text-white font-bold text-sm`}>Refresh</p>
                    </div>
                </div>
                <table className="w-full">
                    <thead>
                    <tr>
                        <th className="p-2 bg-gray-100 text-left w-10">#</th>
                        <th className="p-2 bg-gray-100 text-left">Kode Pallet</th>
                        <th className="p-2 bg-gray-100 text-left">Customer</th>
                        <th className="p-2 bg-gray-100 text-left">Vehicle</th>
                        <th className="p-2 bg-gray-100 text-left">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        filters.map((e, index) =>(
                            <>
                                <tr className={`${selectedCell === index ? 'bg-[#85d3ff]': ''} text-sm font-semibold border-b border-gray-500`} key={index} onClick={()=>setSelectedCell(index)}>
                                    <td className="text-center p-1.5">{index+1}</td>
                                    <td className="px-4">{e['kode']}</td>
                                    <td className="px-4">{e['customer']}</td>
                                    <td className="px-4">{e['vehicle']}</td>
                                    <td className="px-4">Maintenance</td>

                                </tr>
                            </>
                        ))
                    }
                    </tbody>
                </table>
                <br/>
                <PaginationSelect
                    totalPages={dataMaintenance['totalPages']}
                    currentPage={dataMaintenance['currentPage']}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    )
}