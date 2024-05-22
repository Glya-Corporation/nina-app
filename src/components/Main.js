import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import DrawerGroup from '../groups/DrawerGroup';

const Main = () => {
  return (
    <NavigationContainer>
      <DrawerGroup />
    </NavigationContainer>
  );
};

export default Main;
