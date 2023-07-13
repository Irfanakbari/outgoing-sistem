import {BiFullscreen} from "react-icons/bi";
import {Bar, BarChart, ResponsiveContainer, XAxis, YAxis} from "recharts";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {showErrorToast} from "@/utils/toast";
import dayjs from "dayjs";

export default function Dashboard() {
    const [history, setHistory] = useState([])
    const [palletKeluar, setPalletKeluar] = useState([])
    const [palletMasuk, setPalletMasuk] = useState([])
    const [cardInfo, setCardInfo] = useState({})
    const elemRef = useRef(null);

    const [currentTime, setCurrentTime] = useState(new Date());



    useEffect(()=>{
        fetchData()
        const jam = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        const interval = setInterval(fetchData, 3000); // Panggil fetchData setiap 3 detik

        return () => {
            clearInterval(jam); // Hentikan interval saat komponen dibongkar
            clearInterval(interval); // Hentikan interval saat komponen dibongkar
        };
    },[])

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/dashboard');
            setCardInfo({
                stok: response.data['data']['totalStokPallet'],
                total: response.data['data']['totalPallet'],
                keluar: response.data['data']['totalPalletKeluar'],
                repair: response.data['data']['totalPalletRepair']
            })
            setHistory(response.data['data']['historyPallet'])
            setPalletKeluar(response.data['data']['palletKeluar'] ?? [])
            setPalletMasuk(response.data['data']['palletMasuk'])
        } catch (error) {
            showErrorToast("Gagal Fetch Data");
        }
    }
    const enterFullscreen = () => {
        if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
            // Saat ini dalam mode fullscreen, keluar dari fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } else {
            // Tidak dalam mode fullscreen, masuk ke fullscreen
            const elem = elemRef.current;

            if (elem) {
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                }
            }
        }
    };

    return(
        <div className={`bg-white overflow-x-scroll`} ref={elemRef}>
            <div className={`bg-[#2589ce] py-1.5 px-2 text-white flex flex-row justify-between`}>
                <div className={`flex flex-row justify-between w-full mr-1 items-center`}>
                    <h2 className={`font-bold text-[18px]`}>PT VUTEQ INDONESIA</h2>
                    <h2 className={`font-bold text-[14px]`}>Dasboard Status Pallet :  {currentTime.toLocaleTimeString()}</h2>
                </div>
                <div
                    onClick={enterFullscreen}
                    className={`flex items-center`}>
                    <BiFullscreen size={20}/>
                </div>
            </div>
            <div className={`w-full p-2`}>
                <div className={`grid-cols-4 pt-2 grid gap-5 text-white`}>
                    <div className={`bg-blue-500 p-4`}>
                        <h1 className={`font-bold text-4xl mb-5`}>{cardInfo.total ?? '-'}</h1>
                        <span className={`text-xl`}>Total Stok Pallet</span>
                    </div>
                    <div className={`bg-green-500 p-4`}>
                        <h1 className={`font-bold text-4xl mb-5`}>{cardInfo.stok ?? '-'}</h1>
                        <span className={`text-xl`}>Stok Tersedia</span>
                    </div>
                    <div className={`bg-red-500 p-4`}>
                        <h1 className={`font-bold text-4xl mb-5`}>{cardInfo.keluar ?? '-'}</h1>
                        <span className={`text-xl`}>Pallet Keluar</span>
                    </div>
                    <div className={`bg-yellow-500 p-4`}>
                        <h1 className={`font-bold text-4xl mb-5`}>{cardInfo.repair ?? '-'}</h1>
                        <span className={`text-xl`}>Pallet Repair</span>
                    </div>
                </div>
                <div className="grid-cols-3 pt-2 grid gap-5">
                    <div className="border-2 border-black flex flex-col min-h-[10cm] mb-5">
                        <div className="w-full bg-blue-800 text-white p-2 font-semibold">Diagram Stok</div>
                        <div style={{ width: '100%', height: '100%' }} className={`p-5`}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    {
                                        name:"Tersedia",
                                        fill:"blue",
                                        stok: cardInfo.stok
                                    },
                                    {
                                        name:"Keluar",
                                        fill: "red",
                                        stok: cardInfo.keluar
                                    },
                                    {
                                        name:"Maintenance",
                                        fill:"yellow",
                                        stok: cardInfo.repair
                                    }
                                ]}>
                                    <Bar dataKey="stok" fill="#3884d8" />
                                    <XAxis dataKey="name"/>
                                    <YAxis />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className={`border-2 border-black mb-5 overflow-y-scroll`}>
                        <div className={`w-full bg-red-800 text-white p-2 font-semibold`}>
                            Pallet Keluar
                        </div>
                        <table className="divide-y w-full divide-gray-200">
                            <thead>
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kode Pallet
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tujuan
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Time
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {
                                palletKeluar.map((val, index) =>(
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">{val.kode}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{val.customer}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{
                                            val['updated_at'] ? dayjs(val['updated_at']).locale('id').format('DD MMMM YYYY HH:mm') : '-'
                                        }</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                    <div className={`border-2 border-black mb-5 overflow-y-scroll`}>
                        <div className={`w-full bg-green-800 text-white p-2 font-semibold`}>
                            Pallet Masuk
                        </div>
                        <table className="divide-y w-full divide-gray-200">
                            <thead>
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kode Pallet
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tujuan
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Time
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {
                                palletMasuk.map((val, index) =>(
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">{val.kode}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{val.customer}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{
                                            val['updated_at'] ? dayjs(val['updated_at']).locale('id').format('DD MMMM YYYY HH:mm') : '-'
                                        }</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={`w-full`}>
                    <div className={`bg-red-800 text-white p-2 font-semibold`}>
                        Riwayat In/Out Pallet
                    </div>
                    <div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kode Pallet
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Part
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tujuan
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Operator Out
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Out
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Operator In
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    In
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {
                                history.map((val, index) =>(
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">{val.id_pallet}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{val['Pallet'].part}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{val['Pallet'].customer}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{val.user_out}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{
                                            val['keluar'] ? dayjs(val['keluar']).locale('id').format('DD MMMM YYYY HH:mm') : '-'
                                        }</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{val.user_in}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{
                                            val['masuk'] ? dayjs(val['masuk']).locale('id').format('DD MMMM YYYY HH:mm') : '-'
                                        }</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}