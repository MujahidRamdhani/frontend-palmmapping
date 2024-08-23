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
        const getPeta = async () => {
            try {
                const response = await axios.get(
                    'https://palmmapping-backend.my.to/api/pemetaanKebun/GetAllPemetaanKebun',
                );
                setDataPemetaan(response.data);
                console.log('Axios response:', response.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('Error fetching data:', error.message);
                    setError(`Error fetching data: ${error.message}`);
                } else {
                    console.error('Unexpected error:', error);
                    setError('Unexpected error occurred');
                }
            }
        };
        getPeta();
    }, []);

    useEffect(() => {
        const getLegalitasLahan = async () => {
            try {
                const response = await axios.get(
                    'https://palmmapping-backend.my.to/api/legalitasLahan/GetAllLegalitasLahan',
                );
                setStdbs(response.data);
                console.log('Axios response:', response.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('Error fetching data:', error.message);
                    setError(`Error fetching data: ${error.message}`);
                } else {
                    console.error('Unexpected error:', error);
                    setError('Unexpected error occurred');
                }
            }
        };
        getLegalitasLahan();
    }, []);

    const mergeData = (stdbs: Cooperative[], dataPemetaan: DataPemetaan[]) => {
        return stdbs.map((stdb) => {
            const matchingPemetaan = dataPemetaan.find(
                (pemetaan) => pemetaan.idPemetaankebun === stdb.idPemetaanKebun,
            );
            return {
                ...stdb,
                ...matchingPemetaan,
            };
        });
    };

    const combinedData = mergeData(stdbs, dataPemetaan);

    const filterDataPenerbitan = (data: Cooperative[]) => {
        return data.filter(
            (item: Cooperative) => item.statusPenerbitan === 'Diterbitkan',
        );
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
                {selectedCategory == null &&
                    staticData.map((layer, index) => {
                        if (
                            !layer.lat ||
                            !layer.lng ||
                            layer.lat.length !== layer.lng.length
                        ) {
                            return null;
                        }

                        const coordinates = layer.lat.map((lat, idx) => [
                            lat,
                            layer.lng[idx],
                        ]);

                        return (
                            <Polygon
                                key={index + stdbs.length}
                                positions={coordinates}
                                pathOptions={{
                                    color: layer.color,
                                    zIndex: 1000,
                                }}
                            >
                                <Popup>
                                    <div>
                                        <p>{layer.kawasan}</p>
                                    </div>
                                </Popup>
                            </Polygon>
                        );
                    })}

                {combinedData.map((stdb, index) => {
                    const {
                        nomorSTDB,
                        nama,
                        alamat,
                        luasArealKebun,
                        statusKawasan,
                        longitude,
                        latitude,
                        cidFotoLahan,
                    } = stdb;

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
                            {/* <Popup>
                                <div>
                                    <h4>Nomor STDB: {nomorSTDB}</h4>
                                    <h4>Nama Pemilik: {nama}</h4>
                                    <h4>
                                        Luas Areal Kebun: {luasArealKebun} Ha
                                    </h4>
                                    <h4>Kawasan: {statusKawasan}</h4>
                                    <h4>Alamat: {alamat}</h4>
                                    <div className="w-20 max-h-20">
                                        <img
                                            src={`https://ipfs.io/ipfs/${cidFotoLahan}`}
                                            alt="Upload"
                                        />
                                    </div>
                                    <Link
                                        to="/DetailPeta"
                                        state={{
                                            nomorSTDB,
                                            nama,
                                            alamat,
                                            luasArealKebun,
                                            statusKawasan,
                                            longitude,
                                            latitude,
                                        }}
                                        className="inline-flex w-full justify-center rounded-md border border-transparent shadow-sm px-2 py-1 bg-stone-400 text-base font-medium text-white hover:bg-stone-700 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Detail
                                    </Link>
                                </div>
                            </Popup> */}
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
