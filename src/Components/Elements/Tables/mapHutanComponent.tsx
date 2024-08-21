import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';

interface MapComponentProps {
    longitude: any;
    latitude: any;
    namaHutan: any;
    idHutan: any;
    luas?: any;
    luasHutan?: any;
    setLuasHutan: (luas: string) => void;
}

const MapHutanComponent: React.FC<MapComponentProps> = ({
    longitude,
    latitude,
    namaHutan,
    idHutan,
    setLuasHutan,
    luasHutan,
}) => {
    const [luas, setLuas] = useState<number>(0);

    const longitudes = JSON.parse(latitude) as number[];
    const latitudes = JSON.parse(longitude) as number[];

    const polygonLatLngs = latitudes.map(
        (lat, index) => [lat, longitudes[index]] as [number, number],
    );

    let color = '#02ad05';
    useEffect(() => {
        const coordinates = polygonLatLngs.map(([lat, lng]) => [lng, lat]);
        coordinates.push(coordinates[0]); // Closing the polygon

        const polygon = turf.polygon([coordinates]);
        const area = turf.area(polygon);

        // Converting square meters to hectares (1 hectare = 10,000 square meters)
        const luas = area / 10000;
        setLuas(area / 10000);
        setLuasHutan(luas.toString());
    }, [latitude, longitude]);
    const MAPBOX_ACCESS_TOKEN =
        'pk.eyJ1IjoiYWhtYWRtdWphaGlkIiwiYSI6ImNsdzFiaW1ibjA0N3Mya3FqdWFhZXhqc3oifQ.8hMXRQtRBrfZfyl6-kjFLw';
    return (
        <MapContainer
            center={polygonLatLngs[0]}
            zoom={14}
            style={{ height: '80vh', width: '100%' }}
        >
            <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`}
                attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Polygon positions={polygonLatLngs} pathOptions={{ color: color }}>
                <Popup>
                    <div>
                        <p>Id Hutan : {idHutan}</p>
                        <p>Nama Hutan: {namaHutan}</p>
                        <p>Luas: {luas} Hektar</p>
                    </div>
                </Popup>
            </Polygon>
        </MapContainer>
    );
};

export default MapHutanComponent;
