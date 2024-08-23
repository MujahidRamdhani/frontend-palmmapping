import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import InputField from '../Elements/Input/InputField';
import SelectRole from '../Elements/Select/SelectRole';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { useState } from 'react';
import Button from '../Elements/Button/Button';

// Define validation schema using Zod
const schema = z
    .object({
        nik: z.string() .min(16, { message: 'NIK minimal 16 karakter' })
        .nonempty('Masukkan NIK'),
        nama: z.string().nonempty('Masukkan nama'),
        email: z.string().email('Masukkan alamat email yang valid'),
        password: z
            .string()
            .min(8, 'Kata sandi harus terdiri dari minimal 8 karakter'),
        confPassword: z.string(),
        alamat: z.string().nonempty('Masukkan alamat'),
        nomorTelepon: z.string().min(9, { message: 'Nomor telepon minimal 9 Digit' })
        .nonempty('Masukkan nomor telepon'),
        Role: z.string().nonempty('Pilih Roles terlebih dahulu !!!'),
    })
    .refine((data) => data.password === data.confPassword, {
        message: 'Konfirmasi kata sandi tidak cocok',
        path: ['confPassword'], // Path to the field which should show the error message
    });

// Define type for form fields based on Zod schema
type FormFields = z.infer<typeof schema>;

const FormRegister = () => {
    const [selectedRole, setSelectedRole] = useState('');
    const navigate = useNavigate();
    const showSuccessNotification = () => {
        Toastify({
            text: 'Registrasi data pengguna berhasil!',
            duration: 3000,
            gravity: 'bottom',
            position: 'right',
            style: {
                background: 'linear-gradient(to right, #00b09b, #96c93d)',
            },
        }).showToast();
    };

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting, isLoading },
    } = useForm<FormFields>({
        resolver: zodResolver(schema), // Use Zod resolver for validation
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            console.log('Request Payload:', data);
            await axios.post('http://localhost:9999/api/users', {
                nama: data.nama,
                email: data.email,
                alamat: data.alamat,
                nomorTelepon: data.nomorTelepon,
                password: data.password,
                nik: data.nik, // Ensure 'nik' is included
                role: data.Role,
            });
            reset();
            showSuccessNotification();
            navigate('/login');
        } catch (err) {
            console.log(err);
            if (err instanceof AxiosError) {
                setError('root', {
                    message: err.response?.data.msg || 'An error occurred',
                });
            } else {
                setError('root', {
                    message: 'An unexpected error occurred',
                });
            }
        }
    };

    const handleRoleChange = (value: string) => {
        setSelectedRole(value);
    };

    const nikLabel =
        selectedRole === 'petani'
            ? 'Nomor Induk Kependudukan'
            : selectedRole === 'koperasi'
              ? 'Nomor Izin Koperasi'
              : 'Nomor Induk';

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 items-center justify-center">
                <SelectRole
                    register={register}
                    id="Role"
                    errors={errors}
                    onChange={handleRoleChange}
                />
                <InputField
                    label="Nama"
                    id="nama"
                    type="string"
                    register={register}
                    errors={errors}
                    placeholder="Masukan Nama"
                />

                <InputField
                    label="Email"
                    id="email"
                    type="email"
                    register={register}
                    errors={errors}
                    placeholder="Masukan Email"
                />
                <InputField
                    label="Nomor Telepon"
                    id="nomorTelepon"
                    type="string"
                    register={register}
                    errors={errors}
                    placeholder="Masukan nomorTelepon"
                />
                <InputField
                    label="Password"
                    id="password"
                    type="password"
                    register={register}
                    errors={errors}
                    placeholder="Masukan Password"
                />

                <InputField
                    label="Confirm Password"
                    id="confPassword"
                    type="password"
                    register={register}
                    errors={errors}
                    placeholder="Masukan Ulang Password"
                />
                <InputField
                    label="Alamat"
                    id="alamat"
                    type="string"
                    register={register}
                    errors={errors}
                    placeholder="Masukan Alamat"
                />

                {selectedRole === 'petani' || selectedRole === 'koperasi' ? (
                    <InputField
                        label={nikLabel}
                        id="nik"
                        type="string"
                        register={register}
                        errors={errors}
                        placeholder={'Masukan ' + nikLabel}
                    />
                ) : null}
            </div>
            <div className="flex justify-center">
                <Button width="1/2" marginTop="6">
                    {isLoading ? 'Loading...' : 'Register'}
                </Button>
            </div>

            {errors.root && (
                <div className="text-red-500">{errors.root.message}</div>
            )}
        </form>
    );
};

export default FormRegister;
