import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useStore from '../store/filterStore'; // Import the Zustand store

const pusat: [number, number] = [0.24041105296887577, 110.81003665924074];

const osm = {
    maptiler: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors',
    },
};

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
    waktustatusKonfirmator: string;
    alasanPenolakan: string;
    nipDinas: string;
    namaDinas: string;
    waktuPenerbitanSTDB: string;
    createdAt: string;
    statusPenerbitan: string;
    idPemetaanKebun: string;
    statusVerifikator: string;
    nipVerifikator: string;
    longitude: string;
    latitude: string;
    statusKawasan: string;
}
export interface DataPemetaan {
    idPemetaankebun: string;
    nikSurveyor: string;
    namaSurveyor: string;
    longitude: string;
    latitude: string;
    statusKawasan: string;
    luasKebun: string;
    nipVerifikator: string;
    namaVerifikator: string;
    statusVerifikator: string;
    pesanVerifikator: string;
    WaktuPemetaanKebun: string;
    waktuVerifikator: string;
}

const staticData = [
    {
        id: 151,
        lat: [
            0.24942319291277143, 0.24272846096002496, 0.23689202526852574,
            0.23843696436976053, 0.24513169845733346, 0.24976651240907666,
            0.24873655389330432,
        ],
        lng: [
            110.81016540527344, 110.82458496093751, 110.81445693969728,
            110.80209732055665, 110.79849243164064, 110.80295562744142,
            110.80810546875,
        ],
        color: 'green',
        kawasan: 'Hutan Lindung',
    },
];

const Peta: React.FC = () => {
    const [stdbs, setStdbs] = useState<Cooperative[]>([]);
    const [dataPemetaan, setDataPemetaan] = useState<DataPemetaan[]>([]);
    const [error, setError] = useState<string | null>(null);
    const selectedCategory = useStore((state) => state.selectedCategory);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            const response = await axios.get(
                'http://localhost:9999/api/legalitasLahan/GetAllLegalitasLahan',
            );
            setStdbs(response.data.data);
            console.log('Axios response:', response.data.data);
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

    const getPemetaan = async () => {
        try {
            const response = await axios.get(
                'http://localhost:9999/api/pemetaanKebun/GetAllPemetaanKebun',
            );
            setDataPemetaan(response.data.data);
            console.log('Axios response 2:', response.data.data);
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
    useEffect(() => {
        getPemetaan();
    }, []);

    const handleAxiosError = (error: any) => {
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
    };

    const mergeData = (stdbs: Cooperative[], dataPemetaan: DataPemetaan[]) => {
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
    console.log('Combined data', combinedData);

    const filterDataPenerbitan = (data: Cooperative[]) => {
        return data.filter((item) => item.statusPenerbitan === 'Diterbitkan');
    };

    const filteredStdbs = selectedCategory
        ? combinedData.filter((item) => item.statusKawasan === selectedCategory)
        : combinedData;

    return (
        <div
            className="leaflet-container"
            style={{ height: '40vh', width: '100%' }}
        >
            <MapContainer
                center={pusat}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url={osm.maptiler.url}
                    attribution={osm.maptiler.attribution}
                />
                {combinedData.map((stdb, index) => {
                    const { statusKawasan, longitude, latitude } = stdb;

                    console.log('longitude', longitude);
                    console.log('latitude', latitude);
                    console.log('statusKawasan', statusKawasan);

                    const latitudes = JSON.parse(latitude) as number[];
                    const longitudes = JSON.parse(longitude) as number[];
                    const coordinates = latitudes.map((lat, idx) => [
                        lat,
                        longitudes[idx],
                    ]) as [number, number][];

                    let color = '';
                    if (statusKawasan === 'didalam kawasan') {
                        color = '#FF0000';
                    } else if (statusKawasan === 'sebagian memasuki kawasan') {
                        color = '#FFFF00';
                    } else {
                        color = '#0000FF';
                    }

                    return (
                        <Polygon
                            key={index}
                            positions={coordinates}
                            pathOptions={{ color: color }}
                        >
                            <Popup>
                                <div>
                                    {/* <h4>Cooperative ID: {layer.id}</h4> */}
                                </div>
                            </Popup>
                        </Polygon>
                    );
                })}

                {error && (
                    <div className="error">
                        <p>{error}</p>
                    </div>
                )}
            </MapContainer>
        </div>
    );
};

export default Peta;
