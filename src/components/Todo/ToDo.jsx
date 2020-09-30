import React, { useEffect, useState } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { createTodo, deleteTodo } from '../../graphql/mutations';
import { listTodos } from '../../graphql/queries';
import awsExports from '../../aws-exports';
import { Button, Paper, TextField } from '@material-ui/core';
import { ToDoCard } from './ToDoCard';

Amplify.configure(awsExports);

const initialState = { name: '', description: '' };

export const ToDo = () => {
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    fetchTodos();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      const todos = todoData.data.listTodos.items;
      setTodos(todos);
    } catch (err) {
      console.log('error fetching todos');
    }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;
      const todo = { ...formState };
      console.log(todo);
      setTodos([...todos, todo]);
      setFormState(initialState);
      await API.graphql(graphqlOperation(createTodo, { input: todo }));
      await fetchTodos();
    } catch (err) {
      console.log('error creating todo:', err);
    }
  }

  async function removeToDo(todo) {
    console.log(todo);
    try {
      await API.graphql(
        graphqlOperation(deleteTodo, {
          input: { id: todo.id },
        })
      );
      await fetchTodos();
    } catch (err) {
      console.log('error deleting todo:', err);
    }
  }

  return (
    <>
      <Paper style={styles.container}>
        <div style={styles.container}>
          <h2>Amplify Todos</h2>
          <TextField
            onChange={(event) => setInput('name', event.target.value)}
            style={styles.input}
            value={formState.name}
            placeholder="name"
          />
          <TextField
            onChange={(event) => setInput('description', event.target.value)}
            style={styles.input}
            value={formState.description}
            placeholder="description"
          />
          <Button color="primary" style={styles.button} onClick={addTodo}>
            Create Todo
          </Button>
        </div>
      </Paper>

      <div style={{ display: 'flex' }}>
        {todos.map((todo, index) => (
          <div key={todo.id ? todo.id : index} style={styles.todo}>
            <ToDoCard
              name={todo.name}
              description={todo.description}
              button={
                <Button
                  color="primary"
                  style={styles.button}
                  onClick={() => removeToDo(todo)}
                >
                  Delete
                </Button>
              }
            />
          </div>
        ))}
      </div>
    </>
  );
};
const styles = {
  container: {
    width: 400,
    margin: '25px auto',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
  },
  todo: { marginBottom: 15 },
  input: {
    border: 'none',
    //backgroundColor: '#ddd',
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
    width: 350,
  },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: {
    //backgroundColor: 'black',
    outline: 'none',
    fontSize: 18,
    padding: '12px 0px',
    width: 350,
  },
};
