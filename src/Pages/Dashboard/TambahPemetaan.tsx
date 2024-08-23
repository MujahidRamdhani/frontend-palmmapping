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
import useTambahPemetaanKebunForm from '../Hooks/useTambahPemetaanKebunForm';
import Button from '../Components/Elements/Button/Button';
import InputDashboard from '../Components/Elements/Input/InputDashboard';
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
    const [newMaps, setNewMaps] = useState<PolygonLayer[]>([]);
    const [koordinatAwal, setKoordinatAwal] = useState<LatLngLiteral[][]>([]);
    const [dataPemetaanHutan, setDataPemetaanHutan] = useState<
        DataPemetaanHutan[]
    >([]);
    const [lapisanPeta, setLapisanPeta] = useState<PolygonLayer[]>([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [dataPeta, setDataPeta] = useState<LatLngLiteral>([]);
    const pusat = { lat: -1.8226668, lng: 116.084616 };
    const ZOOM_LEVEL = 30;
    const mapContainerRef = useRef<any>(null);
    const [mapCenter, setMapCenter] = useState<LatLngLiteral>({
        lat: 0.934454024134,
        lng: 115.199035644999,
    });
    const [latInput, setLatInput] = useState<string>('');
    const [lngInput, setLngInput] = useState<string>('');
    const [luas, setLuas] = useState('');
    const [dataReset, setDataReset] = useState(false);
    const state = location.state;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        onSubmit,
        setValue,
    } = useTambahPemetaanKebunForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<{ data: DataPemetaanHutan[] }>(
                    'https://palmmapping-backend.my.to/api/pemetaanHutan/GetAllPemetaanHutan',
                );
                const data = response.data.data;

                if (data.length > 0) {
                    const formattedCoordinates = data.map((d) => {
                        const latArray = JSON.parse(d.latitude);
                        const lngArray = JSON.parse(d.longitude);
                        return latArray.map((lat, index) => ({
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

    useEffect(() => {
        if (dataReset) {
            reset();
            reset({ latitude: '' });
        } else {
            if (newMaps.length > 0) {
                const filteredLayers = newMaps.filter(
                    (layer) => layer.kawasan !== 'hutan kawasan',
                );

                const dataLat = filteredLayers.flatMap((layer) =>
                    layer.latlngs.map((coord) => coord.lat),
                );
                const dataIng = filteredLayers.flatMap((layer) =>
                    layer.latlngs.map((coord) => coord.lng),
                );

                const dataLatString = JSON.stringify(dataLat);
                const dataIngString = JSON.stringify(dataIng);

                const kawasan =
                    filteredLayers.length > 0 ? filteredLayers[0].kawasan : '';
                const area =
                    filteredLayers.length > 0
                        ? turf.area(
                              turf.polygon([
                                  filteredLayers[0].latlngs.map((coord) => [
                                      coord.lng,
                                      coord.lat,
                                  ]),
                              ]),
                          )
                        : 0;
                const readableArea = `${(area / 10000).toFixed(2)}`;

                setLuas(readableArea);

                setValue('latitude', dataLatString);
                setValue('longitude', dataIngString);
                setValue('statusKawasan', kawasan);
                setValue('luasLahan', readableArea);
                setValue('nomorSTDB', state.customData);
            }
        }
    }, [newMaps]);

    useEffect(() => {
        console.log('kordinatawal setelah data diambil:', koordinatAwal);
    }, [koordinatAwal]);

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

        console.log('Polygon Coordinates:', coordinates);

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
            console.error(
                'Cannot determine color: data not loaded or initial coordinates are invalid',
                koordinatAwal,
            );
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
            let latlngs: LatLngLiteral[] = layer.getLatLngs()[0];

            // Ensure the polygon is closed
            if (
                latlngs[0].lat !== latlngs[latlngs.length - 1].lat ||
                latlngs[0].lng !== latlngs[latlngs.length - 1].lng
            ) {
                latlngs.push(latlngs[0]);
            }

            console.log('Koordinat Poligon Baru:', latlngs);
            const { color, kawasan } = tentukanWarnaPoligon(latlngs);

            const newLayer = { id: _leaflet_id, latlngs, color, kawasan };

            setLapisanPeta((layers) => [...layers, newLayer]);

            if (kawasan !== 'hutan kawasan') {
                setNewMaps((prevNewMaps) => [...prevNewMaps, newLayer]);
            }
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

        setLapisanPeta((prevLayers) => {
            const hutanLayers = prevLayers.filter((layer) =>
                layer.kawasan.startsWith('hutan'),
            );
            const nonHutanUpdatedLayers = updatedLayers.filter(
                (layer) => !layer.kawasan.startsWith('hutan'),
            );

            const updatedLapisanPeta = prevLayers
                .filter(
                    (layer) =>
                        !nonHutanUpdatedLayers.some(
                            (updatedLayer) => updatedLayer.id === layer.id,
                        ),
                )
                .concat(nonHutanUpdatedLayers);

            return updatedLapisanPeta.concat(hutanLayers);
        });

        const newNonHutanLayers = updatedLayers.filter(
            (layer) => layer.kawasan !== 'hutan kawasan',
        );
        setNewMaps(newNonHutanLayers);
    };

    useEffect(() => {
        if (dataReset) {
            reset({ latitude: '' });
        }
    }, [dataReset]);

    const _onDeleted = (e: any) => {
        setValue('latitude', '');
        const {
            layers: { _layers },
        } = e;
        Object.values(_layers).forEach((layer: any) => {
            const { _leaflet_id } = layer;
            setLapisanPeta((layers) =>
                layers.filter((layer) => layer.id !== _leaflet_id),
            );
            setNewMaps((newMaps) =>
                newMaps.filter((layer) => layer.id !== _leaflet_id),
            );
        });
    };

    const MAPBOX_ACCESS_TOKEN =
        'pk.eyJ1IjoiYWhtYWRtdWphaGlkIiwiYSI6ImNsdzFiaW1ibjA0N3Mya3FqdWFhZXhqc3oifQ.8hMXRQtRBrfZfyl6-kjFLw';
    const handleCenterChange = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('Center changed:', mapCenter);
        const lat = parseFloat(latInput);
        const lng = parseFloat(lngInput);
        if (!isNaN(lat) && !isNaN(lng)) {
            setMapCenter({ lat, lng });
            if (mapContainerRef.current) {
                mapContainerRef.current.setView({ lat, lng }, ZOOM_LEVEL);
            }
        } else {
            alert('Invalid coordinates. Please enter valid numbers.');
        }
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
                    <div className="py-4 px-6.5 flex items-center">
                        <form
                            onSubmit={handleCenterChange}
                            className="flex items-center w-full"
                        >
                            <div className="flex flex-grow items-center">
                                <div className="flex-1 pr-2">
                                    <label className="block text-black dark:text-white">
                                        Latitude:
                                    </label>
                                    <input
                                        type="text"
                                        value={latInput}
                                        onChange={(e) =>
                                            setLatInput(e.target.value)
                                        }
                                        className="w-full border border-stroke px-4 py-2"
                                        placeholder="Enter latitude"
                                    />
                                </div>
                                <div className="flex-1 pl-2">
                                    <label className="block text-black dark:text-white">
                                        Longitude:
                                    </label>
                                    <input
                                        type="text"
                                        value={lngInput}
                                        onChange={(e) =>
                                            setLngInput(e.target.value)
                                        }
                                        className="w-full border border-stroke px-4 py-2"
                                        placeholder="Enter longitude"
                                    />
                                </div>
                                <div className="ml-4 flex-shrink-0 flex items-center">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded mt-6"
                                    >
                                        Set Center
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="leaflet-container2">
                        <MapContainer
                            center={mapCenter}
                            zoom={ZOOM_LEVEL}
                            ref={mapContainerRef}
                        >
                            <FeatureGroup>
                                {dataLoaded && koordinatAwal.length > 0 && (
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
                                            edit: false,
                                            remove: true,
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
                <div className="mx-4 mb-2">
                    <form className="" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mt-6">
                            <label
                                className="mb-3 block text-black dark:text-white"
                                htmlFor="latitude"
                            >
                                Data Latitude
                            </label>
                            <textarea
                                id="latitude"
                                {...register('latitude')}
                                rows={2}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                disabled
                            ></textarea>
                            {errors.latitude && (
                                <div className="text-red-500">
                                    {errors.latitude.message}
                                </div>
                            )}
                        </div>
                        <div className="mt-6">
                            <label
                                className="mb-3 block text-black dark:text-white"
                                htmlFor="longitude"
                            >
                                Data longitude
                            </label>
                            <textarea
                                id="longitude"
                                {...register('longitude')}
                                rows={3}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                disabled
                            ></textarea>
                            {errors.longitude && (
                                <div className="text-red-500">
                                    {errors.longitude.message}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-row">
                            <div className="w-5/12">
                                <InputDashboard
                                    label="Status Kawasan"
                                    type="text"
                                    id="statusKawasan"
                                    register={register}
                                    errors={errors}
                                    disabled
                                />
                            </div>
                            <div className="w-5/12 ml-auto flex">
                                <InputDashboard
                                    label="Luas Lahan"
                                    type="text"
                                    id="luasLahan"
                                    register={register}
                                    errors={errors}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="">
                            <InputDashboard
                                label="nomorSTDB"
                                type="text"
                                id="nomorSTDB"
                                register={register}
                                errors={errors}
                            />
                            <InputDashboard
                                label="Id Pemetaan Kebun"
                                type="text"
                                id="idPemetaanKebun"
                                register={register}
                                errors={errors}
                            />
                            <div className="flex  w-3"></div>
                        </div>

                        <Button width="full" isSubmitting={isSubmitting}>
                            Kirim
                        </Button>
                        {errors.root && (
                            <div className="text-red-500">
                                {errors.root.message}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default TambahPemetaan;
