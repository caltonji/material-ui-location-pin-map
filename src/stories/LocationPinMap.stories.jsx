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

// Story with args
export const Default = (args) => <LocationPinMap {...args} />;



// Default props for the story
Default.args = {
  data: data,
  accessToken: '',
  title: 'MLB Stadiums',
};
