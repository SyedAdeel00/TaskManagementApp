import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { deleteTask, toggleTaskCompletion } from '../store/taskSlice';
import Icon from 'react-native-vector-icons/Ionicons';

const TaskDetailScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const dispatch = useDispatch();
  const task = useSelector((state: RootState) =>
    state.tasks.tasks.find(t => t.id === taskId)
  );

  if (!task) {
    return <Text style={styles.notFoundText}>Task not found</Text>;
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
  <TouchableOpacity style={styles.headRow} onPress={() => navigation.goBack()}>
  <Icon name="chevron-back" size={30} color="#FFFFFF" />
  <Text style={{color:'#FFFFFF', fontSize:28, marginLeft:20}}>Task Detail</Text>
      </TouchableOpacity>
      <View style={{borderWidth:1, borderColor:'#fff',padding:10,borderRadius:10}}>
      <Text style={styles.title}>{task.todo}</Text>
      <Text style={styles.priority}>Priority: {task.priority}</Text>

      {/* Conditional rendering for deadline */}
      <Text style={styles.deadline}>
        Deadline: {task.deadline ? task.deadline : 'Not available, edit to add'}
      </Text>

      {/* Conditional rendering for description */}
      <Text style={styles.description}>
        Description: {task.description ? task.description : 'Not available, edit to add'}
      </Text>

      <Text style={styles.status}>Status: {task.completed ? 'Completed' : 'Pending'}</Text>
      </View>
      {/* Action buttons */}
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
    backgroundColor: '#1E1E1E',
  },
  headRow:{
    flexDirection:'row',
    alignItems:'center',
    marginBottom:100
  },
  notFoundText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  priority: {
    fontSize: 18,
    color: '#B0B0B0',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  deadline: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 10,
  },
  status: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 5,
    marginTop:15
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
});

export default TaskDetailScreen;
