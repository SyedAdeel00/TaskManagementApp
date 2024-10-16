import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, updateTask } from '../store/taskSlice';
import { RootState } from '../store';

const TaskFormScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { taskId } = route.params || {};
  const task = useSelector((state: RootState) => 
    state.tasks.tasks.find(t => t.id === taskId)
  );

  const [todo, setTodo] = useState(task ? task.todo : '');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(todo.trim().length > 0);
  }, [todo]);

  const handleSubmit = () => {
    if (isValid) {
      if (task) {
        dispatch(updateTask({ id: taskId, changes: { todo } }));
      } else {
        dispatch(addTask({ todo, completed: false }));
      }
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={todo}
        onChangeText={setTodo}
        placeholder="Enter task"
      />
      <TouchableOpacity
        style={[styles.button, !isValid && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={!isValid}
      >
        <Text style={styles.buttonText}>{task ? 'Update Task' : 'Add Task'}</Text>
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