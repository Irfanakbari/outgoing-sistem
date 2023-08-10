import React from "react";
import {FaRegWindowMaximize} from "react-icons/fa";
import {ImCross} from "react-icons/im";
import {filterState, modalState} from "@/context/states";

export default function FilterModal({ onSubmit }) {
    const {setModalFilter} = modalState()
    const {
        startDateValue,
        endDateValue,
        setStartDateValue,
        setEndDateValue,
    } = filterState();


    // Handle changes to the startDate and endDate values
    const handleStartDateChange = (event) => {
        setStartDateValue(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDateValue(event.target.value);
    };


    return (
        <div className="fixed bg-black bg-opacity-20 h-full flex items-center justify-center top-0 left-0 z-[5000] w-full overflow-y-auto overflow-x-hidden outline-none">
            <div className="w-1/3 rounded bg-white border-4 border-[#00DD94]">
                <div className="w-full flex items-center justify-between bg-[#00DD94] font-light py-1 px-2 text-white text-sm">
                    <div className="flex items-center gap-2">
                        <FaRegWindowMaximize />
                        Filter Data
                    </div>
                    <div onClick={() => setModalFilter(false)} className="hover:bg-red-800 p-1">
                        <ImCross size={10} />
                    </div>
                </div>
                <div className="p-2 flex flex-col gap-5">
                    <div className="border border-gray-300 w-full p-3 flex flex-col gap-3 text-sm">
                        <div className={`flex flex-col gap-2`}>
                            <label className="text-sm font-semibold mr-3">Tanggal Awal :</label>
                            <input value={startDateValue} onChange={handleStartDateChange} type={'date'} className={`border border-gray-300 rounded p-1 text-sm`} />
                        </div>
                        <div className={`flex flex-col gap-2`}>
                            <label className="text-sm font-semibold mr-3">Tanggal Akhir :</label>
                            <input value={endDateValue} onChange={handleEndDateChange} type={'date'} className={`border border-gray-300 rounded p-1 text-sm`} />
                        </div>
                    </div>
                    <div className="border border-gray-300 w-full p-3 flex flex-col gap-3 text-sm">
                        <div className="flex flex-row justify-center gap-2">
                            <button onClick={onSubmit} className="bg-[#f17373] w-full text-white py-1 text-sm rounded">
                                Simpan
                            </button>
                            <button onClick={() => {
                                setModalFilter(false)
                            }} className="border w-full border-gray-500 py-1 text-sm rounded">
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
