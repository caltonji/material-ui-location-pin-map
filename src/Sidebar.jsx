import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Divider, List } from '@mui/material';
import SidebarItem from './SidebarItem';

const Sidebar = ({ data, title, selectedId, setSelectedId }) => {
    const listRef = useRef(null);

    useEffect(() => {
        if (selectedId && listRef.current) {
            const selectedElement = listRef.current.querySelector(`[data-id="${selectedId}"]`);
            if (selectedElement) {
                selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }, [selectedId]);

    return (
        <Box
            sx={{
                width: 300,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 2 }}>
                <Typography variant="h5" component="div">{title}</Typography>
            </Box>
            <Divider />
            <Box sx={{
                flexGrow: 1,
                overflowY: 'auto'
            }}>
                <List ref={listRef}>
                    {data.map((location) => (
                        <SidebarItem
                            key={location.properties.id}
                            location={location}
                            selectedId={selectedId}
                            setSelectedId={setSelectedId}
                        />
                    ))}
                </List>
            </Box>
        </Box>
    );
};

Sidebar.propTypes = {
    data: PropTypes.array.isRequired,
    title: PropTypes.string,
    selectedId: PropTypes.string,
    setSelectedId: PropTypes.func.isRequired,
};

export default Sidebar;
