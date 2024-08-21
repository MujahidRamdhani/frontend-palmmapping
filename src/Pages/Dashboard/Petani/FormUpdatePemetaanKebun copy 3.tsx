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
                    `http://localhost:9999/api/pemetaanKebun/FindOnePemetaanKebun/${state.customData}`,
                );
                const data = response.data.data;

                const latArray = JSON.parse(data.latitude);
                const lngArray = JSON.parse(data.longitude);
                const kawasan = data.statusKawasan || '';
                let color = 'blue';
                if (kawasan === 'sebagian memasuki kawasan') {
                    color = 'yellow';
                } else if (kawasan === 'didalam kawasan') {
                    color = 'red';
                }

                const coordinates = latArray.map(
                    (lat: number, index: number) => ({
                        lat: lat,
                        lng: lngArray[index],
                    }),
                );

                const newPolygon: PolygonLayer = {
                    latlngs: coordinates,
                    color: color,
                    kawasan: data.statusKawasan || '',
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
                    'http://localhost:9999/api/pemetaanHutan/GetAllPemetaanHutan',
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

        // First update setLapisanPetaKebun state
        setLapisanPetaKebun((prevLayers) => {
            const updatedLapisanPetaKebun = prevLayers.map((layer) => {
                const updatedLayer = updatedLayers.find(
                    (updatedLayer) => updatedLayer.id === layer.id,
                );
                return updatedLayer ? { ...layer, ...updatedLayer } : layer;
            });

            const newLayers = updatedLayers.filter(
                (updatedLayer) =>
                    !prevLayers.some((layer) => layer.id === updatedLayer.id),
            );

            return [...updatedLapisanPetaKebun, ...newLayers];
        });

        // Then update setNewMaps state
        setNewMaps((prevLayers) => {
            const updatedNewMaps = prevLayers.map((layer) => {
                const updatedLayer = updatedLayers.find(
                    (updatedLayer) => updatedLayer.id === layer.id,
                );
                return updatedLayer ? { ...layer, ...updatedLayer } : layer;
            });

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

        const deletedLayerIds = Object.keys(_layers).map((layerId) =>
            parseInt(layerId),
        );

        setNewMaps((prevState) =>
            prevState.filter((layer) => !deletedLayerIds.includes(layer.id!)),
        );

        setLapisanPetaKebun((prevState) =>
            prevState.filter((layer) => !deletedLayerIds.includes(layer.id!)),
        );
    };

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
                            center={mapCenter}
                            zoom={ZOOM_LEVEL}
                            ref={mapContainerRef}
                        >
                            <FeatureGroup>
                                {dataLoaded && (
                                    <EditControl
                                        position="topright"
                                        onCreated={_onCreate}
                                        onEdited={_onEdited}
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
                                            edit: {
                                                selectedPathOptions: {
                                                    maintainColor: true,
                                                    opacity: 0.3,
                                                },
                                            },
                                            remove: true,
                                        }}
                                    />
                                )}
                                {lapisanPetaKebun.map((layer, index) => (
                                    <Polygon
                                        key={layer.id}
                                        positions={layer.latlngs}
                                        color={layer.color}
                                    />
                                ))}
                            </FeatureGroup>
                            <FeatureGroup>
                                {lapisanPeta.map((layer, index) => (
                                    <Polygon
                                        key={layer.id}
                                        positions={layer.latlngs}
                                        color={layer.color}
                                    />
                                ))}
                            </FeatureGroup>

                            <TileLayer
                                url={
                                    'https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=fXmTwJM642uPLZiwzhA1'
                                }
                                attribution={
                                    '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                }
                            />
                        </MapContainer>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default FormUpdatePemetaanKebun;
