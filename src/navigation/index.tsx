import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TaskListScreen from '../screens/TaskListScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import TaskFormScreen from '../screens/TaskFormScreen';
import Profile from '../screens/Profile';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TaskList" component={TaskListScreen} options={{ headerShown: false}} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{  headerShown: false}} />
      <Stack.Screen name="TaskForm" component={TaskFormScreen} options={{  headerShown: false}} />
      <Stack.Screen name="Profile" component={Profile} options={{  headerShown: false}} />
    </Stack.Navigator>
  );
};

export default AppNavigator;