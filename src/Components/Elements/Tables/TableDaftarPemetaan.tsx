import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import useAuthStore from '../../../store/authStore';
import { LegalitasLahan } from '../../../types/legalitasLahan';
import PaginatedTable from './table/PaginatedTable';
import VerificationLabel from './table/VerificationLabel';
import FormatTanggalLabel from './shared/FormatTanggalLabel';
// import uploadImage from '../../../../public/UploadImage.png';
import InputDashboard from '../Input/InputDashboard';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { NavLink, useLocation } from 'react-router-dom';
import { GetAllLegalitasLahan } from '../../../Services/legalitasLahanServices';
import TimelineItem from '../TimeLine/TimeLineItem';
import StatusProgress from '../ProgressBar/StatusProgress';
import TextKeterangan from '../TextKeterangan/TextKeterangan';
import FormatTanggalJamLabel from './table/FormatTanggalJamLabel';

const schema = z
    .object({
        alasanPenolakan: z.string().optional(), // make it optional initially
        statusKonfirmasi: z.string(),
        nomorSTDB: z.string(),
        nikKonfirmator: z.string(),
        namaKonfirmator: z.string(),
    })
    .refine(
        (data) => {
            // Check if statusKonfirmasi indicates rejection
            if (data.statusKonfirmasi === 'ditolak') {
                // Ensure alasanPenolakan is not empty
                return (
                    data.alasanPenolakan && data.alasanPenolakan.trim() !== ''
                );
            }
            // If not rejected, no need to validate alasanPenolakan
            return true;
        },
        {
            message: 'Alasan Penolakan Tidak Boleh Kosong !!!',
            path: ['alasanPenolakan'], // path of the field that causes the error
        },
    );

// Define type for form fields based on Zod schema
type FormFields = z.infer<typeof schema>;

export default function TableDaftarPemetaan() {
    const [showModal, setShowModal] = useState(false);
    const [nomorSTDB, setNomorSTDB] = useState('');
    const [stdbs, setStdbs] = useState<LegalitasLahan[]>([]);
    


    let index;
    if (showModal) {
        index = 'absolute z-999';
    }

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
            accessorKey: 'nik',
            header: 'Nomor KTP',
        },
        {
            accessorKey: 'waktuPengajuan',
            header: 'Tanggal Pengajuan',
            cell: (props) => <FormatTanggalJamLabel tanggal={props.getValue()} />,
        },
        {
            accessorKey: 'alamatKebun',
            header: 'alamat Kebun',
        },
    
        {
            accessorKey: 'waktuKonfirmator',
            header: 'waktu Konfirmasi',
            cell: (props) => <FormatTanggalJamLabel tanggal={props.getValue()} />,
        },
        {
            accessorKey: 'waktuUpdateKonfirmator',
            header: 'waktu  Update Konfirmasi',
            cell: (props) => <FormatTanggalJamLabel tanggal={props.getValue()} />,
        },
       
        {
            accessorKey: 'nomorSTDB',
            header: 'Action',
            cell: (cell: any) => {
                return (
                    <div className="">
                        <button
                            className="rounded  bg-primary px-3 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                            onClick={() => {
                                setShowModal(true);
                                setNomorSTDB(cell.row.original.nomorSTDB);
                            }}
                        >
                            Petakan
                        </button>
                    </div>
                );
            },
        },
    ];
    const filterData = (data: LegalitasLahan[]) => {
        return data.filter(
            (item: LegalitasLahan) =>
                item.statusKonfirmator === 'Disetujui' &&
                item.idPemetaanKebun === 'Belum dipetakan',
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
                .filter((stdb) => stdb.nomorSTDB === nomorSTDB) // Filters LegalitasLahans with statusKonfirmasiKoperasi as "false" (string)
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
                                                    <div>
                                                        <NavLink
                                                            to="/TambahPemetaan"
                                                            state={{
                                                                customData:
                                                                    nomorSTDB,
                                                            }}
                                                            className="inline-flex w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#34D399] text-base font-medium text-white hover:bg-[#207a59] sm:ml-3 sm:w-auto sm:text-sm"
                                                            onClick={() =>
                                                                setShowModal(
                                                                    false,
                                                                )
                                                            }
                                                        >
                                                            Petakan Lahan
                                                        </NavLink>
                                                    </div>

                                                    <button
                                                        className="inline-flex w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-stone-400 text-base font-medium text-white hover:bg-stone-700 sm:ml-3 sm:w-auto sm:text-sm"
                                                        type="submit"
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
                ) })}
          
        </main>
    );
}
