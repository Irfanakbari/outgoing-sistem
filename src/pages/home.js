import Head from "next/head";
import HeadTitle from "@/components/Head/HeadTitle";
import {useEffect} from "react";
import {ImCross} from "react-icons/im";
import LapRiwayat from "@/components/Page/Laporan/LapRiwayat/LapRiwayat";
import User from "@/components/Page/Master/User";
import {getCookie} from "cookies-next";
import axios from "axios";
import Part from "@/components/Page/Master/Part/Part";
import MainMenu from "@/components/Menu/MainMenu";
import {laporan, master} from "@/components/Menu/ListMenu";
import {dataState, useStoreTab} from "@/context/states";
import {showErrorToast, showSuccessToast} from "@/utils/toast";
import {useRouter} from "next/router";


export default function Home() {
    const { listTab, setCloseTab, activeMenu, setActiveMenu } = useStoreTab();
    const {user, setUser} = dataState()
    const router = useRouter()


    useEffect(()=>{
        getCurrentUser()
    },[])

    function getCurrentUser(){
        axios.get('/api/auth/user').then(r =>  {
            if (r.data['data'] === null){
                axios.get('/api/auth/logout').then(async () => {
                    showSuccessToast('Logout Berhasil')
                    await router.replace('/').then(()=>router.reload)
                }).catch(()=>{
                    showErrorToast("Gagal Logout");
                })
            }
            setUser(r.data['data'])
        });
    }

    return (
        <>
            <Head>
                <title>Home | PT Vuteq Indonesia</title>
            </Head>
            <div className={`p-2 min-h-screen flex overflow-x-scroll`}>
                <div className={`w-full bg-white border border-gray-500 h-full`}>
                    <HeadTitle user={user} />
                    <div className={`p-2`}>
                        <div className={`w-full flex bg-[#EBEBEB] text-sm font-bold`}>
                            {/*<MainMenu data={master} title={'Master Data'}/>*/}
                            {/*<MainMenu data={laporan} title={'Laporan'}/>*/}
                        </div>
                    </div>
                    <div className={`bg-[#00DD94] w-full mt-2 flex pt-1 px-1`}>
                        {
                            listTab.map((e, index)=>{
                                return (
                                    <div
                                        key={index}
                                        onClick={() => setActiveMenu(e)}
                                        className={`${activeMenu === e ? "bg-white text-black" : "text-white"} flex items-center just bg-[#2589ce] py-1 px-5 text-sm font-bold mr-2 hover:bg-white hover:text-black hover:cursor-pointer`}>
                                        {e} {
                                            e !== 'Riwayat Transaksi' && <ImCross className={`ml-2`} size={10} onClick={()=>setCloseTab(e)} />
                                    }
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="w-full bg-white p-2 h-full overflow-y-scroll">
                        <div className="bg-[#EBEBEB] p-2 h-full">
                            {/*{activeMenu === "Dashboard" && <Dashboard />}*/}
                            {activeMenu === "Part" && <Part />}
                            {activeMenu === "Riwayat Transaksi" && <LapRiwayat />}
                            {activeMenu === "Users" && <User />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = async ({req, res}) => {
    const cookie = getCookie('@vuteq-1-token', {req, res});

    if (!cookie) {
        res.writeHead(302, {Location: '/'});
        res.end();
    }

    return {props: {}};
};