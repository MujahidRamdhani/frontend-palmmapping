import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import useAuthStore from '../../../store/authStore';
import PaginatedTable from './table/PaginatedTable';
import { LegalitasLahan } from '../../../types/legalitasLahan';
import {
    GetAllLegalitasLahan,
    HistoryLegalitasLahan,
} from '../../../Services/legalitasLahanServices';
import { DataPemetaanKebun } from '../../../types/dataPemetaanKebun';
import FormatTanggalJamLabel from './table/FormatTanggalJamLabel';
import './App.css';
import useHistoryPengajuanLegalitasStore from '../../../store/useHistoryPengajuanLegalitasStore';
import ImageLabel from './table/ImageLabel';
import Button from '../Button/Button';

export default function PaginationTablePage() {
    const { user } = useAuthStore((state) => state);
    const [stdbs, setStdbs] = useState<LegalitasLahan[]>([]);
    const [dataPemetaan, setDataPemetaan] = useState<DataPemetaanKebun[]>([]);
    const [nik, setNik] = useState('');
    const historyPengajuanLegalitas = useHistoryPengajuanLegalitasStore(
        (state) => state.historyPengajuanLegalitas,
    );
    const setHistoryPengajuanLegalitas = useHistoryPengajuanLegalitasStore(
        (state) => state.setHistoryPengajuanLegalitas,
    );
    const stdbStore = useHistoryPengajuanLegalitasStore(
        (state) => state.stdbStore,
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
    }, [historyPengajuanLegalitas]);

    useEffect(() => {
        const fetchDataPemetaanKebun = async () => {
            try {
                if (historyPengajuanLegalitas) {
                    const data = await HistoryLegalitasLahan(
                        historyPengajuanLegalitas,
                    );
                    setDataPemetaan(data);
                }
            } catch (error) {
                console.error('Failed to fetch Data Pemetaan Kebun:', error);
            }
        };
        console.log(fetchDataPemetaanKebun());
        fetchDataPemetaanKebun();
    }, [historyPengajuanLegalitas]);

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
            accessorKey: 'alamatKebun',
            header: 'Alamat Kebun',
        },
        {
            accessorKey: 'statusKepemilikanLahan',
            header: 'status Kepemilikan Lahan',
        },
        {
            accessorKey: 'nomorSertifikat',
            header: 'nomor sertifikat',
            
        },
        {
            accessorKey: 'produksiPerHaPertahun',
            header: 'Produksi per Tahun',
            cell: ({ cell }) => {
                const value = cell.getValue() as number; // or string, depending on the type
                return <span>{value} Ton</span>;
            },
        },
        {
            accessorKey: 'jumlahPohon',
            header: 'Jumlah Pohon',
            cell: ({ cell }) => {
                const value = cell.getValue() as number; // or string, depending on the type
                return <span>{value} Pohon</span>;
            },
        },
        {
            accessorKey: 'asalBenih',
            header: 'Asal Benih',
        },
        {
            accessorKey: 'polaTanam',
            header: 'Pola Tanam',
        },
        {
            accessorKey: 'jenisPupuk',
            header: 'Jumlah Pohon',
        },
        {
            accessorKey: 'mitraPengolahan',
            header: 'Jumlah Pohon',
        },
        {
            accessorKey: 'jenisTanah',
            header: 'Jumlah Pohon',
        },
        {
            accessorKey: 'tahunTanam',
            header: 'Tahun Tanam',
        },
        {
            accessorKey: 'usahaLainDikebun',
            header: 'usaha Lain Dikebun',
        },
        {
            accessorKey: 'cidFileLegalitasKebun',
            header: 'File Legalitas Kebun',
            cell: (props) => (
                <ImageLabel
                    cidFileLegalitasKebun={props.getValue() as string}
                />
            ),
        },
        {
            accessorKey: 'cidFotoKebun',
            header: 'Foto Kebun',
            cell: (props) => (
                <ImageLabel cidFotoKebun={props.getValue() as string} />
            ),
        },

        {
            accessorKey: 'waktuPembuatan',
            header: 'Tanggal Pengajuan',
            cell: (props) => (
                <FormatTanggalJamLabel tanggal={props.getValue()} />
            ),
        },
        {
            accessorKey: 'waktuUpdatePembuatan',
            header: 'Tanggal Update Pengjuan',
            cell: (props) => (
                <FormatTanggalJamLabel tanggal={props.getValue()} />
            ),
        },
    ];

    const filterData = (data: LegalitasLahan[]) => {
        return data.filter(
            (item: LegalitasLahan) => item.idPemetaanKebun !== 'False',
        );
    };
    const combinedData = mergeData(stdbs, dataPemetaan);

 
    return (
        <main>
            <div className="flex  gap-4 mt-2">
            <h1 className="text-title-sm font-semibold text-black dark:text-white">
                History Data Kebun Dengan Nomor STDB: {stdbStore}  
            </h1>
            {/* <Button >Close</Button> */}
            <Button type='submit' onClick={() => setHistoryPengajuanLegalitas('')}>close</Button>
            </div>
            <PaginatedTable
                columns={columns}
                data={dataPemetaan}
                className="mt-8  "
                withFilter
            />
        </main>
    );
}
