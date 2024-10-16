import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TaskListScreen from '../screens/TaskListScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import TaskFormScreen from '../screens/TaskFormScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Tasks' }} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Task Detail' }} />
      <Stack.Screen name="TaskForm" component={TaskFormScreen} options={{ title: 'Add/Edit Task' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;