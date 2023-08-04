import {create} from "zustand";

const dataState = create((set) => ({
    listPart: [],
    user: [],
    setPart: (data) => set ({listPart: data}),
    setUser: (data) => set ({user: data}),
}));

const useStoreTab = create((set) => ({
    activeMenu: "Riwayat Transaksi",
    setActiveMenu: (value) => set({ activeMenu: value }),
    listTab: ['Riwayat Transaksi'],
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

const modalState = create((set) => ({
    modalAdd: false,
    modalFilter: false,
    modalEdit: false,
    modalDelete: false,
    modalQr: false,
    setModalAdd: (data) => set ({modalAdd: data}),
    setModalEdit: (data) => set ({modalEdit: data}),
    setModalDelete: (data) => set ({modalDelete: data}),
    setModalFilter: (data) => set ({modalFilter: data})
}));

const filterState = create((set) => ({
    custFilterValue: '',
    vehicleFilterValue: '',
    partFilterValue: '',
    statusFilterValue: '',
    startDateValue: '',
    endDateValue: '',
    setStartDateValue: (startDate) => set({ startDateValue: startDate }),
    setEndDateValue: (endDate) => set({ endDateValue: endDate }),
}));


export {dataState, useStoreTab, modalState, filterState}