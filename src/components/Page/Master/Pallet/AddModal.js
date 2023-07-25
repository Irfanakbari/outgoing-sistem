import React from "react";
import ModalLayout from "@/components/Modal/AddModalLayout";
import {dataState} from "@/context/states";

export default function AddModalLayout({ onSubmit, reset, register }) {
    const {listCustomer, listPart, listVehicle} = dataState()

    return (
        <ModalLayout onSubmit={onSubmit} reset={reset}>
            <div className="border border-gray-300 w-full p-3 flex flex-col gap-3 text-sm">
                <div className="flex flex-row w-full justify-between items-center gap-2">
                    <label className="w-1/4">Nama Pallet : </label>
                    <input {...register("name")} className="border border-gray-300 p-1 flex-grow" />
                </div>
                {/*<div className="flex flex-row w-full justify-between items-center gap-2">*/}
                {/*    <label className="w-1/4">Customer : </label>*/}
                {/*    <select {...register("customer")} className="border border-gray-300 p-1 flex-grow">*/}
                {/*        {*/}
                {/*            listCustomer.map((e, index)=>(*/}
                {/*                <option key={index} value={e.kode}>*/}
                {/*                    {*/}
                {/*                        `${e.kode} - ${e.name}`*/}
                {/*                    }*/}
                {/*                </option>*/}
                {/*            ))*/}
                {/*        }*/}
                {/*    </select>*/}
                {/*</div>*/}
                {/*<div className="flex flex-row w-full justify-between items-center gap-2">*/}
                {/*    <label className="w-1/4">Vehicle : </label>*/}
                {/*    <select {...register("vehicle")} className="border border-gray-300 p-1 flex-grow">*/}
                {/*        {*/}
                {/*            listVehicle.map((e, index)=>(*/}
                {/*                <option key={index} value={e.kode}>*/}
                {/*                    {*/}
                {/*                        `${e.kode} - ${e.name}`*/}
                {/*                    }*/}
                {/*                </option>*/}
                {/*            ))*/}
                {/*        }*/}
                {/*    </select>*/}
                {/*</div>*/}
                <div className="flex flex-row w-full justify-between items-center gap-2">
                    <label className="w-1/4">Part : </label>
                    <select {...register("part")} className="border border-gray-300 p-1 flex-grow">
                        {
                            listPart.map((e, index)=>(
                                <option key={index} value={e.kode}>
                                    {
                                        `${e['Customer'].name} - ${e.name} - Produksi ${e['Vehicle'].department}`
                                    }
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div className="flex flex-row w-full justify-between items-center gap-2">
                    <label className="w-1/4">Total Pallet : </label>
                    <input type={'number'} defaultValue={1} min={1} {...register("total")} className="border border-gray-300 p-1 flex-grow" />
                </div>
            </div>
        </ModalLayout>
    );
}
