import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

const ImportData = () => {
  const [importedData, setImportedData] = useState(null);

  const importJSON = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json'
      });

      if (result.type === 'success') {
        const fileUri = result.uri;
        const content = await FileSystem.readAsStringAsync(fileUri);
        const data = JSON.parse(content);
        setImportedData(data);
        console.log(data); // Mostrar los datos en la consola
      } else {
        Alert.alert('Cancelled', 'Import was cancelled');
      }
    } catch (error) {
      Alert.alert('Error', 'There was an error importing the JSON file');
    }
  };

  return (
    <View style={styles.container}>
      <Button title='Import JSON' onPress={importJSON} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20
  }
});

export default ImportData;
