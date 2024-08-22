import React, { useState, useRef, useEffect, useMemo } from 'react';
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
import InputDashboard from '../../../Components/Elements/Input/InputDashboard';
import useTambahPemetaanKebunForm from '../../../Hooks/useTambahPemetaanKebunForm';
import Button from '../../../Components/Elements/Button/Button';
import useUpdatePemetaanKebunForm from '../../../Hooks/useUpdatePemetaankebunForm';

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
    const [dataDetelete, setDataDetelete] = useState(false);
    const pusat = { lat: -1.8226668, lng: 116.084616 };
    const ZOOM_LEVEL = 30;
    const mapContainerRef = useRef<any>(null);
    const [mapCenter, setMapCenter] = useState<LatLngLiteral>({
        lat: 0.934454024134,
        lng: 115.199035644999,
    });
    const [mapKey, setMapKey] = useState(0);
    const state = location.state;
    const [renderTrigger, setRenderTrigger] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        onSubmit,
        setValue,
    } = useUpdatePemetaanKebunForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch kebun data
                const kebunResponse = await axios.put<{
                    data: DataPemetaanKebun;
                }>(
                    `https://palmmapping-backend.my.to/api/pemetaanKebun/FindOnePemetaanKebun/${state.customData}`,
                );
                const kebunData = kebunResponse.data.data;

                const latArrayKebun = JSON.parse(kebunData.latitude);
                const lngArrayKebun = JSON.parse(kebunData.longitude);
                const kawasanKebun = kebunData.statusKawasan || '';
                let colorKebun = 'blue';
                if (kawasanKebun === 'sebagian memasuki kawasan') {
                    colorKebun = 'yellow';
                } else if (kawasanKebun === 'didalam kawasan') {
                    colorKebun = 'red';
                }

                const coordinatesKebun = latArrayKebun.map(
                    (lat: number, index: number) => ({
                        lat: lat,
                        lng: lngArrayKebun[index],
                    }),
                );

                const newPolygonKebun: PolygonLayer = {
                    latlngs: coordinatesKebun,
                    color: colorKebun,
                    kawasan: kebunData.statusKawasan || '',
                };

                setValue('statusKawasan', kawasanKebun);
                setValue('latitude', kebunData.latitude);
                setValue('longitude', kebunData.longitude);
                setValue('luasLahan', kebunData.luasKebun);
                setValue('nomorSTDB', state.customData);
                setValue('idPemetaanKebun', kebunData.idPemetaanKebun);
                setValue('waktuPemetaanKebun', kebunData.waktuPemetaanKebun);
                setValue('waktuVerifikator', kebunData.waktuVerifikator);
                setLapisanPetaKebun([newPolygonKebun]);

                // Fetch hutan data
                const hutanResponse = await axios.get<{ data: any[] }>(
                    'https://palmmapping-backend.my.to/api/pemetaanHutan/GetAllPemetaanHutan',
                );
                const hutanData = hutanResponse.data.data;

                if (hutanData.length > 0) {
                    const formattedCoordinates = hutanData.map((d) => {
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
                            kawasan: `hutan`,
                        })),
                    );
                }

                setDataLoaded(true);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, [state.customData]);

    useEffect(() => {
        console.log('layer2', newMaps);
        console.log('dateDetelete', dataDetelete);
        if (dataDetelete === false) {
            if (newMaps.length > 0) {
                const filteredLayers = newMaps.filter(
                    (layer) => layer.kawasan !== 'hutan',
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

                setValue('latitude', dataLatString);
                setValue('longitude', dataIngString);
                setValue('statusKawasan', kawasan);
                setValue('luasLahan', readableArea);
                setValue('nomorSTDB', state.customData);
                setValue('nomorSTDB', state.customData);

                console.log('tampil');
            }
        } else {
            reset({
                latitude: '',
                longitude: '',
                statusKawasan: '',
                luasLahan: '',
            });
        }
    }, [newMaps, dataDetelete]);

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
        setDataDetelete(false);

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

            setLapisanPetaKebun((layers) => [...layers, newLayer]);

            if (kawasan !== 'hutan') {
                setNewMaps((prevNewMaps) => [...prevNewMaps, newLayer]);
            }
        }
    };

    const _onEdited = (e: any) => {
        const {
            layers: { _layers },
        } = e;
        setDataDetelete(false);
        const updatedLayers = Object.values(_layers).map((layer: any) => {
            const { _leaflet_id } = layer;
            let latlngs: LatLngLiteral[] = layer.getLatLngs()[0];

            // Ensure the polygon is closed
            if (
                latlngs[0].lat !== latlngs[latlngs.length - 1].lat ||
                latlngs[0].lng !== latlngs[latlngs.length - 1].lng
            ) {
                latlngs = [...latlngs, latlngs[0]]; // Create a new array to avoid mutation
            }

            const { color, kawasan } = tentukanWarnaPoligon(latlngs);
            return { id: _leaflet_id, latlngs, color, kawasan };
        });

        setLapisanPetaKebun([]);

        setLapisanPetaKebun((prevLayers) => {
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
            (layer) => layer.kawasan !== 'hutan',
        );
        setNewMaps(newNonHutanLayers);

        // Force re-render
        setRenderTrigger((prev) => !prev);
        setMapKey((prevKey) => prevKey + 1);
    };

    const _onDeleted = (e: any) => {
        setDataDetelete(true);
        const {
            layers: { _layers },
        } = e;
        reset({
            latitude: '',
            longitude: '',
            statusKawasan: '',
            luasLahan: '',
        });

        Object.values(_layers).forEach((layer: any) => {
            console.log('Layer ID:', layer._leaflet_id);
        });

        const deletedLayerIds = Object.keys(_layers).map((layerId) =>
            parseInt(layerId, 10),
        );

        setNewMaps((prevState) =>
            prevState.filter((layer) => {
                if (layer.kawasan === 'hutan') {
                    return true; // Preserve hutan layers
                }
                return !deletedLayerIds.includes(layer.id!);
            }),
        );

        setLapisanPetaKebun((prevState) =>
            prevState.filter((layer) => {
                if (layer.kawasan === 'hutan') {
                    return true; // Preserve hutan layers
                }
                return !deletedLayerIds.includes(layer.id!);
            }),
        );
        console.log('Lapisan Peta Kebun:', deletedLayerIds);
    };

    const renderedPolygonsKebun = useMemo(() => {
        if (!dataLoaded) return null;

        return lapisanPetaKebun.map((layer) => (
            <Polygon
                key={layer.id}
                positions={layer.latlngs}
                color={layer.color}
            />
        ));
    }, [dataLoaded, lapisanPetaKebun]);

    const renderedPolygonsHutan = useMemo(() => {
        if (!dataLoaded) return null;

        return lapisanPeta.map((layer) => (
            <Polygon
                key={layer.id}
                positions={layer.latlngs}
                color={layer.color}
            />
        ));
    }, [dataLoaded, lapisanPeta]);

    if (!dataLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Pemetaan Lahan" />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="px-2 pb-2 lg:pb-4">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Form Update Pemetaan Lahan
                        </h3>
                    </div>
                    <div className="leaflet-container2">
                        <MapContainer
                            key={mapKey}
                            center={mapCenter}
                            zoom={ZOOM_LEVEL}
                            ref={mapContainerRef}
                        >
                            <FeatureGroup>{renderedPolygonsHutan}</FeatureGroup>

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
                                {renderedPolygonsKebun}
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
                                    span="HA"
                                />
                            </div>
                        </div>

                        <div className="">
                            <InputDashboard
                                label="Nomor STDB"
                                type="text"
                                id="nomorSTDB"
                                register={register}
                                errors={errors}
                                disabled
                            />
                            <InputDashboard
                                label="Id Pemetaan Kebun"
                                type="text"
                                id="idPemetaanKebun"
                                register={register}
                                errors={errors}
                                disabled
                            />
                            <div className="">
                                <InputDashboard
                                    label="waktuPemetaanKebun"
                                    type="text"
                                    id="waktuPemetaanKebun"
                                    register={register}
                                    errors={errors}
                                    disabled
                                />
                                <InputDashboard
                                    label="waktuVerifikator"
                                    type="text"
                                    id="waktuVerifikator"
                                    register={register}
                                    errors={errors}
                                    disabled
                                />
                            </div>
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

export default FormUpdatePemetaanKebun;
