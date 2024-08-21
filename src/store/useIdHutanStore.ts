import create from 'zustand';

interface StoreState {
    idHutanStore: string | null;
    setIdHutanStore: (id: string | null) => void;
}

const useIdHutanStore = create<StoreState>((set) => ({
    idHutanStore: null,
    setIdHutanStore: (id) => set({ idHutanStore: id }),
}));

export default useIdHutanStore;
