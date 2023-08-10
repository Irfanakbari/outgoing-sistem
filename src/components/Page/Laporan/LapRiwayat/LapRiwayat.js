import {BiFilter, BiPrinter, BiRefresh, BiSolidUpArrow} from "react-icons/bi";
import { ImCross } from "react-icons/im";
import { AiFillFileExcel } from "react-icons/ai";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import ExcelJS from "exceljs"
import PaginationSelect from "@/components/PaginationSelect";
import {showErrorToast} from "@/utils/toast";
import FilterModal from "@/components/Page/Laporan/LapRiwayat/FilterModal";
import {filterState, modalState} from "@/context/states";

export default function LapRiwayat() {
    const [dataHistory, setDataHistory] = useState([]);
    const {modalFilter,setModalFilter} = modalState()
    const {
        startDateValue,
        endDateValue,
    } = filterState();

    const [selectedCell, setSelectedCell] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState([]);


    useEffect(() => {
        fetchData();
    }, []);

    const getHistory = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.get(`/api/history?start=${startDateValue}&end=${endDateValue}&page=1`);
            setDataHistory(response.data);
            setFilters(response.data['data']);
        } catch (error) {
            showErrorToast("Gagal Fetch Data");
        } finally {
            setModalFilter(false)
        }
    };

    const fetchData =  () => {
        axios.get(`/api/history?page=1`).then(response=>{
            setDataHistory(response.data);
            setFilters(response.data['data']);
        }).catch(()=>{
            showErrorToast("Gagal Fetch Data");
        })
    };

    const handlePageChange = async (selectedPage) => {
        // Lakukan perubahan halaman di sini
        const response3 = await axios.get(`/api/history?start=${startDateValue}&end=${endDateValue}&page=` + selectedPage);
        setDataHistory(response3.data);
        setFilters(response3.data['data'])
    };

    const handleSearch = async () => {
        const searchValueLowerCase = searchTerm.toLowerCase().split(' ').join('');
        const response = await axios.get(`/api/history?search=${searchValueLowerCase}`);
        setDataHistory(response.data);
        setFilters(response.data['data']);
    };

    const saveExcel = async (e) => {
        e.preventDefault();
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("My Sheet");
        sheet.properties.defaultRowHeight = 40;
        sheet.getCell('A1:I1').fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor : {argb: '0366fc'}
        }
        sheet.getCell('B1').fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor : {argb: '0366fc'}
        }
        sheet.getCell('C1').fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor : {argb: '0366fc'}
        }
        sheet.getCell('D1').fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor : {argb: '0366fc'}
        }
        sheet.getCell('E1').fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor : {argb: '0366fc'}
        }
        sheet.getCell('F1').fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor : {argb: '0366fc'}
        }
        sheet.getCell('G1').fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor : {argb: '0366fc'}
        }
        sheet.getCell('H1').fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor : {argb: '0366fc'}
        }
        sheet.getCell('I1').fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor : {argb: '0366fc'}
        }
        sheet.getRow(1).font = {
            name: "Comic Sans MS",
            family: 4,
            size: 16,
            bold: true,
            color: {argb: 'FFFFFF'}
        }
        sheet.columns = [
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
                width: 32,
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
        ];
        filters.map((item, index) => {
            const keluarDate = item['keluar'] ? dayjs(item['keluar']) : null;
            const masukDate = item['masuk'] ? dayjs(item['masuk']) : null;
            const oneWeekAgo = dayjs().subtract(1, 'week');

            const rowFill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb:
                        masukDate === null && keluarDate.isBefore(oneWeekAgo) ? 'FF0000' : 'FFFFFFFF'
                },
            };

            const row = sheet.addRow({
                no: index + 1,
                id: item.id_part,
                masuk: item['timestamp'] ? dayjs(item['timestamp']).locale('id').format('DD MMMM YYYY HH:mm') : '-',
            });
            row.fill = rowFill
        });
        await workbook.xlsx.writeBuffer().then(data=>{
            const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheet.sheet'})
            const url = window.URL.createObjectURL(blob)
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = 'Lap. Riwayat.xlsx';
            anchor.click();
            window.URL.revokeObjectURL(anchor);
        })
    };


    return (
        <div className="h-full bg-white">
            <div className="bg-[#00DD94] py-1.5 px-2 text-white flex flex-row justify-between">
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
                        onClick={getHistory}
                    />
                    <button
                        className="bg-green-500 py-1 px-2 text-white font-semibold text-sm"
                        onClick={handleSearch}
                    >
                        Dapatkan Data
                    </button>
                </div>
                {modalFilter&&
                    <FilterModal onSubmit={getHistory}/>
                }
            </div>
            <div className="w-full bg-white h-4 border border-gray-500" />
            <div className="w-full bg-white p-2">
                <div className="w-full bg-[#00B8A7] py-0.5 px-1 text-white flex flex-row">
                    <div className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#0092A1] hover:cursor-pointer">
                        <BiPrinter size={12} />
                        <p className="text-white font-bold text-sm">Cetak</p>
                    </div>
                    <div onClick={saveExcel} className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#0092A1] hover:cursor-pointer">
                        <AiFillFileExcel size={12} />
                        <p className="text-white font-bold text-sm">Excel</p>
                    </div>
                    <div onClick={fetchData} className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#0092A1] hover:cursor-pointer">
                        <BiRefresh size={12} />
                        <p className="text-white font-bold text-sm">Refresh</p>
                    </div>
                    <div onClick={()=>setModalFilter(true)} className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#0092A1] hover:cursor-pointer">
                        <BiFilter size={12} />
                        <p className="text-white font-bold text-sm">Filter</p>
                    </div>
                </div>
                <table className="w-full">
                    <thead>
                    <tr>
                        <th className="py-2 bg-gray-100 text-left w-10">#</th>
                        <th className="py-2 bg-gray-100 text-left">ID Part</th>
                        <th className="py-2 bg-gray-100 text-left">TimeStamp</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        filters.map((e, index) => (
                            <tr
                                className={`${selectedCell === index ? 'bg-[#00DD94]' : ''} text-sm font-semibold border-b border-gray-500`}
                                key={index}
                                onClick={() => setSelectedCell(index)}
                            >
                                <td className="text-center p-1.5">{index + 1}</td>
                                <td>{e['id_part']}</td>
                                <td>{e['timestamp'] ? dayjs(e['timestamp']).locale('id').format('DD MMMM YYYY HH:mm') : '-'}</td>
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
