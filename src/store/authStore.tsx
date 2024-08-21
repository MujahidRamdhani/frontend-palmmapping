import create from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import Cookies from 'js-cookie';

// Define the user type
interface User {
    data: {
        uuid: string;
        idRole: string;
        email: string;
        nama: string;
        alamat: string;
        tempatTanggalLahir: string;
        role: string;
        wallet: string;
    };
}

// Define the initial state type
interface AuthState {
    user: User | null;
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    message: string;
}

// Define the response types
interface AuthResponse {
    user: User;
}

interface ErrorResponse {
    message: string;
}

// Set axios to include credentials (cookies) in requests
axios.defaults.withCredentials = true;

// Zustand store with persistence
const useAuthStore = create(
    persist<
        AuthState & {
            loginUser: (email: string, password: string) => Promise<void>;
            getMe: () => Promise<void>;
            logout: () => Promise<void>;
            resetState: () => void;
        }
    >(
        (set) => ({
            user: null,
            isError: false,
            isSuccess: false,
            isLoading: false,
            message: '',

            // Async function for login
            loginUser: async (email: string, password: string) => {
                set({ isLoading: true });
                try {
                    const response = await axios.post(
                        'http://localhost:9999/api/users/login',
                        {
                            email,
                            password,
                        },
                    );
                    // const userData = response.data.data;
                    // Cookies.set('userEmail', userData.email, { expires: 5 / 24 });
                    set({
                        user: response.data,
                        isSuccess: true,
                        isError: false,
                        message: '',
                    });
                } catch (error: any) {
                    const errResponse = error.response?.data as ErrorResponse;
                    set({
                        message: errResponse.message || 'An error occurred',
                        isError: true,
                        isSuccess: false,
                    });
                } finally {
                    set({ isLoading: false });
                }
            },

            // Async function for getting user data
            getMe: async () => {
                try {
                    const response = await axios.get<AuthResponse>(
                        'http://localhost:9999/api/users/me',
                    );
                    set({
                        user: response.data.user,
                        isSuccess: true,
                        isError: false,
                        message: '',
                    });
                } catch (error: any) {
                    const errResponse = error.response?.data as ErrorResponse;
                    set({
                        message: errResponse?.message || 'An error occurred',
                        isError: true,
                        isSuccess: false,
                    });
                } finally {
                }
            },

            // Async function for logout
            logout: async () => {
                try {
                    await axios.delete(
                        'http://localhost:9999/api/users/logout',
                    );
                    // Cookies.remove('userEmail');
                    localStorage.removeItem('auth-storage');
                    console.log(
                        'User logged out successfully',
                        localStorage.getItem('auth-storage'),
                    );
                    set({
                        user: null,
                        isSuccess: false,
                        isError: false,
                        message: '',
                    });
                } catch (error: any) {
                    const errResponse = error.response?.data as ErrorResponse;
                    set({
                        message: errResponse?.message || 'An error occurred',
                        isError: true,
                        isSuccess: false,
                    });
                }
            },

            // Reset state function
            resetState: () =>
                set({
                    user: null,
                    isError: false,
                    isSuccess: false,
                    isLoading: false,
                    message: '',
                }),
        }),
        {
            name: 'auth-storage', // unique name for the storage key
            getStorage: () => localStorage, // use local storage
        },
    ),
);

export default useAuthStore;
