import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Accordion from './Accordion';

const Setting = () => {
  return (
    <View style={styles.container}>
      <Accordion title='Section 1'>
        <Text>This is the content of section 1</Text>
      </Accordion>
      <Accordion title='Section 2'>
        <Text>This is the content of section 2</Text>
      </Accordion>
      <Accordion title='Section 3'>
        <Text>This is the content of section 3</Text>
      </Accordion>
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
