import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import useAuthStore from '../../../store/authStore';

import PaginatedTable from './table/PaginatedTable';
import VerificationLabel from './table/VerificationLabel';
import FormatTanggalLabel from './shared/FormatTanggalLabel';
// import uploadImage from '../../../../public/UploadImage.png';
import InputDashboard from '../Input/InputDashboard';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import Toastify from 'toastify-js';
import { useNavigate } from 'react-router-dom';
// import Stepper from '../Stepper/Stepper';
import { NavLink, useLocation } from 'react-router-dom';
const CHECKOUT_STEPS = [
    {
        name: 'Pengajuan STDB',
        alur: 'petani Mengajukan stdb',
    },
    {
        name: 'Konfirmasi STDB',
        alur: 'menolak',
    },

    {
        name: 'Penerbitan STDB',
        alur: 'Menerbitakan STDB',
    },
];

const schema = z.object({
    nipDinas: z.string(),
    namaDinas: z.string(),
    uuid: z.string(),
    statusPenerbitanSTDB: z.string(),
    waktuPenerbitanSTDB: z.date(),
});

// Define type for form fields based on Zod schema
type FormFields = z.infer<typeof schema>;

export interface Cooperative {
    uuid: string;
    nomorSTDB: string;
    nama: string;
    tempatTanggalLahir: string;
    nik: string;
    alamat: string;
    lokasiKebun: string;
    statusKepemilikanLahan: string;
    nomorSertifikat: string;
    luasArealKebun: number;
    jenisTanaman: string;
    produksiPerHaPertahun: number;
    asalBenih: string;
    polaTanam: string;
    jenisPupuk: string;
    mitraPengolahan: string;
    jenisTanah: string;
    tahunTanam: string;
    usahaLainDikebun: string;
    cidFotoLahan: string;
    longLatitude: string;
    waktuPengajuanSTDB: string;
    nikKonfirmator: string;
    namaKonfirmator: string;
    statusKonfirmasi: string;
    waktuStatusKonfirmasi: string;
    alasanPenolakan: string;
    nipDinas: string;
    namaDinas: string;
    waktuPenerbitanSTDB: string;
    createdAt: string;
    statusPenerbitan: string;
}

