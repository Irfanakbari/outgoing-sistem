import Head from "next/head";
import HeadTitle from "@/components/Head/HeadTitle";
import {useEffect, useState} from "react";
import Customer from "@/components/Page/Master/Customer";
import {create} from "zustand";
import Dashboard from "@/components/Page/Master/Dashboard";
import {ImCross} from "react-icons/im";
import Pallet from "@/components/Page/Master/Pallet";
import LapRiwayat from "@/components/Page/Laporan/LapRiwayat";
import LapMaintenance from "@/components/Page/Laporan/LapMaintenance";
import User from "@/components/Page/Master/User";
import {getCookie} from "cookies-next";
import axios from "axios";
import Vehicle from "@/components/Page/Master/Vehicle";
import Part from "@/components/Page/Master/Part";


const useStoreTab = create((set) => ({
    activeMenu: "Dashboard",
    setActiveMenu: (value) => set({ activeMenu: value }),
    listTab: ['Dashboard'],
    setNewTab: (value) => set(state => {
        if (!state.listTab.includes(value)) {
            return {
                listTab: [...state.listTab, value],
                activeMenu: value
            };
        } else {
            return {
                ...state,
                activeMenu: value
            };
        }
    }),
    setCloseTab: (value) => set((state) => (
        {
            listTab: state.listTab.filter((tab) => tab !== value),
        }
    )),
}));


export default function Home() {
    const [dropdown1, setDropdown1] = useState(false)
    const [dropdown2, setDropdown2] = useState(false)
    const [user, setUser] = useState({})
    const { listTab, setNewTab, setCloseTab, activeMenu, setActiveMenu } = useStoreTab();

    useEffect(()=>{
        getCurrentUser()
    },[])

    async function getCurrentUser(){
        const user = await axios.get('/api/auth/user');
        setUser(user.data['data'])
    }

    return (
        <>
            <Head>
                <title>Home | PT Vuteq Indonesia</title>
            </Head>
            <div className={`p-2 min-h-screen flex overflow-x-scroll`}>
                <div className={`w-full bg-white border border-gray-500 h-full flex flex-col`}>
                    <HeadTitle user={user} />
                    <div className={`p-2`}>
                        <div className={`w-full flex bg-[#EBEBEB] text-sm font-bold`}>
                            <div
                                onMouseEnter={()=> setDropdown1(true)}
                                onMouseLeave={()=> setDropdown1(false)}
                                className={`border-gray-500 border-r hover:bg-[#85d3ff] hover:cursor-pointer`}>
                                <span className={`p-2`}>
                                    Master Data
                                </span>
                                {
                                    dropdown1 ? <div className={`px-8 py-2 bg-white shadow-2xl shadow-gray-500 absolute flex flex-col gap-2`}>
                                    <span onClick={()=>{setNewTab('Customer')}}>
                                        Customer
                                    </span>
                                        <span onClick={()=>{setNewTab('Vehicle')}}>
                                        Vehicle
                                    </span>
                                        <span onClick={()=>{setNewTab('Part')}}>
                                        Part
                                    </span>
                                        <span onClick={()=>{setNewTab('Pallet')}}>
                                        Pallet
                                    </span>
                                        <span onClick={()=>{setNewTab('Users')}}>
                                        Users
                                    </span>
                                    </div> : null
                                }
                            </div>
                            <div
                                onMouseEnter={()=> setDropdown2(true)}
                                onMouseLeave={()=> setDropdown2(false)}
                                className={`border-gray-500 border-r hover:bg-[#85d3ff] hover:cursor-pointer`}>
                                <span className={`p-2`}>
                                    Laporan
                                </span>
                                {
                                    dropdown2 ? <div className={`px-8 py-2 bg-white shadow-2xl shadow-gray-500 absolute flex flex-col gap-2`}>
                                    <span onClick={()=>{setNewTab('Lap. Stok Pallet')}}>
                                        Lap. Stok Pallet
                                    </span>
                                        <span onClick={()=>{setNewTab('Lap. Riwayat Pallet')}}>
                                        Lap. Riwayat Pallet
                                    </span>
                                        <span onClick={()=>{setNewTab('Lap. Maintenance Pallet')}}>
                                        Lap. Maintenance Pallet
                                    </span>
                                    </div> : null
                                }
                            </div>
                        </div>
                    </div>
                    <div className={`bg-[#3da0e3] w-full mt-2 flex pt-1 px-1`}>
                        {
                            listTab.map(e=>{
                                return (
                                    <div
                                        key={e}
                                        onClick={() => setActiveMenu(e)}
                                        className={`${activeMenu === e ? "bg-white text-black" : "text-white"} flex items-center bg-[#2589ce] py-1 px-5 text-sm font-bold mr-2 hover:bg-white hover:text-black hover:cursor-pointer`}>
                                        {e} {
                                            e !== 'Dashboard' ? <ImCross className={`ml-2`} size={10} onClick={()=>setCloseTab(e)} /> : null
                                    }
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="w-full bg-white p-2 h-full overflow-y-scroll">
                        <div className="bg-[#EBEBEB] p-2 h-full">
                            {activeMenu === "Dashboard" ? <Dashboard /> : null}
                            {activeMenu === "Customer" ? <Customer /> : null}
                            {activeMenu === "Vehicle" ? <Vehicle /> : null}
                            {activeMenu === "Part" ? <Part /> : null}
                            {activeMenu === "Pallet" ? <Pallet /> : null}
                            {activeMenu === "Lap. Riwayat Pallet" ? <LapRiwayat /> : null}
                            {activeMenu === "Lap. Maintenance Pallet" ? <LapMaintenance /> : null}
                            {activeMenu === "Users" ? <User /> : null}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = async ({req, res}) => {
    const cookie = getCookie('@vuteq-token', {req, res});

    if (!cookie) {
        res.writeHead(302, {Location: '/'});
        res.end();
    }

    return {props: {}};
};