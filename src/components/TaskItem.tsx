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
        <Text style={styles.priorityTag}>Priority: {task.priority}</Text>
        <Text style={styles.deadlineTag}>Deadline: {task.deadline}</Text>
        <Text style={styles.descriptionTag}>Description: {task.description}</Text>
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
  priorityTag: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
    fontWeight: 'bold',
  },
  deadlineTag: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  descriptionTag: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
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
