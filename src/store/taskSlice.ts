import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTodos } from '../services/api';
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

// Add a new local task (not sent to API)
export const addTaskLocally = createAsyncThunk('tasks/addTaskLocally', async (task: Partial<Task>) => {
  return { ...task, id: Date.now(), priority: task.priority || getRandomPriority() }; // Assign ID and random priority
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
      
      // Add Task Locally
      .addCase(addTaskLocally.fulfilled, (state, action) => {
        state.tasks.push(action.payload);  // Add the new local task
      })
      
      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        const { id, changes } = action.payload;
        const index = state.tasks.findIndex((t) => t.id === id);
        if (index !== -1) {
          state.tasks[index] = { ...state.tasks[index], ...changes };  // Update task with changes
        }
      });
  },
});

export const { toggleTaskCompletion } = tasksSlice.actions;

export default tasksSlice.reducer;
