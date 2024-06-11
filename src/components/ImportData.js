import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert, Text, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Modal from 'react-native-modal';

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

  const saveData = data => {
    console.log(data);
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
