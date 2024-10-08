import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState, useMemo } from 'react';
import useAuthStore from '../../../store/authStore';
import PaginatedTable from './table/PaginatedTable';
import FormatTanggalLabel from './shared/FormatTanggalLabel';
import InputDashboard from '../Input/InputDashboard';
import { LegalitasLahan } from '../../../types/legalitasLahan';
import { GetAllLegalitasLahan } from '../../../Services/legalitasLahanServices';
import { GetAllDataPemetaanKebun } from '../../../Services/pemetaanKebunServices';
import { DataPemetaanKebun } from '../../../types/dataPemetaanKebun';
import { useModalStore } from '../../../store/useModalStore';
import userVerifikasiPemetaanKebun from '../../../Hooks/useVerifikasiPemetaanKebunForm';
import MapComponent from './mapComponent';
import FormatTanggalJamLabel from './table/FormatTanggalJamLabel';
import ProgressBar from '../ProgressBar/ProgressBar';
import VerificationLabelStatusKawasan from './table/VerificationLabelStatusKawasan';
import useIdPemetaanKebunStore from '../../../store/useIdPemetaanKebunStore';
import SelectStatusVerifikator from '../Select/SelectStatusVerifikator';
import TextKeterangan from '../TextKeterangan/TextKeterangan';
import StatusProgress from '../ProgressBar/StatusProgress';
import TimelineItem from '../TimeLine/TimeLineItem';
import SelectKonfirmasi from '../Select/SelectKonfirmasi';

