import create from 'zustand';
import axios from 'axios';

// Define the state and actions for the form
interface FormState {
    isSubmitting: boolean;
    isSuccess: boolean;
    error: string | null;
    isError: boolean;
    submitForm: (data: any) => Promise<void>;
    setError: (error: string) => void;
    clearError: () => void;
    resetState: () => void;
}

const useFormStore = create<FormState>((set) => ({
    isSubmitting: false,
    isSuccess: false,
    error: null,
    isError: false,
    submitForm: async (data) => {
        set({ isSubmitting: true });
        try {
            await axios.post('http://localhost:5000/users', {
                NIK: data.NIK,
                name: data.name,
                email: data.email,
                password: data.password,
                confPassword: data.confPassword,
                roles: data.roles,
            });
            set({ isSubmitting: false, isSuccess: true, error: null });
        } catch (err) {
            let errorMessage = 'Terjadi kesalahan yang tidak diketahui.';
            if (axios.isAxiosError(err) && err.response) {
                console.error('Full error response:', err.response.data);
                errorMessage =
                    err.response.data.msg || 'Email sudah terdaftar!!';
            } else {
                console.error('Unknown error occurred:', err);
            }
            set({ isSubmitting: false, isSuccess: false, error: errorMessage });
        }
    },
    setError: (error) => set({ error, isError: !!error }),
    clearError: () => set({ error: null, isError: false }),
    resetState: () =>
        set({
            isSubmitting: false,
            isSuccess: false,
            error: null,
            isError: false,
        }),
}));

export default useFormStore;
