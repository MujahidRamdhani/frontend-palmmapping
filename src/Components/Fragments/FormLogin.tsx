import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import InputField from '../Elements/Input/InputField';
import Button from '../Elements/Button/Button';
import useAuthStore from '../../store/authStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { error } from 'echarts/types/src/util/log.js';

// Define validation schema using Zod
const schema = z.object({
    email: z.string().email('Masukkan alamat email yang valid'),
    password: z
        .string()
        .min(8, 'Kata sandi harus terdiri dari minimal 8 karakter'),
});

// Define type for form fields based on Zod schema
type FormFields = z.infer<typeof schema>;

const FormLogin = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        resolver: zodResolver(schema), // Use Zod resolver for validation
    });

    const {
        loginUser,
        message,
        isLoading,
        isSuccess,
        resetState,
        user,
        isError,
    } = useAuthStore(); // Dapatkan fungsi loginUser dari useAuthStore
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            navigate('/PalmMapping');
        }
        // resetState()
    }, [isSuccess]);

    // Function to be called on form submission
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            // Panggil fungsi loginUser untuk otentikasi pengguna
            await loginUser(data.email, data.password);

            if (message) {
                setError('root', { message: message });
            }
        } catch (error) {
            setError('root', {
                message: message, // Error message for invalid credentials
            });
        }
    };
    console.log('message', message);
    // useEffect(() => {
    //     const checkSession = async () => {
    //         try {
    //             const response = await axios.get(
    //                 'http://localhost:9999/api/users/checkSession',
    //             );
    //             console.log(response);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };

    //     checkSession();
    // }, [isSuccess]);
    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <InputField
                label="Alamat Email"
                id="email"
                type="email"
                register={register}
                errors={errors}
                placeholder="Masukan Email"
            />
            <InputField
                label="Kata Sandi"
                id="password"
                type="password"
                register={register}
                placeholder="Masukan Kata Sandi"
                errors={errors}
            />

            <div className="flex justify-center">
                <Button isSubmitting={isSubmitting} width="1/2">
                    {isLoading ? 'Loading...' : 'Login'}
                </Button>
            </div>
            {isError && <div className="text-red-500">{message}</div>}
        </form>
    );
};

export default FormLogin;
