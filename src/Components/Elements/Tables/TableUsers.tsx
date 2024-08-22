import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import useAuthStore from '../../../store/authStore';
import PaginatedTable from './table/PaginatedTable';
import VerificationLabel from './table/VerificationLabel';
import FormatTanggalLabel from './shared/FormatTanggalLabel';
// import uploadImage from '../../../../public/UploadImage.png';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputDashboard from '../Input/InputDashboard';
import { BsWallet } from 'react-icons/bs';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
export interface Cooperative {
    uuid: string;
    nik: string;
    nama: string;
    role: string;
    createdAt: string;
    wallet: string;
}

const schema = z.object({
    email: z.string(),
    role: z.string(),
});

const showSuccessNotification = (response: any) => {
    Toastify({
        text: response,
        duration: 3000,
        gravity: 'bottom',
        position: 'right',
        style: {
            background: 'linear-gradient(to right, #00b09b, #96c93d)',
        },
    }).showToast();
};

// Define type for form fields based on Zod schema
type FormFields = z.infer<typeof schema>;

export default function PaginationTablePage() {
    const { user } = useAuthStore((state) => state);
    const [error2, setError2] = useState(null);
    const [users, setUsers] = useState<Cooperative[]>([]);

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            // console.log('Submitting form with data:', data);

            // Simulate API call
            // await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = await axios.post(
                `https://palmmapping-backend.my.to/api/users/InvokeCaUser`,
                {
                    emailUser: data.email,
                    roleUser: data.role,
                },
            );

            // Uncomment these lines if needed
            // setShowModal(false);
            // setShowModalPenolakan(false);
            showSuccessNotification(response.data.data);
           
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

    // const getUSERS = async () => {
    //     try {
    //         const response = await axios.get('https://palmmapping-backend.my.to/api/users/findAllUsers');
    //         setUsers(response.data.data);
    //         console.log('Axios response:', response.data.data);
    //     } catch (error) {
    //         if (axios.isAxiosError(error)) {
    //             console.error('Error fetching data:', error.message);
    //         } else {
    //             console.error('Unexpected error:', error);
    //         }
    //     }
    // };

    const getUSERS = async () => {
        try {
            const response = await axios.get(
                'https://palmmapping-backend.my.to/api/users/findAllUsers',
            );
            setUsers(response.data.data);
            console.log('Axios response 2:', response.data.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error fetching data:', error.message);
                
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                } else if (error.request) {
                    console.error('Request data:', error.request);
                } else {
                    console.error('Error message:', error.message);
                }
            } else {
                console.error('Unexpected error:', error);
               
            }
        }
    };

    useEffect(() => {
        getUSERS();
    }, [isSubmitting]);

    const columns: ColumnDef<Cooperative>[] = [
        {
            accessorKey: 'email',
            header: 'email',
        },

        {
            accessorKey: 'nama',
            header: 'nama',
            // cell: (props) => <VerificationLabel status={props.getValue()} />,
        },
        {
            accessorKey: 'role',
            header: 'role',
            // cell: (props) => <VerificationLabel statusPemetaan={props.getValue()} />,
        },
        {
            accessorKey: 'alamat',
            header: 'alamat',
            // cell: (props) => <VerificationLabel statusPenerbitanSTDB={props.getValue()} />,
        },
        {
            accessorKey: 'uuid',
            header: 'Action',
            cell: (cell: any) => {
                return (
                    <div className="">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="hidden">
                                <InputDashboard
                                    label="email"
                                    id="email"
                                    type="string"
                                    value={cell.row.original.email}
                                    register={register}
                                    errors={errors}
                                    placeholder="Masukan uuid"
                                />
                                <InputDashboard
                                    label="role"
                                    id="role"
                                    type="string"
                                    value={cell.row.original.role}
                                    register={register}
                                    errors={errors}
                                    placeholder="Masukan uuid"
                                />
                            </div>

                            <button
                                className="rounded  bg-primary px-3 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                type="submit"
                            >
                                Enroll CA
                            </button>
                        </form>
                    </div>
                );
            },
        },
    ];

    const filterData = (data: Cooperative[]) => {
        return data.filter((item: Cooperative) => item.wallet === 'FALSE');
    };
    return (
        <main>
            <PaginatedTable
                columns={columns}
                data={filterData(users)}
                className="mt-8"
                withFilter
            />
        </main>
    );
}
