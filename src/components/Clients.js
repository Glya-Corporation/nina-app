import React, { useState, useEffect } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import formaDate from '../functions/formatDate.js';

export default function Clients({ route }) {
  const [clientsList, setClientsList] = useState([]);
  const [deletedClients, setDeletedClients] = useState([]);

  const fetchClients = async () => {
    try {
      const data = await AsyncStorage.getItem('allClients');
      if (data) {
        const allClients = JSON.parse(data);
        const todayClients = allClients.filter(client => client.date === formaDate(new Date()));
        setClientsList(todayClients);
      }
    } catch (error) {
      console.error('Error fetching clients', error);
    }
  };

  const fetchDeletedClients = async () => {
    try {
      const data = await AsyncStorage.getItem('deletedClients');
      if (data) {
        setDeletedClients(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error fetching deleted clients', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchClients();
      await fetchDeletedClients();
    };
    fetchData();
  }, []);

  const updateClientsList = async () => {
    await fetchClients();
    await fetchDeletedClients();
  };

  const handleDelete = async id => {
    try {
      const clientToDelete = clientsList.find(client => client.id === id);
      const updatedList = clientsList.filter(client => client.id !== id);
      const updatedDeletedClients = [...deletedClients, clientToDelete];

      await AsyncStorage.setItem('allClients', JSON.stringify(updatedList));
      await AsyncStorage.setItem('deletedClients', JSON.stringify(updatedDeletedClients));

      setClientsList(updatedList);
      setDeletedClients(updatedDeletedClients);

      Alert.alert('Success', 'Client deleted successfully!');
    } catch (error) {
      console.error('Error deleting client', error);
      Alert.alert('Error', 'There was an error deleting the client.');
    }
  };

  useEffect(() => {
    if (route.params?.refresh) {
      fetchClients();
      route.params.refresh = false; // Reset the refresh parameter
    }
  }, [route.params, fetchClients]);

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
        keyExtractor={item => item.id.toString()}
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
    justifyContent: 'center',
    paddingBottom: 0 // To avoid overlap with the floating button
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
