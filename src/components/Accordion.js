import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const Accordion = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState(null);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleAccordion = () => {
    if (expanded) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: maxHeight,
        duration: 300,
        useNativeDriver: false
      }).start();
    }
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleAccordion} style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
      <Animated.View style={{ height: animation, overflow: 'hidden' }}>
        <View
          style={styles.content}
          onLayout={event => {
            setMaxHeight(event.nativeEvent.layout.height);
          }}
        >
          {children}
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
  }
});

export default Accordion;
