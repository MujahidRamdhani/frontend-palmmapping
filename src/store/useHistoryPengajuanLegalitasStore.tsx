import create from 'zustand';

interface StoreState {
    historyPengajuanLegalitas: string | null;
    setHistoryPengajuanLegalitas: (id: string | null) => void;
    stdbStore: string | null;
    setStdbStore: (id: string | null) => void;
}

const useHistoryPengajuanLegalitasStore = create<StoreState>((set) => ({
    historyPengajuanLegalitas: null,
    setHistoryPengajuanLegalitas: (id) =>
        set({ historyPengajuanLegalitas: id }),
    stdbStore: null,
    setStdbStore: (id) => set({ stdbStore: id }),
}));

export default useHistoryPengajuanLegalitasStore;
