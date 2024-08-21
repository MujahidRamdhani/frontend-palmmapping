import React, { useState, useRef, useEffect } from 'react';
import { TileLayer, FeatureGroup, MapContainer, Polygon } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import './style.css';
import axios from 'axios';
import DefaultLayout from '../Components/Layouts/DefaultLayout';
import Breadcrumb from '../Components/Elements/Breadcrumbs/Breadcrumb';
import useAuthStore from '../store/authStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataPemetaanHutan } from '../types/dataPemetaanHutan';
import * as turf from '@turf/turf';

interface LatLngLiteral {
    lat: number;
    lng: number;
}

interface PolygonLayer {
    id?: number;
    latlngs: LatLngLiteral[];
    color: string;
    kawasan: string;
}

const TambahPemetaan: React.FC = () => {
    const { user } = useAuthStore((state) => state);
    const location = useLocation();
    const navigate = useNavigate();

    const [koordinatAwal, setKoordinatAwal] = useState<LatLngLiteral[]>([]);
    const [dataPemetaanHutan, setDataPemetaanHutan] = useState<
        DataPemetaanHutan[]
    >([]);
    const [lapisanPeta, setLapisanPeta] = useState<PolygonLayer[]>([]);
    const [dataLoaded, setDataLoaded] = useState(false); // Flag to check if data is loaded

    const pusat = { lat: 0.934454024134, lng: 115.199035644999 };
    const ZOOM_LEVEL = 14;
    const mapContainerRef = useRef<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<{ data: DataPemetaanHutan[] }>(
                    'http://localhost:9999/api/pemetaanHutan/GetAllPemetaanHutan',
                );
                const data = response.data.data;

                if (data.length > 0) {
                    const formattedCoordinates = data
                        .map((d) => {
                            const latArray = JSON.parse(d.latitude);
                            const lngArray = JSON.parse(d.longitude);
                            return latArray.map((lat, index) => ({
                                lat: lat,
                                lng: lngArray[index],
                            }));
                        })
                        .flat();

                    setKoordinatAwal(formattedCoordinates);
                    setLapisanPeta([
                        {
                            latlngs: formattedCoordinates,
                            color: 'green',
                            kawasan: 'hutan',
                        },
                    ]);
                }
                setDataLoaded(true); // Pastikan ini dilakukan setelah data diatur
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log('kordinatawal setelah data diambil:', koordinatAwal);
    }, [koordinatAwal]);

    const titikDalamPoligon = (
        titik: LatLngLiteral,
        koordinatAwal: LatLngLiteral[],
    ) => {
        if (koordinatAwal.length < 4) {
            console.error('Invalid polygon: less than 4 points', koordinatAwal);
            return false;
        }

        // Ensure the polygon is closed
        const coordinates = koordinatAwal.map((coord) => [
            coord.lng,
            coord.lat,
        ]);
        if (coordinates.length > 0) {
            coordinates.push(coordinates[0]);
        }

        console.log('Polygon Coordinates:', coordinates); // Logging the coordinates

        try {
            const polygon = turf.polygon([coordinates]);
            const point = turf.point([titik.lng, titik.lat]);
            return turf.booleanPointInPolygon(point, polygon);
        } catch (error) {
            console.error('Error creating polygon:', error);
            return false;
        }
    };

    const tentukanWarnaPoligon = (latlngs: LatLngLiteral[]) => {
        if (!dataLoaded || koordinatAwal.length < 4) {
            console.error(
                'Cannot determine color: data not loaded or initial coordinates are invalid',
                koordinatAwal,
            );
            return { color: 'gray', kawasan: 'invalid kawasan' };
        }

        const semuaTitikDiDalam = latlngs.every((titik) =>
            titikDalamPoligon(titik, koordinatAwal),
        );
        if (semuaTitikDiDalam) {
            console.log('semuaTitikDiDalam');
            return { color: 'red', kawasan: 'didalam kawasan' };
        }

        const salahSatuTitikDiDalam = latlngs.some((titik) =>
            titikDalamPoligon(titik, koordinatAwal),
        );
        if (salahSatuTitikDiDalam) {
            console.log('salah satu titik didalam');
            return { color: 'yellow', kawasan: 'sebagian memasuki kawasan' };
        }

        console.log('diluar');
        return { color: 'blue', kawasan: 'diluar kawasan' };
    };

    const _onCreate = (e: any) => {
        console.log(
            'Mencoba membuat poligon dengan dataLoaded:',
            dataLoaded,
            'dan koordinatAwal:',
            koordinatAwal.length,
        );

        if (!dataLoaded || koordinatAwal.length === 0) {
            console.error('Data belum dimuat atau koordinat awal tidak valid');
            return;
        }

        const { layerType, layer } = e;
        if (layerType === 'polygon') {
            const { _leaflet_id } = layer;
            const latlngs: LatLngLiteral[] = layer.getLatLngs()[0];

            console.log('Koordinat Poligon Baru:', latlngs);
            const { color, kawasan } = tentukanWarnaPoligon(latlngs);

            setLapisanPeta((layers) => [
                ...layers,
                { id: _leaflet_id, latlngs, color, kawasan },
            ]);
        }
    };

    const _onDeleted = (e: any) => {
        const {
            layers: { _layers },
        } = e;
        Object.values(_layers).forEach((layer: any) => {
            const { _leaflet_id } = layer;
            setLapisanPeta((layers) =>
                layers.filter((layer) => layer.id !== _leaflet_id),
            );
        });
    };

    const filteredLapisanPeta = lapisanPeta.filter(
        (layer) => layer.kawasan !== 'hutan',
    );

    const MAPBOX_ACCESS_TOKEN = 'your_mapbox_access_token';

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Pemetaan Lahan" />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="px-2 pb-2 lg:pb-4">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Form Pemetaan Lahan
                        </h3>
                    </div>
                    <div className="leaflet-container2">
                        <MapContainer
                            center={pusat}
                            zoom={ZOOM_LEVEL}
                            ref={mapContainerRef}
                        >
                            <FeatureGroup>
                                {dataLoaded && koordinatAwal.length > 0 && (
                                    <EditControl
                                        position="topright"
                                        onCreated={_onCreate}
                                        onDeleted={_onDeleted}
                                        draw={{
                                            polygon: true,
                                            rectangle: false,
                                            polyline: false,
                                            circle: false,
                                            circlemarker: false,
                                            marker: false,
                                        }}
                                        edit={{
                                            edit: false, // Disable editing
                                            remove: true, // Enable removal
                                        }}
                                    />
                                )}
                            </FeatureGroup>
                            <TileLayer
                                url={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`}
                                attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {lapisanPeta.map((layer, index) => (
                                <Polygon
                                    key={index}
                                    positions={layer.latlngs}
                                    color={layer.color}
                                />
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default TambahPemetaan;
