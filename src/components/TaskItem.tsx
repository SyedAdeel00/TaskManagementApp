import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Task } from '../types/task';
import Icon from 'react-native-vector-icons/Ionicons';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  // Log the updated task whenever it changes
  useEffect(() => {
    console.log("Updated Task:", task);
  }, [task]); // Run effect when 'task' changes

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.todo}</Text>
      <Text style={styles.priorityTag}>Priority: {task.priority}</Text>
      {/* <Text style={styles.deadlineTag}>{task.deadline}</Text> */}
      {/* <Text style={styles.descriptionTag}>Description: {task.description}</Text> */}
      <Text style={[styles.status, task.completed ? styles.completed : styles.pending]}>
        {task.completed ? 'Completed' : 'Pending'}
      </Text>
      <Icon name="person-circle-outline" size={40} color="#000" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
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
