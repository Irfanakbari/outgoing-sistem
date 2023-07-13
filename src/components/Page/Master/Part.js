import {BiEdit, BiPlusMedical, BiPrinter, BiRefresh, BiSolidUpArrow} from "react-icons/bi";
import {ImCross} from "react-icons/im";
import {BsFillTrashFill} from "react-icons/bs";
import {AiFillFileExcel} from "react-icons/ai";
import axios from "axios";
import {toast} from "react-toastify";
import {useEffect, useRef, useState} from "react";
import DeleteModal from "@/components/Modal/DeleteModal";
import {FaRegWindowMaximize} from "react-icons/fa";
import {showErrorToast, showSuccessToast} from "@/utils/toast";

export default function Part() {
    const [dataParts, setDataParts] = useState([])
    const [dataCust, setDataCust] = useState([])


    const [selectedCell, setSelectedCell] = useState('')
    const [closeModal, setCloseModal] = useState(false)
    const [closeAddModal, setCloseAddModal] = useState(false)
    const [closeEditModal, setCloseEditModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState([])

    const selectKodeCust = useRef(null);
    const kodeInput = useRef(null);
    const nameInput = useRef()

    const editCust = useRef()
    const editName = useRef()


    useEffect(()=>{
        fetchData()
    },[])

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/parts');
            setDataParts(response.data['data']);
            setFilters(response.data['data'])
            const response2 = await axios.get('/api/customers');
            setDataCust(response2.data['data']);
        } catch (error) {
            showErrorToast("Gagal Fetch Data");
        }
    };

    const submitData = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/parts',{
                customer : selectKodeCust.current.value,
                name : nameInput.current.value,
                kode: kodeInput.current.value,
            }).then(r =>{
                showSuccessToast("Sukses Simpan Data");
                fetchData()
            })
        } catch (e) {
            showErrorToast(e.response.data.error);
        } finally {
            setCloseAddModal(false)
        }
    }

    const deleteData = async (e) => {
        try {
            await axios.delete('/api/parts/' + e)
            showSuccessToast("Sukses Hapus Data");
        } catch (e) {
            showErrorToast("Gagal Hapus Data");
        } finally {
            setCloseModal(false)
            fetchData()
        }
    }

    const editData = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/api/parts/' + selectedCell.kode,{
                name : editName.current.value,
                customer : editCust.current.value
            }).then(r =>{
                showSuccessToast("Sukses Edit Data");
                fetchData()
            })
        } catch (e) {
            showErrorToast("Gagal Edit Data");
        } finally {
            setCloseEditModal(false)
        }
    }

    function searchValue(value) {
        if (value.trim() === '') {
            return dataParts;
        }

        const searchValueLowerCase = value.toLowerCase();

        return dataParts.filter((item) => {
            for (let key in item) {
                if (typeof item[key] === 'string' && item[key].toLowerCase().includes(searchValueLowerCase)) {
                    return true;
                }
            }
            return false;
        });
    }


    const handleSearch = () => {
        const searchResult = searchValue(searchTerm);
        setFilters(searchResult);
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
                                                <label className={`w-1/4`}>Kode Part (A~Z) : </label>
                                                <input
                                                    ref={kodeInput}
                                                    className={`border border-gray-300 p-1 flex-grow`} />
                                            </div>
                                            <div className={`flex flex-row w-full justify-between items-center gap-2`}>
                                                <label className={`w-1/4`}>Nama Part : </label>
                                                <input
                                                    ref={nameInput}
                                                    className={`border border-gray-300 p-1 flex-grow`} />
                                            </div>
                                            <div className={`flex flex-row w-full justify-between items-center gap-2`}>
                                                <label className={`w-1/4`}>Customer : </label>
                                                <select ref={selectKodeCust} className={`border border-gray-300 p-1 flex-grow`}>
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
                                        </div>
                                        <div className={`border border-gray-300 w-full p-3 flex flex-col gap-3 text-sm`}>
                                            <div className={`flex flex-row justify-center gap-2`}>
                                                <button onClick={submitData} className={`bg-[#f17373] w-full text-white py-1 text-sm rounded`}>Simpan</button>
                                                <button onClick={()=> setCloseAddModal(false)} className={`border w-full border-gray-500 py-1 text-sm rounded`}>Batal</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        : null
                    }
            {
                closeEditModal ?
                    <div className={`fixed bg-black bg-opacity-20 h-full flex items-center justify-center top-0 left-0 z-[5000] w-full overflow-y-auto overflow-x-hidden outline-none`}>
                        <div className={`w-1/3 rounded bg-white border-4 border-[#3da0e3]`}>
                            <div className={`w-full flex items-center justify-between bg-[#3da0e3] font-light py-1 px-2 text-white text-sm`}>
                                <div className={'flex items-center gap-2'}>
                                    <FaRegWindowMaximize />
                                    Form Edit Data
                                </div>
                                <div onClick={()=> setCloseEditModal(false)} className={`hover:bg-red-800 p-1`}>
                                    <ImCross size={10} />
                                </div>
                            </div>
                            <div className={`p-2 flex flex-col gap-5`}>
                                <div className={`border border-gray-300 w-full p-3 flex flex-col gap-3 text-sm`}>
                                    <div className={`flex flex-row w-full justify-between items-center gap-2`}>
                                        <label className={`w-1/4`}>Nama Part : </label>
                                        <input
                                            ref={nameInput}
                                            defaultValue={selectedCell.name}
                                            className={`border border-gray-300 p-1 flex-grow`} />
                                    </div>
                                    <div className={`flex flex-row w-full justify-between items-center gap-2`}>
                                        <label className={`w-1/4`}>Customer : </label>
                                        <select ref={editCust} defaultValue={selectedCell.customer} className={`border border-gray-300 p-1 flex-grow`}>
                                            {
                                                dataCust.map(e=>(
                                                    <option key={e.kode} value={e.kode}>
                                                        {
                                                            e.kode
                                                        }
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className={`border border-gray-300 w-full p-3 flex flex-col gap-3 text-sm`}>
                                    <div className={`flex flex-row justify-center gap-2`}>
                                        <button onClick={editData} className={`bg-[#f17373] w-full text-white py-1 text-sm rounded`}>Simpan</button>
                                        <button onClick={()=> setCloseEditModal(false)} className={`border w-full border-gray-500 py-1 text-sm rounded`}>Batal</button>
                                    </div>
                                </div>
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
                <div className={`w-full flex items-center px-3 py-2`}>
                    <label className={`text-sm font-semibold mr-3`}>Cari : </label>
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
                <div className={`w-full h-4 border border-gray-500`} />
                <div className={`w-full p-2`}>
                    <div className={`w-full bg-[#3da0e3] py-0.5 px-1 text-white flex flex-row`}>
                        <div
                            onClick={()=> setCloseAddModal(true)}
                            className={`flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer`}>
                            <BiPlusMedical size={12} />
                            <p className={`text-white font-bold text-sm`}>Baru</p>
                        </div>
                        <div
                            onClick={()=>setCloseEditModal(true)}
                            className={`flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer`}>
                            <BiEdit size={12} />
                            <p className={`text-white font-bold text-sm`}>Ubah</p>
                        </div>
                        <div
                            onClick={()=>setCloseModal(true)}
                            className={`flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer`}>
                            <BsFillTrashFill size={12} />
                            <p className={`text-white font-bold text-sm`}>Hapus</p>
                        </div>
                        <div className={`flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer`}>
                            <BiPrinter size={12} />
                            <p className={`text-white font-bold text-sm`}>Cetak</p>
                        </div>
                        <div className={`flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer`}>
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
                    <div className="flex overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr>
                                <th className="py-2 bg-gray-100 text-center w-20">#</th>
                                <th className="py-2 bg-gray-100 text-left">Kode Part (A~Z) (A~Z)</th>
                                <th className="py-2 bg-gray-100 text-left">Nama Part</th>
                                <th className="py-2 bg-gray-100 text-left">Customer</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                filters.map((e, index) =>(
                                    <>
                                        <tr className={`${selectedCell.kode === e['kode'] ? 'bg-[#85d3ff]': ''} text-sm font-semibold border-b border-gray-500`} key={e['kode']} onClick={()=>setSelectedCell(e)}>
                                            <td className="text-center p-1.5">{index+1}</td>
                                            <td>{e['kode']}</td>
                                            <td>{e['name']}</td>
                                            <td>{e['customer'] + ' - ' + e['Customer']['name']}</td>
                                        </tr>
                                    </>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
        </div>
    )
}