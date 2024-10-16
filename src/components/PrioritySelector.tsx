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
        <TouchableOpacity key={p} onPress={() => onSelect(p)} style={[styles.button, priority === p && styles.selected]}>
          <Text>{p}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
  },
  selected: {
    backgroundColor: '#007AFF',
    color: 'white',
  },
});

export default PrioritySelector;
