import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import formatDate from '../functions/formatDate';
import filterDate from '../functions/filterDate';

const ReservationModal = ({ visible, reservation, onClose }) => {
  if (!reservation) return null;

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{reservation.name}</Text>
          <Text style={styles.modalDetail}>{reservation.date}</Text>
          <Text style={styles.modalDetail}>$ {Number(reservation.price).toFixed(2)}</Text>
          <Text style={styles.modalDetail}>{reservation.description}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const Reservations = ({ route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [reservations, setReservations] = useState([]);

  const fetchReservations = useCallback(async () => {
    try {
      const clientsData = await AsyncStorage.getItem('clientesGuardados');
      const clients = clientsData ? JSON.parse(clientsData) : [];
      console.log(clients);
      const today = formatDate(new Date());
      setReservations(filterDate(clients, today));
    } catch (error) {
      Alert.alert('Error', 'There was an error fetching the reservations');
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  useEffect(() => {
    if (route.params?.refresh) {
      fetchReservations();
    }
  }, [route.params, fetchReservations]);

  const openModal = useCallback(reservation => {
    setSelectedReservation(reservation);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedReservation(null);
    setModalVisible(false);
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity onPress={() => openModal(item)} style={styles.item}>
        <Text style={styles.itemText}>{item.date}</Text>
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.itemText}>$ {Number(item.price).toFixed(2)}</Text>
        <Text style={styles.itemText}>{item.description}</Text>
      </TouchableOpacity>
    ),
    [openModal]
  );

  const keyExtractor = useCallback(item => item.id, []);

  return (
    <View style={styles.container}>
      <FlatList data={reservations} keyExtractor={keyExtractor} renderItem={renderItem} />
      <ReservationModal visible={modalVisible} reservation={selectedReservation} onClose={closeModal} />
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
