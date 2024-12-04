import React from 'react';
import { LocationPinMap } from '..';
import data from './mlb_stadiums.geojson';

export default {
  title: 'Example/LocationPinMap',
  component: LocationPinMap,
  tags: ['autodocs'],
  argTypes: {
    // Add controls for your props
    accessToken: { control: 'text' },
    title: { control: 'text' },
  },
};

// Story with valid data
export const Default = (args) => <LocationPinMap {...args} />;

Default.args = {
  data: data,
  accessToken: '',
  title: 'MLB Stadiums',
};

// Story with broken data
export const WithBrokenData = (args) => <LocationPinMap {...args} />;

// Example of broken data: missing Lat or Long in one or more rows
const brokenData = {
  "type": "FeatureCollection",
  "features": []
};

WithBrokenData.args = {
  data: brokenData,
  accessToken: '',
  title: 'Broken Example',
};
