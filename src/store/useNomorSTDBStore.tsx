import create from 'zustand';

interface StoreState {
    nomorSTDBStore: string | null;
    setNomorSTDBStore: (id: string | null) => void;
}

const useNomorSTDBStore = create<StoreState>((set) => ({
    nomorSTDBStore: null,
    setNomorSTDBStore: (id) => set({ nomorSTDBStore: id }),
}));

export default useNomorSTDBStore;
