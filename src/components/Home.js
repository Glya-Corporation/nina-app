import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, Alert, Modal } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import formatDate from '../functions/formaDate.js';

const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.input} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const generateUniqueId = () => {
  return '_' + Math.random().toString(36).substr(2, 9); // Generates a random alphanumeric ID
};

const Home = () => {
  const listItem = ['Manicure', 'Pedicure', 'Acrilicas', 'Gel', 'Tradicional', 'Limpieza'];

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [service, setService] = useState(null);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [formattedDate, setFormattedDate] = useState(formatDate(new Date()));
  const [modalVisible, setModalVisible] = useState(false);
  const [percentage, setPercentage] = useState('');

  useEffect(() => {
    const checkPercentage = async () => {
      try {
        const percentage = await AsyncStorage.getItem('percentage');
        if (percentage === null) {
          setModalVisible(true); // Show modal if percentage is not set
        }
      } catch (error) {
        console.error('Error checking percentage', error);
      }
    };

    checkPercentage();
  }, []);

  const savePercentage = async () => {
    const value = parseInt(percentage, 10);
    if (!isNaN(value) && value >= 1 && value <= 100) {
      try {
        await AsyncStorage.setItem('percentage', value.toString());
        setModalVisible(false);
        Alert.alert('Success', 'Percentage saved successfully!');
      } catch (error) {
        console.error('Error saving percentage', error);
        Alert.alert('Error', 'There was an error saving the percentage.');
      }
    } else {
      Alert.alert('Invalid Input', 'Please enter a valid percentage between 1 and 100.');
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setFormattedDate(formatDate(currentDate));
    setShow(false); // Close the picker after selecting a date
  };

  const handleSave = async () => {
    const newData = {
      id: generateUniqueId(), // Generate unique ID
      name,
      price,
      description,
      service,
      date: formattedDate
    };

    try {
      const existingData = await AsyncStorage.getItem('allClients');
      const dataArray = existingData ? JSON.parse(existingData) : [];

      const userExists = dataArray.some(client => client.name === name && client.date === formattedDate);

      if (userExists) {
        Alert.alert('Error', 'El usuario ya existe.');
      } else {
        dataArray.push(newData);
        await AsyncStorage.setItem('allClients', JSON.stringify(dataArray));
        Alert.alert('Éxito', 'Usuario guardado con éxito!');

        // Clear input fields
        setName('');
        setPrice('');
        setDescription('');
        setService(null);
        setDate(new Date());
        setFormattedDate(formatDate(new Date()));
      }
    } catch (error) {
      console.error('Error saving data', error);
      Alert.alert('Error', 'There was an error saving the data.');
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Please enter a percentage between 1 and 100</Text>
            <TextInput style={styles.input} placeholder='Percentage' value={percentage} onChangeText={setPercentage} keyboardType='numeric' />
            <TouchableOpacity style={styles.button} onPress={savePercentage}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.card}>
        <TextInput style={styles.input} placeholder='Nombres' value={name} onChangeText={setName} />
        <CustomButton title={formattedDate} onPress={() => setShow(true)} />
        {show && <DateTimePicker value={date} mode='date' display='default' onChange={onChange} />}
        <SelectDropdown
          data={listItem}
          onSelect={selectedItem => setService(selectedItem)}
          renderButton={selectedItem => (
            <View style={styles.dropdownButtonStyle}>
              <Text style={styles.dropdownButtonTxtStyle}>{selectedItem || 'Selecciona...'}</Text>
            </View>
          )}
          renderItem={(item, isSelected) => (
            <View style={[styles.dropdownItemStyle, isSelected && { backgroundColor: '#D2D9DF' }]}>
              <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
        <TextInput style={styles.input} placeholder='Precio' value={price} onChangeText={setPrice} keyboardType='numeric' />
        <TextInput style={styles.input} placeholder='Descripcion' value={description} onChangeText={setDescription} />
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.button}>Guardar</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style='auto' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    width: 200,
    height: 30,
    margin: 5,
    borderWidth: 0.5,
    borderColor: '#aaaaaa',
    padding: 5,
    borderRadius: 5,
    shadowColor: '#a4894e',
    shadowRadius: 5,
    shadowOpacity: 10,
    justifyContent: 'center'
  },
  card: {
    width: 250,
    height: 350,
    margin: 'auto',
    backgroundColor: '#ffe5ad60',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 30
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#666',
    textAlign: 'left'
  },
  dropdownButtonStyle: {
    width: 200,
    height: 30,
    margin: 5,
    borderWidth: 0.5,
    borderColor: '#aaaaaa',
    padding: 5,
    borderRadius: 5,
    shadowColor: '#a4894e',
    shadowRadius: 5,
    shadowOpacity: 10
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: '#666'
  },
  dropdownMenuStyle: {
    width: 200,
    margin: 5,
    borderWidth: 0.5,
    borderColor: '#aaaaaa',
    padding: 5,
    borderRadius: 5,
    shadowColor: '#a4894e',
    shadowRadius: 5,
    shadowOpacity: 10
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26'
  },
  button: {
    padding: 10,
    backgroundColor: '#a4894e',
    color: '#ffffff',
    borderRadius: 5,
    marginTop: 5,
    textAlign: 'center'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  }
});

export default Home;
