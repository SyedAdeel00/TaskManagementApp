import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '../services/api';
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

// Function to generate a default description if missing
const getDefaultDescription = (): string => 'No description available';

// Function to generate a default deadline (7 days from today)
const getDefaultDeadline = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
};

// Async action to fetch tasks and assign random priorities, default deadlines, and descriptions
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchTodos();
    const tasksWithDefaults = response.todos.map((task) => ({
      ...task,
      priority: getRandomPriority(),  // Assign random priority
      deadline: task.deadline || getDefaultDeadline(),  // Assign default deadline if missing
      description: task.description || getDefaultDescription(),  // Assign default description if missing
    }));
    return tasksWithDefaults;
  } catch (error) {
    return rejectWithValue('Failed to fetch tasks');
  }
});

// Async action to add a task to the API and locally
export const addTask = createAsyncThunk('tasks/addTask', async (taskData: { title: string; completed: boolean; userId: number; priority: string; deadline: string; description: string }, { rejectWithValue }) => {
  try {
    const response = await addTodo({
      todo: taskData.title,
      completed: taskData.completed,
      userId: taskData.userId,
    });

    // Return the full task with additional fields stored locally
    return {
      ...response,          // API response: id, todo, completed, userId
      priority: taskData.priority,
      deadline: taskData.deadline,
      description: taskData.description,
    };
  } catch (error) {
    return rejectWithValue('Failed to add task');
  }
});

// Update a task (for API and local)
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, changes }: { id: number; changes: Partial<Task> }, { rejectWithValue }) => {
    try {
      const response = await updateTodo(id, {
        todo: changes.todo,  // Ensure 'todo' is sent to the API
        completed: changes.completed,
      });

      // Merge the response with local changes
      return {
        id,
        ...response,
        ...changes, // Include local fields (priority, description, deadline)
      };
    } catch (error) {
      return rejectWithValue('Failed to update task');
    }
  }
);

// Async action to delete a task
export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: number, { rejectWithValue }) => {
  try {
    await deleteTodo(id);
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
        state.tasks = action.payload;  // Store fetched tasks with default values
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Add Task
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);  // Add the new task to the store
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        const { id, changes } = action.payload;
        const index = state.tasks.findIndex((t) => t.id === id);
        if (index !== -1) {
          state.tasks[index] = { ...state.tasks[index], ...changes }; // Update the task with changes
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
