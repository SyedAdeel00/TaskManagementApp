import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../store/taskSlice';
import TaskItem from '../components/TaskItem';
import { RootState } from '../store';

const TaskListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setFilter('all')}>
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilter]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('pending')}>
          <Text style={[styles.filterText, filter === 'pending' && styles.activeFilter]}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('completed')}>
          <Text style={[styles.filterText, filter === 'completed' && styles.activeFilter]}>Completed</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredTasks}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('TaskForm')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
  },
  filterText: {
    fontSize: 16,
  },
  activeFilter: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TaskListScreen;