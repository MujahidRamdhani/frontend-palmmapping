import React, { useEffect } from 'react';
import {
    MapContainer,
    TileLayer,
    useMap,
    Polygon,
    FeatureGroup,
} from 'react-leaflet';
import L, { Map, Polygon as LeafletPolygon, Layer } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import 'leaflet-geometryutil'; // Import leaflet-geometryutil

const createAreaTooltip = (layer: LeafletPolygon, map: Map) => {
    if ((layer as any).areaTooltip) {
        return;
    }

    (layer as any).areaTooltip = L.tooltip({
        permanent: true,
        direction: 'center',
        className: 'area-tooltip',
    });

    layer.on('remove', function () {
        (layer as any).areaTooltip.remove();
    });

    layer.on('add', function () {
        updateAreaTooltip(layer);
        (layer as any).areaTooltip.addTo(map);
    });

    if (map.hasLayer(layer)) {
        updateAreaTooltip(layer);
        (layer as any).areaTooltip.addTo(map);
    }
};

const updateAreaTooltip = (layer: LeafletPolygon) => {
    const area = (L.GeometryUtil as any).geodesicArea(
        (layer as any).getLatLngs()[0],
    );
    const readableArea = (L.GeometryUtil as any).readableArea(area, true);
    const latlng = (layer as any).getCenter();

    (layer as any).areaTooltip.setContent(readableArea).setLatLng(latlng);
};

const LeafletMap: React.FC = () => {
    const map = useMap();

    useEffect(() => {
        const polygon = L.polygon([
            [51.509, -0.08],
            [51.503, -0.06],
            [51.51, -0.047],
        ]).addTo(map);

        createAreaTooltip(polygon, map);

        const drawnItems = new L.FeatureGroup().addTo(map);

        const drawControl = new L.Control.Draw({
            edit: {
                featureGroup: drawnItems,
                poly: {
                    allowIntersection: false,
                },
            },
            draw: {
                marker: false,
                circle: false,
                circlemarker: false,
                rectangle: false,
                polyline: false,
                polygon: {
                    allowIntersection: false,
                    showArea: true,
                },
            },
        });
        map.addControl(drawControl);

        map.on(L.Draw.Event.CREATED, function (event: any) {
            const layer = event.layer;

            if (layer instanceof L.Polygon) {
                createAreaTooltip(layer, map);
            }

            drawnItems.addLayer(layer);
        });

        map.on(L.Draw.Event.EDITED, function (event: any) {
            event.layers.getLayers().forEach(function (layer: Layer) {
                if (layer instanceof L.Polygon) {
                    updateAreaTooltip(layer);
                }
            });
        });
    }, [map]);

    return null;
};

const Home: React.FC = () => {
    return (
        <div
            className="leaflet-container"
            style={{ height: '40vh', width: '100%' }}
        >
            <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                style={{ height: '400px', width: '600px' }}
            >
                <TileLayer
                    url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <FeatureGroup>
                    <LeafletMap />
                </FeatureGroup>
            </MapContainer>
        </div>
    );
};

export default Home;
