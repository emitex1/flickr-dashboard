import React from 'react';
import { FlickrUserPrompt } from '../components/FlickrUserPrompt';
import { UserInfo } from '../components/UserInfo';

export const SetFlickrUser: React.FC = () => {
  return (
    <div>
      <h1>Welcome to Flickr Dashboard</h1>
      <p>You signed up successfully.</p>

      <UserInfo />

      <FlickrUserPrompt />
    </div>
  );
}