import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import useStore from '../store/filterStore'; // Import the Zustand store
import { GetAllDataPemetaanKebun } from '../Services/pemetaanKebunServices';
import { GetAllLegalitasLahan } from '../Services/legalitasLahanServices';
import { LegalitasLahan } from '../types/legalitasLahan';
import { DataPemetaanKebun } from '../types/dataPemetaanKebun';
import { GetAllDataPemetaanHutan } from '../Services/pemetaanHutanServices';
import { DataPemetaanHutan } from '../types/dataPemetaanHutan';
import FormatTanggalJamLabel from '../Components/Elements/Tables/table/FormatTanggalJamLabel';

import 'leaflet-geosearch/dist/geosearch.css';
import LeafletgeoSearch from '../Components/Elements/LeaftletGeoSearch/LeafletgeoSearch';

const pusat: [number, number] = [0.24041105296887577, 110.81003665924074];

const osm = {
    maptiler: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors',
    },
};

const Peta: React.FC = () => {
    const [stdbs, setStdbs] = useState<LegalitasLahan[]>([]);
    const [error, setError] = useState<string | null>(null);
    const selectedCategory = useStore((state) => state.selectedCategory);
    const [dataPemetaan, setDataPemetaan] = useState<DataPemetaanKebun[]>([]);
    const [dataPemetaanHutan, setDataPemetaanHutan] = useState<
        DataPemetaanHutan[]
    >([]);
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

    useEffect(() => {
        const fetchDataPemetaanKebun = async () => {
            try {
                const data = await GetAllDataPemetaanHutan();
                setDataPemetaanHutan(data);
            } catch (error) {
                console.error('Failed to fetch Data Pemetaan Kebun:', error);
            }
        };
        console.log(fetchDataPemetaanKebun());
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

    const combinedData = mergeData(stdbs, dataPemetaan);
    const filteredStdbs = selectedCategory
        ? combinedData.filter((item) => item.statusKawasan === selectedCategory)
        : combinedData;
    const MAPBOX_ACCESS_TOKEN =
        'pk.eyJ1IjoiYWhtYWRtdWphaGlkIiwiYSI6ImNsdzFiaW1ibjA0N3Mya3FqdWFhZXhqc3oifQ.8hMXRQtRBrfZfyl6-kjFLw';
    return (
        <div
            className="leaflet-container2"
            style={{ height: '40vh', width: '100%' }}
        >
            <MapContainer center={pusat} zoom={18}>
                <LeafletgeoSearch />
                {/* <TileLayer
                    url={osm.maptiler.url}
                    attribution={osm.maptiler.attribution}
                /> */}
                <TileLayer
                    url={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`}
                    attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {selectedCategory == null &&
                    dataPemetaanHutan.map((hutan, index) => {
                        // Ensure lat and lng arrays are defined and have the same length
                        const {
                            idHutan,
                            namaSurveyor,
                            nipSurveyor,
                            longitude,
                            latitude,
                            luasHutan,
                            waktuPemetaanHutan,
                        } = hutan;

                        // Log the data before parsing
                        console.log('Parsing latitude:', latitude);
                        console.log('Parsing longitude:', longitude);

                        // Validate and parse JSON data
                        if (latitude && longitude) {
                            try {
                                const latitudes = JSON.parse(
                                    latitude,
                                ) as number[];
                                const longitudes = JSON.parse(
                                    longitude,
                                ) as number[];
                                const coordinates = latitudes.map(
                                    (lat, idx) => [lat, longitudes[idx]],
                                ) as [number, number][];

                                let color = '#02ad05';
                                console.log('cordinat hutan', coordinates);
                                return (
                                    <Polygon
                                        key={index}
                                        positions={coordinates}
                                        pathOptions={{ color: color }}
                                    >
                                        <Popup>
                                            <div>
                                                <h4>id Hutan: {idHutan}</h4>
                                                <h4>
                                                    Nama Dinas: {namaSurveyor}
                                                </h4>
                                                <h4>
                                                    nip dinas: {nipSurveyor}
                                                </h4>
                                                <h4>
                                                    Luas Areal Hutan {luasHutan}{' '}
                                                    Hektar
                                                </h4>
                                                <h4>
                                                    waktu Pemetaan Hutan{' '}
                                                    <FormatTanggalJamLabel
                                                        tanggal={
                                                            waktuPemetaanHutan
                                                        }
                                                    />
                                                </h4>
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

                {filterDataPenerbitan(filteredStdbs).map((stdb, index) => {
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

                    console.log('Parsing latitude kebun:', latitude);
                    console.log('Parsing longitude:', longitude);

                    if (latitude && longitude) {
                        try {
                            const latitudes = JSON.parse(latitude) as number[];
                            const longitudes = JSON.parse(
                                longitude,
                            ) as number[];

                            if (latitudes.length !== longitudes.length) {
                                console.error(
                                    'Latitude and longitude arrays are of different lengths',
                                );
                                return null;
                            }

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

                            console.log('Color:', color);
                            console.log('Coordinates:', coordinates);

                            if (coordinates.length > 0) {
                                return (
                                    <Polygon
                                        key={index}
                                        positions={coordinates}
                                        pathOptions={{ color: color }} // Use the dynamic color
                                    >
                                        <Popup>
                                            <div>
                                                <h4>Nomor STDB: {nomorSTDB}</h4>
                                                <h4>Nama Pemilik: {nama}</h4>
                                                <h4>
                                                    Luas Areal Kebun:{' '}
                                                    {luasArealKebun} Ha
                                                </h4>
                                                <h4>
                                                    Kawasan: {statusKawasan}
                                                </h4>

                                                <div className="w-30 max-h-40">
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
                            } else {
                                console.error('Coordinates array is empty');
                            }
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
