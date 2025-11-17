import React, { useState, useEffect } from 'react';
import './App.css';
import {
  getTodos, createTodo, removeTodo, updateTodo,
} from './util';

const App = () => {
  const [todo, setTodo] = useState({
    description: '',
  });
  const [todoList, setTodoList] = useState();
  const [error, setError] = useState();
  // Add state management to track which todo is being edited
  const [editingId, setEditingId] = useState(null);
  // Add state for the edit input value
  const [editValue, setEditValue] = useState('');
  // Create a fetchTodos() function to update the View from Model
  // using getTodos() function from Controller
  const fetchTodos = async () => {
    const res = await getTodos();
    if (res.error) {
      setError(res.error.name);
    }
    setTodoList(res.data);
  };
  // Create a handleDelete() function to remove to-do list with matching id
  const handleDelete = async (id) => {
    try {
      await removeTodo(id);
      fetchTodos();
    } catch (err) {
      setError(err);
    }
  };

  const handleUpdate = (id, currentDescription) => {
    setEditingId(id);
    setEditValue(currentDescription);
  };

  const handleSave = async (id) => {
    try {
      const formData = new FormData();
      formData.set('description', editValue);
      await updateTodo(id, formData);
      setEditingId(null);
      setEditValue('');
      fetchTodos();
    } catch (err) {
      setError(err);
    }
  };

  const handleCancel = () => {
    fetchTodos();
    setEditingId(null);
  };
  // Create a handleSubmit() function to add new to-do list
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError();
    const data = new FormData(e.currentTarget);
    try {
      data.set('description', todo.description);
      data.set('created_at', `${new Date().toISOString()}`);
      const newTodo = await createTodo(data);
      if (newTodo.error) {
        setError(newTodo.error);
      }
      setTodo({ description: '' });
      fetchTodos();
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);
  return (
    <div className='App'>
      <h1>To-Do List</h1>
      <form onSubmit={(e) => handleSubmit(e)} className='add-todo'>
        <textarea
          type='text'
          value={todo.description}
          onChange={(event) => setTodo({ ...todo, description: event.target.value })}
          rows={5}
          cols={40}
        ></textarea>
        <button className=' btn update-btn' type='submit'>Add Todo</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ol>
        {todoList?.map((todoItem) => (
          <li className='todo-item' key={todoItem.todo_id}>
            {editingId === todoItem.todo_id ? (
              <>
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  type="text"
                  rows={5}
                  cols={40}
                ></textarea>
                <div>
                <button
                  onClick={() => handleSave(todoItem.todo_id)}
                  className="btn update-btn"
                >
                  Save
                </button>
                <button
                  onClick={() => handleCancel()}
                  className="btn delete-btn"
                >
                  Cancel
                </button>
                </div>
              </>
            ) : (
              <>
                <span className="todo-text">{todoItem.description}</span>
                <button
                  className="btn delete-btn"
                  onClick={() => handleDelete(todoItem.todo_id)}
                  aria-label={`Delete ${todoItem.description}`}
                >
                  Delete
                </button>
                <button
                  className="btn update-btn"
                  onClick={() => handleUpdate(todoItem.todo_id, todoItem.description)}
                  aria-label={`Edit ${todoItem.description}`}
                >
                  Edit
                </button>
              </>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default App;
