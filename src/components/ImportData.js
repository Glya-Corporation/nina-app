import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert, Text, ScrollView, BackHandler } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ImportData = () => {
  const [importedData, setImportedData] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const importJSON = async () => {
    try {
      const { assets } = await DocumentPicker.getDocumentAsync({
        type: 'application/json'
      });

      const { uri } = assets[0];

      if (assets) {
        const content = await FileSystem.readAsStringAsync(uri);
        const data = JSON.parse(content);
        setImportedData(data);
        setModalVisible(true);
      } else {
        Alert.alert('Cancelled', 'Import was cancelled');
      }
    } catch (error) {
      Alert.alert('Error', 'There was an error importing the JSON file');
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const saveData = async data => {
    await AsyncStorage.clear();

    for (const key in data) {
      if (key !== 'porcentaje') await AsyncStorage.setItem(key, JSON.stringify(data[key]));
      if (key === 'porcentaje') await AsyncStorage.setItem(key, data[key]);
    }

    Alert.alert('Data complete');
    closeModal();
    setTimeout(() => {
      BackHandler.exitApp();
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Button title='Import JSON' onPress={importJSON} />
      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.modalTitle}>Imported JSON</Text>
            <Text style={styles.modalText}>{JSON.stringify(importedData, null, 2)}</Text>
          </ScrollView>
          <Button title='Guardar' onPress={() => saveData(importedData)} />
          <Button title='Cerrar' onPress={closeModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20
  },
  modalContent: {
    height: 500,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  modalText: {
    fontSize: 16
  }
});

export default ImportData;

const objectNew = {
  clientesGuardados: [],
  clientesEliminados: [
    { date: '2024-06-06', name: 'Maria dolores', price: '8', colaborador: 'Andreina ', description: 'Manicura', id: 1717992583538, service: 'Manicure', estado: 'eliminado', motivo: 'mala fecha' },
    { date: '2024-06-06', name: 'Gabriela', price: '14', colaborador: 'Andreina ', description: 'Acrílicas ', id: 1717992622373, service: 'Manicure', estado: 'eliminado', motivo: 'mala fecha' },
    { date: '2024-05-16', name: 'Leslie', price: '16', colaborador: 'Admin', description: '', id: 1715961227795, service: 'Manicure', estado: 'eliminado', motivo: 'mal' }
  ],
  porcentaje: '100',
  registro: [
    {
      inicio: '2024-06-09',
      cierre: '2024-06-07',
      cobrado: '81.00',
      ganado: '81.00',
      clientes: [
        { date: '2024-06-09', name: 'Laura', price: '23', colaborador: 'Andreina ', description: 'Acrílicas mano, tradicional pedí.', id: 1717992908043, service: '', estado: 'activo' },
        { date: '2024-06-08', name: 'Amiga Leslie ', price: '21', colaborador: 'Andreina ', description: 'Retiro y puesta', id: 1717992833330, service: '', estado: 'activo' },
        { date: '2024-06-08', name: 'Leslie', price: '15', colaborador: 'Andreina ', description: 'Relleno', id: 1717992806609, service: '', estado: 'activo' },
        { date: '2024-06-07', name: 'Gabriela', price: '14', colaborador: 'Andreina ', description: 'Acrílicas ', id: 1717992770096, service: '', estado: 'activo' },
        { date: '2024-06-07', name: 'Maria dolores', price: '8', colaborador: 'Andreina ', description: 'Manicura ', id: 1717992748370, service: 'Manicure', estado: 'activo' }
      ]
    },
    {
      inicio: '2024-05-17',
      cierre: '2024-05-17',
      cobrado: '16.00',
      ganado: '16.00',
      clientes: [{ date: '2024-05-17', name: 'Leslie', price: '16', colaborador: 'Andreina ', description: 'Acrílicas', id: 1717992484364, service: 'Manicure', estado: 'activo' }]
    }
  ],
  advances: [],
  user: null
};
