import create from 'zustand';

interface FileState {
    image: boolean;
    setImage: (show: boolean) => void;
    fileLegalitasLahan: boolean;
    setFileLegalitasLahan: (show: boolean) => void;
}

export const selectFileStore = create<FileState>((set) => ({
    image: false,
    setImage: (show) => set({ image: show }),
    fileLegalitasLahan: false,
    setFileLegalitasLahan: (show) => set({ fileLegalitasLahan: show }),
}));
