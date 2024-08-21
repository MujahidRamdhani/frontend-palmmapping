import create from 'zustand';

interface StoreState {
    selectedCategory: string | null;
    setSelectedCategory: (category: string | null) => void;
}

const useStore = create<StoreState>((set) => ({
    selectedCategory: null,
    setSelectedCategory: (category) => set({ selectedCategory: category }),
}));

export default useStore;