export default function PaginationTablePage() {
    const [uuid, setUuid] = useState('');
    const { user } = useAuthStore((state) => state);
    const [dataPemetaan, setDataPemetaan] = useState<DataPemetaanKebun[]>([]);
    const [stdbs, setStdbs] = useState<LegalitasLahan[]>([]);
    const showModal = useModalStore((state) => state.showModal);
    const setShowModal = useModalStore((state) => state.setShowModal);
    const [isLoading, setIsLoading] = useState(false);
    const setIdPemetaanKebun = useIdPemetaanKebunStore(
        (state) => state.setIdPemetaanKebun,
    );
    const showModalPenolakan = useModalStore(
        (state) => state.showModalPenolakan,
    );
    const setShowModalPenolakan = useModalStore(
        (state) => state.setShowModalPenolakan,
    );

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
        onSubmit,
        reset,
    } = userVerifikasiPemetaanKebun();

    useEffect(() => {
        const fetchSTDBS = async () => {
            try {
                const data = await GetAllLegalitasLahan();
                setStdbs(data);
                setIsLoading(true)
            } catch (error) {
                console.error('Failed to fetch STDBS:', error);
            }finally{
                setIsLoading(false)
            }
        };

        fetchSTDBS();
    }, [isSubmitting]);

    useEffect(() => {
        const fetchDataPemetaanKebun = async () => {
            try {
                const data = await GetAllDataPemetaanKebun();
                setDataPemetaan(data);
                setIsLoading(true)
            } catch (error) {
                console.error('Failed to fetch Data Pemetaan Kebun:', error);
            }finally{
                setIsLoading(false)
            }
        };

        fetchDataPemetaanKebun();
    }, [isSubmitting]);

    const handleResetTutup = () => {
         reset();
       
    };

    const handleResetValueNomorSTDB = (idPemetaanKebun: any) => {
        console.log('nomor', idPemetaanKebun);
        setValue('idPemetaanKebun', idPemetaanKebun);
    };

    const handleResetDiterima = () => {};

    let index;
    if (showModal) {
        index = 'absolute z-999';
    }

    const columns: ColumnDef<LegalitasLahan>[] = [
        {
            accessorKey: 'nomorSTDB',
            header: 'Nomor STDB',
        },
        {
            accessorKey: 'idPemetaanKebun',
            header: 'id PemetaanKebun',
        },
        {
            accessorKey: 'nik',
            header: 'Nomor KTP',
        },
        {
            accessorKey: 'statusKawasan',
            header: 'status kawasan',
            cell: (props) => (
                <VerificationLabelStatusKawasan
                    statusKawasan={props.getValue()}
                />
            ),
        },

        {
            accessorKey: 'nikSurveyor',
            header: 'nik Surveyor',
        },
        {
            accessorKey: 'namaSurveyor',
            header: 'nik Surveyor',
        },

        {
            accessorKey: 'waktuPemetaanKebun',
            header: 'Tanggal Pemetaan',
            cell: (props) => (
                <FormatTanggalJamLabel tanggal={props.getValue()} />
            ),
        },
        {
            accessorKey: 'waktuUpdatePemetaanKebun',
            header: 'Tanggal Update Pemetaan',
            cell: (props) => (
                <FormatTanggalJamLabel tanggal={props.getValue()} />
            ),
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
                                // setShowModal(true);
                                // setNomorSTDB(cell.row.original.nomorSTDB);
                                setIdPemetaanKebun(
                                    cell.row.original.idPemetaanKebun,
                                );

                            }}
                        >
                            History
                        </button>
                        <button
                            className=" ml-2 rounded  bg-amber-400 px-3 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-amber-500 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-amber-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-amber-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                            onClick={() => {
                                setShowModal(true);
                                handleResetDiterima();

                                handleResetValueNomorSTDB(
                                    cell.row.original.idPemetaanKebun,
                                );
                                setUuid(cell.row.original.idPemetaanKebun);
                                setIdPemetaanKebun(
                                    ''
                                )
                            }}
                        >
                            verify
                        </button>
                    </div>
                );
            },
        },
    ];
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
    const filterData = (data: LegalitasLahan[]) => {
        return data.filter(
            (item: LegalitasLahan) =>
                item.idPemetaanKebun !== 'Belum dipetakan' &&
                item.idPemetaanKebun !== undefined &&
                item.statusVerifikator === 'Belum diverifikasi',
        );
    };

    const combinedData = useMemo(() => mergeData(stdbs, dataPemetaan), [stdbs, dataPemetaan]);
    const filteredData = useMemo(() => filterData(combinedData), [combinedData]);

    return (
        <main>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <PaginatedTable
                columns={columns}
                data={filteredData}
                className="mt-8"
                withFilter
            />
            )}
            
     {combinedData
                .filter((stdb) => stdb.idPemetaanKebun=== uuid) // Filters LegalitasLahans with statusKonfirmasiKoperasi as "false" (string)
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
                            <div className="z-999">
                                <div className={``}>
                                    <div className="fixed inset-0 overflow-y-auto backdrop-blur-sm">
                                        <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                                            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all lg:w-2/4 sm:w-4/6 xl:w-1/2 ">
                                                <header className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex  mx-1">
                                                    <p className="text-lg font-semibold text-center flex-grow">
                                                       Verifikasi Pemetaan Kebun
                                                    </p>
                                                    <button
                                                        className="text-gray-400 hover:text-gray-500"
                                                        aria-label="close"
                                                        onClick={() =>
                                                            {
                                                            setShowModal(false)
                                                            handleResetTutup();
                                                            }
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
                                                            
                                                            <div className='mt-4 p-4'>
                                                                            <MapComponent
                                                                                longitude={
                                                                                    longitude
                                                                                }
                                                                                luasKebun={
                                                                                    luasKebun
                                                                                }
                                                                                latitude={
                                                                                    latitude
                                                                                }
                                                                                statusKawasan={
                                                                                    statusKawasan
                                                                                } 
                                                                                nikSurveryor={nikSurveyor}
                                                                                namaSurveryor={namaSurveyor}

                                                                                waktuPemetaanKebun={waktuPemetaanKebun}
                                                                                waktuUpdatePemetaanKebun={waktuUpdatePemetaanKebun}
                                                                            />
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
                                                        }}
                                                    >
                                                        Ubah status Verifikasi Pemetaan Kebun
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
    <div className="z-999">
        <div className={``}>
            <div className="fixed inset-0 overflow-y-auto backdrop-blur-sm">
                <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                    <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all lg:w-2/4 sm:w-4/6 xl:w-1/2 ">
                        <header className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex  mx-1">
                            <p className="text-lg font-semibold text-center flex-grow">
                                Verifikasi Pemetaan
                            </p>
                            <button
                                className="text-gray-400 hover:text-gray-500"
                                aria-label="close"
                                onClick={() =>
                                    {
                                    setShowModalPenolakan(
                                        false,
                                    )
                                    handleResetTutup();
                                    }
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
                                        className="space-y-4"
                                        onSubmit={handleSubmit(
                                            onSubmit,
                                        )}
                                    >
                                        <div>
                                            <div className="hidden">
                                                <InputDashboard
                                                    label="Id Pemetaan Kebun"
                                                    id="idPemetaanKebun"
                                                    type="string"
                                                    value={
                                                        stdb.idPemetaanKebun
                                                    }
                                                    register={
                                                        register
                                                    }
                                                    errors={
                                                        errors
                                                    }
                                                    placeholder="Masukan Id Pemetaan Kebun"
                                                />
                                            </div>
                                            <InputDashboard
                                                label="Pesan Verifikator"
                                                id="pesanVerifikator"
                                                type="string"
                                                register={
                                                    register
                                                }
                                                errors={
                                                    errors
                                                }
                                                placeholder="Masukan Pesan Verifikator"
                                            />

                                            <SelectStatusVerifikator
                                                id="statusVerifikator"
                                                register={
                                                    register
                                                }
                                                errors={
                                                    errors
                                                }

                                                // hidden={true}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            disabled={
                                                isSubmitting
                                            }
                                        >
                                           {isSubmitting
                                                                        ? 'Memuat...'
                                                                        : 'Simpan'}
                                        </button>
                                    </form>
                                </section>
                            </div>
                        </div>
                        <footer className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mx-1">
                            <button
                                className="inline-flex w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-stone-400 text-base font-medium text-white hover:bg-stone-700 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={() =>
                                    {
                                    setShowModalPenolakan(
                                        false,
                                    )
                                    handleResetTutup();
                                    }
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
    )
}
