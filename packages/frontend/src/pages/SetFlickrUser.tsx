import React from 'react';
import { FlickrUserPrompt } from '../components/FlickrUserPrompt';
import { UserInfo } from '../components/UserInfo';

export const SetFlickrUser: React.FC = () => {
  return (
    <div>
      <h1>Initialize ...</h1>

      <UserInfo />

      <FlickrUserPrompt />
    </div>
  );
}