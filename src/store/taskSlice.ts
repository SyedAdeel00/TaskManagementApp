import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTodos, addTodo } from '../services/api';
import { Task } from '../types/task';

interface TasksState {
  tasks: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  status: 'idle',
  error: null,
};

// Function to generate a random priority
const getRandomPriority = (): 'Low' | 'Medium' | 'High' => {
  const priorities = ['Low', 'Medium', 'High'];
  return priorities[Math.floor(Math.random() * priorities.length)];
};

// Async action to fetch tasks and assign random priorities
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchTodos();
    const tasksWithPriority = response.todos.map((task) => ({
      ...task,
      priority: getRandomPriority(),  // Add random priority to each API task
    }));
    return tasksWithPriority;
  } catch (error) {
    return rejectWithValue('Failed to fetch tasks');
  }
});

// Async action to add a task both to the API and locally (with extra fields)
export const addTask = createAsyncThunk('tasks/addTask', async (taskData: { title: string, completed: boolean, userId: number, priority: string, deadline: string, description: string }, { rejectWithValue }) => {
  try {
    // Send the task to the API
    const response = await addTodo({
      todo: taskData.title,
      completed: taskData.completed,
      userId: taskData.userId
    });

    // Return the full task (including local fields)
    return {
      ...response, // API response (id, todo, completed, userId)
      priority: taskData.priority, // Add priority
      deadline: taskData.deadline, // Add deadline
      description: taskData.description, // Add description
    };
  } catch (error) {
    return rejectWithValue('Failed to add task');
  }
});

// Update task (for both API and local tasks)
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, changes }: { id: number; changes: Partial<Task> }, { rejectWithValue }) => {
    try {
      // Simulate API call for update if needed
      return { id, changes }; // Return id and changes for local handling
    } catch (error) {
      return rejectWithValue('Failed to update task');
    }
  }
);

// Async action to delete a task
export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: number, { rejectWithValue }) => {
  try {
    // Simulate API call for delete if needed
    return id; // Return the id for deletion
  } catch (error) {
    return rejectWithValue('Failed to delete task');
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    toggleTaskCompletion(state, action) {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed; // Toggle completion status
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;  // Save fetched tasks with random priorities
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Add Task to API and Locally
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);  // Push the new task into the Redux store
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        const { id, changes } = action.payload;
        const index = state.tasks.findIndex((t) => t.id === id);
        if (index !== -1) {
          state.tasks[index] = { ...state.tasks[index], ...changes };  // Update task with changes
        }
      })
      
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        const id = action.payload;
        state.tasks = state.tasks.filter((t) => t.id !== id);  // Remove deleted task
      });
  },
});

export const { toggleTaskCompletion } = tasksSlice.actions;

export default tasksSlice.reducer;
