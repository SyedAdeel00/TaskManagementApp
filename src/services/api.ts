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

// API call to add a task (send only the required fields to API: 'todo' as title, 'completed', and 'userId')
export const addTodo = async (task: { todo: string; completed: boolean; userId: number }) => {
  const response = await fetch(`${API_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });

  // Ensure the response contains the newly created task with an ID
  const newTask = await response.json();
  if (!newTask.id) {
    throw new Error("Task creation failed: ID not returned");
  }
  return newTask;
};

// Update a task (send changes to API, handle local fields separately)
export const updateTodo = async (id: number, changes: Partial<{ todo: string; completed: boolean }>) => {
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
