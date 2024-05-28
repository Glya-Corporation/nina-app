import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WeekClose = () => {
  const [weeklyClose, setWeeklyClose] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClose, setSelectedClose] = useState(null);
  const [percentage, setPercentage] = useState(20); // Default percentage, can be updated from AsyncStorage

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const storedWeeklyClose = JSON.parse(await AsyncStorage.getItem('weeklyClose')) || [];
        setWeeklyClose(storedWeeklyClose);
        setFilteredData(storedWeeklyClose);

        const storedPercentage = await AsyncStorage.getItem('percentage');
        if (storedPercentage) {
          setPercentage(parseFloat(storedPercentage));
        }

        checkAutoClose();
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  const checkAutoClose = async () => {
    const now = new Date();
    if (now.getDay() === 0 && now.getHours() === 23 && now.getMinutes() === 59) {
      await handleWeekClose(true);
    }
  };

  const handleWeekClose = async (auto = false) => {
    try {
      const todayClients = JSON.parse(await AsyncStorage.getItem('todayClients')) || [];

      if (!auto && todayClients.length === 0) {
        Alert.alert('Error', 'No hay clientes para cerrar la semana');
        return;
      }

      const now = new Date();
      const start = new Date(now.setDate(now.getDate() - now.getDay() + 1));
      const end = new Date(now.setDate(now.getDate() - now.getDay() + 7));

      const formatDate = date => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}-${month}-${year}`;
      };

      const startFormatted = formatDate(start);
      const endFormatted = formatDate(end);

      const newWeeklyClose = {
        start: startFormatted,
        end: endFormatted,
        clients: todayClients
      };

      const updatedWeeklyClose = [newWeeklyClose, ...weeklyClose];

      await AsyncStorage.setItem('weeklyClose', JSON.stringify(updatedWeeklyClose));
      await AsyncStorage.setItem('todayClients', JSON.stringify([]));

      setWeeklyClose(updatedWeeklyClose);
      setFilteredData(updatedWeeklyClose);

      if (!auto) {
        Alert.alert('Éxito', 'Cierre semanal realizado correctamente');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un error al realizar el cierre semanal');
      console.error(error);
    }
  };

  const handleSearch = text => {
    setSearch(text);
    if (text) {
      const filtered = weeklyClose.filter(item => item.start.includes(text) || item.end.includes(text));
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

  const calculateTotals = clients => {
    const totalCharged = clients.reduce((sum, client) => sum + parseFloat(client.price), 0);
    const totalEarned = totalCharged * (percentage / 100);
    return { totalCharged, totalEarned };
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)} style={styles.item}>
      <Text style={styles.itemText}>Inicio: {item.start}</Text>
      <Text style={styles.itemText}>Final: {item.end}</Text>
      <Text style={styles.itemText}>Clientes: {item.clients.length}</Text>
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
              <Text style={styles.modalText}>Inicio: {selectedClose.start}</Text>
              <Text style={styles.modalText}>Final: {selectedClose.end}</Text>
              {selectedClose && calculateTotals(selectedClose.clients) && (
                <>
                  <Text style={styles.modalText}>Total Cobrado: ${calculateTotals(selectedClose.clients).totalCharged.toFixed(2)}</Text>
                  <Text style={styles.modalText}>Total Ganado: ${calculateTotals(selectedClose.clients).totalEarned.toFixed(2)}</Text>
                </>
              )}
              <Text style={styles.modalText}>Clientes:</Text>
              <FlatList
                data={selectedClose.clients}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={styles.clientItem}>
                    <Text style={styles.clientText}>Nombre: {item.name}</Text>
                    <Text style={styles.clientText}>Servicio: {item.service}</Text>
                    <Text style={styles.clientText}>Precio: ${parseFloat(item.price).toFixed(2)}</Text>
                    <Text style={styles.clientText}>Fecha: {item.date}</Text>
                  </View>
                )}
              />
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
    borderRadius: 5
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
    width: 300,
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
  clientItem: {
    backgroundColor: '#ffe5ad60',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5
  },
  clientText: {
    fontSize: 16
  }
});

export default WeekClose;
