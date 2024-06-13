import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import formatDate from '../functions/formatDate.js';

const TotalReport = ({ route }) => {
  const [serviceCounts, setServiceCounts] = useState({});
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalCharged, setTotalCharged] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const storedPercentage = await AsyncStorage.getItem('porcentaje');
      const parsedPercentage = storedPercentage ? parseInt(storedPercentage, 10) : 0;
      setPercentage(parsedPercentage);

      const data = await AsyncStorage.getItem('clientesGuardados');
      const clients = data ? JSON.parse(data) : [];

      const serviceCounts = {
        Manicure: 0,
        Pedicure: 0,
        Acrilicas: 0,
        Gel: 0,
        Tradicional: 0,
        Limpieza: 0
      };

      let totalCharged = 0;
      const today = formatDate(new Date());

      clients.forEach(client => {
        if (client.date === today) {
          const { service, price } = client;
          if (serviceCounts.hasOwnProperty(service)) {
            serviceCounts[service] += 1;
            totalCharged += parseFloat(price);
          }
        }
      });
      console.log(parsedPercentage);
      const totalEarned = (totalCharged * parsedPercentage) / 100;
      setServiceCounts(serviceCounts);
      setTotalEarned(totalEarned);
      setTotalCharged(totalCharged);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (route.params?.refresh) {
      fetchData();
      route.params.refresh = false; // Reset the refresh parameter
    }
  }, [route.params, fetchData]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Servicios:</Text>
      {Object.entries(serviceCounts).map(([service, count]) => (
        <View key={service} style={styles.serviceItem}>
          <Text style={styles.serviceName}>{service}:</Text>
          <Text style={styles.serviceCount}>{count}</Text>
        </View>
      ))}
      <Text style={styles.total}>Total cobrado: ${totalCharged.toFixed(2)}</Text>
      <Text style={styles.total}>
        Total Ganado ({percentage}%): ${totalEarned.toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    margin: 30,
    elevation: 10,
    position: 'relative'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  serviceName: {
    fontSize: 16,
    color: '#495057'
  },
  serviceCount: {
    fontSize: 16,
    color: '#495057'
  },
  total: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343a40'
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: '#007bff',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5
  },
  floatingButtonText: {
    color: '#ffffff',
    fontSize: 24
  }
});

export default TotalReport;
