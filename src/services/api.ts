const API_URL = 'https://dummyjson.com/todos';

export const fetchTodos = async () => {
  const response = await fetch(API_URL);
  return await response.json();
};

export const fetchTodoById = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`);
  return await response.json();
};

export const addTodo = async (todo: { todo: string; completed: boolean; userId: number }) => {
  const response = await fetch(`${API_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });
  return await response.json();
};

export const updateTodo = async (id: number, changes: { completed: boolean }) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
  return await response.json();
};

export const deleteTodo = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return await response.json();
};
