import { z } from 'zod';
import DefaultLayout from '../../Components/Layouts/DefaultLayout';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputDashboard from '../../Components/Elements/Input/InputDashboard';
import Breadcrumb from '../../Components/Elements/Breadcrumbs/Breadcrumb';
// import SignaturePad from '../../Components/Elements/Input/SignaturePad';
import useAuthStore from '../../store/authStore';
import axios, { AxiosError } from 'axios';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { Controller, FieldErrors, FieldError } from 'react-hook-form';

import { useEffect, useState } from 'react';
import Select, { SingleValue, components } from 'react-select';
import { showSuccessNotification } from '../../utils/util';

// Define the option type
type KoperasiOption = {
    value: string;
    label: string;
};

type KoperasiData = {
    id: string;
    idAkun: string;
    nama: string;
    alamat: string;
    niKoperasi: string;
};

type UserData = {
    nik: string;
    niKoperasi: string;
    nip: string;
    email: string;
    nama: string;
    alamat: string;
    nomorTelepon: string;
    idKoperasi: string;
};

interface InputFieldProps {
    label: string;
    id: string;
    register: any;
    errors: FieldErrors; // Make message optional
    placeholder?: string;
    control: any;
}

const SelectMitraKoperasi: React.FC<InputFieldProps> = ({
    label,
    id,
    control,
    errors,
    placeholder,
}) => {
    const [options, setOptions] = useState<KoperasiOption[]>([]);
    const NoOptionsMessage = (props: any) => (
        <components.NoOptionsMessage {...props}>
            Koperasi Tidak Ditemukan
        </components.NoOptionsMessage>
    );

    useEffect(() => {
        const fetchKoperasiData = async () => {
            try {
                const response = await axios.get<{ data: KoperasiData[] }>(
                    'https://palmmapping-backend.my.to/api/users/findAllKoperasis',
                );
                const data = response.data.data;

                const mappedOptions = data.map((koperasi) => ({
                    value: koperasi.id,
                    label: `${koperasi.niKoperasi} - ${koperasi.nama} - ${koperasi.alamat}`,
                }));
                setOptions(mappedOptions);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchKoperasiData();
    }, []);

    return (
        <div className="mb-4.5">
            <label
                className="mb-2.5 block text-black dark:text-white"
                htmlFor={id}
            >
                {label}
            </label>
            <Controller
                name={id}
                control={control}
                rules={{ required: 'Pilih dahulu mitra koperasi' }}
                render={({ field }) => (
                    <Select
                        {...field}
                        value={options.find(
                            (option) => option.value === field.value,
                        )}
                        onChange={(option) => field.onChange(option?.value)}
                        options={options}
                        isSearchable={true}
                        placeholder={placeholder}
                        components={{ NoOptionsMessage }}
                        className="w-full rounded"
                        styles={{
                            control: (provided, state) => ({
                                ...provided,
                                padding: '4px',
                                borderColor: state.isFocused
                                    ? 'rgb(60 80 224)'
                                    : provided.borderColor,
                                boxShadow: state.isFocused
                                    ? '0 0 0 0.5px rgba(99, 102, 241, 0.5)'
                                    : provided.boxShadow,
                            }),
                            menu: (provided) => ({
                                ...provided,
                                padding: '4px',
                            }),
                        }}
                    />
                )}
            />
        </div>
    );
};

const Profile = () => {
    const { user } = useAuthStore((state) => state);
    useEffect(() => {
        const fetchKoperasiData = async () => {
            try {
                const response = await axios.get<{ data: UserData }>(
                    'https://palmmapping-backend.my.to/api/users/profil',
                );
                const data = response.data.data;
                if (data) {
                    if(user?.data.role === 'PETANI'){
                        setValue('idRole', data.nik);
                    }
                    if(user?.data.role === 'KOPERASI'){
                        setValue('idRole', data.niKoperasi);
                    }
                    if(user?.data.role === 'DINAS'){
                        setValue('idRole', data.nip);
                    }

                    setValue('email', data.email);
                    setValue('nama', data.nama);
                    setValue('alamat', data.alamat);
                    setValue('nomorTelepon', data.nomorTelepon);
                    setValue(
                        'password',
                        'Apabila ingin merubah password maka ubah password disini',
                    );
                    setValue('mitraKoperasi', data.idKoperasi);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchKoperasiData();
    }, []);

    const schema = z
        .object({
            idRole: z.string().nonempty('ID Role tidak boleh kosong!'),
            email: z
                .string()
                .email('Email tidak valid!')
                .nonempty('Email tidak boleh kosong!'),
            nama: z.string().nonempty('Nama tidak boleh kosong!'),
            alamat: z.string().nonempty('Alamat tidak boleh kosong!'),
            nomorTelepon: z
                .string()
                .nonempty('Nomor telepon tidak boleh kosong!'),
            password: z.string().nonempty('Password tidak boleh kosong!'),
            mitraKoperasi: z.string().optional(), // Initially optional
        })
        .refine(
            (data) => {
                // Make 'mitraKoperasi' required if the role is 'petani'
                if (user?.data?.role !== 'petani' && !data.mitraKoperasi) {
                    return false;
                }
                return true;
            },
            {
                message:
                    'Mitra Koperasi tidak boleh kosong untuk petani!',
                path: ['mitraKoperasi'], // The path where the error should be displayed
            },
        );

    type FormFields = z.infer<typeof schema>;

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            await axios.put(`https://palmmapping-backend.my.to/api/users/UpdateProfil`, {
                idRole: data.idRole,
                email: data.email,
                password: data.password,
                nama: data.nama,
                alamat: data.alamat,
                nomorTelepon: data.nomorTelepon,
                idKoperasi: data.mitraKoperasi,
            });

            showSuccessNotification('Update Data Profil Berhasil');
        } catch (err) {
            console.log(err);
            if (err instanceof AxiosError) {
                setError('root', {
                    message: err.response?.data.msg || 'An error occurred', // Use the error message if available
                });
            } else {
                setError('root', {
                    message: 'An unexpected error occurred', // Fallback error message
                });
            }
        }
    };
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Profil" />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="px-2 pb-2 lg:pb-4">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Profil {user?.data?.role}
                        </h3>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="p-6.5">
                        {user?.data.role === 'petani' && (
                         <InputDashboard
                         label="Nomor Induk Kependudukan (NIK)"
                         id="idRole"
                         type="string"
                         register={register}
                         errors={errors}
                         placeholder="Masukan Nomor Induk Kependudukan"
                     />
                    )}
                    {user?.data.role === 'koperasi' && (
                         <InputDashboard
                         label="Nomor Induk Koperasi (NIK)"
                         id="idRole"
                         type="string"
                         register={register}
                         errors={errors}
                         placeholder="Masukan Nomor Induk Koperasi"
                     />
                    )}
                     {user?.data.role === 'dinas' && (
                         <InputDashboard
                         label="Nomor Induk Pegawai (NIP)"
                         id="idRole"
                         type="string"
                         register={register}
                         errors={errors}
                         placeholder="Masukan Nomor Induk Pegawai"
                     />
                    )}

                           
                            <InputDashboard
                                label="Email"
                                id="email"
                                type="email"
                                register={register}
                                errors={errors}
                                placeholder="Masukan email"
                                disabled
                            />
                            <InputDashboard
                                label="Nama"
                                id="nama"
                                type="string"
                                register={register}
                                errors={errors}
                                placeholder="Masukan Nama"
                            />
                            <InputDashboard
                                label="Alamat"
                                id="alamat"
                                type="string"
                                register={register}
                                errors={errors}
                                placeholder="Masukan Alamat"
                            />
                            <InputDashboard
                                label="Nomor Telepon"
                                id="nomorTelepon"
                                type="string"
                                register={register}
                                errors={errors}
                                placeholder="Masukan Tempat Tanggal Lahir Dinas"
                                // value={nomorTelepon}
                            />
                            <InputDashboard
                                label="password"
                                id="password"
                                type="string"
                                register={register}
                                errors={errors}
                                placeholder="Masukan Tempat Tanggal Lahir Dinas"
                                // value={nomorTelepon}
                            />
                    {user?.data.role === 'petani' && (
                         <SelectMitraKoperasi
                         control={control}
                         errors={errors}
                         label="Mitra Koperasi"
                         register={register}
                         id="mitraKoperasi"
                         placeholder="Pilih Mitra Koperasi"
                     />
                    )}
                           

                            <button
                                type="submit"
                                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                                disabled={isSubmitting}
                            >
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Profile;
