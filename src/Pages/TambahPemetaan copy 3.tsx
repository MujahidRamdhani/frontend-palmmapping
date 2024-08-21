import React, { useState, useRef, useEffect } from 'react';
import { TileLayer, FeatureGroup, MapContainer, Polygon } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import osm from './osm-providers';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import './style.css';
import L, {
    LatLngLiteral,
    Map,
    Polygon as LeafletPolygon,
    Layer,
} from 'leaflet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, useWatch, Controller } from 'react-hook-form';
import { z } from 'zod';
import Button from '../Components/Elements/Button/Button';
import InputDashboard from '../Components/Elements/Input/InputDashboard';
import DefaultLayout from '../Components/Layouts/DefaultLayout';
import Breadcrumb from '../Components/Elements/Breadcrumbs/Breadcrumb';
import { useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import axios, { AxiosError } from 'axios';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { useNavigate } from 'react-router-dom';
import * as turf from '@turf/turf';
import useTambahPemetaanKebunForm from '../Hooks/useTambahPemetaanKebunForm';
import { GetAllDataPemetaanHutan } from '../Services/pemetaanHutanServices';
import { DataPemetaanHutan } from '../types/dataPemetaanHutan';
interface PolygonLayer {
    id?: number;
    latlngs: LatLngLiteral[];
    color: string;
    kawasan: string;
}

interface Layer {
    _leaflet_id: number;
    editing: {
        latlngs: LatLngLiteral[][];
    };
}

const koordinatAwal: LatLngLiteral[] = [
    { lat: 0.24942319291277143, lng: 110.81016540527344 },
    { lat: 0.24272846096002496, lng: 110.82458496093751 },
    { lat: 0.23689202526852574, lng: 110.81445693969728 },
    { lat: 0.23843696436976053, lng: 110.80209732055665 },
    { lat: 0.24513169845733346, lng: 110.79849243164064 },
    { lat: 0.24976651240907666, lng: 110.80295562744142 },
    { lat: 0.24873655389330432, lng: 110.80810546875 },
];

const TambahPemetaan: React.FC = () => {
    const { user } = useAuthStore((state) => state);
    const location = useLocation();
    const state = location.state;
    const navigate = useNavigate();
    const [dataPeta, setDataPeta] = useState<LatLngLiteral>([]);
    const [pusat, setPusat] = useState<LatLngLiteral>({
        lat: 0.2362,
        lng: 110.7718,
    });

    const [dataPemetaanHutan, setDataPemetaanHutan] = useState<
        DataPemetaanHutan[]
    >([]);

    useEffect(() => {
        const fetchDataPemetaanKebun = async () => {
            try {
                const data = await GetAllDataPemetaanHutan();
                setDataPemetaanHutan(data);
            } catch (error) {
                console.error('Failed to fetch Data Pemetaan Kebun:', error);
            }
        };
        console.log('data hutan', fetchDataPemetaanKebun());
        fetchDataPemetaanKebun();
    }, []);
    console.log('data hutan 2', dataPemetaanHutan);

    const [lapisanPeta, setLapisanPeta] = useState<PolygonLayer[]>([
        { latlngs: koordinatAwal, color: 'green', kawasan: 'hutan' },
    ]);
    const [luas, setLuas] = useState('');

    // const { register, setValue, handleSubmit } = useForm();
    // console.log(state);
    useEffect(() => {
        // Filter out layers where kawasan is 'hutan'
        const filteredLayers = lapisanPeta.filter(
            (layer) => layer.kawasan !== 'hutan',
        );
        const jsonString = JSON.stringify(filteredLayers);

        // Determine the kawasan value
        let kawasan = '';
        if (
            filteredLayers.some((layer) => layer.kawasan === 'didalam kawasan')
        ) {
            kawasan = 'didalam kawasan';
        } else if (
            filteredLayers.some(
                (layer) => layer.kawasan === 'sebagian memasuki kawasan',
            )
        ) {
            kawasan = 'sebagian memasuki kawasan';
        } else if (
            filteredLayers.some((layer) => layer.kawasan === 'diluar kawasan')
        ) {
            kawasan = 'diluar kawasan';
        }

        // Store the filtered layers as a JSON string
        let DataLatitude = jsonString;

        // Parse the JSON string back to an object
        const latlngs = JSON.parse(DataLatitude);

        // Check if there are any layers and log them
        let dataLat: number[] = [];
        let dataIng: number[] = [];

        if (latlngs.length > 0) {
            latlngs.forEach((layer: any) => {
                console.log(layer.latlngs);
                setDataPeta(layer.latlngs);
                layer.latlngs.forEach((innerLayer: any) => {
                    dataLat.push(innerLayer.lat);
                    console.log('lat', dataLat);
                    dataIng.push(innerLayer.lng);
                    console.log('lng', dataIng);
                });
            });
        }

        if (latlngs.length > 0) {
            latlngs.forEach((layer: any) => {
                console.log(layer.latlngs);

                const positions: [number, number][] = []; // Array to hold positions

                layer.latlngs.forEach((innerLayer: any) => {
                    const lat = innerLayer.lat;
                    const lng = innerLayer.lng;
                    positions.push([lng, lat]); // Push the coordinate pair
                });

                if (positions.length > 0) {
                    // Ensure the polygon is closed
                    if (
                        positions[0][0] !==
                            positions[positions.length - 1][0] ||
                        positions[0][1] !== positions[positions.length - 1][1]
                    ) {
                        positions.push(positions[0]);
                    }

                    const area = turf.area(turf.polygon([positions]));
                    const readableArea = `${(area / 10000).toFixed(2)} ha`;
                    setLuas(readableArea);
                }
            });
        }
        console.log('luass', luas);

        // Convert the arrays to strings
        const dataLatString = JSON.stringify(dataLat);
        const dataIngString = JSON.stringify(dataIng);

        // Use the setValue function with string arguments

        if (user !== null) {
            setValue('latitude', dataLatString);
            setValue('longitude', dataIngString);
            setValue('statusKawasan', kawasan);
            setValue('luasLahan', luas);
            setValue('nomorSTDB', state.customData);
        }
    }, [lapisanPeta, luas]);

    const ZOOM_LEVEL = 14;
    const MapContainerRef = useRef<any>(null);

    const titikDalamPoligon = (
        titik: LatLngLiteral,
        vs: LatLngLiteral[],
    ): boolean => {
        const x = titik.lat,
            y = titik.lng;
        let diDalam = false;
        for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            const xi = vs[i].lat,
                yi = vs[i].lng;
            const xj = vs[j].lat,
                yj = vs[j].lng;
            const intersect =
                yi > y !== yj > y &&
                x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
            if (intersect) diDalam = !diDalam;
        }
        return diDalam;
    };

    const garisBersinggunganGaris = (
        garis1: [LatLngLiteral, LatLngLiteral],
        garis2: [LatLngLiteral, LatLngLiteral],
    ): boolean => {
        const det =
            (garis2[1].lng - garis2[0].lng) * (garis1[1].lat - garis1[0].lat) -
            (garis2[1].lat - garis2[0].lat) * (garis1[1].lng - garis1[0].lng);
        if (det === 0) return false;
        const lambda =
            ((garis2[1].lat - garis2[0].lat) * (garis2[1].lng - garis1[0].lng) +
                (garis2[0].lng - garis2[1].lng) *
                    (garis2[1].lat - garis1[0].lat)) /
            det;
        const gamma =
            ((garis1[0].lat - garis1[1].lat) * (garis2[1].lng - garis1[0].lng) +
                (garis1[1].lng - garis1[0].lng) *
                    (garis2[1].lat - garis1[0].lat)) /
            det;
        return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
    };

    const poligonBersinggunganPoligon = (
        poly1: LatLngLiteral[],
        poly2: LatLngLiteral[],
    ): boolean => {
        for (let i = 0; i < poly1.length; i++) {
            for (let j = 0; j < poly2.length; j++) {
                if (
                    garisBersinggunganGaris(
                        [poly1[i], poly1[(i + 1) % poly1.length]],
                        [poly2[j], poly2[(j + 1) % poly2.length]],
                    )
                ) {
                    return true;
                }
            }
        }
        return false;
    };

    const tentukanWarnaPoligon = (
        poligon: LatLngLiteral[],
    ): { color: string; kawasan: string } => {
        const semuaTitikDiDalam = poligon.every((titik) =>
            titikDalamPoligon(titik, koordinatAwal),
        );

        if (semuaTitikDiDalam) {
            return { color: 'red', kawasan: 'didalam kawasan' };
        }

        const salahSatuTitikDiDalam = poligon.some((titik) =>
            titikDalamPoligon(titik, koordinatAwal),
        );
        if (salahSatuTitikDiDalam) {
            return { color: 'yellow', kawasan: 'sebagian memasuki kawasan' };
        }

        return { color: 'blue', kawasan: 'diluar kawasan' };
    };

    const _onCreate = (e: any) => {
        const { layerType, layer } = e;
        if (layerType === 'polygon') {
            const { _leaflet_id } = layer;
            const latlngs: LatLngLiteral[] = layer.getLatLngs()[0];
            const { color, kawasan } = tentukanWarnaPoligon(latlngs);
            setLapisanPeta((layers) => [
                ...layers,
                { id: _leaflet_id, latlngs, color, kawasan },
            ]);
        }
    };

    const _onEdited = (e: any) => {
        const {
            layers: { _layers },
        } = e;
        Object.values(_layers).forEach((layer: any) => {
            const { _leaflet_id, editing } = layer as Layer;
            const latlngs: LatLngLiteral[] = editing.latlngs[0];
            const { color, kawasan } = tentukanWarnaPoligon(latlngs);
            setLapisanPeta((layers) =>
                layers.map((layer) =>
                    layer.id === _leaflet_id
                        ? { ...layer, latlngs, color, kawasan }
                        : layer,
                ),
            );
        });
    };

    const _onDeleted = (e: any) => {
        const {
            layers: { _layers },
        } = e;
        Object.values(_layers).forEach((layer: any) => {
            const { _leaflet_id } = layer as Layer;
            setLapisanPeta((layers) =>
                layers.filter((layer) => layer.id !== _leaflet_id),
            );
        });
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        onSubmit,
        setValue,
    } = useTambahPemetaanKebunForm();

    const filteredLapisanPeta = lapisanPeta.filter(
        (layer) => layer.kawasan !== 'hutan',
    );

    const MAPBOX_ACCESS_TOKEN =
        'pk.eyJ1IjoiYWhtYWRtdWphaGlkIiwiYSI6ImNsdzFiaW1ibjA0N3Mya3FqdWFhZXhqc3oifQ.8hMXRQtRBrfZfyl6-kjFLw';
    return (
        <>
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
                            {filteredLapisanPeta.length === 0 ? (
                                <MapContainer
                                    center={pusat}
                                    zoom={ZOOM_LEVEL}
                                    ref={MapContainerRef}
                                >
                                    <FeatureGroup>
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
                                                edit: false, // Disable editing
                                                remove: true, // Enable removal
                                            }}
                                        />
                                    </FeatureGroup>
                                    <TileLayer
                                        url={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`}
                                        attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    {lapisanPeta.map((layer, index) => (
                                        <Polygon
                                            key={index}
                                            positions={layer.latlngs}
                                            pathOptions={{ color: layer.color }}
                                        />
                                    ))}
                                </MapContainer>
                            ) : (
                                <MapContainer
                                    center={pusat}
                                    zoom={ZOOM_LEVEL}
                                    ref={MapContainerRef}
                                >
                                    <FeatureGroup>
                                        <EditControl
                                            position="topright"
                                            onDeleted={_onDeleted}
                                            draw={{
                                                polygon: false,
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
                                    </FeatureGroup>

                                    <TileLayer
                                        url={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`}
                                        attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    {lapisanPeta.map((layer, index) => (
                                        <Polygon
                                            key={index}
                                            positions={layer.latlngs}
                                            pathOptions={{ color: layer.color }}
                                        />
                                    ))}
                                </MapContainer>
                            )}
                        </div>

                        {/* {statusKawasan !== 'diluar kawasan' && simpanPeta !== '[]' && ( */}

                        {filteredLapisanPeta.length === 0 ? 'tidak ada' : 'ada'}

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

                            <Button isSubmitting={isSubmitting}>Kirim</Button>
                            {errors.root && (
                                <div className="text-red-500">
                                    {errors.root.message}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </DefaultLayout>
        </>
    );
};

export default TambahPemetaan;
