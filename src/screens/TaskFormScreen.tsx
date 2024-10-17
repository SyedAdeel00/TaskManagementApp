import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, updateTask } from '../store/taskSlice';
import { RootState } from '../store';
import PrioritySelector from '../components/PrioritySelector';
import { isFutureDate } from '../utils/DateUtils';
import Icon from 'react-native-vector-icons/Ionicons';

const TaskFormScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { taskId } = route.params || {};
  const task = useSelector((state: RootState) =>
    state.tasks.tasks.find(t => t.id === taskId)
  );

  const [title, setTitle] = useState(task ? task.todo : '');
  const [description, setDescription] = useState(task ? task.description : '');
  const [deadline, setDeadline] = useState(task ? task.deadline : '');
  const [priority, setPriority] = useState(task ? task.priority : 'Low');
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState({ title: '', deadline: '' });

  useEffect(() => {
    let valid = true;
    const newErrors = { title: '', deadline: '' };

    if (title.trim().length === 0) {
      newErrors.title = 'Task title is required.';
      valid = false;
    }

    if (!isFutureDate(deadline)) {
      newErrors.deadline = 'Deadline must be a future date.';
      valid = false;
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
      newErrors.deadline = 'Deadline must be in YYYY-MM-DD format.';
      valid = false;
    }

    setErrors(newErrors);
    setIsValid(valid);
  }, [title, deadline]);

  const handleSubmit = () => {
    if (isValid) {
      if (task) {
        dispatch(updateTask({
          id: taskId,
          changes: {
            todo: title,
            completed: task.completed,
            priority,
            deadline,
            description,
          },
        }));
      } else {
        dispatch(addTask({
          title,
          completed: false,
          userId: 5,
          priority,
          deadline,
          description,
        }));
      }
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="chevron-back" size={30} color="#FFFFFF" />
        <Text style={{ color: '#FFFFFF', fontSize: 28, marginLeft: 20 }}>Add/Edit Task</Text>
      </TouchableOpacity>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>{task ? 'Edit Task' : 'Add New Task'}</Text>
        
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Task Title"
          placeholderTextColor="#B0B0B0"
        />
        {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}

        <TextInput
          style={styles.inputDescription}
          value={description}
          onChangeText={setDescription}
          placeholder="Task Description (optional)"
          placeholderTextColor="#B0B0B0"
        />

        <TextInput
          style={styles.input}
          value={deadline}
          onChangeText={setDeadline}
          placeholder="Deadline (YYYY-MM-DD)"
          placeholderTextColor="#B0B0B0"
        />
        {errors.deadline ? <Text style={styles.errorText}>{errors.deadline}</Text> : null}

        <PrioritySelector priority={priority} onSelect={setPriority} />
        
        <TouchableOpacity
          style={[styles.button, !isValid && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={!isValid}
        >
          <Text style={styles.buttonText}>{task ? 'Update Task' : 'Add Task'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1E1E1E',
  },
  backButton: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#B0B0B0',
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    color: '#000000',
    marginBottom: 20,
  },
  inputDescription: {
    borderWidth: 1,
    borderColor: '#B0B0B0',
    padding: 20,
    fontSize: 18,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    color: '#000000',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 6,
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default TaskFormScreen;
