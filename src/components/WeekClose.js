import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import formatDate from '../functions/formatDate.js';

const WeekClose = ({ route }) => {
  const [weeklyClose, setWeeklyClose] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClose, setSelectedClose] = useState(null);
  const [percentage, setPercentage] = useState(20);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (route.params?.refresh) {
      fetchInitialData();
      route.params.refresh = false; // Reset the refresh parameter
    }
  }, [route.params, fetchInitialData]);

  const fetchInitialData = async () => {
    try {
      const storedWeeklyClose = JSON.parse(await AsyncStorage.getItem('registro')) || [];
      const storedPercentage = await AsyncStorage.getItem('porcentaje');

      console.log(storedWeeklyClose);

      setWeeklyClose(storedWeeklyClose);
      setFilteredData(storedWeeklyClose);
      if (storedPercentage) setPercentage(parseFloat(storedPercentage));

      checkAutoClose();
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const checkAutoClose = async () => {
    const now = new Date();
    if (now.getDay() === 0 && now.getHours() === 23 && now.getMinutes() === 59) {
      await handleWeekClose(true);
    }
  };

  const handleWeekClose = async (auto = false) => {
    try {
      const clientesGuardados = JSON.parse(await AsyncStorage.getItem('clientesGuardados')) || [];

      if (!auto && clientesGuardados.length === 0) {
        Alert.alert('Error', 'No hay clientes para cerrar la semana');
        return;
      }

      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
      const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 7));

      const startFormatted = formatDate(startOfWeek);
      const endFormatted = formatDate(endOfWeek);

      const clientsThisWeek = clientesGuardados.filter(client => {
        const clientDate = client.date;
        return clientDate >= startFormatted && clientDate <= endFormatted;
      });

      const totalCharged = clientsThisWeek.reduce((sum, client) => sum + parseFloat(client.price), 0);
      const totalEarned = totalCharged * (percentage / 100);

      const newWeeklyClose = {
        inicio: startFormatted,
        cierre: endFormatted,
        clientes: clientsThisWeek,
        cobrado: totalCharged,
        ganado: totalEarned
      };

      const updatedWeeklyClose = [newWeeklyClose, ...weeklyClose];

      await AsyncStorage.setItem('registro', JSON.stringify(updatedWeeklyClose));
      await AsyncStorage.setItem('clientesGuardados', JSON.stringify(clientesGuardados.filter(client => !clientsThisWeek.includes(client))));

      setWeeklyClose(updatedWeeklyClose);
      setFilteredData(updatedWeeklyClose);

      if (!auto) Alert.alert('Éxito', 'Cierre semanal realizado correctamente');
    } catch (error) {
      Alert.alert('Error', 'Hubo un error al realizar el cierre semanal');
      console.error(error);
    }
  };

  const handleSearch = text => {
    setSearch(text);
    if (text) {
      const filtered = weeklyClose.filter(item => item.inicio.includes(text) || item.cierre.includes(text));
      setFilteredData(filtered);
    } else {
      setFilteredData(weeklyClose);
    }
  };

  const openModal = close => {
    setSelectedClose(close);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedClose(null);
    setModalVisible(false);
  };

  const handleDeleteItem = async item => {
    try {
      const index = weeklyClose.indexOf(item);
      const newWeeklyClose = [...weeklyClose];
      newWeeklyClose.splice(index, 1);
      setWeeklyClose(newWeeklyClose);
      setFilteredData(newWeeklyClose);
      await AsyncStorage.setItem('registro', JSON.stringify(newWeeklyClose));
      Alert.alert('Éxito', 'Cierre semanal eliminado correctamente');
    } catch (error) {
      Alert.alert('Error', 'Hubo un error al eliminar el cierre semanal');
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)} style={styles.item}>
      <View style={styles.itemContent}>
        <Text style={styles.itemText}>Inicio: {item.inicio}</Text>
        <Text style={styles.itemText}>Final: {item.cierre}</Text>
        <Text style={styles.itemText}>Clientes: {item.clientes.length}</Text>
        <Text style={styles.itemText}>Total Cobrado: ${item.totalCobrado.toFixed(2)}</Text>
        <Text style={styles.itemText}>Total Ganado: ${item.totalGanado.toFixed(2)}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteItem(item)} style={styles.deleteIcon}>
        <MaterialIcons name='delete' size={24} color='black' />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput style={styles.searchInput} placeholder='Buscar por fecha (dd-mm-aa)' value={search} onChangeText={handleSearch} />
      <TouchableOpacity style={styles.button} onPress={() => handleWeekClose(false)}>
        <Text style={styles.buttonText}>Cerrar Semana</Text>
      </TouchableOpacity>
      <FlatList data={filteredData} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} />
      {selectedClose && (
        <Modal visible={modalVisible} transparent={true} animationType='slide' onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Detalles del Cierre</Text>
              <Text style={styles.modalText}>Inicio: {selectedClose.inicio}</Text>
              <Text style={styles.modalText}>Final: {selectedClose.cierre}</Text>
              <Text style={styles.modalText}>Total Cobrado: ${selectedClose.totalCobrado.toFixed(2)}</Text>
              <Text style={styles.modalText}>Total Ganado: ${selectedClose.totalGanado.toFixed(2)}</Text>
              <Text style={styles.modalText}>Clientes:</Text>
              <ScrollView style={styles.clientList}>
                {selectedClose.clientes.map((client, index) => (
                  <View key={index} style={styles.clientItem}>
                    <Text style={styles.clientText}>Nombre: {client.name}</Text>
                    <Text style={styles.clientText}>Servicio: {client.service}</Text>
                    <Text style={styles.clientText}>Precio: ${parseFloat(client.price).toFixed(2)}</Text>
                    <Text style={styles.clientText}>Fecha: {client.date}</Text>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.button} onPress={closeModal}>
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10
  },
  item: {
    padding: 20,
    marginVertical: 8,
    backgroundColor: '#ffe5ad60',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemContent: {
    flex: 1
  },
  itemText: {
    fontSize: 18
  },
  button: {
    backgroundColor: '#a4894e',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 18
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: '80%',
    maxHeight: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10
  },
  clientList: {
    maxHeight: '50%'
  },
  clientItem: {
    backgroundColor: '#ffe5ad60',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5
  },
  clientText: {
    fontSize: 16
  },
  deleteIcon: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 20
  }
});

export default WeekClose;
