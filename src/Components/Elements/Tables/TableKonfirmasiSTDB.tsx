import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import PaginatedTable from './table/PaginatedTable';
import FormatTanggalLabel from './shared/FormatTanggalLabel';
import InputDashboard from '../Input/InputDashboard';
import { LegalitasLahan } from '../../../types/legalitasLahan';
import { GetAllLegalitasLahan } from '../../../Services/legalitasLahanServices';
import useLegalitasLahanForm from '../../../Hooks/useLegalitaasLahanForm';
import { useModalStore } from '../../../store/useModalStore';
import SelectKonfirmasi from '../Select/SelectKonfirmasi';
import useHistoryPengajuanLegalitasStore from '../../../store/useHistoryPengajuanLegalitasStore';
import useAuthStore from '../../../store/authStore';
import TimelineItem from '../TimeLine/TimeLineItem';
import StatusProgress from '../ProgressBar/StatusProgress';
import TextKeterangan from '../TextKeterangan/TextKeterangan';

export default function PaginationTablePage() {
    const { user } = useAuthStore((state) => state);
    const [uuid, setUuid] = useState('');
    const [nikKoperasi, setNikoperasi] = useState('');
    const [stdbs, setStdbs] = useState<LegalitasLahan[]>([]);
    const setHistoryPengajuanLegalitas = useHistoryPengajuanLegalitasStore(
        (state) => state.setHistoryPengajuanLegalitas,
    );
    const setStdbstore = useHistoryPengajuanLegalitasStore(
        (state) => state.setStdbStore,
    );
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
        onSubmit,
        reset,
    } = useLegalitasLahanForm();

    const showModal = useModalStore((state) => state.showModal);
    const setShowModal = useModalStore((state) => state.setShowModal);
    const showModalPenolakan = useModalStore(
        (state) => state.showModalPenolakan,
    );
    const setShowModalPenolakan = useModalStore(
        (state) => state.setShowModalPenolakan,
    );

    const handleResetDitolak = () => {
        // reset({
        //     statusKonfirmasi: 'Ditolak',
        // });
    };

    const handleResetTutup = () => {
        // reset();
    };
    const handleResetDiterima = () => {
        // reset({
        //     statusKonfirmasi: 'Diterima',
        // });
    };

    useEffect(() => {
        if (user) {
            setNikoperasi(user.data.idRole);
        }
    }, []);
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
    }, [isSubmitting]);

    const columns: ColumnDef<LegalitasLahan>[] = [
        {
            accessorKey: 'nomorSTDB',
            header: 'Nomor STDB',
        },
        {
            accessorKey: 'nik',
            header: 'Nomor KTP',
        },
        {
            accessorKey: 'alamatKebun',
            header: 'lokasi Kebun',
        },
        {
            accessorKey: 'createdAt',
            header: 'Tanggal Pengajuan',
            cell: (props) => <FormatTanggalLabel tanggal={props.getValue()} />,
        },

        {
            accessorKey: 'action',
            header: 'Action',
            cell: (cell: any) => {
                return (
                    <div className="">
                        <button
                            className="rounded bg-green-400 px-3 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] mr-2"
                            onClick={() => {
                                setShowModal(false);
                                setHistoryPengajuanLegalitas(
                                    cell.row.original.idDataKebun,
                                );
                                setStdbstore(cell.row.original.nomorSTDB);
                            }}
                        >
                            History
                        </button>
                        <button
                            className="rounded  bg-primary px-3 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                            onClick={() => {
                                setShowModal(true);
                                setHistoryPengajuanLegalitas('');
                                // handleResetDiterima();
                                setUuid(cell.row.original.nomorSTDB);
                            }}
                        >
                            Konfirmasi
                        </button>
                    </div>
                );
            },
        },
    ];
    const filterData = (data: LegalitasLahan[]) => {
        return data.filter(
            (item: LegalitasLahan) =>
                item.statusKonfirmator === 'False' &&
                item.nikKonfirmator === nikKoperasi,
        );
    };

    return (
        <main>
            <PaginatedTable
                columns={columns}
                data={filterData(stdbs)}
                className="mt-8"
                withFilter
            />

            {stdbs
                .filter((stdb) => stdb.nomorSTDB === uuid) // Filters LegalitasLahans with statusKonfirmasiKoperasi as "false" (string)
                .map((stdb, index) => {
                const {
                    nomorSTDB,
                    nik,
                    nama,
                    alamatKebun,
                    statusKepemilikanLahan,
                    nomorSertifikat,
                    luasArealKebun,
                    jenisTanaman,
                    produksiPerHaPertahun,
                    asalBenih,
                    jumlahPohon,
                    polaTanam,
                    jenisPupuk,
                    mitraPengolahan,
                    jenisTanah,
                    tahunTanam,
                    usahaLainDikebun,
                    statusKawasan,
                    nikKonfirmator,
                    namaKonfirmator,
                    nikSurveyor,
                    namaSurveyor,
                    waktuPemetaanKebun,
                    nipVerifikator,
                    namaVerifikator,
                    nipPenerbitLegalitas,
                    namaPenerbitLegalitas,
                    waktuPenerbitLegalitas,
                    updateWaktuPenerbitLegalitas,
                    waktuPengajuan,
                    cidFotoKebun,
                    luasKebun,
                    waktuKonfirmator,
                    updateWaktuKonfirmator,
                    waktuUpdatePemetaanKebun,
                    waktuVerifikator,
                    waktuUpdateVerifikator,
                    latitude,
                    longitude,
                    statusKonfirmator,
                    pesanKonfirmator,
                    idPemetaanKebun,
                    statusVerifikator,
                    pesanVerifikator,
                    cidFileLegalitasKebun,
                } = stdb;
                
                return(
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
                                                        Konfirmasi Pengajuan
                                                        Pemetaan
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

                                                <div className="w-full max-w-2xl mx-auto">
                                                    <h1></h1>
                                                    <TimelineItem
                                                        nama={nama}
                                                        waktuPengajuan={
                                                            waktuPengajuan
                                                        }
                                                        statusKonfirmator={
                                                            statusKonfirmator
                                                        }
                                                        namaKonfirmator={
                                                            namaKonfirmator
                                                        }
                                                        pesanKonfirmator={
                                                            pesanKonfirmator
                                                        }
                                                        idPemetaanKebun={
                                                            idPemetaanKebun
                                                        }
                                                        statusVerifikator={
                                                            statusVerifikator
                                                        }
                                                        namaSurveyor={
                                                            namaSurveyor
                                                        }
                                                        namaVerifikator={
                                                            namaVerifikator
                                                        }
                                                        nipPenerbitLegalitas={
                                                            nipPenerbitLegalitas
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                        <StatusProgress
                                                            nipPenerbitLegalitas={
                                                                nipPenerbitLegalitas
                                                            }
                                                            statusVerifikator={
                                                                statusVerifikator
                                                            }
                                                            idPemetaanKebun={
                                                                idPemetaanKebun
                                                            }
                                                            statusKonfirmator={
                                                                statusKonfirmator
                                                            }
                                                        />
                                                    </div>
                                                    <div className="bg-slate-100 mx-1 rounded-xl">
                                                        <h2 className="font-bold ml-1">
                                                            A. Keterangan
                                                            Pemilik :
                                                        </h2>
                                                        <div className="ml-5">
                                                        <TextKeterangan
                                                            nama={
                                                                '1. Nomor STDB'
                                                            }
                                                            keterangan={
                                                                nomorSTDB
                                                            }
                                                        />
                                                        <TextKeterangan
                                                            nama={'2. Nama'}
                                                            keterangan={nama}
                                                        />
                                                        <TextKeterangan
                                                            nama={
                                                                '3. Nomor KTP'
                                                            }
                                                            keterangan={nik}
                                                        />
                                                    </div>
                                                        <div className="mt-4">
                                                            <h2 className="font-bold ml-1 ">
                                                                B. Data Kebun :
                                                            </h2>
                                                            <div className="ml-6">
                                                            <div className="">
                                                                <TextKeterangan
                                                                    nama={
                                                                        '1. Alamat Kebun'
                                                                    }
                                                                    keterangan={
                                                                        alamatKebun
                                                                    }
                                                                />
                                                                <TextKeterangan
                                                                    nama={
                                                                        '2. Status Kepemilikan Lahan'
                                                                    }
                                                                    keterangan={
                                                                        statusKepemilikanLahan
                                                                    }
                                                                />
                                                                <TextKeterangan
                                                                    nama={
                                                                        '3. Nomor Sertifikat'
                                                                    }
                                                                    keterangan={
                                                                        nomorSertifikat
                                                                    }
                                                                />
                                                                <TextKeterangan
                                                                    nama={
                                                                        '4. Luas Lahan Kebun'
                                                                    }
                                                                    keterangan={
                                                                        jenisTanaman
                                                                    }
                                                                />
                                                                <TextKeterangan
                                                                    nama={
                                                                        '5. Jenis Tanaman'
                                                                    }
                                                                    keterangan={
                                                                        statusKepemilikanLahan
                                                                    }
                                                                />
                                                                <TextKeterangan
                                                                    nama={
                                                                        '6. Produksi per Hektar per Tahun'
                                                                    }
                                                                    keterangan={
                                                                        produksiPerHaPertahun
                                                                    }
                                                                    span="Ton"
                                                                />
                                                                <TextKeterangan
                                                                    nama={
                                                                        '7. Asal Benih'
                                                                    }
                                                                    keterangan={
                                                                        asalBenih
                                                                    }
                                                                />
                                                                <TextKeterangan
                                                                    nama={
                                                                        '8. Jumlah Pohon'
                                                                    }
                                                                    keterangan={
                                                                        jumlahPohon
                                                                    }
                                                                    span="Pohon"
                                                                />
                                                                <TextKeterangan
                                                                    nama={
                                                                        '9. Pola Tanam'
                                                                    }
                                                                    keterangan={
                                                                        polaTanam
                                                                    }
                                                                />
                                                                <TextKeterangan
                                                                    nama={
                                                                        '10. Jenis Pupuk'
                                                                    }
                                                                    keterangan={
                                                                        jenisPupuk
                                                                    }
                                                                />
                                                                <TextKeterangan
                                                                    nama={
                                                                        '11. Mitra Pengolahan'
                                                                    }
                                                                    keterangan={
                                                                        mitraPengolahan
                                                                    }
                                                                />
                                                                <TextKeterangan
                                                                    nama={
                                                                        '12. Jenis Tanah'
                                                                    }
                                                                    keterangan={
                                                                        jenisTanah
                                                                    }
                                                                />
                                                                <TextKeterangan
                                                                    nama={
                                                                        '13. Tahun Tanam'
                                                                    }
                                                                    keterangan={
                                                                        tahunTanam
                                                                    }
                                                                />
                                                                <TextKeterangan
                                                                    nama={
                                                                        '14. Usaha Lain di Lahan Kebun'
                                                                    }
                                                                    keterangan={
                                                                        usahaLainDikebun
                                                                    }
                                                                />
                                                            </div>

                                                            <h4 className="text-sm">
                                                                15. File
                                                                Legalitas lahan
                                                                <span className="ml-24">
                                                                    :
                                                                </span>
                                                                <a
                                                                    href={`https://ipfs.io/ipfs/${cidFileLegalitasKebun}`}
                                                                    download="LegalitasKebun.pdf"
                                                                    className="font-medium text-blue-500"
                                                                >
                                                                    Download
                                                                    File
                                                                    Legalitas
                                                                </a>
                                                            </h4>
                                                        </div>
                                                            
                                                            <div className="flex items-center">
                                                                <h4 className="text-sm ml-6">
                                                                    17. Foto
                                                                    Kebun
                                                                    <span className="ml-39">
                                                                        :
                                                                    </span>
                                                                    &nbsp;
                                                                </h4>
                                                                <div className="w-30 max-h-40">
                                                                    <img
                                                                        src={`https://ipfs.io/ipfs/${cidFotoKebun}`}
                                                                        alt="Upload"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <footer className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mx-1">
                                                    <button
                                                        className="inline-flex w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-400 text-base font-medium text-white hover:bg-amber-600 sm:ml-3 sm:w-auto sm:text-sm"
                                                        onClick={() => {
                                                            setShowModalPenolakan(
                                                                true,
                                                            );
                                                            setShowModal(false);
                                                            handleResetDitolak();
                                                        }}
                                                    >
                                                        Ubah Status Konfirmasi
                                                    </button>
                                                    <button
                                                        className="inline-flex w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-stone-400 text-base font-medium text-white hover:bg-stone-700 sm:ml-3 sm:w-auto sm:text-sm"
                                                        type="submit"
                                                        onClick={() => {
                                                            setShowModal(false);
                                                            handleResetTutup();
                                                        }}
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
                                                            setShowModalPenolakan(
                                                                false,
                                                            )
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
                                                    <div className="bg-slate-100 mx-1 rounded-xl">
                                                        <section className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ">
                                                            <form
                                                                onSubmit={handleSubmit(
                                                                    onSubmit,
                                                                )}
                                                            >
                                                                <div className="">
                                                                    <div className="">
                                                                        <InputDashboard
                                                                            label="Nomor STDB"
                                                                            id="nomorSTDB"
                                                                            type="string"
                                                                            value={
                                                                                stdb.nomorSTDB
                                                                            }
                                                                            register={
                                                                                register
                                                                            }
                                                                            errors={
                                                                                errors
                                                                            }
                                                                            placeholder="Masukan Nomor STDB"
                                                                        />
                                                                    </div>

                                                                    <InputDashboard
                                                                        label="Pesan Konfirmator"
                                                                        id="pesanKonfirmator"
                                                                        type="string"
                                                                        register={
                                                                            register
                                                                        }
                                                                        errors={
                                                                            errors
                                                                        }
                                                                        placeholder="Masukan Pesan Konfirmator"
                                                                    />

                                                                    {/* <InputDashboard
                                                                        label="status Konfirmasi"
                                                                        id="statusKonfirmasi"
                                                                        type="string"
                                                                        register={
                                                                            register
                                                                        }
                                                                        errors={
                                                                            errors
                                                                        }
                                                                    /> */}

                                                                    <SelectKonfirmasi
                                                                        register={
                                                                            register
                                                                        }
                                                                        id="statusKonfirmasi"
                                                                        errors={
                                                                            errors
                                                                        }
                                                                    />
                                                                </div>

                                                                <button
                                                                    className={`inline-flex w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#34D399] text-base font-medium text-white hover:bg-[#207a59] sm:ml-3 sm:w-auto sm:text-sm ${
                                                                        isSubmitting
                                                                            ? 'bg-opacity-90'
                                                                            : ''
                                                                    }`}
                                                                    type="submit"
                                                                    onClick={() => {
                                                                        // setShowModal(false);
                                                                        handleResetTutup();
                                                                    }}
                                                                    disabled={
                                                                        isSubmitting
                                                                    }
                                                                >
                                                                    {isSubmitting
                                                                        ? 'Memuat...'
                                                                        : 'Simpan'}
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
                                                        </section>
                                                    </div>
                                                </div>
                                                <footer className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mx-1">
                                                    <button
                                                        className="inline-flex w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-stone-400 text-base font-medium text-white hover:bg-stone-700 sm:ml-3 sm:w-auto sm:text-sm"
                                                        onClick={() =>
                                                            setShowModalPenolakan(
                                                                false,
                                                            )
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
                ) })}

                                                   
        </main>
    );
}
