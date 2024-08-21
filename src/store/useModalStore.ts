import create from 'zustand';

interface ModalState {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    showModalPenolakan: boolean;
    setShowModalPenolakan: (show: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
    showModal: false,
    setShowModal: (show) => set({ showModal: show }),
    showModalPenolakan: false,
    setShowModalPenolakan: (show) => set({ showModalPenolakan: show }),
}));
