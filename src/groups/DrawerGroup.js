import { createDrawerNavigator } from '@react-navigation/drawer';
import StackGroup from './StackGroup';

import Home from '../components/Home';
import Clients from '../components/Clients';
import TotalReport from '../components/TotalReport.js';
import Reservations from '../components/Reservations.js';
import WeekClose from '../components/WeekClose.js';
import ClientsDeleted from '../components/ClientsDeleted.js';
import Setting from '../components/Setting.js';

const Drawer = createDrawerNavigator();

export default DrawerGroup = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerTintColor: '#aaaaaa', drawerActiveBackgroundColor: '#ffe5ad60', drawerActiveTintColor: '#470000' }}>
      <Drawer.Screen name='Nuevo Cliente' component={Home} />
      <Drawer.Screen name='Clientes' component={Clients} />
      <Drawer.Screen name='Reporte Total' component={TotalReport} />
      <Drawer.Screen name='Reservaciones' component={Reservations} />
      <Drawer.Screen name='Cierre Semanal' component={WeekClose} />
      <Drawer.Screen name='Clientes Eliminados' component={ClientsDeleted} />
      <Drawer.Screen name='Configuraciones' component={Setting} />
    </Drawer.Navigator>
  );
};
