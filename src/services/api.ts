const API_URL = 'https://dummyjson.com/todos';

// Fetch all tasks
export const fetchTodos = async () => {
  const response = await fetch(API_URL);
  return await response.json();
};

// Fetch a specific task by id
export const fetchTodoById = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`);
  return await response.json();
};

// Add a new task
export const addTodo = async (task: { todo: string; completed: boolean; userId: number; priority: string }) => {
  const response = await fetch(`${API_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return await response.json();
};

// Update a task
export const updateTodo = async (id: number, changes: Partial<Task>) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
  return await response.json();
};

// Delete a task
export const deleteTodo = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return await response.json();
};
