import {BiEdit, BiPlusMedical, BiPrinter, BiRefresh, BiSolidUpArrow} from "react-icons/bi";
import {ImCross} from "react-icons/im";
import {BsFillTrashFill, BsQrCode} from "react-icons/bs";
import {AiFillFileExcel} from "react-icons/ai";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import DeleteModal from "@/components/Modal/DeleteModal";
import {FaRegWindowMaximize} from "react-icons/fa";
import {QRCode} from "react-qrcode-logo";
import {showErrorToast, showSuccessToast} from "@/utils/toast";
import Print from "@/components/print/label";
import {useExcelJS} from "react-use-exceljs";
import PaginationSelect from "@/components/PaginationSelect";
export default function Pallet() {
    const [dataVehicle, setDataVehicle] = useState([])
    const [dataPart, setDataPart] = useState([])
    const [dataPallet, setdataPallet] = useState([])
    const [dataCust, setDataCust] = useState([])

    const [selectedCell, setSelectedCell] = useState({})

    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState([])
    const custFilter = useRef(null);
    const vehicleFilter = useRef(null);

    const [closeModal, setCloseModal] = useState(false)
    const [closeAddModal, setCloseAddModal] = useState(false)
    const [closeQr, setCloseQr] = useState(false)


    const custInput = useRef(null);
    const nameInput = useRef(null);
    const vehicleInput = useRef(null);
    const partInput = useRef(null);




    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/vehicle');
            setDataVehicle(response.data['data']);
            const response2 = await axios.get('/api/parts');
            setDataPart(response2.data['data']);
            const response3 = await axios.get('/api/pallets?page=1');
            setdataPallet(response3.data);
            const response4 = await axios.get('/api/customers');
            setDataCust(response4.data['data']);
            setFilters(response3.data['data'])
        } catch (error) {
            showErrorToast("Gagal Fetch Data")
        }
    };

    const deleteData = async (e) => {
        try {
            await axios.delete('/api/pallets/' + e)
            showSuccessToast("Sukses Hapus Data")
        } catch (e) {
           showErrorToast("Gagal Hapus Data")
        } finally {
            setCloseModal(false)
            await getFilter()
        }
    }

    function searchValue(value) {
        if (value.trim() === '') {
            return dataPallet.data;
        }

        const searchValueLowerCase = value.toLowerCase();

        return dataPallet.data.filter((item) => {
            for (let key in item) {
                if (typeof item[key] === 'string' && item[key].toLowerCase().includes(searchValueLowerCase)) {
                    return true;
                }
            }
            return false;
        });
    }

    const handlePageChange = async (selectedPage) => {
        // Lakukan perubahan halaman di sini
        const response3 = await axios.get('/api/pallets?page=' + selectedPage);
        setdataPallet(response3.data);
        setFilters(response3.data['data'])
    };

    const submitData = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/pallets',{
                name : nameInput.current.value,
                customer : custInput.current.value,
                vehicle: vehicleInput.current.value,
                part: partInput.current.value
            }).then(r =>{
                showSuccessToast("Sukses Simpan Data")
                getFilter()
            })
        } catch (e) {
            showErrorToast("Gagal Simpan Data")
        } finally {
            setCloseAddModal(false)
        }
    }


    const handleSearch = () => {
        const searchResult = searchValue(searchTerm);
        setFilters(searchResult);
    };


    const excel = useExcelJS({
        filename: "data_pallet.xlsx",
        worksheets: [
            {
                name: "Data Pallet",
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
                        header: "Nama Pallet",
                        key: "name",
                        width: 40,
                    },
                    {
                        header: "Customer",
                        key: "customer",
                        width: 10,
                    },
                    {
                        header: "Vehicle",
                        key: "vehicle",
                        width: 20,
                    },
                    {
                        header: "Part",
                        key: "part",
                        width: 32,
                    },
                    {
                        header: "Qr Code",
                        key: "qr",
                        width: 32,
                    },
                ],
            },
        ],
    })
    const onClick = async (e) => {
        e.preventDefault();
        const data = filters.data.map((item, index) => ({
            no: index + 1,
            id: item.kode,
            name: item.name,
            customer: item.customer + ' - ' +item['Customer']['name'],
            vehicle: item.vehicle,
            part: item.part + ' - ' +item['Part']['name'],
            qr: "Ongoing"
        }));
        await excel.download(data)
    }

    const getFilter = async () => {
        try {
            const response = await axios.get(`/api/pallets?customer=${custFilter.current.value}&vehicle=${vehicleFilter.current.value}&page=1`);
            setdataPallet(response.data);
            setFilters(response.data['data']);
        } catch (error) {
            showErrorToast("Gagal Fetch Data");
        }
    };


    return(
        <div className={`h-full bg-white`}>
            {
                closeModal ?
                    <DeleteModal data={selectedCell.kode} setCloseModal={setCloseModal} action={deleteData} />
                    :
                    null
            }
            {
                closeAddModal ?
                    <div className={`fixed bg-black bg-opacity-20 h-full flex items-center justify-center top-0 left-0 z-[5000] w-full overflow-y-auto overflow-x-hidden outline-none`}>
                        <div className={`w-1/3 rounded bg-white border-4 border-[#3da0e3]`}>
                            <div className={`w-full flex items-center justify-between bg-[#3da0e3] font-light py-1 px-2 text-white text-sm`}>
                                <div className={'flex items-center gap-2'}>
                                    <FaRegWindowMaximize />
                                    Form Tambah Data
                                </div>
                                <div onClick={()=> setCloseAddModal(false)} className={`hover:bg-red-800 p-1`}>
                                    <ImCross size={10} />
                                </div>
                            </div>
                            <div className={`p-2 flex flex-col gap-5`}>
                                <div className={`border border-gray-300 w-full p-3 flex flex-col gap-3 text-sm`}>
                                    <div className={`flex flex-row w-full justify-between items-center gap-2`}>
                                        <label className={`w-1/4`}>Kode : </label>
                                        <input className={`border border-gray-300 p-1 flex-grow`} disabled={true} placeholder={'Otomatis'} />
                                    </div>
                                    <div className={`flex flex-row w-full justify-between items-center gap-2`}>
                                        <label className={`w-1/4`}>Nama Pallet : </label>
                                        <input ref={nameInput} className={`border border-gray-300 p-1 flex-grow`} placeholder={'Nama Pallet'} />
                                    </div>
                                    <div className={`flex flex-row w-full justify-between items-center gap-2`}>
                                        <label className={`w-1/4`}>Customer : </label>
                                        <select ref={custInput} className={`border border-gray-300 p-1 flex-grow`}>
                                            {
                                                dataCust.map(e=>(
                                                    <option value={e['kode']} key={e['kode']}>
                                                        {
                                                            e['kode'] + ' - ' + e['name']
                                                        }
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className={`flex flex-row w-full justify-between items-center gap-2`}>
                                        <label className={`w-1/4`}>Vehicle : </label>
                                        <select ref={vehicleInput} className={`border border-gray-300 p-1 flex-grow`}>
                                            {
                                                dataVehicle.map(e=>(
                                                    <option value={e['kode']} key={e['kode']}>
                                                        {
                                                            e['kode'] + ' - ' + e['name']
                                                        }
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className={`flex flex-row w-full justify-between items-center gap-2`}>
                                        <label className={`w-1/4`}>Part : </label>
                                        <select ref={partInput} className={`border border-gray-300 p-1 flex-grow`}>
                                            {
                                                dataPart.map(e=>(
                                                    <option value={e['kode']} key={e['kode']}>
                                                        {
                                                            e['kode'] + ' - ' + e['name']
                                                        }
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className={`border border-gray-300 w-full p-3 flex flex-col gap-3 text-sm`}>
                                    <div className={`flex flex-row justify-center gap-2`}>
                                        <button onClick={ submitData} className={`bg-[#f17373] w-full text-white py-1 text-sm rounded`}>Simpan</button>
                                        <button onClick={()=> setCloseAddModal(false)} className={`border w-full border-gray-500 py-1 text-sm rounded`}>Batal</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    : null
            }
            {
                closeQr ?
                    <div className={`fixed bg-black bg-opacity-20 h-full flex items-center justify-center top-0 left-0 z-[5000] w-full overflow-y-auto overflow-x-hidden outline-none`}>
                        <div className={`rounded bg-white border-4 border-[#3da0e3]`}>
                            <div className={`w-full flex items-center justify-between bg-[#3da0e3] font-light py-1 px-2 text-white text-sm`}>
                                <div className={'flex items-center gap-2'}>
                                    <FaRegWindowMaximize />
                                    {
                                        `QR Code - ${selectedCell.kode}`
                                    }
                                </div>
                                <div onClick={()=> setCloseQr(false)} className={`hover:bg-red-800 p-1`}>
                                    <ImCross size={10} />
                                </div>
                            </div>
                            <div className={`p-6 flex flex-col gap-3 justify-center items-center`}>
                                <QRCode
                                    eyeRadius={10}
                                    logoWidth={70}
                                    ecLevel={'Q'}
                                    size={350}
                                    logoOpacity={0.5}
                                    value={selectedCell.kode}
                                    qrStyle={'squares'}
                                    logoImage={'/logo.png'} r
                                    removeQrCodeBehindLogo={true} />
                                <h2 className={`text-xl font-bold`}>
                                    {
                                        selectedCell.kode + ` - ` + selectedCell.name
                                    }
                                </h2>
                            </div>
                        </div>
                    </div>
                    : null
            }
            <div className={`bg-[#2589ce] py-1.5 px-2 text-white flex flex-row justify-between`}>
                <h2 className={`font-bold text-[14px]`}>Filter</h2>
                <div className={`flex items-center`}>
                    <BiSolidUpArrow  size={10}/>
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
                        {dataCust.map((e, index) => (
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
                        {dataVehicle.map((e, index) => (
                            <option className="text-sm" key={index} value={e['kode']}>
                                {`${e['kode']} - ${e['name']}`}
                            </option>
                        ))}
                    </select>
                    <button
                        className="ml-3 bg-green-500 py-1 px-2 text-white font-semibold text-sm"
                        onClick={getFilter}
                    >
                        Dapatkan Data
                    </button>
                </div>
            </div>
            <div className={`w-full bg-white h-4 border border-gray-500`} />
            <div className={`w-full bg-white p-2`}>
                <div className={`w-full bg-[#3da0e3] py-0.5 px-1 text-white flex flex-row`}>
                    <div
                        onClick={()=> setCloseAddModal(true)}
                        className={`flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer`}>
                        <BiPlusMedical size={12} />
                        <p className={`text-white font-bold text-sm`}>Baru</p>
                    </div>
                    <div
                        onClick={()=>setCloseModal(true)}
                        className={`flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer`}>
                        <BsFillTrashFill size={12} />
                        <p className={`text-white font-bold text-sm`}>Hapus</p>
                    </div>
                    <Print data={selectedCell} />
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
                    <div
                        onClick={()=>setCloseQr(true)}
                        className={`flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer`}>
                        <BsQrCode size={12} />
                        <p className={`text-white font-bold text-sm`}>QR Code</p>
                    </div>
                </div>
                <table className="w-full overflow-y-scroll">
                    <thead>
                    <tr>
                        <th className="py-2 bg-gray-100 text-left w-10">#</th>
                        <th className="py-2 bg-gray-100 text-left">Kode Pallet</th>
                        <th className="py-2 bg-gray-100 text-left">Nama Pallet</th>
                        <th className="py-2 bg-gray-100 text-left">Customer</th>
                        <th className="py-2 bg-gray-100 text-left">Vehicle</th>
                        <th className="py-2 bg-gray-100 text-left">Part</th>
                    </tr>
                    </thead>
                    <tbody className={`overflow-y-scroll`}>
                    {
                        filters.map((e, index) =>(
                            <>
                                <tr className={`${selectedCell.kode === e['kode'] ? 'bg-[#85d3ff]': ''} text-sm font-semibold border-b border-gray-500`} key={index} onClick={()=>{
                                    setSelectedCell(e)
                                }}>
                                    <td className="text-center p-1.5">{index+1}</td>
                                    <td>{e['kode']}</td>
                                    <td>{e['name'] ?? '-'}</td>
                                    <td>{e['customer'] + ' - ' + e['Customer']['name']}</td>
                                    <td>{e['vehicle'] + ' - ' + e['Vehicle']['name']}</td>
                                    <td>{e['part'] + ' - ' + e['Part']['name']}</td>
                                </tr>
                            </>
                        ))
                    }
                    </tbody>
                </table>
                <br/>
                <PaginationSelect
                    totalPages={dataPallet['totalPages']}
                    currentPage={dataPallet['currentPage']}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    )
}