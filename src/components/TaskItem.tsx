import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onPress: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.title}>{task.todo}</Text>
        <Text style={[styles.status, task.completed ? styles.completed : styles.pending]}>
          {task.completed ? 'Completed' : 'Pending'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
  },
  status: {
    fontSize: 14,
    marginTop: 5,
  },
  completed: {
    color: 'green',
  },
  pending: {
    color: 'orange',
  },
});

export default TaskItem;