import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Clients from '../components/Clients';
import ClientsAtendidos from '../components/ClientsAtendidos';

const Tab = createMaterialTopTabNavigator();

export default MyTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name='No Atendidos' component={Clients} />
      <Tab.Screen name='Atendidos' component={ClientsAtendidos} />
    </Tab.Navigator>
  );
};
