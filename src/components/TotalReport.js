import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TotalReport = () => {
  const [serviceCounts, setServiceCounts] = useState({});
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalCharged, setTotalCharged] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the percentage
        const storedPercentage = await AsyncStorage.getItem('percentage');
        const parsedPercentage = storedPercentage ? parseInt(storedPercentage, 10) : 0;
        setPercentage(parsedPercentage);

        const data = await AsyncStorage.getItem('todayClients');
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

        clients.forEach(client => {
          const service = client.service;
          const price = parseFloat(client.price);

          if (serviceCounts.hasOwnProperty(service)) {
            serviceCounts[service] += 1;
            totalCharged += price;
          }
        });

        // Calculate total earned based on percentage
        const totalEarned = (totalCharged * parsedPercentage) / 100;

        setServiceCounts(serviceCounts);
        setTotalEarned(totalEarned);
        setTotalCharged(totalCharged);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    setTimeout(() => {
      fetchData();
    }, 500);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Servicios:</Text>
      {Object.keys(serviceCounts).map(service => (
        <View key={service} style={styles.serviceItem}>
          <Text style={styles.serviceName}>{service}:</Text>
          <Text style={styles.serviceCount}>{serviceCounts[service]}</Text>
        </View>
      ))}
      <Text style={styles.total}>Total cobrado: {totalCharged.toFixed(2)}</Text>
      <Text style={styles.total}>
        Total Ganado ({percentage}%): {totalEarned.toFixed(2)}
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
    elevation: 10
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
  }
});

export default TotalReport;
