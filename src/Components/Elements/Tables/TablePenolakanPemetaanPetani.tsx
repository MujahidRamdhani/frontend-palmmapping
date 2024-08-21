import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import useAuthStore from '../../../store/authStore';
import PaginatedTable from './table/PaginatedTable';
import VerificationLabel from './table/VerificationLabel';
import FormatTanggalLabel from './shared/FormatTanggalLabel';
import { LegalitasLahan } from '../../../types/legalitasLahan';
import { GetAllLegalitasLahan } from '../../../Services/legalitasLahanServices';
import { useNavigate, useLocation } from 'react-router-dom';
import ProgressBar from '../ProgressBar/ProgressBar';
import FormatTanggalJamLabel from './table/FormatTanggalJamLabel';
export default function PaginationTablePage() {
    const [showModal, setShowModal] = useState(false);
    const [nomorSTDB, setNomorSTDB] = useState('');
    const { user } = useAuthStore((state) => state);
    const [stdbs, setStdbs] = useState<LegalitasLahan[]>([]);
    const [nik, setNik] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/dashboard/PenolakanSTDB') {
            // Perform some action if the current path is "/"
            // For example, navigate to another path
        }
    }, [location, navigate]);

    useEffect(() => {
        if (user) {
            setNik(user.data.idRole);
            setRole(user.data.role);
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
        ...(role === 'koperasi'
            ? [
                  {
                      accessorKey: 'nik',
                      header: 'nik Petani',
                  },
              ]
            : [
                  {
                      accessorKey: 'nikKonfirmator',
                      header: 'nik Konfirmator',
                  },
              ]),

        {
            accessorKey: 'pesanKonfirmator',
            header: 'Alasan Penolakan',
        },
        {
            accessorKey: 'waktuKonfirmator',
            header: 'Tanggal Konfirmasi',
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

    let filterData: (data: LegalitasLahan[]) => LegalitasLahan[];
    if (role === 'koperasi') {
        filterData = (data: LegalitasLahan[]) => {
            return data.filter(
                (item: LegalitasLahan) =>
                    item.nikKonfirmator === nik &&
                    item.idPemetaanKebun === 'False' &&
                    item.statusKonfirmator === 'Ditolak',
            );
        };
    } else {
        filterData = (data: LegalitasLahan[]) => {
            return data.filter(
                (item: LegalitasLahan) =>
                    item.nik === nik &&
                    item.idPemetaanKebun === 'False' &&
                    item.statusKonfirmator === 'Ditolak',
            );
        };
    }

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
                data={filterData(stdbs)}
                className="mt-8  "
                withFilter
            />

            {stdbs
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
                                                Pengajuan Pemetaan
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
                                                            <div className="w-[calc(100%-3.2rem)] md:w-[calc(50%-2rem)] bg-white p-3 rounded border border-slate-200 shadow">
                                                                <div className="flex items-center justify-between space-x-2 mb-1">
                                                                    <div className="font-bold text-slate-900 text-sm">
                                                                        Konfirmasi
                                                                        Pengajuan
                                                                    </div>
                                                                    <div
                                                                        className={`font-caveat font-semibold ${stdb.statusKonfirmator === 'Diterima' ? 'text-indigo-500' : 'text-red-500'}  text-xs`}
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
