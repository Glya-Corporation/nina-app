import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';

const Reservations = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  // Array de prueba con 5 elementos
  const reservations = [
    { id: '1', name: 'Andreina Bozo', date: '28-05-24', time: '19:00', detail: 'Reparacion de uña y relleno en una mano, en la otra mano poner uñas acrilicas' },
    { id: '2', name: 'Luis Uzcategui', date: '28-05-24', time: '19:00', detail: 'Detalle de la cita 2' },
    { id: '3', name: 'Cita 3', date: '28-05-24', time: '20:00', detail: 'Detalle de la cita 3' },
    { id: '4', name: 'Cita 4', date: '28-05-24', time: '20:00', detail: 'Detalle de la cita 4' },
    { id: '5', name: 'Cita 5', date: '28-05-24', time: '20:30', detail: 'Detalle de la cita 5' }
  ];

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
            <Text style={styles.itemText}>{item.time}</Text>
          </TouchableOpacity>
        )}
      />
      {selectedReservation && (
        <Modal transparent={true} visible={modalVisible} onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedReservation.name}</Text>
              <Text style={styles.modalDetail}>{selectedReservation.date}</Text>
              <Text style={styles.modalDetail}>{selectedReservation.time}</Text>
              <Text style={styles.modalDetail}>{selectedReservation.detail}</Text>
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
