import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.input} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const formatDate = date => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

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
      const existingData = await AsyncStorage.getItem('todayClients'); // Change storage key name
      const dataArray = existingData ? JSON.parse(existingData) : [];

      // Add new data and save to AsyncStorage
      dataArray.push(newData);
      await AsyncStorage.setItem('todayClients', JSON.stringify(dataArray));

      Alert.alert('Success', 'Data saved successfully!');
    } catch (error) {
      console.error('Error saving data', error);
      Alert.alert('Error', 'There was an error saving the data.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TextInput style={styles.input} placeholder='Nombres' value={name} onChangeText={setName} />
        <CustomButton title={formattedDate} onPress={() => setShow(true)} />
        {show && <DateTimePicker value={date} mode='date' display='default' onChange={onChange} />}
        <SelectDropdown
          data={listItem}
          onSelect={(selectedItem, index) => {
            setService(selectedItem);
          }}
          renderButton={(selectedItem, isOpened) => (
            <View style={styles.dropdownButtonStyle}>
              <Text style={styles.dropdownButtonTxtStyle}>{selectedItem || 'Selecciona...'}</Text>
            </View>
          )}
          renderItem={(item, index, isSelected) => (
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
  }
});

export default Home;
