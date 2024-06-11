import React from 'react';
import { StyleSheet, ScrollView, Alert, BackHandler } from 'react-native';
import Accordion from './Accordion';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImportData from './ImportData';

const Setting = () => {
  const data1 = ['Item 1.1', 'Item 1.2', 'Item 1.3'];
  const data2 = ['Item 2.1', 'Item 2.2'];
  const data3 = ['Ubuntu', 'Montserrat', 'Merriweather', 'JosefinSans', 'Dosis', 'Dancing'];
  const data4 = ['Cambiar Porcentaje'];
  const data7 = ['Borrar Todo'];

  const deletedAllData = () => {
    AsyncStorage.clear();
    Alert.alert('Reinicio completo');
    setTimeout(() => {
      BackHandler.exitApp();
    }, 2000);
  };

  return (
    <ScrollView style={styles.container}>
      <Accordion title='Perfil' data={data1} />
      <Accordion title='Temas' data={data2} />
      <Accordion title='Fuentes' data={data3} />
      <Accordion title='Porcentaje' data={data4} />
      <Accordion title='Borrar Todo' data={data7} functionClick={deletedAllData} />
      <ImportData />
      {/* <Accordion title='Exportar' data={data5} /> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  }
});

export default Setting;
