import {dataState, useStoreTab} from "@/context/states";
import {useState} from "react";

export default function MainMenu({title, data}) {
    const [dropdown, setDropdown] = useState(false)
    const { setNewTab } = useStoreTab();
    const {user} = dataState()

    return (
        <div
            onMouseEnter={
                ()=> setDropdown(true)
            }
            onMouseLeave={
                ()=> setDropdown(false)
            }
            className={`border-gray-500 border-r hover:bg-[#85d3ff] hover:cursor-pointer`}>
            <span className={`p-2`}>{title}</span>
            {
                dropdown? <div className={`px-8 py-2 bg-white shadow-2xl shadow-gray-500 absolute flex flex-col gap-2 z-50`}>
                    {
                        data.map((e, index) => {
                            return (
                                <span key={index} onClick={() => { setNewTab(e.name) }}>{e.name}</span>
                            );
                        })
                    }
                </div> : null
            }
        </div>
    )
}