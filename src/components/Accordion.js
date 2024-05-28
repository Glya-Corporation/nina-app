import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, FlatList } from 'react-native';

const Accordion = ({ title, data }) => {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleAccordion = () => {
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false
    }).start();
    setExpanded(!expanded);
  };

  const itemHeight = 50; // Define a fixed height for each item
  const contentHeight = data.length * itemHeight;

  const heightInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight]
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleAccordion} style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
      <Animated.View style={{ height: heightInterpolation, overflow: 'hidden' }}>
        <View style={styles.content}>
          {data.map((item, index) => (
            <View key={index} style={[styles.item, { height: itemHeight }]}>
              <Text style={styles.itemText}>{item}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5
  },
  titleContainer: {
    padding: 15,
    backgroundColor: '#a4894e'
  },
  title: {
    color: '#fff',
    fontSize: 18
  },
  content: {
    padding: 15
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  itemText: {
    fontSize: 16
  }
});

export default Accordion;
