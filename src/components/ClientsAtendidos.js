// ClientsAtendidos.js
import React, { useState, useEffect } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import formaDate from '../functions/formatDate.js';

export default ClientsAtendidos = ({ route }) => {
  const [clientsList, setClientsList] = useState([]);

  const fetchClients = async () => {
    try {
      const data = await AsyncStorage.getItem('clientesGuardados');
      if (data) {
        const clientesGuardados = JSON.parse(data);
        console.log(clientesGuardados);
        const todayClients = clientesGuardados.filter(client => client.date === formaDate(new Date()) && client.status);
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
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
      <StatusBar style='auto' />
    </View>
  );
};

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
  }
});
