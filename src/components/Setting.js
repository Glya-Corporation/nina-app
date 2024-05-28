import React from 'react';
import { StyleSheet, View } from 'react-native';
import Accordion from './Accordion';

const Setting = () => {
  const data1 = ['Item 1.1', 'Item 1.2', 'Item 1.3'];
  const data2 = ['Item 2.1', 'Item 2.2'];
  const data3 = ['Item 3.1', 'Item 3.2', 'Item 3.3', 'Item 3.4'];

  return (
    <View style={styles.container}>
      <Accordion title='Section 1' data={data1} />
      <Accordion title='Section 2' data={data2} />
      <Accordion title='Section 3' data={data3} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  }
});

export default Setting;
