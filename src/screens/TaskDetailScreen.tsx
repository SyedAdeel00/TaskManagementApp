import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { deleteTask, toggleTaskCompletion } from '../store/taskSlice';

const TaskDetailScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const dispatch = useDispatch();
  const task = useSelector((state: RootState) => 
    state.tasks.tasks.find(t => t.id === taskId)
  );

  if (!task) {
    return <Text>Task not found</Text>;
  }

  const handleDelete = () => {
    dispatch(deleteTask(taskId));
    navigation.goBack();
  };

  const handleToggleCompletion = () => {
    dispatch(toggleTaskCompletion(taskId));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.todo}</Text>
      <Text style={styles.status}>Status: {task.completed ? 'Completed' : 'Pending'}</Text>
      <TouchableOpacity style={styles.button} onPress={handleToggleCompletion}>
        <Text style={styles.buttonText}>
          {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TaskForm', { taskId })}>
        <Text style={styles.buttonText}>Edit Task</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
        <Text style={styles.buttonText}>Delete Task</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  status: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
});

export default TaskDetailScreen;