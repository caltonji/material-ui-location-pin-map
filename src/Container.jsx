import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import Map from './Map';
import Sidebar from './Sidebar';

const Container = ({ data, accessToken, title }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    const processedData = useMemo(() => {
        if (!data?.features) return data;

        return {
            ...data,
            features: data.features.map((feature, index) => ({
                ...feature,
                properties: {
                    ...feature.properties,
                    id: `generated-${index}`
                }
            }))
        };
    }, [data]);

    return (
        <Box sx={{
            display: 'flex',
            width: '100%',
            height: 'calc(100vw / 3)',
            minHeight: '500px',
            maxHeight: '800px',
            overflow: 'hidden',
            visibility: isMapLoaded ? 'visible' : 'hidden',
            opacity: isMapLoaded ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out'
        }}>
            <Sidebar
                data={processedData?.features || []}
                title={title || "Locations"}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
            />
            <Box sx={{ flexGrow: 1 }}>
                <Map
                    data={processedData}
                    accessToken={accessToken}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    onLoad={() => setIsMapLoaded(true)}
                />
            </Box>
        </Box>
    );
};

Container.propTypes = {
    data: PropTypes.object,
    accessToken: PropTypes.string.isRequired,
    title: PropTypes.string
};

export default Container;