export default function TablePenerbitanSTDB() {
    const [showModal, setShowModal] = useState(false);
    const [showModalPenolakan, setShowModalPenolakan] = useState(false);
    const [uuid, setUuid] = useState('');
    const { user } = useAuthStore((state) => state);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
    });
    const showSuccessNotification = () => {
        Toastify({
            text: 'Penerbitan STDB Berhasilll!',
            duration: 3000,
            gravity: 'bottom',
            position: 'right',
            style: {
                background: 'linear-gradient(to right, #00b09b, #96c93d)',
            },
        }).showToast();
    };

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            // console.log('Submitting form with data:', data);

            // Simulate API call
            // await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = await axios.patch(
                `http://localhost:5000/STDBS/${data.uuid}`,
                {
                    nipDinas: data.nipDinas,
                    namaDinas: data.namaDinas,
                    statusPenerbitanSTDB: data.statusPenerbitanSTDB,
                    waktuPenerbitanSTDB: data.waktuPenerbitanSTDB,
                },
            );

            // Uncomment these lines if needed
            // setShowModal(false);
            // setShowModalPenolakan(false);
            showSuccessNotification();
            navigate('/dashboard/RiwayatPenerbitanSTDB');
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

    // const handleResetDitolak = () => {
    //     reset({
    //         statusKonfirmasi: 'ditolak',
    //         // You can add other form fields here as needed
    //     });
    // };
    const handleResetDiterima = () => {
        reset({
            statusPenerbitanSTDB: 'Diterbitkan',
            // You can add other form fields here as needed
        });
    };
    let waktuSekarang = new Date();

    // Mengatur nilai waktuPenerbitanSTDB
    let waktuPenerbitanSTDB = waktuSekarang;
    setValue('waktuPenerbitanSTDB', waktuPenerbitanSTDB);
    let index;
    if (showModal) {
        index = 'absolute z-999';
    }

    let nik = '';
    let nama = '';
    if (user !== null) {
        ({ nik, nama } = user);
        setValue('nipDinas', nik);
        setValue('namaDinas', nama);
    }

    const [stdbs, setStdbs] = useState<Cooperative[]>([]);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/STDBS');
            setStdbs(response.data);
            console.log('Axios response:', response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error fetching data:', error.message);
                setError(`Error fetching data: ${error.message}`);
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
                setError('Unexpected error occurred');
            }
        }
    };

    const columns: ColumnDef<Cooperative>[] = [
        {
            accessorKey: 'nomorSTDB',
            header: 'Nomor STDB',
        },
        {
            accessorKey: 'nik',
            header: 'Nomor KTP',
        },
        {
            accessorKey: 'createdAt',
            header: 'Tanggal Pengajuan',
            cell: (props) => <FormatTanggalLabel tanggal={props.getValue()} />,
        },
        {
            accessorKey: 'nikSurveyor',
            header: 'Nik Surveyor',
            // cell: (props) => <VerificationLabel status={props.getValue()} />,
        },
        {
            accessorKey: 'uuid',
            header: 'Action',
            cell: (cell: any) => {
                return (
                    <div className="">
                        <button
                            className="rounded  bg-primary px-3 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                            onClick={() => {
                                setShowModal(true);
                                handleResetDiterima();
                                setUuid(cell.row.original.uuid);
                            }}
                        >
                            edit
                        </button>
                    </div>
                );
            },
        },
    ];
    const filterData = (data: Cooperative[]) => {
        return data.filter(
            (item: Cooperative) =>
                item.statusKonfirmasi === 'diterima' ||
                item.statusPenerbitan === 'Belum diterbitkan',
        );
    };

    // const handleResetDiterima = () => {
    //     reset({
    //         statusKonfirmasi: 'diterima',
    //         // You can add other form fields here as needed
    //     });
    // };
    return (
        <main>
            <PaginatedTable
                columns={columns}
                data={filterData(stdbs)}
                className="mt-8"
                withFilter
            />

            {stdbs
                .filter((stdb) => stdb.uuid === uuid) // Filters cooperatives with statusKonfirmasiKoperasi as "false" (string)
                .map((stdb, index) => (
                    <div className="grid grid-cols-3 sm:grid-cols-5">
                        {/* Tampilan Modal */}
                        {showModal && (
                            <div className="">
                                <div className={``}>
                                    <div className="fixed inset-0 overflow-y-auto backdrop-blur-sm">
                                        <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                                            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all lg:w-2/4 sm:w-4/6 xl:w-1/2 ">
                                                <header className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex  mx-1">
                                                    <p className="text-lg font-semibold text-center flex-grow">
                                                        Terbitkan Pemetaan
                                                    </p>
                                                    <button
                                                        className="text-gray-400 hover:text-gray-500"
                                                        aria-label="close"
                                                        onClick={() =>
                                                            setShowModal(false)
                                                        }
                                                    >
                                                        <svg
                                                            className="h-6 w-6"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            aria-hidden="true"
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
                                                <div className="max-h-125 overflow-y-scroll scoll p-4 ">
                                                    {/* content 1 */}
                                                    {/* <div className="flex items-center justify-center">
                                                        <div className="text-center">
                                                            <h1 className="font-semibold">
                                                                Traceability
                                                                Pengajuan STDB
                                                            </h1>
                                                            <span className="text-sm">
                                                                Ketelusuran
                                                                Pengajuan
                                                                Sertifikat Tanda
                                                                Daftar Budidaya
                                                            </span>
                                                            <div className="mt-4">
                                                                
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                    <div className="bg-slate-100 mx-1 rounded-xl">
                                                        {/* <section className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ">
                                                            <div className="sm:flex sm:items-center">
                                                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                                    <div className="container mx-auto">
                                                                        <div className="text-center mb-5">
                                                                            <div className="flex items-center justify-center">
                                                                                <h2 className="text-lg font-bold">
                                                                                    SURAT
                                                                                    TANDA
                                                                                    DAFTAR
                                                                                    BUDIDAYA
                                                                                </h2>
                                                                            </div>
                                                                            <p className="text-gray-500">
                                                                                STDB
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </section> */}
                                                        <h2 className="font-bold ml-1">
                                                            A. Keterangan
                                                            Pemilik :
                                                        </h2>
                                                        <div className="ml-5">
                                                            <h4 className="text-sm">
                                                                1. Nama
                                                                <span className="ml-50">
                                                                    :
                                                                </span>
                                                                &nbsp;
                                                                {stdb.nama}
                                                            </h4>
                                                            <h4 className="text-sm">
                                                                2. Tempat,
                                                                Tanggal Lahir
                                                                <span className="ml-21">
                                                                    :
                                                                </span>
                                                                &nbsp;{' '}
                                                                {
                                                                    stdb.tempatTanggalLahir
                                                                }
                                                            </h4>
                                                            <h4 className="text-sm">
                                                                3. Nomor KTP
                                                                <span className="ml-39">
                                                                    :
                                                                </span>
                                                                &nbsp;{' '}
                                                                {stdb.nik}
                                                            </h4>
                                                            <h4 className="text-sm">
                                                                4. Alamat{' '}
                                                                <span className="ml-46">
                                                                    :
                                                                </span>
                                                                &nbsp;{' '}
                                                                {stdb.alamat}
                                                            </h4>
                                                        </div>
                                                        <div className="mt-4">
                                                            <h2 className="font-bold ml-1 ">
                                                                B. Data Kebun :
                                                            </h2>
                                                            <div className="ml-6">
                                                                <h4 className="text-sm">
                                                                    1. Lokasi
                                                                    Kebun
                                                                    <span className="ml-40">
                                                                        :
                                                                    </span>
                                                                    &nbsp;
                                                                    {
                                                                        stdb.lokasiKebun
                                                                    }
                                                                </h4>
                                                                <h4 className="text-sm">
                                                                    2. Status
                                                                    Kepemilikan
                                                                    Lahan &nbsp
                                                                    <span className="ml-3">
                                                                        :
                                                                    </span>
                                                                    &nbsp;
                                                                    {
                                                                        stdb.statusKepemilikanLahan
                                                                    }
                                                                </h4>
                                                                <h4 className="text-sm">
                                                                    3. Nomor
                                                                    Sertifikat
                                                                    <span className="ml-32">
                                                                        :
                                                                    </span>
                                                                    &nbsp;
                                                                    {
                                                                        stdb.nomorSertifikat
                                                                    }
                                                                </h4>
                                                                <h4 className="text-sm">
                                                                    4. Luas
                                                                    Lahan Kebun
                                                                    <span className="ml-28">
                                                                        :
                                                                    </span>
                                                                    &nbsp;
                                                                    {
                                                                        stdb.luasArealKebun
                                                                    }
                                                                    M2{' '}
                                                                </h4>
                                                                <h4 className="text-sm">
                                                                    6. Jenis
                                                                    Tanaman
                                                                    <span className="ml-35">
                                                                        :
                                                                    </span>
                                                                    &nbsp;
                                                                    {
                                                                        stdb.jenisTanaman
                                                                    }
                                                                </h4>
                                                                <h4 className="text-sm">
                                                                    7. Produksi
                                                                    per Hektar
                                                                    per Tahun
                                                                    <span className="ml-9">
                                                                        :
                                                                    </span>
                                                                    &nbsp;
                                                                    {
                                                                        stdb.produksiPerHaPertahun
                                                                    }
                                                                </h4>
                                                                <h4 className="text-sm">
                                                                    8. Asal
                                                                    Benih
                                                                    <span className="ml-44">
                                                                        :
                                                                    </span>
                                                                    {
                                                                        stdb.asalBenih
                                                                    }
                                                                </h4>
                                                                <h4 className="text-sm">
                                                                    9. Jumlah
                                                                    Pohon
                                                                    <span className="ml-36">
                                                                        :
                                                                    </span>
                                                                    &nbsp;
                                                                    {
                                                                        stdb.jenisTanaman
                                                                    }{' '}
                                                                </h4>
                                                                <h4 className="text-sm">
                                                                    10. Pola
                                                                    Tanam
                                                                    <span className="ml-40">
                                                                        :
                                                                    </span>
                                                                    &nbsp;
                                                                    {
                                                                        stdb.polaTanam
                                                                    }
                                                                </h4>
                                                                <h4 className="text-sm">
                                                                    11. Jenis
                                                                    Pupuk
                                                                    <span className="ml-40">
                                                                        :
                                                                    </span>
                                                                    &nbsp;
                                                                    {
                                                                        stdb.jenisTanaman
                                                                    }{' '}
                                                                </h4>
                                                                <h4 className="text-sm">
                                                                    12. Mitra
                                                                    Pengolahan{' '}
                                                                    <span className="ml-29">
                                                                        :
                                                                    </span>
                                                                    &nbsp;
                                                                    {
                                                                        stdb.mitraPengolahan
                                                                    }
                                                                </h4>
                                                                <h4 className="text-sm">
                                                                    13. Jenis
                                                                    Tanah
                                                                    <span className="ml-40">
                                                                        :
                                                                    </span>
                                                                    &nbsp;
                                                                    {
                                                                        stdb.jenisTanah
                                                                    }
                                                                </h4>
                                                                <h4 className="text-sm">
                                                                    14. Tahun
                                                                    Tanam
                                                                    <span className="ml-36">
                                                                        :
                                                                    </span>
                                                                    &nbsp;
                                                                    {
                                                                        stdb.tahunTanam
                                                                    }
                                                                </h4>
                                                                <h4 className="text-sm">
                                                                    15. Usaha
                                                                    Lain di
                                                                    Lahan Kebun
                                                                    <span className="ml-12">
                                                                        :
                                                                    </span>
                                                                    &nbsp;
                                                                    {
                                                                        stdb.usahaLainDikebun
                                                                    }
                                                                </h4>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <h4 className="text-sm ml-6">
                                                                    16. Foto
                                                                    Kebun
                                                                    <span className="ml-39">
                                                                        :
                                                                    </span>
                                                                    &nbsp;
                                                                </h4>
                                                                <div className="w-30 max-h-40">
                                                                    <img
                                                                        src={`https://ipfs.io/ipfs/${stdb.cidFotoLahan}`}
                                                                        alt="Upload"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <footer className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mx-1">
                                                    <div>
                                                        {showModal && (
                                                            <form
                                                                onSubmit={handleSubmit(
                                                                    onSubmit,
                                                                )}
                                                            >
                                                                <div className="hidden">
                                                                    <InputDashboard
                                                                        label="uuid"
                                                                        id="uuid"
                                                                        type="string"
                                                                        value={
                                                                            stdb.uuid
                                                                        }
                                                                        register={
                                                                            register
                                                                        }
                                                                        errors={
                                                                            errors
                                                                        }
                                                                        placeholder="Masukan uuid"
                                                                    />
                                                                    <InputDashboard
                                                                        label="Nama Dinas"
                                                                        id="namaDinas"
                                                                        type="string"
                                                                        register={
                                                                            register
                                                                        }
                                                                        errors={
                                                                            errors
                                                                        }
                                                                        placeholder="Masukan nama Konfirmator"
                                                                    />
                                                                    <InputDashboard
                                                                        label="Nip Dinas"
                                                                        id="nipDinas"
                                                                        type="string"
                                                                        register={
                                                                            register
                                                                        }
                                                                        errors={
                                                                            errors
                                                                        }
                                                                    />
                                                                </div>

                                                                <button
                                                                    className="inline-flex w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#34D399] text-base font-medium text-white hover:bg-[#207a59] sm:ml-3 sm:w-auto sm:text-sm"
                                                                    type="submit"
                                                                    // onClick={() => {
                                                                    //     setShowModal(false);

                                                                    // }}
                                                                >
                                                                    Terbitkan
                                                                    Pemetaan
                                                                </button>
                                                                {/* <NavLink
                                                                    to="/TambahPemetaan"
                                                                    // state={{
                                                                    //     customData:
                                                                    //         stdb.uuid,
                                                                    // }}
                                                                    className="inline-flex w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#34D399] text-base font-medium text-white hover:bg-[#207a59] sm:ml-3 sm:w-auto sm:text-sm"
                                                                >
                                                                    Konfirmasi
                                                                    Pengajuan
                                                                </NavLink> */}
                                                            </form>
                                                        )}
                                                    </div>

                                                    <button
                                                        className="inline-flex w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-stone-400 text-base font-medium text-white hover:bg-stone-700 sm:ml-3 sm:w-auto sm:text-sm"
                                                        type="submit"
                                                    >
                                                        Tutup
                                                    </button>
                                                </footer>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showModalPenolakan && (
                            <div className="">
                                <div className={``}>
                                    <div className="fixed inset-0 overflow-y-auto backdrop-blur-sm">
                                        <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                                            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all lg:w-2/4 sm:w-4/6 xl:w-1/2 ">
                                                <header className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex  mx-1">
                                                    <p className="text-lg font-semibold text-center flex-grow">
                                                        Konfirmasi Pengajuan
                                                        STDB
                                                    </p>
                                                    <button
                                                        className="text-gray-400 hover:text-gray-500"
                                                        aria-label="close"
                                                        onClick={() =>
                                                            setShowModal(false)
                                                        }
                                                    >
                                                        <svg
                                                            className="h-6 w-6"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            aria-hidden="true"
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
                                                <div className="max-h-125 overflow-y-scroll scoll p-4 ">
                                                    {/* content 1 */}

                                                    <div className="bg-slate-100 mx-1 rounded-xl">
                                                        <section className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ">
                                                            <form
                                                                className="space-y-4"
                                                                onSubmit={handleSubmit(
                                                                    onSubmit,
                                                                )}
                                                            >
                                                                <div>
                                                                    <InputDashboard
                                                                        label="Masukan Alasan Penolakan"
                                                                        id="alasanPenolakan"
                                                                        type="string"
                                                                        register={
                                                                            register
                                                                        }
                                                                        errors={
                                                                            errors
                                                                        }
                                                                        placeholder="Masukan Alasan Penolakan"
                                                                    />
                                                                    <InputDashboard
                                                                        label="status Konfirmasi"
                                                                        id="statusKonfirmasi"
                                                                        type="string"
                                                                        value={
                                                                            'ditolak'
                                                                        }
                                                                        register={
                                                                            register
                                                                        }
                                                                        errors={
                                                                            errors
                                                                        }
                                                                        placeholder="Masukan Lokasi Kebun"
                                                                        hidden={
                                                                            true
                                                                        }
                                                                        // hidden={true}
                                                                    />
                                                                    <InputDashboard
                                                                        label="uuid"
                                                                        id="uuid"
                                                                        type="string"
                                                                        value={
                                                                            stdb.uuid
                                                                        }
                                                                        register={
                                                                            register
                                                                        }
                                                                        errors={
                                                                            errors
                                                                        }
                                                                        placeholder="Masukan uuid"
                                                                        hidden={
                                                                            true
                                                                        }
                                                                    />
                                                                    <InputDashboard
                                                                        label="nikKonfirmator"
                                                                        id="nikKonfirmator"
                                                                        type="string"
                                                                        register={
                                                                            register
                                                                        }
                                                                        errors={
                                                                            errors
                                                                        }
                                                                        placeholder="Masukan uuid"
                                                                    />
                                                                    <InputDashboard
                                                                        label="namaKonfirmator"
                                                                        id="namaKonfirmator"
                                                                        type="string"
                                                                        register={
                                                                            register
                                                                        }
                                                                        errors={
                                                                            errors
                                                                        }
                                                                        placeholder="Masukan uuid"
                                                                    />
                                                                </div>

                                                                <button
                                                                    type="submit"
                                                                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                                >
                                                                    Simpan
                                                                </button>
                                                            </form>
                                                        </section>
                                                    </div>
                                                </div>
                                                <footer className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mx-1">
                                                    <button
                                                        className="inline-flex w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-stone-400 text-base font-medium text-white hover:bg-stone-700 sm:ml-3 sm:w-auto sm:text-sm"
                                                        onClick={() =>
                                                            setShowModal(false)
                                                        }
                                                    >
                                                        Tutup
                                                    </button>
                                                </footer>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
        </main>
    );
}
