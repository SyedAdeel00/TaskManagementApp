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

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await fetchTodos();
  return response.todos;
});

export const addTask = createAsyncThunk('tasks/addTask', async (task: Partial<Task>) => {
  const response = await addTodo(task);
  return response;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, changes }: { id: number, changes: Partial<Task> }) => {
  const response = await updateTodo(id, changes);
  return response;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: number) => {
  await deleteTodo(id);
  return id;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    toggleTaskCompletion(state, action) {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
      });
  },
});

export const { toggleTaskCompletion } = tasksSlice.actions;

export default tasksSlice.reducer;
