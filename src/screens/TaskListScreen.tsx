import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../store/taskSlice';
import TaskItem from '../components/TaskItem';
import { RootState } from '../store';
import Icon from 'react-native-vector-icons/Ionicons';

const TaskListScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { tasks, status } = useSelector((state: RootState) => state.tasks);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchTasks()).then(() => {
            setTimeout(() => setLoading(false), 2000);  // Show loader for 2 seconds
        });
    }, [dispatch]);

    // Filter tasks based on the selected filter
    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true; // Return all tasks for 'all' filter
    });

    if (loading || status === 'loading') {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Good Morning,</Text>
                    <Text style={styles.userName}>User!</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Icon name="person-circle-outline" size={40} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Search Bar UI (without functionality) */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search tasks..."
                // Removed value and onChangeText to disable functionality
            />

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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    greeting: {
        fontSize: 16,
        color: '#666',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        margin: 10,
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
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
