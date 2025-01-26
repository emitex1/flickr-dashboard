import React from 'react';
import { FlickrUserPrompt } from '../components/FlickrUserPrompt';

export const Settings: React.FC = () => {
  return (
    <div>
      <h1>Settings Page</h1>

      <FlickrUserPrompt />
    </div>
  );
}