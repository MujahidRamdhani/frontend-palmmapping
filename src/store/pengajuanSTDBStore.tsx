import create from 'zustand';
import axios from 'axios';

// Define the state and actions for the form
interface FormState {
    isSubmitting: boolean;
    isSuccess: boolean;
    submitForm: (data: any) => Promise<void>;
    setError: (error: string) => void;
    resetState: () => void;
    error: string | null;
}

const pengajuanSTDBStore = create<FormState>((set) => ({
    isSubmitting: false,
    error: null,
    isSuccess: false,
    submitForm: async (data) => {
        set({ isSubmitting: true });
        try {
            await axios.post('http://localhost:5000/STDBS', {
                nomorSTDB: data.nomorSTDB,
                nama: data.nama,
                tempatTanggalLahir: data.tempatTanggalLahir,
                nomorKTP: data.nomorKTP,
                alamat: data.alamat,
                lokasiKebun: data.lokasiKebun,
                statusKepemilikanLahan: data.statusKepemilikanLahan,
                nomorSertifikat: data.nomorSertifikat,
                luasKebun: data.luasKebun,
                jenisTanaman: data.jenisTanaman,
                produksiPerHaPerTahun: data.produksiPerHaPerTahun,
                asalBenih: data.asalBenih,
                polaTanam: data.polaTanam,
                jenisPupuk: data.jenisPupuk,
                mitraPengolahan: data.mitraPengolahan,
                jenisTanah: data.jenisTanah,
                tahunTanam: data.tahunTanam,
                usahaLainDikebun: data.usahaLainDikebun,
                cidFotoLahan: data.cidFotoLahan,
            });
            set({ isSubmitting: false, error: null, isSuccess: true });
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                console.error('Full error response:', err.response.data);
                const errorMessage = err.response.data.msg;
                set({ isSubmitting: false, error: errorMessage });
            } else {
                console.error('Unknown error occurred:', err);
                set({
                    isSubmitting: false,
                    error: 'Terjadi kesalahan yang tidak diketahui.',
                });
            }
        }
    },
    setError: (error) => set({ error }),
    resetState: () =>
        set({
            isSubmitting: false,
            isSuccess: false,
            error: null,
        }),
}));

export default pengajuanSTDBStore;
