import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const ExportData = () => {
  const createJSONFile = async () => {
    const data = {
      name: 'John Doe',
      age: 30,
      occupation: 'Software Developer'
    };

    const json = JSON.stringify(data, null, 2);
    const filename = `${FileSystem.documentDirectory}data.json`;

    try {
      await FileSystem.writeAsStringAsync(filename, json, {
        encoding: FileSystem.EncodingType.UTF8
      });
      return filename;
    } catch (error) {
      Alert.alert('Error', 'There was an error creating the JSON file');
      return null;
    }
  };

  const shareJSON = async () => {
    const filename = await createJSONFile();
    if (filename && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(filename);
    } else {
      Alert.alert('Error', 'Sharing is not available on this device');
    }
  };

  const downloadJSON = async () => {
    const filename = await createJSONFile();
    if (filename) {
      const downloadUri = `${FileSystem.cacheDirectory}data.json`;
      try {
        await FileSystem.copyAsync({ from: filename, to: downloadUri });
        Alert.alert('Success', 'File downloaded successfully', [{ text: 'OK', onPress: () => FileSystem.getContentUriAsync(downloadUri).then(uri => FileSystem.writeAsStringAsync(uri)) }]);
      } catch (error) {
        Alert.alert('Error', 'There was an error downloading the file');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title='Share JSON' onPress={shareJSON} />
      <Button title='Download JSON' onPress={downloadJSON} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 20
  }
});

export default ExportData;
