import React from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import useAuthStore from '../../../store/authStore';
import FormatTanggalJamLabel from './table/FormatTanggalJamLabel';

interface MapComponentProps {
    longitude: any;
    latitude: any;
    statusKawasan?: any;
    nomorSTDB?: any;
    idPemetaanKebun?: string;
    luasHutan?: string;
    idHutan?: string;
    luasKebun?: string;
    nikSurveryor?: string;
    namaSurveryor?: string;
    waktuPemetaanKebun?: string;
    waktuUpdatePemetaanKebun?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
    longitude,
    latitude,
    statusKawasan,
    nomorSTDB,
    idHutan,
    luasHutan,
    luasKebun,
    nikSurveryor,
    namaSurveryor,
    waktuPemetaanKebun,
    waktuUpdatePemetaanKebun,
}) => {
    const { user } = useAuthStore((state) => state);

    console.log(longitude, latitude);
    const latitudes = JSON.parse(latitude) as number[];
    const longitudes = JSON.parse(longitude) as number[];

    const position: [number, number] = [latitudes[0], longitudes[0]];

    const polygonLatLngs = latitudes.map(
        (lat, index) => [lat, longitudes[index]] as [number, number],
    );
    let color = '';

    // useEffect(() => {
    const userRole = user?.data?.role ?? 'defaultRole';

    if (statusKawasan) {
        if (statusKawasan === 'didalam kawasan') {
            color = '#FF0000';
        } else if (statusKawasan === 'sebagian memasuki kawasan') {
            color = '#FFFF00';
        } else {
            color = '#0000FF';
        }
    } else {
        color = '#02ad05';
    }
    // },[user]);
    const MAPBOX_ACCESS_TOKEN =
    'pk.eyJ1IjoiYWhtYWRtdWphaGlkIiwiYSI6ImNsdzFiaW1ibjA0N3Mya3FqdWFhZXhqc3oifQ.8hMXRQtRBrfZfyl6-kjFLw';

    return (
        <MapContainer
            center={position}
            zoom={16}
            style={{ height: '100vh', width: '100%' }}
        >
            <TileLayer
                                url={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`}
                                attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
            <Polygon positions={polygonLatLngs} pathOptions={{ color: color }}>
                <Popup>
                    <div>
                        {statusKawasan ? (
                            <>
                            {nomorSTDB && (
                            <p>Nomor STDB: {nomorSTDB}</p>
                            )}
                               
                                <p>Status kawasan: {statusKawasan}</p>
                                <p>Luas Kebun: {luasKebun} Ha</p>
                                <p>Nik Surveyor: {nikSurveryor}</p>
                                <p>Nama Surveyor: {namaSurveryor}</p>
                                <p>
                                    waktu Pemetaan Kebun:
                                    <FormatTanggalJamLabel
                                        tanggal={waktuPemetaanKebun}
                                    />
                                </p>
                                <p>
                                    waktu Update Pemetaan Kebun:
                                    <FormatTanggalJamLabel
                                        tanggal={waktuUpdatePemetaanKebun}
                                    />
                                </p>
                            </>
                        ) : (
                            <>
                                <p>Id Hutan: {idHutan}</p>
                                <p>Luas Hutan: {luasHutan} hektar</p>
                            </>
                        )}
                    </div>
                </Popup>
            </Polygon>
        </MapContainer>
    );
};

export default MapComponent;
