import React, { useState, useEffect } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Clients() {
  const [clientsList, setClientsList] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await AsyncStorage.getItem('todayClients');
        if (data !== null) {
          setClientsList(JSON.parse(data));
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchClients();
  }, []);

  const handleDelete = async id => {
    try {
      const updatedList = clientsList.filter(client => client.id !== id);
      await AsyncStorage.setItem('todayClients', JSON.stringify(updatedList));
      setClientsList(updatedList);
      Alert.alert('Success', 'Client deleted successfully!');
    } catch (error) {
      console.error('Error deleting client', error);
      Alert.alert('Error', 'There was an error deleting the client.');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={clientsList}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.input}>{item.name}</Text>
            <Text style={styles.input}>{item.date}</Text>
            <Text style={styles.input}>{item.service}</Text>
            <Text style={styles.input}>{item.price}</Text>
            <Text style={styles.input}>{item.description}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.button}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    width: 200,
    height: 30,
    margin: 5,
    borderWidth: 0.5,
    borderColor: '#aaaaaa',
    color: '#aaaaaa',
    padding: 5,
    borderRadius: 5,
    shadowColor: '#a4894e',
    shadowRadius: 5,
    shadowOpacity: 10
  },
  card: {
    width: 250,
    height: 350,
    margin: 'auto',
    marginVertical: 20,
    backgroundColor: '#ffe5ad60',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 30
  },
  button: {
    padding: 10,
    backgroundColor: '#a4894e',
    color: '#ffffff',
    borderRadius: 5,
    marginTop: 5,
    textAlign: 'center'
  }
});
