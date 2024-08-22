import React, { useState, useRef, useEffect } from 'react';
import { TileLayer, FeatureGroup, MapContainer, Polygon } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import './style.css';
import DefaultLayout from '../../../Components/Layouts/DefaultLayout';
import Breadcrumb from '../../../Components/Elements/Breadcrumbs/Breadcrumb';
import useAuthStore from '../../../store/authStore';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as turf from '@turf/turf';
import { DataPemetaanKebun } from '../../../types/dataPemetaanKebun';

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

const FormUpdatePemetaanKebun: React.FC = () => {
    const { user } = useAuthStore((state) => state);
    const location = useLocation();
    const navigate = useNavigate();
    const [newMaps, setNewMaps] = useState<PolygonLayer[]>([]);
    const [koordinatAwal, setKoordinatAwal] = useState<LatLngLiteral[][]>([]);
    const [lapisanPeta, setLapisanPeta] = useState<PolygonLayer[]>([]);
    const [lapisanPetaKebun, setLapisanPetaKebun] = useState<PolygonLayer[]>(
        [],
    );
    const [dataLoaded, setDataLoaded] = useState(false);
    const pusat = { lat: -1.8226668, lng: 116.084616 };
    const ZOOM_LEVEL = 30;
    const mapContainerRef = useRef<any>(null);
    const [mapCenter, setMapCenter] = useState<LatLngLiteral>({
        lat: 0.934454024134,
        lng: 115.199035644999,
    });

    const state = location.state;

    useEffect(() => {
        const fetchDataPemetaanKebun = async () => {
            try {
                const response = await axios.put<{ data: DataPemetaanKebun }>(
                    `https://palmmapping-backend.my.to/api/pemetaanKebun/FindOnePemetaanKebun/${state.customData}`,
                );
                const data = response.data.data;

                const latArray = JSON.parse(data.latitude);
                const lngArray = JSON.parse(data.longitude);

                const coordinates = latArray.map(
                    (lat: number, index: number) => ({
                        lat: lat,
                        lng: lngArray[index],
                    }),
                );

                const newPolygon: PolygonLayer = {
                    latlngs: coordinates,
                    color: 'blue',
                    kawasan: data.kawasan || '',
                };

                setLapisanPetaKebun([newPolygon]);
                setDataLoaded(true);
            } catch (error) {
                console.error('Failed to fetch Data hutan:', error);
            }
        };
        fetchDataPemetaanKebun();
    }, [state.customData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<{ data: any[] }>(
                    'https://palmmapping-backend.my.to/api/pemetaanHutan/GetAllPemetaanHutan',
                );
                const data = response.data.data;

                if (data.length > 0) {
                    const formattedCoordinates = data.map((d) => {
                        const latArray = JSON.parse(d.latitude);
                        const lngArray = JSON.parse(d.longitude);
                        return latArray.map((lat: number, index: number) => ({
                            lat: lat,
                            lng: lngArray[index],
                        }));
                    });

                    setKoordinatAwal(formattedCoordinates);
                    setLapisanPeta(
                        formattedCoordinates.map((coords, index) => ({
                            id: index + 1,
                            latlngs: coords,
                            color: '#02ad05',
                            kawasan: `hutan ${index + 1}`,
                        })),
                    );
                }
                setDataLoaded(true);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const titikDalamPoligon = (
        titik: LatLngLiteral,
        polygonCoords: LatLngLiteral[],
    ) => {
        if (polygonCoords.length < 4) {
            console.error('Invalid polygon: less than 4 points', polygonCoords);
            return false;
        }

        const coordinates = polygonCoords.map((coord) => [
            coord.lng,
            coord.lat,
        ]);
        if (coordinates.length > 0) {
            coordinates.push(coordinates[0]);
        }

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
        if (!dataLoaded || koordinatAwal.length === 0) {
            return { color: 'gray', kawasan: 'invalid kawasan' };
        }

        let semuaTitikDiDalam = false;
        let salahSatuTitikDiDalam = false;

        for (let coords of koordinatAwal) {
            semuaTitikDiDalam = latlngs.every((titik) =>
                titikDalamPoligon(titik, coords),
            );
            salahSatuTitikDiDalam = latlngs.some((titik) =>
                titikDalamPoligon(titik, coords),
            );

            if (semuaTitikDiDalam) {
                console.log('semuaTitikDiDalam');
                return { color: 'red', kawasan: 'didalam kawasan' };
            }

            if (salahSatuTitikDiDalam) {
                console.log('salah satu titik didalam');
                return {
                    color: 'yellow',
                    kawasan: 'sebagian memasuki kawasan',
                };
            }
        }

        console.log('diluar');
        return { color: 'blue', kawasan: 'diluar kawasan' };
    };

    const _onCreate = (e: any) => {
        const { layerType, layer } = e;
        if (layerType === 'polygon') {
            const { _leaflet_id } = layer;
            const latlngs: LatLngLiteral[] = layer.getLatLngs()[0];

            const { color, kawasan } = tentukanWarnaPoligon(latlngs);

            setNewMaps((prevState) => [
                ...prevState,
                { id: _leaflet_id, latlngs, color, kawasan },
            ]);

            setLapisanPetaKebun((prevState) => [
                ...prevState,
                { id: _leaflet_id, latlngs, color, kawasan },
            ]);

            console.log('Polygon created with color:', color);
        }
    };

    const _onEdited = (e: any) => {
        const {
            layers: { _layers },
        } = e;

        const updatedLayers = Object.values(_layers).map((layer: any) => {
            const { _leaflet_id } = layer;
            let latlngs: LatLngLiteral[] = layer.getLatLngs()[0];

            // Ensure the polygon is closed
            if (
                latlngs[0].lat !== latlngs[latlngs.length - 1].lat ||
                latlngs[0].lng !== latlngs[latlngs.length - 1].lng
            ) {
                latlngs.push(latlngs[0]);
            }

            const { color, kawasan } = tentukanWarnaPoligon(latlngs);
            return { id: _leaflet_id, latlngs, color, kawasan };
        });

        setLapisanPetaKebun((prevLayers) => {
            const updatedLapisanPetaKebun = prevLayers.map((layer) => {
                const updatedLayer = updatedLayers.find(
                    (updatedLayer) => updatedLayer.id === layer.id,
                );
                return updatedLayer ? { ...layer, ...updatedLayer } : layer;
            });

            // If new layers were added during the edit, add them to the state
            const newLayers = updatedLayers.filter(
                (updatedLayer) =>
                    !prevLayers.some((layer) => layer.id === updatedLayer.id),
            );

            return [...updatedLapisanPetaKebun, ...newLayers];
        });

        setNewMaps((prevLayers) => {
            const updatedNewMaps = prevLayers.map((layer) => {
                const updatedLayer = updatedLayers.find(
                    (updatedLayer) => updatedLayer.id === layer.id,
                );
                return updatedLayer ? { ...layer, ...updatedLayer } : layer;
            });

            // If new layers were added during the edit, add them to the state
            const newLayers = updatedLayers.filter(
                (updatedLayer) =>
                    !prevLayers.some((layer) => layer.id === updatedLayer.id),
            );

            return [...updatedNewMaps, ...newLayers];
        });
    };

    const _onDeleted = (e: any) => {
        const {
            layers: { _layers },
        } = e;

        const deletedLayerIds = Object.values(_layers).map(
            (layer: any) => layer._leaflet_id,
        );

        setLapisanPetaKebun((prevLayers) =>
            prevLayers.filter(
                (layer) => !deletedLayerIds.includes(layer.id ?? -1),
            ),
        );

        setNewMaps((prevLayers) =>
            prevLayers.filter(
                (layer) => !deletedLayerIds.includes(layer.id ?? -1),
            ),
        );
    };

    const handleSimpan = async () => {
        try {
            for (const map of newMaps) {
                const newLatitudes = JSON.stringify(
                    map.latlngs.map((coord) => coord.lat),
                );
                const newLongitudes = JSON.stringify(
                    map.latlngs.map((coord) => coord.lng),
                );

                const updatedData = {
                    latitude: newLatitudes,
                    longitude: newLongitudes,
                    kawasan: map.kawasan,
                };

                await axios.put(
                    `https://palmmapping-backend.my.to/api/pemetaanKebun/updateKebun/${state.customData}`,
                    updatedData,
                );
            }

            alert('Data updated successfully!');
        } catch (error) {
            console.error('Failed to update data:', error);
            alert('Failed to update data.');
        }
    };

    return (
        <DefaultLayout>
            <div>
                <Breadcrumb pageName="Update Form Pemetaan Kebun" />
                <h1 className="pt-4 pb-4">
                    Form update data kebun kawasan hutan
                </h1>
            </div>
            <div>
                <div className="flex justify-center mt-5">
                    <div className="w-full sm:w-96 bg-white p-6 rounded-lg shadow-md">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold mb-2">
                                Map Center
                            </h2>
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold">Latitude:</span>
                                <span>{mapCenter.lat}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold">
                                    Longitude:
                                </span>
                                <span>{mapCenter.lng}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <MapContainer
                    center={pusat}
                    zoom={ZOOM_LEVEL}
                    style={{ height: '500px' }}
                    ref={mapContainerRef}
                >
                    <FeatureGroup>
                        <EditControl
                            position="topright"
                            onCreated={_onCreate}
                            onEdited={_onEdited}
                            onDeleted={_onDeleted}
                            draw={{
                                rectangle: false,
                                polyline: false,
                                circle: false,
                                circlemarker: false,
                                marker: false,
                            }}
                        />
                    </FeatureGroup>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {lapisanPeta.map((layer, index) => (
                        <Polygon
                            key={`lapisanPeta-${index}`}
                            positions={layer.latlngs}
                            color={layer.color}
                        />
                    ))}
                    {lapisanPetaKebun.map((layer, index) => (
                        <Polygon
                            key={`lapisanPetaKebun-${index}`}
                            positions={layer.latlngs}
                            color={layer.color}
                        />
                    ))}
                </MapContainer>
            </div>
            <div className="flex justify-center mt-4">
                <button
                    onClick={handleSimpan}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Simpan
                </button>
            </div>
        </DefaultLayout>
    );
};

export default FormUpdatePemetaanKebun;
