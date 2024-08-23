import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import useAuthStore from '../../../store/authStore';
import PaginatedTable from './table/PaginatedTable';
import VerificationLabel from './table/VerificationLabel';
import FormatTanggalLabel from './shared/FormatTanggalLabel';
import { DataPemetaanHutan } from '../../../types/dataPemetaanHutan';
import VerificationLabelPemetaanKebun from './table/VerificationLabelPemetaan';
import FormatTanggalJamLabel from './table/FormatTanggalJamLabel';
import MapComponent from './mapComponent';
import './App.css';
import ProgressBar from '../ProgressBar/ProgressBar';
import { GetAllDataPemetaanHutan } from '../../../Services/pemetaanHutanServices';
import { NavLink } from 'react-router-dom';
import useIdHutanStore from '../../../store/useIdHutanStore';
import RoundNumber from './table/verificationLavelRoundNumber';

export default function PaginationTablePage() {
    const [showModal, setShowModal] = useState(false);
    const [idHutan, setIdHutan] = useState('');
    const { user } = useAuthStore((state) => state);
    const [dataPemetaanHutan, setDataPemetaanHutan] = useState<
        DataPemetaanHutan[]
    >([]);
    const [nik, setNik] = useState('');
    const setIdHutanStore = useIdHutanStore((state) => state.setIdHutanStore);
    useEffect(() => {
        if (user) {
            setNik(user.data.idRole);
        }
    }, [user]);

    useEffect(() => {
        const fetchDataPemetaanKebun = async () => {
            try {
                const data = await GetAllDataPemetaanHutan();
                setDataPemetaanHutan(data);
            } catch (error) {
                console.error('Failed to fetch Data Pemetaan Kebun:', error);
            }
        };
        console.log(fetchDataPemetaanKebun());
        fetchDataPemetaanKebun();
    }, []);

    const columns: ColumnDef<DataPemetaanHutan>[] = [
        {
            accessorKey: 'idHutan',
            header: 'id Hutan',
        },
        {
            accessorKey: 'luasHutan',
            header: 'Luas Hutan',
            cell: (props) => (
                <RoundNumber luasLahan={props.getValue() as string} />
            ),
        },
        {
            accessorKey: 'waktuPemetaanHutan',
            header: 'Waktu Pemetaan Hutan',
            cell: (props) => (
                <FormatTanggalJamLabel tanggal={props.getValue()} />
            ),
        },

        {
            accessorKey: 'idHutan',
            header: 'Action',
            cell: (cell: any) => {
                return (
                    <div className="">
                        <NavLink
                            to="/dashboard/PemetaanHutan/FormEditPemetaanHutan"
                            state={{
                                customData: cell.row.original.idHutan,
                            }}
                            className="rounded bg-warning px-3 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] mr-2"
                            onClick={() => setShowModal(false)}
                        >
                            Edit Hutan
                        </NavLink>
                        <button
                            className="rounded bg-primary px-3 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                            onClick={() => {
                                setIdHutanStore(cell.row.original.idHutan);
                            }}
                        >
                            History
                        </button>

                        <button
                            className="ml-2 rounded bg-primary px-3 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                            onClick={() => {
                                setShowModal(true);
                                setIdHutan(cell.row.original.idHutan);
                            }}
                        >
                            Lihat
                        </button>
                    </div>
                );
            },
        },
    ];

    const filterData = (data: DataPemetaanHutan[]) => {
        return data.filter(
            (item: DataPemetaanHutan) => item.nipSurveyor === nik,
        );
    };

    //     {
    //       title: 'Pengajuan Pemetaan',
    //       description: 'ahmad mengajukan pemetaan',
    //       date: '19 Juni 2024'
    //     },
    //     {
    //       title: 'Koperasi Mengkonfirmasi Berkas',
    //       description: 'Koperasi mujahid diterima',
    //       date: 'February 2018'
    //     },
    //     {
    //       title: 'Koperasi Memetakan Pemetaan',
    //       description: 'Nama pemetaan',
    //       date: '19 Juni 2024'
    //     },
    //     {
    //       title: 'Dinas Memverifikasi pemetaan',
    //       description: 'Dinas',
    //       date: '20 Juni 2024'
    //     }
    //   ];

    // type TimelineItem = {
    //   title: string;
    //   date: string;
    //   description: string;
    //   isActive: boolean;
    // };

    // const timelineItems: TimelineItem[] = [
    //   { title: 'Mengajukan legalitas', date: '08/06/2023', description: 'Pretium lectus quam id leo. Urna et pharetra aliquam vestibulum morbi blandit cursus risus.', isActive: true },
    //   { title: 'konfirmasi legalitas', date: '09/06/2023', description: 'Pretium lectus quam id leo. Urna et pharetra aliquam vestibulum morbi blandit cursus risus.', isActive: true },
    //   { title: 'Memetakan kebun', date: '10/06/2023', description: 'Pretium lectus quam id leo. Urna et pharetra aliquam vestibulum morbi blandit cursus risus.', isActive: true },
    //   { title: 'Verifikasi Pemetaan', date: '12/06/2023', description: 'Pretium lectus quam id leo. Urna et pharetra aliquam vestibulum morbi blandit cursus risus.', isActive: true },
    //   // { title: 'Delivered', date: 'Exp. 12/08/2023', description: 'Pretium lectus quam id leo. Urna et pharetra aliquam vestibulum morbi blandit cursus risus.', isActive: false },
    // ];

    return (
        <main>
            <PaginatedTable
                columns={columns}
                data={filterData(dataPemetaanHutan)}
                className="mt-8  "
                withFilter
            />

            {dataPemetaanHutan
                .filter(
                    (dataPemetaanHutan) =>
                        dataPemetaanHutan.idHutan === idHutan,
                )
                .map((dataPemetaanHutan) => (
                    <div
                        key={dataPemetaanHutan.idHutan}
                        className="grid grid-cols-3 sm:grid-cols-5 mt-40"
                    >
                        {showModal && (
                            <div className="">
                                <div className="fixed inset-0 overflow-y-auto backdrop-blur-sm flex items-center justify-center z-999999 ">
                                    <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all lg:w-2/4 sm:w-4/6 xl:w-1/2">
                                        <header className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex mx-1">
                                            <p className="text-lg font-semibold text-center flex-grow">
                                                Pemetaan Hutan
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

                                        <div className="max-h-125 overflow-y-scroll scroll p-4">
                                            <div className="w-full max-w-2xl mx-auto">
                                                <h1></h1>
                                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-emerald-500 bg-emerald-500 text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                            <svg
                                                                className="fill-current"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="10"
                                                                height="8"
                                                            >
                                                                <path
                                                                    fillRule="nonzero"
                                                                    d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <div className="w-[calc(100%-3.2rem)] md:w-[calc(50%-2rem)] bg-white p-3 rounded border border-slate-200 shadow">
                                                            <div className="flex items-center justify-between space-x-2 mb-1">
                                                                <div className="font-bold text-slate-900 text-sm">
                                                                    Memetakan
                                                                    Hutan
                                                                </div>
                                                                {/* <time className="font-caveat font-medium text-amber-500 title-xxxxxxxs" >
                                                                <FormatTanggalLabel tanggal={dataPemetaanHutan.waktuPengajuan} />
                                                                </time> */}
                                                            </div>
                                                            <div className="text-slate-500 text-sm">
                                                                {
                                                                    dataPemetaanHutan.namaSurveyor
                                                                }{' '}
                                                                Memetakan Hutan
                                                                pada{' '}
                                                                <FormatTanggalJamLabel
                                                                    tanggal={
                                                                        dataPemetaanHutan.waktuPemetaanHutan
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-slate-100 mx-1 rounded-xl mt-4">
                                                <h2 className="font-bold ml-1 py-2">
                                                    A. Keterangan Pemetaan :
                                                </h2>
                                                <div className="ml-5">
                                                    <h4 className="text-sm">
                                                        1. Nama
                                                        <span className="ml-50">
                                                            :
                                                        </span>
                                                        &nbsp;
                                                        {
                                                            dataPemetaanHutan.namaSurveyor
                                                        }
                                                    </h4>
                                                    <h4 className="text-sm">
                                                        2. Nomor Induk Pegawai
                                                        Surveyor
                                                        <span className="ml-10">
                                                            :
                                                        </span>
                                                        &nbsp;
                                                        {
                                                            dataPemetaanHutan.nipSurveyor
                                                        }
                                                    </h4>
                                                    <h4 className="text-sm">
                                                        3. Waktu Pemetaan Hutan
                                                        <span className="ml-22">
                                                            :
                                                        </span>
                                                        &nbsp;
                                                        <FormatTanggalJamLabel
                                                            tanggal={
                                                                dataPemetaanHutan.waktuPemetaanHutan
                                                            }
                                                        />
                                                    </h4>
                                                </div>
                                                <div className="mt-4">
                                                    <div className="ml-2">
                                                        <h2 className="font-bold ml-1">
                                                            B. Peta Hutan :
                                                        </h2>
                                                        <div>
                                                            <MapComponent
                                                                longitude={
                                                                    dataPemetaanHutan.longitude
                                                                }
                                                                latitude={
                                                                    dataPemetaanHutan.latitude
                                                                }
                                                                luasHutan={
                                                                    dataPemetaanHutan.luasHutan
                                                                }
                                                                idHutan={
                                                                    dataPemetaanHutan.idHutan
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <footer className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mx-1">
                                            <button
                                                className="inline-flex w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-stone-400 text-base font-medium text-white hover:bg-stone-700 sm:ml-3 sm:w-auto sm:text-sm"
                                                type="button"
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
                        )}
                    </div>
                ))}
        </main>
    );
}
