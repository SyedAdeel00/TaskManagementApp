import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PrioritySelectorProps {
  priority: 'Low' | 'Medium' | 'High';
  onSelect: (priority: 'Low' | 'Medium' | 'High') => void;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({ priority, onSelect }) => {
  const priorities = ['Low', 'Medium', 'High'] as const;

  return (
    <View style={styles.container}>
      {priorities.map((p) => (
        <TouchableOpacity
          key={p}
          onPress={() => onSelect(p)}
          style={[styles.button, priority === p ? styles.selected : styles.notSelected]}
        >
          <Text style={[styles.buttonText, priority === p && styles.selectedText]}>{p}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    width: '30%',
    alignItems: 'center', // Center the text horizontally
  },
  selected: {
    backgroundColor: '#007AFF',
  },
  notSelected: {
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#FFFFFF', // White text for selected button
  },
});

export default PrioritySelector;
