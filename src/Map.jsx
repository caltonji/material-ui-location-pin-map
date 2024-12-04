// MapWithMarkers.js
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import PropTypes from 'prop-types';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from '@mui/material';
import './style.css';
import ReactDOM from 'react-dom';
import Popup from './Popup';


const Map = ({ data, accessToken, selectedId, setSelectedId, onLoad }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);

    // Handle Data Updates
    useEffect(() => {
        if (!accessToken) {
            console.error('Mapbox access token is required');
            return;
        }

        if (map.current) return; // Initialize map only once

        mapboxgl.accessToken = accessToken;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/light-v11',
            pitch: 0,
            bearing: 0,
            dragRotate: false,
            touchZoomRotate: false
        });

        map.current.addControl(new mapboxgl.NavigationControl({
            showCompass: false,
            showZoom: true
        }), 'top-right');

        map.current.dragRotate.disable();
        map.current.touchZoomRotate.disableRotation();

        map.current.on('load', () => {
            map.current.loadImage(
                'https://radish-map-maker.s3-us-west-2.amazonaws.com/google-geo-icon.png',
                function (error, image) {
                    if (error) throw error;
                    console.log("Adding image");
                    map.current.addImage('geo-icon', image);
                }
            );
        });

        // Wait for map style to finish loading before adding data
        map.current.on('style.load', () => {
            if (data) {
                addMarkers();
                fitMapToMarkers(data);
                // Listen for the idle event to ensure everything is loaded
                map.current.once('idle', () => {
                    onLoad();
                });
            }
        });

    }, [accessToken]);

    useEffect(() => {
        if (map.current && map.current.isStyleLoaded()) {
            addMarkers();
            fitMapToMarkers(data);
        }
    }, [data]);

    useEffect(() => {
        if (selectedId) {
            const selectedFeature = data?.features?.find(f => f.properties.id === selectedId);
            if (selectedFeature) {
                flyToStore(selectedFeature);
                createPopUp(selectedFeature);
            }
        }
    }, [selectedId, data]);

    const fitMapToMarkers = (geojsonData) => {
        if (!map.current || !geojsonData || !geojsonData?.features?.length) return;

        // create bounds object
        const bounds = new mapboxgl.LngLatBounds();
        geojsonData?.features?.forEach(feature => {
            bounds.extend(feature.geometry.coordinates);
        });
        // Fit bounds immediately without animation
        map.current.fitBounds(bounds, {
            padding: { top: 50, bottom: 50, left: 50, right: 50 },
            duration: 0  // Set duration to 0 for immediate fit
        });
    };

    const addMarkers = () => {
        if (!map.current || !data) return;

        // Remove existing source if it exists
        if (map.current.getSource('places')) {
            map.current.removeLayer('clusters');
            map.current.removeLayer('cluster-count');
            map.current.removeLayer('unclustered-point');
            map.current.removeSource('places');
        }

        map.current.addSource('places', {
            'type': 'geojson',
            'data': data,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50
        });

        addClusters(map.current);
        addUnclusteredPoints(map.current);
    };

    function addClusters(map) {
        map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'places',
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': '#dadada',
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    20, 100,
                    30, 750,
                    40
                ]
            }
        });

        map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'places',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            }
        });
    }

    function addUnclusteredPoints(map) {
        map.addLayer({
            id: 'unclustered-point',
            type: 'symbol',
            source: 'places',
            filter: ['!', ['has', 'point_count']],
            layout: {
                'icon-image': 'geo-icon',
                'icon-size': 0.3
            }
        });

        map.on('click', 'clusters', function (e) {
            const features = map.queryRenderedFeatures(e.point, {
                layers: ['clusters']
            });

            const clusterId = features[0].properties.cluster_id;
            map.getSource('places').getClusterExpansionZoom(
                clusterId,
                function (err, zoom) {
                    if (err) return;

                    map.flyTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom
                    });
                }
            );
        });

        map.on('click', 'unclustered-point', function (e) {
            if (e.features && e.features.length > 0) {
                const feature = e.features[0];
                setSelectedId(feature.properties.id);
            }
        });
    }

    const flyToStore = (feature) => {
        if (!map.current || !feature.geometry.coordinates) return;
        map.current.flyTo({
            center: feature.geometry.coordinates,
            zoom: 15,
        });
    };

    const createPopUp = (feature) => {
        if (!map.current || !feature.geometry.coordinates) return;
        const popUps = document.getElementsByClassName('mapboxgl-popup');
        if (popUps[0]) popUps[0].remove();

        const popupDiv = document.createElement('div');
        const popup = new mapboxgl.Popup({
            closeButton: false, // Disable default close button
            closeOnClick: true
        });

        ReactDOM.render(
            <Popup
                title={feature.properties.Title}
                subtitle={feature.properties.Subtitle}
                onClose={() => popup.remove()}
            />,
            popupDiv
        );

        popup
            .setLngLat(feature.geometry.coordinates)
            .setDOMContent(popupDiv)
            .addTo(map.current);

        // Closing the Popup via clicking the X or somewhere on Map will trigger this on close.
        popup.on('close', () => {
            setSelectedId(null);
        });
    };

    return (
        <div
            id="map"
            style={{
                width: '100%',
                height: '100%'
            }}
            ref={mapContainer}
        />
    );
};

Map.propTypes = {
    data: PropTypes.object,
    accessToken: PropTypes.string.isRequired,
    selectedId: PropTypes.string,
    setSelectedId: PropTypes.func.isRequired,
    onLoad: PropTypes.func.isRequired
};

export default Map;
