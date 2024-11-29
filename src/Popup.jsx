import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Popup = ({ title, subtitle, onClose }) => {
    return (
        <Box sx={{ p: 1, minWidth: 200, position: 'relative' }}>
            <IconButton
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: -8,
                    top: -8,
                    backgroundColor: 'white',
                    '&:hover': {
                        backgroundColor: '#f0f0f0',
                    },
                }}
                size="small"
            >
                <CloseIcon />
            </IconButton>
            <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', pr: 3 }}>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {subtitle}
            </Typography>
        </Box>
    );
};

Popup.propTypes = {
    title: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
};

export default Popup;
