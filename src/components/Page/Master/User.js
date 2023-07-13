import {BiEdit, BiPlusMedical, BiPrinter, BiRefresh, BiSolidUpArrow} from "react-icons/bi";
import {ImCross} from "react-icons/im";
import {BsFillTrashFill} from "react-icons/bs";
import axios from "axios";
import {toast} from "react-toastify";
import {useEffect, useState} from "react";
import DeleteModal from "@/components/Modal/DeleteModal";
import {FaRegWindowMaximize} from "react-icons/fa";
import {showErrorToast, showSuccessToast} from "@/utils/toast";

export default function User() {
    const [dataUser, setDataUser] = useState([])
    const [selectedCell, setSelectedCell] = useState([])
    const [closeModal, setCloseModal] = useState(false)
    const [closeAddModal, setCloseAddModal] = useState(false)
    const [closeEditModal, setCloseEditModal] = useState(false)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    useEffect(()=>{
        fetchData()
    },[])

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/users',{
                withCredentials: true,
            });
            setDataUser(response.data['data']);
        } catch (error) {
            showErrorToast("Gagal Fetch Data");
        }
    };

    const submitData = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/users',{
                username : username,
                password : password,
            }).then(r =>{
                showSuccessToast("Sukses Simpan Data");
                fetchData()
            })
        } catch (e) {
            showErrorToast("Gagal Simpan Data");

        } finally {
            setCloseAddModal(false)
        }
    }

    const editData = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/api/users/' + selectedCell.id,{
                password : password,
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

    const deleteData = async (e) => {
        try {
            await axios.delete('/api/users/' + e)
            showSuccessToast("Sukses Hapus Data");
        } catch (e) {
            showErrorToast("Gagal Hapus Data");

        } finally {
            setCloseModal(false)
            fetchData()
        }
    }


    return(
        <div className={`h-full bg-white`}>
            {
                closeModal ?
                    <DeleteModal data={selectedCell} setCloseModal={setCloseModal} action={deleteData} />
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
                                        <label className={`w-1/4`}>Username : </label>
                                        <input
                                            onChange={event => setUsername(event.target.value)}
                                            className={`border border-gray-300 p-1 flex-grow`} />
                                    </div>
                                    <div className={`flex flex-row w-full justify-between items-center gap-2`}>
                                        <label className={`w-1/4`}>Password : </label>
                                        <input
                                            type={`password`}
                                            onChange={event => setPassword(event.target.value)}
                                            className={`border border-gray-300 p-1 flex-grow`} />
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
                                        <label className={`w-1/4`}>Username : </label>
                                        <input
                                            disabled={true}
                                            defaultValue={selectedCell.username}
                                            className={`border border-gray-300 p-1 flex-grow`} />
                                    </div>
                                    <div className={`flex flex-row w-full justify-between items-center gap-2`}>
                                        <label className={`w-1/4`}>Password : </label>
                                        <input
                                            type={`password`}
                                            onChange={event => setPassword(event.target.value)}
                                            className={`border border-gray-300 p-1 flex-grow`} />
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
                        onClick={()=> setCloseEditModal(true)}
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
                            <th className="py-2 bg-gray-100 text-left">User ID</th>
                            <th className="py-2 bg-gray-100 text-left">Username</th>
                            <th className="py-2 bg-gray-100 text-left">Role</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            dataUser.map((e, index) =>(
                                <tr key={e['id']}  className={`${selectedCell.id === e['id'] ? 'bg-[#85d3ff]': ''} text-sm font-semibold border-b border-gray-500`} onClick={()=>setSelectedCell(e)}>
                                    <td className="text-center p-1.5">{index+1}</td>
                                    <td>{e['id']}</td>
                                    <td>{e['username']}</td>
                                    <td>{e['role']}</td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}