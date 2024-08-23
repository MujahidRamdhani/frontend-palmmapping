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
    email: string;

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
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [email, setEmail] = useState('');

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
                `http://localhost:9999/api/users/InvokeCaUser`,
                {
                    emailUser: data.email,
                    roleUser: data.role,
                },
            );

            // Uncomment these lines if needed
            // setShowModal(false);
            // setShowModalPenolakan(false);
            showSuccessNotification(response.data.data);
            reset();
            setShowModalUpdate(false);
                                                   
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
    //         const response = await axios.get('http://localhost:9999/api/users/findAllUsers');
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
                'http://localhost:9999/api/users/findAllUsers',
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
            accessorKey: 'action',
            header: 'Action',
            cell: (cell: any) => {
                return (
                    <div className="">
                        <button
                            className="rounded bg-primary px-3 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                            onClick={() => {
                                setShowModalUpdate(true);
                                setEmail(cell.row.original.email);
                            }}
                        >
                            Enroll Certificate
                        </button>
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
            {filterData(users)
    .filter((user) => user.email === email)
    .map((user, index) => {
        const { email, role } = user;
        return (
            showModalUpdate && (
                <div className="fixed inset-0 overflow-y-auto backdrop-blur-sm">
                    <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all lg:w-2/4 sm:w-4/6 xl:w-1/2">
                            <header className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center">
                                <p className="text-lg font-semibold">
                                    Enroll Certificate Authory
                                </p>
                                <button
                                    className="text-gray-400 hover:text-gray-500"
                                    aria-label="close"
                                    onClick={() => {
                                        reset();
                                        setShowModalUpdate(false);
                                    }}
                                >
                                    <svg
                                        className="h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </header>
                            <div className="max-h-125 overflow-y-scroll p-4">
                                <div className="bg-slate-100 rounded-xl">
                                    <section className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 center ">
                                    <div className="flex justify-center items-center ">
                                        <div>

                            <p className='font-bold'>
                            Apakah Yakin memberikan Certificate Authority?
                            </p>
  <span className='text-sm text-danger'>
    Enroll Certificate tidak bisa di batalkan
  </span>
  </div>
</div>
                                    </section>
                                </div>
                            </div>
                            <footer className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
                            <div className='flex gap-4 justify-center items-center'>
                                    
                               
                         
                                <button
                                    className="inline-flex justify-center rounded-md px-4 py-2 bg-stone-400 text-base font-medium text-white hover:bg-stone-700"
                                    onClick={() => {
                                        setShowModalUpdate(false);
                                        reset();
                                    }}
                                >
                                    Tidak
                                </button>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className='hidden'>
                                                <InputDashboard
                                                    label="Email"
                                                    id="email"
                                                    type="text"
                                                    value={email}
                                                    register={register}
                                                    errors={errors}
                                                    placeholder="Masukan email"
                                                   
                                                />
                                                <InputDashboard
                                                    label="Role"
                                                    id="role"
                                                    type="text"
                                                    value={role}
                                                    register={register}
                                                    errors={errors}
                                                    placeholder="Masukan role"
                                                   
                                                />
                                            </div>
                                            <button
                                                className="rounded bg-primary px-7 py-3 text-xs font-medium uppercase text-white shadow-md transition hover:bg-primary-600 focus:outline-none "
                                                type="submit"
                                               
                                            >
                                               Ya
                                            </button>
                                        </form>
                                </div>
                            </footer>
                        </div>
                    </div>
                </div>
            )
        );
    })}

        </main>


    );
}
