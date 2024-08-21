import React, { useEffect, useState } from 'react';
import useStore from '../store/filterStore';
import axios from 'axios';
import { LegalitasLahan } from '../types/legalitasLahan';
import { GetAllDataPemetaanKebun } from '../Services/pemetaanKebunServices';
import { GetAllLegalitasLahan } from '../Services/legalitasLahanServices';
import { DataPemetaanKebun } from '../types/dataPemetaanKebun';
interface StatProps {
    title: string;
    value: number | string;
}
interface StatProps {
    title: string;
    value: number | string;
    span?: string;
}
type UserData = {
    nik: string;
    email: string;
    nama: string;
    alamat: string;
    nomorTelepon: string;
    idKoperasi: string;
    lengkap: string
    profilLengkap: string
    role: string;
    wallet: string;
};

const StatCard: React.FC<StatProps> = ({ title, value, span}) => {
    return (
        <div className="chart p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-700">{title}</h2>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{value} {span}</p>
        </div>
    );
};

const Keterangan = () => {
    const [stdbs, setStdbs] = useState<LegalitasLahan[]>([]);
    const [dataPemetaan, setDataPemetaan] = useState<DataPemetaanKebun[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [users, setUsers] = useState<UserData[]>([]);
    const selectedCategory = useStore((state) => state.selectedCategory);

    useEffect(() => {
        const fetchSTDBS = async () => {
            try {
                const data = await GetAllLegalitasLahan();
                setStdbs(data);
                console.log('Fetched LegalitasLahan:', data);
            } catch (error) {
                console.error('Failed to fetch STDBS:', error);
                setError('Failed to fetch STDBS');
            }
        };

        fetchSTDBS();
    }, []);

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
    }, []);


    useEffect(() => {
        const fetchDataPemetaanKebun = async () => {
            try {
                const data = await GetAllDataPemetaanKebun();
                setDataPemetaan(data);
                console.log('Fetched DataPemetaanKebun:', data);
            } catch (error) {
                console.error('Failed to fetch Data Pemetaan Kebun:', error);
                setError('Failed to fetch Data Pemetaan Kebun');
            }
        };
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

    const combinedData = mergeData(stdbs, dataPemetaan);
    console.log('Combined Data:', combinedData);

    const filterDataPenerbitan = (data: LegalitasLahan[]) => {
        return data.filter(
            (item: LegalitasLahan) => item.nipPenerbitLegalitas !== 'False',
        );
    };
    const filterDataPetani = (data: UserData[]) => {
        return data.filter(
            (item: UserData) => item.role === 'PETANI' && item.wallet === "TRUE",
        );
    };

    

    const filteredStdbs = selectedCategory
        ? combinedData.filter((item) => item.statusKawasan === selectedCategory)
        : combinedData;

    useEffect(() => {
        console.log('Filtered Data:', filteredStdbs);
    }, [filteredStdbs]);

    const calculateTotalLuasArealKebun = (data: LegalitasLahan[]) => {
        return data.reduce(
            (total, item) =>
                total + parseFloat(item.luasKebun || '0', 10),
            0,
        );
    };

    const calculateJumlahPohon = (data: LegalitasLahan[]) => {
        return data.reduce(
            (total, item) =>
                total + parseInt(item.jumlahPohon || '0', 10),
            0,
        );
    };

    const calculateJumlahPerhaPertahun = (data: LegalitasLahan[]) => {
        return data.reduce(
            (total, item) =>
                total + parseInt(item.produksiPerHaPertahun || '0', 10),
            0,
        );
    };

    // const calculateJumlahPetani = (data: UserData[]): number => {
    //     const uniqueNiks = new Set<string>();
    //     data.forEach((item) => {
    //         uniqueNiks.add(item.nik);
    //     });
    //     return uniqueNiks.size;
    // };
    const calculateJumlahPetani = (data: UserData[]): number => {
        return data.reduce(
            (total, item) =>
                total + parseInt(item.role || '0', 10),
            0,
        );
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
                <StatCard
                    title="Jumlah Kebun"
                    value={filterDataPenerbitan(filteredStdbs).length}
                />
                <StatCard
                    title="Jumlah Petani"
                    value={filterDataPetani(users).length}
                />
                <StatCard
                    title="Luas Lahan"
                    value={calculateTotalLuasArealKebun(
                        filterDataPenerbitan(filteredStdbs),
                    )}
                    span='Hektar'
                />
                <StatCard
                    title="Jumlah Pohon"
                    value={calculateJumlahPohon(
                        filterDataPenerbitan(filteredStdbs),
                    )}
                    span='Pohon'
                />
                <StatCard
                    title="Produksi Per Ha Pertahun "
                    value={calculateJumlahPerhaPertahun(
                        filterDataPenerbitan(filteredStdbs),
                    )}
                    span='Ton'
                />
            </div>
        </div>
    );
};

export default Keterangan;
