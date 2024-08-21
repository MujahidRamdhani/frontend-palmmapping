import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import useAuthStore from '../../../store/authStore';
import PaginatedTable from './table/PaginatedTable';
import VerificationLabel from './table/VerificationLabel';
import FormatTanggalLabel from './shared/FormatTanggalLabel';
import { LegalitasLahan } from '../../../types/legalitasLahan';
import { GetAllLegalitasLahan } from '../../../Services/legalitasLahanServices';
import { GetAllDataPemetaanKebun } from '../../../Services/pemetaanKebunServices';
import { DataPemetaanKebun } from '../../../types/dataPemetaanKebun';
import VerificationLabelPemetaanKebun from './table/VerificationLabelPemetaan';
import FormatTanggalJamLabel from './table/FormatTanggalJamLabel';
import MapComponent from './mapComponent';
import './App.css';
import ProgressBar from '../ProgressBar/ProgressBar';
import VerificationLabelVerifikator from './VerificationLabelVerifikator';
import VerificationLabelPenerbitanLegalitas from './VerificationLabelPenerbitanLegalitas';

export default function PaginationTablePage() {
    const [showModal, setShowModal] = useState(false);
    const [nomorSTDB, setNomorSTDB] = useState('');
    const { user } = useAuthStore((state) => state);
    const [stdbs, setStdbs] = useState<LegalitasLahan[]>([]);
    const [dataPemetaan, setDataPemetaan] = useState<DataPemetaanKebun[]>([]);
    const [nik, setNik] = useState('');

    useEffect(() => {
        if (user) {
            setNik(user.data.idRole);
        }
    }, [user]);

    useEffect(() => {
        const fetchSTDBS = async () => {
            try {
                const data = await GetAllLegalitasLahan();
                setStdbs(data);
            } catch (error) {
                console.error('Failed to fetch STDBS:', error);
            }
        };

        fetchSTDBS();
    }, []);

    useEffect(() => {
        const fetchDataPemetaanKebun = async () => {
            try {
                const data = await GetAllDataPemetaanKebun();
                setDataPemetaan(data);
            } catch (error) {
                console.error('Failed to fetch Data Pemetaan Kebun:', error);
            }
        };
        console.log(fetchDataPemetaanKebun());
        fetchDataPemetaanKebun();
    }, []);

    const mergeData = (
        stdbs: LegalitasLahan[],
        dataPemetaan: DataPemetaanKebun[],
    ) => {
        return stdbs.map((stdb) => {
            const matchingPemetaan = dataPemetaan.find(
                (pemetaan) => pemetaan.idPemetaanKebun === stdb.idPemetaanKebun,
            );
            return {
                ...stdb,
                ...matchingPemetaan,
            };
        });
    };

    const columns: ColumnDef<LegalitasLahan>[] = [
        {
            accessorKey: 'nomorSTDB',
            header: 'Nomor STDB',
        },
        {
            accessorKey: 'WaktuPengajuanSTDB',
            header: 'Tanggal Pengajuan',
            cell: (props) => <FormatTanggalLabel tanggal={props.getValue()} />,
        },

        {
            accessorKey: 'nikKonfirmator',
            header: 'nik konfirmator',
        },
        {
            accessorKey: 'nikSurveyor',
            header: 'nik Surveyor',
        },
        {
            accessorKey: 'nipVerifikator',
            header: 'nip Verifikator',
        },
        {
            accessorKey: 'waktuPenerbitLegalitas',
            header: 'waktu penerbitan legalitas',
            cell: (props) => <FormatTanggalLabel tanggal={props.getValue()} />,
        },

        {
            accessorKey: 'nomorSTDB',
            header: 'Action',
            cell: (cell: any) => {
                return (
                    <div className="">
                        <button
                            className="rounded bg-primary px-3 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                            onClick={() => {
                                setShowModal(true);
                                setNomorSTDB(cell.row.original.nomorSTDB);
                            }}
                        >
                            Lihat
                        </button>
                    </div>
                );
            },
        },
    ];

    const filterData = (data: LegalitasLahan[]) => {
        return data.filter(
            (item: LegalitasLahan) => item.nipPenerbitLegalitas === nik,
        );
    };
    const combinedData = mergeData(stdbs, dataPemetaan);
    console.log('tes', combinedData);
    // const timelineEvents: TimelineEvent[] = [
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
                data={filterData(combinedData)}
                className="mt-8  "
                withFilter
            />

            {combinedData
                .filter((stdb) => stdb.nomorSTDB === nomorSTDB)
                .map((stdb) => (
                    <div
                        key={stdb.nomorSTDB}
                        className="grid grid-cols-3 sm:grid-cols-5 mt-40"
                    >
                        {showModal && (
                            <div className="">
                                <div className="fixed inset-0 overflow-y-auto backdrop-blur-sm flex items-center justify-center z-999999 ">
                                    <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all lg:w-2/4 sm:w-4/6 xl:w-1/2">
                                        <header className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex mx-1">
                                            <p className="text-lg font-semibold text-center flex-grow">
                                                Pengajuan Legalitas Lahan
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
                                                                    Mengajukan
                                                                    Legalitas
                                                                </div>
                                                                {/* <time className="font-caveat font-medium text-amber-500 title-xxxxxxxs" >
                                                                <FormatTanggalLabel tanggal={stdb.waktuPengajuan} />
                                                                </time> */}
                                                            </div>
                                                            <div className="text-slate-500 text-sm">
                                                                {stdb.nama}{' '}
                                                                mengajukan
                                                                legalitas lahan
                                                                pada{' '}
                                                                <FormatTanggalJamLabel
                                                                    tanggal={
                                                                        stdb.waktuPengajuan
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {stdb.statusKonfirmator !==
                                                        'False' && (
                                                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                                            {stdb.statusKonfirmator ===
                                                            'Disetujui' ? (
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
                                                            ) : (
                                                                <>
                                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-red-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            strokeWidth={
                                                                                1.5
                                                                            }
                                                                            stroke="currentColor"
                                                                            className="size-6"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                d="M6 18 18 6M6 6l12 12"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                </>
                                                            )}
                                                            <div className="w-[calc(100%-3.2rem)] md:w-[calc(50%-2rem)] bg-white p-3 rounded border border-slate-200 shadow">
                                                                <div className="flex items-center justify-between space-x-2 mb-1">
                                                                    <div className="font-bold text-slate-900 text-sm">
                                                                        Konfirmasi
                                                                        Pengajuan
                                                                    </div>
                                                                    <div
                                                                        className={`font-caveat font-semibold ${stdb.statusKonfirmator === 'Disetujui' ? 'text-indigo-500' : 'text-red-500'}  text-xs`}
                                                                    >
                                                                        {
                                                                            stdb.statusKonfirmator
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="text-slate-500 text-sm">
                                                                    {
                                                                        stdb.namaKonfirmator
                                                                    }{' '}
                                                                    menerima
                                                                    Pengajuan
                                                                    legalitas
                                                                    pada{' '}
                                                                    <FormatTanggalJamLabel
                                                                        tanggal={
                                                                            stdb.waktuPengajuan
                                                                        }
                                                                    />{' '}
                                                                    {stdb.statusKonfirmator ===
                                                                        'Ditolak' &&
                                                                        'dengan alasan penolakan ' +
                                                                            stdb.pesanKonfirmator}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {stdb.idPemetaanKebun !==
                                                        'False' && (
                                                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
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
                                                                        Lahan
                                                                    </div>
                                                                    <div className="font-caveat font-semibold text-indigo-500 text-xs">
                                                                        Dipetakan
                                                                    </div>
                                                                </div>
                                                                <div className="text-slate-500 text-sm">
                                                                    {
                                                                        stdb.namaSurveyor
                                                                    }{' '}
                                                                    memetakan
                                                                    lahan pada{' '}
                                                                    <FormatTanggalJamLabel
                                                                        tanggal={
                                                                            stdb.waktuPengajuan
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {stdb.idPemetaanKebun !==
                                                        'False' &&
                                                        (stdb.statusVerifikator ===
                                                            'Diterima' ||
                                                            stdb.statusVerifikator ===
                                                                'Ditolak') && (
                                                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                                                {stdb.statusVerifikator ===
                                                                'Diterima' ? (
                                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-emerald-500 text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
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
                                                                ) : (
                                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-red-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            strokeWidth={
                                                                                1.5
                                                                            }
                                                                            stroke="currentColor"
                                                                            className="size-6"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                d="M6 18 18 6M6 6l12 12"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                )}

                                                                <div className="w-[calc(100%-3.2rem)] md:w-[calc(50%-2rem)] bg-white p-3 rounded border border-slate-200 shadow">
                                                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                                                        <div className="font-bold text-slate-900 text-sm">
                                                                            Dinas
                                                                            Memverifikasi
                                                                            Pemetaan
                                                                        </div>
                                                                        <div
                                                                            className={`font-caveat font-semibold ${stdb.statusVerifikator === 'Diterima' ? 'text-indigo-500' : 'text-red-500'} text-xs`}
                                                                        >
                                                                            {
                                                                                stdb.statusVerifikator
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-slate-500 text-sm">
                                                                        {
                                                                            stdb.namaVerifikator
                                                                        }{' '}
                                                                        memverifikasi
                                                                        pemetaan
                                                                        pada{' '}
                                                                        <FormatTanggalJamLabel
                                                                            tanggal={
                                                                                stdb.waktuPengajuan
                                                                            }
                                                                        />{' '}
                                                                        {stdb.statusVerifikator ===
                                                                            'Ditolak' &&
                                                                            'dengan alasan penolakan' +
                                                                                stdb.pesanVerifikator}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                    {stdb.nipPenerbitLegalitas !==
                                                        'False' && (
                                                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
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
                                                                        Menerbitkan
                                                                        Legalitas
                                                                        Lahan
                                                                    </div>
                                                                    <div className="font-caveat font-medium text-indigo-500 text-xs">
                                                                        Diterbitkan
                                                                    </div>
                                                                </div>
                                                                <div className="text-slate-500 text-sm">
                                                                    {
                                                                        stdb.namaSurveyor
                                                                    }{' '}
                                                                    menerbitkan
                                                                    legalitas
                                                                    lahan lahan
                                                                    pada{' '}
                                                                    <FormatTanggalJamLabel
                                                                        tanggal={
                                                                            stdb.waktuPengajuan
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {stdb.nipPenerbitLegalitas !==
                                            'False' ? (
                                                <>
                                                    <ProgressBar
                                                        bgcolor={'#6a1b9a'}
                                                        completed={100}
                                                    />
                                                </>
                                            ) : stdb.statusVerifikator !==
                                                  'False' &&
                                              stdb.idPemetaanKebun !==
                                                  'False' &&
                                              stdb.statusKonfirmator !==
                                                  'False' ? (
                                                <>
                                                    <ProgressBar
                                                        bgcolor={'#6a1b9a'}
                                                        completed={80}
                                                    />
                                                </>
                                            ) : stdb.idPemetaanKebun !==
                                              'False' ? (
                                                <>
                                                    <ProgressBar
                                                        bgcolor={'#6a1b9a'}
                                                        completed={60}
                                                    />
                                                </>
                                            ) : stdb.statusKonfirmator ===
                                                  'Diterima' ||
                                              stdb.statusKonfirmator ===
                                                  'Ditolak' ? (
                                                <>
                                                    <ProgressBar
                                                        bgcolor={'#6a1b9a'}
                                                        completed={40}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <ProgressBar
                                                        bgcolor={'#6a1b9a'}
                                                        completed={20}
                                                    />
                                                </>
                                            )}

                                            <div className="bg-slate-100 mx-1 rounded-xl mt-4">
                                                <h2 className="font-bold ml-1 py-2">
                                                    A. Keterangan Pemilik :
                                                </h2>
                                                <div className="ml-5">
                                                    <h4 className="text-sm">
                                                        1. Nama
                                                        <span className="ml-50">
                                                            :
                                                        </span>
                                                        &nbsp;{stdb.nama}
                                                    </h4>
                                                    <h4 className="text-sm">
                                                        2. Nomor KTP
                                                        <span className="ml-40">
                                                            :
                                                        </span>
                                                        &nbsp;{stdb.nik}
                                                    </h4>
                                                </div>
                                                <div className="mt-4">
                                                    <h2 className="font-bold ml-1">
                                                        B. Data Kebun :
                                                    </h2>
                                                    <div className="ml-6">
                                                        <h4 className="text-sm">
                                                            1. Alamat Kebun
                                                            <span className="ml-36">
                                                                :
                                                            </span>
                                                            &nbsp;
                                                            {stdb.alamatKebun}
                                                        </h4>
                                                        <h4 className="text-sm">
                                                            2. Status
                                                            Kepemilikan Lahan
                                                            <span className="ml-18">
                                                                :
                                                            </span>
                                                            &nbsp;
                                                            {
                                                                stdb.statusKepemilikanLahan
                                                            }
                                                        </h4>
                                                        <h4 className="text-sm">
                                                            3. Nomor Sertifikat
                                                            <span className="ml-32">
                                                                :
                                                            </span>
                                                            &nbsp;
                                                            {
                                                                stdb.nomorSertifikat
                                                            }
                                                        </h4>
                                                        <h4 className="text-sm">
                                                            4. Luas Lahan Kebun
                                                            <span className="ml-29">
                                                                :
                                                            </span>
                                                            &nbsp;
                                                            {stdb.luasKebun} M2
                                                        </h4>
                                                        <h4 className="text-sm">
                                                            6. Jenis Tanaman
                                                            <span className="ml-35">
                                                                :
                                                            </span>
                                                            &nbsp;
                                                            {stdb.jenisTanaman}
                                                        </h4>
                                                        <h4 className="text-sm">
                                                            7. Produksi per
                                                            Hektar per Tahun
                                                            <span className="ml-12">
                                                                :
                                                            </span>
                                                            &nbsp;
                                                            {
                                                                stdb.produksiPerHaPertahun
                                                            }
                                                        </h4>
                                                        <h4 className="text-sm">
                                                            8. Asal Benih
                                                            <span className="ml-40">
                                                                :
                                                            </span>
                                                            &nbsp;
                                                            {stdb.asalBenih}
                                                        </h4>
                                                        <h4 className="text-sm">
                                                            9. Jumlah Pohon
                                                            <span className="ml-36">
                                                                :
                                                            </span>
                                                            &nbsp;
                                                            {stdb.jenisTanaman}
                                                        </h4>
                                                        <h4 className="text-sm">
                                                            10. Pola Tanam
                                                            <span className="ml-40">
                                                                :
                                                            </span>
                                                            &nbsp;
                                                            {stdb.polaTanam}
                                                        </h4>
                                                        <h4 className="text-sm">
                                                            11. Jenis Pupuk
                                                            <span className="ml-40">
                                                                :
                                                            </span>
                                                            &nbsp;
                                                            {stdb.jenisTanaman}
                                                        </h4>
                                                        <h4 className="text-sm">
                                                            12. Mitra Pengolahan
                                                            <span className="ml-29">
                                                                :
                                                            </span>
                                                            &nbsp;
                                                            {
                                                                stdb.mitraPengolahan
                                                            }
                                                        </h4>
                                                        <h4 className="text-sm">
                                                            13. Jenis Tanah
                                                            <span className="ml-40">
                                                                :
                                                            </span>
                                                            &nbsp;
                                                            {stdb.jenisTanah}
                                                        </h4>
                                                        <h4 className="text-sm">
                                                            14. Tahun Tanam
                                                            <span className="ml-36">
                                                                :
                                                            </span>
                                                            &nbsp;
                                                            {stdb.tahunTanam}
                                                        </h4>
                                                        <h4 className="text-sm">
                                                            15. Usaha Lain di
                                                            Lahan Kebun
                                                            <span className="ml-12">
                                                                :
                                                            </span>
                                                            &nbsp;
                                                            {
                                                                stdb.usahaLainDikebun
                                                            }
                                                        </h4>
                                                        <h4 className="text-sm">
                                                            16. File Legalitas
                                                            lahan
                                                            <span className="ml-24">
                                                                :
                                                            </span>
                                                            <a
                                                                href={`https://ipfs.io/ipfs/${stdb.cidFileLegalitasKebun}`}
                                                                download="LegalitasKebun.pdf"
                                                                className="font-medium text-blue-500"
                                                            >
                                                                Download File
                                                                Legalitas
                                                            </a>
                                                        </h4>
                                                    </div>

                                                    <div className="flex items-center ">
                                                        <h4 className="text-sm ml-6">
                                                            17. Foto Kebun
                                                            <span className="ml-39">
                                                                :
                                                            </span>
                                                            &nbsp;
                                                        </h4>
                                                        <div className="w-30 max-h-40">
                                                            <img
                                                                src={`https://ipfs.io/ipfs/${stdb.cidFotoKebun}`}
                                                                alt="Upload"
                                                            />

                                                            {/* {stdb.cidFotoKebun} */}
                                                        </div>
                                                    </div>

                                                    <div className="ml-2">
                                                        {stdb.idPemetaanKebun !==
                                                            'False' && (
                                                            <>
                                                                <h2 className="font-bold ml-1">
                                                                    C. Peta
                                                                    Kebun :
                                                                </h2>
                                                                <div>
                                                                    <MapComponent
                                                                        longitude={
                                                                            stdb.longitude
                                                                        }
                                                                        latitude={
                                                                            stdb.latitude
                                                                        }
                                                                        statusKawasan={
                                                                            stdb.statusKawasan
                                                                        }
                                                                        nomorSTDB={
                                                                            stdb.nomorSTDB
                                                                        }
                                                                    />
                                                                </div>
                                                            </>
                                                        )}
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
