import create from 'zustand';

interface StoreState {
    idPemetaanKebun: string | null;
    setIdPemetaanKebun: (id: string | null) => void;
}

const useIdPemetaanKebunStore = create<StoreState>((set) => ({
    idPemetaanKebun: null,
    setIdPemetaanKebun: (id) => set({ idPemetaanKebun: id }),
}));

export default useIdPemetaanKebunStore;
