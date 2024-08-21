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
}

const MapHutanComponent: React.FC<MapComponentProps> = ({
    longitude,
    latitude,
    namaHutan,
    idHutan,
}) => {
    const [luas, setLuas] = useState<number>(0);

    const latitudes = JSON.parse(latitude) as number[];
    const longitudes = JSON.parse(longitude) as number[];

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
        setLuas(area / 10000);
    }, [latitude, longitude]);

    return (
        <MapContainer
            center={polygonLatLngs[0]}
            zoom={10}
            style={{ height: '80vh', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Polygon positions={polygonLatLngs} pathOptions={{ color: color }}>
                <Popup>
                    <div>
                        <p>Id Hutan : {idHutan}</p>
                        <p>Nama Hutan: {namaHutan}</p>
                        <p>Luas: {luas.toFixed(2)} Hektar</p>
                    </div>
                </Popup>
            </Polygon>
        </MapContainer>
    );
};

export default MapHutanComponent;
