import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

import Home from '../components/Home';
import Clients from '../components/Clients';
import TotalReport from '../components/TotalReport.js';
import Reservations from '../components/Reservations.js';
import WeekClose from '../components/WeekClose.js';
import ClientsDeleted from '../components/ClientsDeleted.js';
import Setting from '../components/Setting.js';

const Drawer = createDrawerNavigator();

const DrawerGroup = () => {
  const navigation = useNavigation();

  const screenOptionsWithRefresh = refreshAction => ({
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
          refreshAction();
          navigation.setParams({ refresh: true });
        }}
        style={styles.refreshButton}
      >
        <Text style={styles.refreshButtonText}>↻</Text>
      </TouchableOpacity>
    ),
    headerTintColor: '#aaaaaa',
    drawerActiveBackgroundColor: '#ffe5ad60',
    drawerActiveTintColor: '#470000'
  });

  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name='Nuevo Cliente'
        component={Home}
        options={{
          headerTintColor: '#aaaaaa',
          drawerActiveBackgroundColor: '#ffe5ad60',
          drawerActiveTintColor: '#470000'
        }}
      />
      <Drawer.Screen
        name='Clientes'
        component={Clients}
        options={screenOptionsWithRefresh(() => {})} // Agrega tu lógica de refresco aquí
      />
      <Drawer.Screen
        name='Reporte Total'
        component={TotalReport}
        options={screenOptionsWithRefresh(() => {})} // Agrega tu lógica de refresco aquí
      />
      <Drawer.Screen
        name='Reservaciones'
        component={Reservations}
        options={screenOptionsWithRefresh(() => {})} // Agrega tu lógica de refresco aquí
      />
      <Drawer.Screen
        name='Cierre Semanal'
        component={WeekClose}
        options={screenOptionsWithRefresh(() => {})} // Agrega tu lógica de refresco aquí
      />
      <Drawer.Screen
        name='Clientes Eliminados'
        component={ClientsDeleted}
        options={screenOptionsWithRefresh(() => {})} // Agrega tu lógica de refresco aquí
      />
      <Drawer.Screen
        name='Configuraciones'
        component={Setting}
        options={screenOptionsWithRefresh(() => {})} // Agrega tu lógica de refresco aquí
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  refreshButton: {
    marginRight: 10
  },
  refreshButtonText: {
    color: '#aaa',
    fontSize: 24
  }
});

export default DrawerGroup;
