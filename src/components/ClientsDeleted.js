import React, { useState, useEffect } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DeletedClients() {
  const [deletedClients, setDeletedClients] = useState([]);

  useEffect(() => {
    const fetchDeletedClients = async () => {
      try {
        const data = await AsyncStorage.getItem('clientesEliminados');
        if (data !== null) {
          setDeletedClients(JSON.parse(data));
        }
      } catch (error) {
        console.error('Error fetching deleted clients data', error);
      }
    };

    fetchDeletedClients();
  }, []);

  const renderClient = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.input}>{item.name}</Text>
      <Text style={styles.input}>{item.date}</Text>
      <Text style={styles.input}>{item.service}</Text>
      <Text style={styles.input}>{item.price}</Text>
      <Text style={styles.input}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList data={deletedClients} renderItem={renderClient} keyExtractor={(item, index) => item.id.toString()} showsVerticalScrollIndicator={false} />
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
    padding: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10
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
    marginVertical: 10,
    backgroundColor: '#ffe5ad60',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 30
  }
});
