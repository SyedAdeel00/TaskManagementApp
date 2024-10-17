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
    
    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchTasks());
        };
        
        fetchData();
    }, [dispatch]);

    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true;
    });

    const isLoading = status === 'loading'; // or you can add a custom loading state if needed

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    const renderTaskItem = ({ item }) => (
        <TouchableOpacity
            style={styles.taskItemContainer}
            onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
        >
            <TaskItem task={item} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Good Morning,</Text>
                    <Text style={styles.userName}>User!</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Icon name="person-circle-outline" size={40} color="#fff" />
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.searchInput}
                placeholder="Search tasks..."
                placeholderTextColor="#999"
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
                key="twoColumnList"
                data={filteredTasks}
                renderItem={renderTaskItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
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
        backgroundColor: '#1E1E1E',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    greeting: {
        fontSize: 16,
        color: '#B0B0B0',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    searchInput: {
        height: 40,
        backgroundColor: '#2C2C2C',
        borderRadius: 20,
        paddingHorizontal: 15,
        margin: 10,
        color: '#FFFFFF',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#2C2C2C',
        borderRadius: 20,
        margin: 10,
    },
    filterText: {
        fontSize: 16,
        color: '#B0B0B0',
    },
    activeFilter: {
        fontWeight: 'bold',
        color: '#FFF',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
    },
    row: {
        flex: 1,
        justifyContent: 'space-around',
    },
    taskItemContainer: {
        flex: 0.48,
        margin: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 15,
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
        elevation: 5,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default TaskListScreen;
