import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';

const Accordion = ({ title, data, functionClick }) => {
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
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={toggleAccordion} style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
      <Animated.View style={{ height: heightInterpolation, overflow: 'hidden' }}>
        <View style={styles.content}>
          {data.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => functionClick && functionClick()}>
              <View style={[styles.item, { height: itemHeight }]}>
                <Text style={styles.itemText}>{item}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#a4894e',
    elevation: 10
  },
  titleContainer: {
    padding: 15
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
    borderBottomColor: '#ccc',
    marginBottom: 0
  },
  itemText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10
  }
});

export default Accordion;
