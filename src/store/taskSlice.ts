import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '../services/api';
import { Task } from '../types/task';

interface TasksState {
  tasks: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  nextId: number;
}

const initialState: TasksState = {
  tasks: [],
  status: 'idle',
  error: null,
  nextId: 1,
};

// Function to generate a random priority
const getRandomPriority = (): 'Low' | 'Medium' | 'High' => {
  const priorities = ['Low', 'Medium', 'High'];
  return priorities[Math.floor(Math.random() * priorities.length)];
};

// Async action to fetch tasks and assign random priorities, default deadlines, and descriptions
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchTodos();
    const tasksWithDefaults = response.todos.map((task) => ({
      ...task,
      priority: getRandomPriority(),
      deadline: task.deadline || '',
      description: task.description || '',
    }));
    return tasksWithDefaults;
  } catch (error) {
    return rejectWithValue('Failed to fetch tasks');
  }
});

// Async action to add a task to the API and locally
export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (taskData: { title: string; completed: boolean; userId: number; priority: string; deadline: string; description: string }, 
  { getState, rejectWithValue }) => {
    try {
      const state = getState() as { tasks: TasksState };
      const newId = state.tasks.nextId;
      
      const response = await addTodo({
        id: newId,
        todo: taskData.title,
        completed: taskData.completed,
        userId: taskData.userId,
      });

      return {
        ...response,
        id: newId,
        priority: taskData.priority,
        deadline: taskData.deadline,
        description: taskData.description,
      };
    } catch (error) {
      return rejectWithValue('Failed to add task');
    }
  }
);

// Update a task (for API and local)
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, changes }: { id: number; changes: Partial<Task> }, { rejectWithValue }) => {
    try {
      const response = await updateTodo(id, {
        todo: changes.todo,
        completed: changes.completed,
      });

      return {
        id,
        ...changes,
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
    return id;
  } catch (error) {
    return rejectWithValue('Failed to delete task');
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    toggleTaskCompletion(state, action: PayloadAction<number>) {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
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
        state.tasks = action.payload;
        state.nextId = Math.max(...action.payload.map(task => task.id), 0) + 1;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Add Task
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        state.nextId++;
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        const { id, ...changes } = action.payload;
        const index = state.tasks.findIndex((t) => t.id === id);
        if (index !== -1) {
          state.tasks[index] = { ...state.tasks[index], ...changes };
        }
      })
      
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        const id = action.payload;
        state.tasks = state.tasks.filter((t) => t.id !== id);
      });
  },
});

export const { toggleTaskCompletion } = tasksSlice.actions;

export default tasksSlice.reducer;