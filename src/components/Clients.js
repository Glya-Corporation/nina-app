// ClientsNoAtendidos.js
import React, { useState, useEffect } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, View, TouchableOpacity, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import formaDate from '../functions/formatDate.js';

export default function ClientsNoAtendidos({ route }) {
  const [clientsList, setClientsList] = useState([]);
  const [editingClientId, setEditingClientId] = useState(null);
  const [price, setPrice] = useState('');

  const fetchClients = async () => {
    try {
      const data = await AsyncStorage.getItem('clientesGuardados');
      if (data) {
        const clientesGuardados = JSON.parse(data);
        const todayClients = clientesGuardados.filter(client => client.date === formaDate(new Date()) && !client.status);
        setClientsList(todayClients);
      }
    } catch (error) {
      console.error('Error fetching clients', error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (route.params?.refresh) {
      fetchClients();
    }
  }, [route.params]);

  const handleDelete = async id => {
    try {
      const clientToDelete = clientsList.find(client => client.id === id);
      const updatedList = clientsList.filter(client => client.id !== id);

      await AsyncStorage.setItem('clientesGuardados', JSON.stringify(updatedList));

      setClientsList(updatedList);

      Alert.alert('Success', 'Client deleted successfully!');
    } catch (error) {
      console.error('Error deleting client', error);
      Alert.alert('Error', 'There was an error deleting the client.');
    }
  };

  const handleEditToggle = (id, price) => {
    setEditingClientId(id);
    setPrice(price);
  };

  const handleSave = async id => {
    try {
      const updatedList = clientsList.map(client => (client.id === id ? { ...client, price } : client));

      await AsyncStorage.setItem('clientesGuardados', JSON.stringify(updatedList));

      setClientsList(updatedList);
      setEditingClientId(null);
      Alert.alert('Success', 'Price updated successfully!');
    } catch (error) {
      console.error('Error saving price', error);
      Alert.alert('Error', 'There was an error saving the price.');
    }
  };

  const handleStatusChange = async id => {
    try {
      const updatedList = clientsList.map(client => (client.id === id ? { ...client, status: true } : client));

      await AsyncStorage.setItem('clientesGuardados', JSON.stringify(updatedList));

      setClientsList(updatedList.filter(client => !client.status));
      Alert.alert('Success', 'Client status updated successfully!');
    } catch (error) {
      console.error('Error updating status', error);
      Alert.alert('Error', 'There was an error updating the client status.');
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
            {editingClientId === item.id ? <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType='numeric' /> : <Text style={styles.input}>{item.price}</Text>}
            <Text style={styles.input}>{item.description}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.button}>Eliminar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => (editingClientId === item.id ? handleSave(item.id) : handleEditToggle(item.id, item.price))}>
              <Text style={styles.button}>{editingClientId === item.id ? 'Guardar' : 'Editar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleStatusChange(item.id)}>
              <Text style={styles.button}>Atendido</Text>
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
