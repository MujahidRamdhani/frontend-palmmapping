import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import useStore from '../store/filterStore'; // Import the Zustand store
import { GetAllDataPemetaanKebun } from '../Services/pemetaanKebunServices';
import { GetAllLegalitasLahan } from '../Services/legalitasLahanServices';
import { LegalitasLahan } from '../types/legalitasLahan';
import { DataPemetaanKebun } from '../types/dataPemetaanKebun';

const pusat: [number, number] = [0.24041105296887577, 110.81003665924074];

const osm = {
    maptiler: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors',
    },
};

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
    const [stdbs, setStdbs] = useState<LegalitasLahan[]>([]);
    const [error, setError] = useState<string | null>(null);
    const selectedCategory = useStore((state) => state.selectedCategory);
    const [dataPemetaan, setDataPemetaan] = useState<DataPemetaanKebun[]>([]);

    useEffect(() => {
        const fetchSTDBS = async () => {
            try {
                const data = await GetAllLegalitasLahan();
                setStdbs(data);
                console.log('data legalitas', data);
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
                console.log('data pemetaan', data);
            } catch (error) {
                console.error('Failed to fetch Data Pemetaan Kebun:', error);
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

    const filterDataPenerbitan = (data: LegalitasLahan[]) => {
        return data.filter(
            (item: LegalitasLahan) => item.nipPenerbitLegalitas !== 'False',
        );
    };

    const filteredStdbs = selectedCategory
        ? mergeData(stdbs, dataPemetaan).filter(
              (item) => item.statusKawasan === selectedCategory,
          )
        : stdbs;
    const combinedData = mergeData(stdbs, dataPemetaan);
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
                        // Ensure lat and lng arrays are defined and have the same length
                        if (
                            !layer.lat ||
                            !layer.lng ||
                            layer.lat.length !== layer.lng.length
                        ) {
                            return null;
                        }

                        // Create coordinates array
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

                {filterDataPenerbitan(combinedData).map((stdb, index) => {
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

                    // Log the data before parsing
                    console.log('Parsing latitude:', latitude);
                    console.log('Parsing longitude:', longitude);

                    // Validate and parse JSON data
                    if (latitude && longitude) {
                        try {
                            const latitudes = JSON.parse(latitude) as number[];
                            const longitudes = JSON.parse(
                                longitude,
                            ) as number[];
                            const coordinates = latitudes.map((lat, idx) => [
                                lat,
                                longitudes[idx],
                            ]) as [number, number][];

                            let color = '';
                            if (statusKawasan === 'didalam kawasan') {
                                color = '#FF0000';
                            } else if (
                                statusKawasan === 'sebagian memasuki kawasan'
                            ) {
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
                                            <h4>Nomor STDB: {nomorSTDB}</h4>
                                            <h4>Nama Pemilik: {nama}</h4>
                                            <h4>
                                                Luas Areal Kebun:{' '}
                                                {luasArealKebun} Ha
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
                                    </Popup>
                                </Polygon>
                            );
                        } catch (e) {
                            console.error('JSON parsing error:', e);
                        }
                    } else {
                        console.error('Latitude or longitude is undefined');
                    }

                    return null;
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
