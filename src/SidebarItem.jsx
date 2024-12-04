import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemText, Typography } from '@mui/material';

const SidebarItem = ({ location, selectedId, setSelectedId }) => {
    return (
        <ListItem
            button
            key={location.properties.id}
            data-id={location.properties.id}
            selected={selectedId === location.properties.id}
            onClick={() => setSelectedId(location.properties.id)}
        >
            <ListItemText
                primary={location.properties.Title}
                secondary={
                    <>
                        {location.properties.Subtitle && (
                            <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                    display: 'block',
                                    color: 'text.secondary',
                                    fontStyle: 'italic'
                                }}
                            >
                                {location.properties.Subtitle}
                            </Typography>
                        )}
                        {location.properties.Description && (
                            <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    mt: location.properties.Subtitle ? 1 : 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: selectedId === location.properties.id ? 'none' : '10',
                                    WebkitBoxOrient: 'vertical'
                                }}
                            >
                                {location.properties.Description}
                            </Typography>
                        )}
                    </>
                }
            />
        </ListItem>
    );
};

SidebarItem.propTypes = {
    location: PropTypes.object.isRequired,
    selectedId: PropTypes.string,
    setSelectedId: PropTypes.func.isRequired,
};

export default SidebarItem;
