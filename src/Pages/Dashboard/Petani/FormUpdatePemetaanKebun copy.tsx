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
                console.log('state', state.customData);
                const response = await axios.put<{ data: DataPemetaanKebun[] }>(
                    `https://palmmapping-backend.my.to/api/pemetaanKebun/FindOnePemetaanKebun/${state.customData}`,
                );
                const data = response.data.data;

                const latArray = JSON.parse(data.latitude);
                const lngArray = JSON.parse(data.longitude);

                console.log('latArray', latArray);
                console.log('lngArray', lngArray);

                // Create array of coordinate pairs
                const coordinates = latArray.map(
                    (lat: number, index: number) => ({
                        lat: lat,
                        lng: lngArray[index],
                    }),
                );

                // Create new polygon layer
                const newPolygon: PolygonLayer = {
                    latlngs: coordinates,
                    color: 'blue',
                    kawasan: data.kawasan || '', // Use the appropriate field from your data
                };

                setLapisanPetaKebun([newPolygon]);
                setDataLoaded(true);
            } catch (error) {
                console.error('Failed to fetch Data hutan:', error);
            }
        };
        fetchDataPemetaanKebun();
    }, [state.customData]);

    const _onCreate = (e: any) => {
        const { layerType, layer } = e;
        if (layerType === 'polygon') {
            const { _leaflet_id } = layer;

            setNewMaps((prevState) => [
                ...prevState,
                {
                    id: _leaflet_id,
                    latlngs: layer.getLatLngs()[0],
                    color: 'blue',
                    kawasan: '',
                },
            ]);
        }
    };

    const _onEdited = (e: any) => {
        const {
            layers: { _layers },
        } = e;

        const editedLayers = Object.keys(_layers).map((layerId) => {
            const { _leaflet_id, editing } = _layers[layerId];
            return {
                id: _leaflet_id,
                latlngs: editing.latlngs[0],
                color: 'blue',
                kawasan: '',
            };
        });

        setNewMaps((prevState) =>
            prevState.map((layer) => {
                const editedLayer = editedLayers.find((l) => l.id === layer.id);
                return editedLayer ? editedLayer : layer;
            }),
        );

        setLapisanPetaKebun((prevState) =>
            prevState.map((layer) => {
                const editedLayer = editedLayers.find((l) => l.id === layer.id);
                return editedLayer ? editedLayer : layer;
            }),
        );
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
                                        key={index}
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
