import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import formaDate from '../functions/formaDate';

const Reservations = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const clientsData = await AsyncStorage.getItem('allClients');
        const clients = clientsData ? JSON.parse(clientsData) : [];
        const today = formaDate(new Date());
        const filteredClients = clients.filter(client => client.date > today);
        console.log(filteredClients);
        setReservations(filteredClients);
      } catch (error) {
        Alert.alert('Error', 'There was an error fetching the reservations');
      }
    };

    fetchReservations();
  }, []);

  const openModal = reservation => {
    setSelectedReservation(reservation);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedReservation(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={reservations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)} style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemText}>{item.date}</Text>
            <Text style={styles.itemText}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
      {selectedReservation && (
        <Modal transparent={true} visible={modalVisible} onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedReservation.name}</Text>
              <Text style={styles.modalDetail}>{selectedReservation.date}</Text>
              <Text style={styles.modalDetail}>$ {Number(selectedReservation.price).toFixed(2)}</Text>
              <Text style={styles.modalDetail}>{selectedReservation.description}</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
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
  item: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#ffe5ad60',
    borderRadius: 5
  },
  itemText: {
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
    borderRadius: 10,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  modalDetail: {
    fontSize: 16,
    marginBottom: 5
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#ffe5ad',
    borderRadius: 5
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16
  }
});

export default Reservations;
