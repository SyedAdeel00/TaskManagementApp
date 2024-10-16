import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addTask } from '../store/taskSlice';
import PrioritySelector from '../components/PrioritySelector';
import { isFutureDate } from '../utils/DateUtils';

const TaskFormScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Low');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Ensure form is valid when title and deadline are filled correctly
    setIsValid(title.trim().length > 0 && isFutureDate(deadline));
  }, [title, deadline]);

  const handleSubmit = () => {
    if (isValid) {
      // Dispatch the action to add the task (both to API and locally)
      dispatch(addTask({
        title,
        completed: false,
        userId: 5, // Assuming userId is static or dynamic
        priority,
        deadline,
        description,
      }));

      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter task title"
      />
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter task description (optional)"
      />
      <TextInput
        style={styles.input}
        value={deadline}
        onChangeText={setDeadline}
        placeholder="Enter deadline (YYYY-MM-DD)"
      />
      <PrioritySelector priority={priority} onSelect={setPriority} />
      <TouchableOpacity
        style={[styles.button, !isValid && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={!isValid}
      >
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default TaskFormScreen;
