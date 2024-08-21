import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import useAuthStore from '../../../store/authStore';
import PaginatedTable from './table/PaginatedTable';
import VerificationLabel from './table/VerificationLabel';
import FormatTanggalLabel from './shared/FormatTanggalLabel';
import { LegalitasLahan } from '../../../types/legalitasLahan';
import { GetAllLegalitasLahan } from '../../../Services/legalitasLahanServices';
import {
    GetAllDataPemetaanKebun,
    HistoryPemetaanKebun,
} from '../../../Services/pemetaanKebunServices';
import { DataPemetaanKebun } from '../../../types/dataPemetaanKebun';
import VerificationLabelPemetaanKebun from './table/VerificationLabelPemetaan';
import FormatTanggalJamLabel from './table/FormatTanggalJamLabel';
import MapComponent from './mapComponent';
import './App.css';
import ProgressBar from '../ProgressBar/ProgressBar';
import VerificationLabelVerifikator from './VerificationLabelVerifikator';
import VerificationLabelPenerbitanLegalitas from './VerificationLabelPenerbitanLegalitas';
import { NavLink } from 'react-router-dom';
import useIdPemetaanKebunStore from '../../../store/useIdPemetaanKebunStore';
import VerificationLabelStatusKawasan from './table/VerificationLabelStatusKawasan';
import RoundNumber from './table/verificationLavelRoundNumber';
import Button from '../Button/Button';
import TextKeterangan from '../TextKeterangan/TextKeterangan';
import StatusProgress from '../ProgressBar/StatusProgress';
import TimelineItem from '../TimeLine/TimeLineItem';
export default function PaginationTablePage() {
    const [showModal, setShowModal] = useState(false);
    const [idPemetaanKebunState, setidPemetaanKebunState] = useState('');
    const { user } = useAuthStore((state) => state);
    const [stdbs, setStdbs] = useState<LegalitasLahan[]>([]);
    const [dataPemetaan, setDataPemetaan] = useState<DataPemetaanKebun[]>([]);
    const [nik, setNik] = useState('');
    const setIdPemetaanKebun = useIdPemetaanKebunStore(
        (state) => state.setIdPemetaanKebun,
    );
    const idPemetaanKebun = useIdPemetaanKebunStore(
        (state) => state.idPemetaanKebun,
    );
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
    }, [idPemetaanKebun]);

    useEffect(() => {
        const fetchDataPemetaanKebun = async () => {
            try {
                if (idPemetaanKebun) {
                    const data = await HistoryPemetaanKebun(idPemetaanKebun);
                    setDataPemetaan(data);
                }
            } catch (error) {
                console.error('Failed to fetch Data Pemetaan Kebun:', error);
            }
        };
        console.log(fetchDataPemetaanKebun());
        fetchDataPemetaanKebun();
    }, [idPemetaanKebun]);

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
            accessorKey: 'IdTransaksiBlockchain',
            header: 'Hash Block',
        },

        {
            accessorKey: 'luasKebun',
            header: 'Luas Kebun',
            cell: (props) => (
                <RoundNumber luasLahan={props.getValue() as string} />
            ),
        },
        {
            accessorKey: 'statusKawasan',
            header: 'Status Kawasan',
            cell: (props) => (
                <VerificationLabelStatusKawasan
                    statusKawasan={props.getValue()}
                />
            ),
        },
        {
            accessorKey: 'waktuPemetaanKebun',
            header: 'Tanggal Pemetaan Kebun',
            cell: (props) => (
                <FormatTanggalJamLabel tanggal={props.getValue()} />
            ),
        },
        
        {
            accessorKey: 'statusVerifikator',
            header: 'Status Verifikator',
            cell: (props) => (
                <VerificationLabelVerifikator
                    statusVerifikator={props.getValue()}
                />
            ),
        },
        {
            accessorKey: 'waktuVerifikator',
            header: 'waktu Verifikator',
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
                                setShowModal(true);
                                setidPemetaanKebunState(cell.row.original.IdTransaksiBlockchain);
                            }}
                        >
                            Lihat
                        </button>
                    </div>
                );
            },
        },
    ];

   

    

    return (
        <main>
            <div className='flex  gap-4'>
            <h1 className="text-title-sm font-semibold text-black dark:text-white">
                History Pemetaan Kebun Dengan Id Pemetaan: {idPemetaanKebun}
            </h1>
            <Button type='submit' onClick={() => setIdPemetaanKebun('')}>close</Button>
            </div>
           
            <PaginatedTable
                columns={columns}
                data={dataPemetaan}
                className="mt-8  "
                withFilter
            />
             {dataPemetaan
                .filter((stdb) => stdb.IdTransaksiBlockchain === idPemetaanKebunState) // Filters LegalitasLahans with statusKonfirmasiKoperasi as "false" (string)
                .map((stdb, index) => {
                const {
                   
                    statusKawasan,
                   
                    nikSurveyor,
                    namaSurveyor,
                    waktuPemetaanKebun,
                    nipVerifikator,
                    namaVerifikator,
                    
                    luasKebun,
                    waktuUpdateVerifikator,
                    latitude,
                    longitude,
                    waktuVerifikator,
                    idPemetaanKebun,
                    statusVerifikator,
                    pesanVerifikator,
                    waktuUpdatePemetaanKebun,
                } = stdb;
                
                return(
                    <div className="grid grid-cols-3 sm:grid-cols-5">
                        {/* Tampilan Modal */}
                        {showModal && (
                            <div className="z-50">
                                <div className={``}>
                                    <div className="fixed inset-0 overflow-y-auto backdrop-blur-sm">
                                        <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                                            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all lg:w-2/4 sm:w-4/6 xl:w-1/2 ">
                                                <header className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex  mx-1">
                                                    <p className="text-lg font-semibold text-center flex-grow">
                                                       Riwayat Pemetaan kebun 
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
                                                   
                                                </div>
                                                <div>
                                                        
                                                    </div>
                                                    <div className="bg-slate-100 mx-1 rounded-xl">
                                                    <div className="ml-2">
                                                            {idPemetaanKebun !==
                                                                'Belum dipetakan' &&
                                                                idPemetaanKebun !==
                                                                    undefined && (
                                                                    <>
                                                                        <h2 className="font-bold ml-1">
                                                                            A.
                                                                            Peta
                                                                            Kebun
                                                                            :
                                                                        </h2>
                                                                        <div className='ml-2'>
                                                                        <TextKeterangan
                                                                            nama={
                                                                                '1. Nik Surveyor'
                                                                            }
                                                                            keterangan={
                                                                                nikSurveyor
                                                                            }
                                                                             />
                                                                             <TextKeterangan
                                                                            nama={
                                                                                '2. Nama Surveyor'
                                                                            }
                                                                            keterangan={
                                                                                namaSurveyor
                                                                            }
                                                                             />
                                                                              <TextKeterangan
                                                                            nama={
                                                                                '3. Waktu Pemetaan Kebun'
                                                                            }
                                                                            tanggal={
                                                                                waktuPemetaanKebun
                                                                            }
                                                                             />
                                                                              <TextKeterangan
                                                                            nama={
                                                                                '4. Waktu Update Pemetaan Kebun'
                                                                            }
                                                                            tanggal={
                                                                                waktuUpdatePemetaanKebun
                                                                            }
                                                                             />
                                                                             {nipVerifikator &&(
                                                                                  <div className=''>
                                                                                  <TextKeterangan
                                                                                nama={
                                                                                    '5. Nip verifikator'
                                                                                }
                                                                                keterangan={
                                                                                    nipVerifikator
                                                                                }
                                                                                 />
                                                                                 <TextKeterangan
                                                                                nama={
                                                                                    '6. Nama verifikator'
                                                                                }
                                                                                keterangan={
                                                                                    namaVerifikator
                                                                                }
                                                                                 />
                                                                                  <TextKeterangan
                                                                                nama={
                                                                                    '7. Status Verifikator'
                                                                                }
                                                                                keterangan={
                                                                                    statusVerifikator
                                                                                    
                                                                                }
                                                                                 />
                                                                                  <TextKeterangan
                                                                                nama={
                                                                                    '8. Waktu verifikator'
                                                                                }
                                                                                tanggal={
                                                                                    waktuVerifikator
                                                                                }
                                                                                 />
                                                                                 <TextKeterangan
                                                                                nama={
                                                                                    '9. Waktu verifikator'
                                                                                }
                                                                                tanggal={
                                                                                    waktuVerifikator
                                                                                }
                                                                                 />
                                                                        </div>
                                                                             )}
                                                                           <div className='mb-2'></div>
                                                                        </div>
                                                                        <div>
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
                                                                    </>
                                                                )}
                                                        </div>
                                                       
                                                        
                                                    </div>
                                                </div>
                                                <footer className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mx-1">
                                                    <button
                                                        className="inline-flex w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-stone-400 text-base font-medium text-white hover:bg-stone-700 sm:ml-3 sm:w-auto sm:text-sm"
                                                        type="submit"
                                                        onClick={() => {
                                                            setShowModal(false);
                                                        
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

                       
                    </div>
                ) })};
        </main>
    );
}
