/* src/App.js */
import React, { useEffect, useState } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { createTodo, deleteTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsExports from './aws-exports';
import { NavBar } from './layout/toolBar';
import { Button } from '@material-ui/core';
import { DoughnutBudget } from './components/charts/DoughnutBudget';
import * as budget from './mockData/budgets.json';
Amplify.configure(awsExports);

const initialState = { name: '', description: '' };

const App = () => {
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
      setTodos([...todos, todo]);
      setFormState(initialState);
      await API.graphql(graphqlOperation(createTodo, { input: todo }));
    } catch (err) {
      console.log('error creating todo:', err);
    }
  }

  async function removeToDo(todo) {
    try {
      console.log(todo);
      await API.graphql(graphqlOperation(deleteTodo, { input: todo }));
    } catch (err) {
      console.log('error deleting todo:', err);
    }
  }

  return (
    <>
      <NavBar />
      <div style={styles.container}>
        <h2>Amplify Todos</h2>
        <input
          onChange={(event) => setInput('name', event.target.value)}
          style={styles.input}
          value={formState.name}
          placeholder="name"
        />
        <input
          onChange={(event) => setInput('description', event.target.value)}
          style={styles.input}
          value={formState.description}
          placeholder="description"
        />
        <Button color="primary" style={styles.button} onClick={addTodo}>
          Create Todo
        </Button>
        {todos.map((todo, index) => (
          <div key={todo.id ? todo.id : index} style={styles.todo}>
            <p style={styles.todoName}>{todo.name}</p>
            <p style={styles.todoDescription}>{todo.description}</p>
            <Button
              color="primary"
              style={styles.button}
              onClick={() => removeToDo(todo)}
            >
              Delete Todo
            </Button>
          </div>
        ))}
      </div>
      <DoughnutBudget
        labels={budget.data.map((item) => item.month)}
        dataSetLabel={'Amount Spent Per Month'}
        dollarAmounts={budget.data.map((item) => item.amount_spent)}
        itemColor={budget.data.map((item) => {
          if (item.amount_spent < 1000) {
            return 'rgb(0, 255, 0)';
          } else {
            return 'rgb(255, 0, 0)';
          }
        })}
      />
    </>
  );
};

const styles = {
  container: {
    width: 400,
    margin: '0 auto',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
  },
  todo: { marginBottom: 15 },
  input: {
    border: 'none',
    backgroundColor: '#ddd',
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: {
    //backgroundColor: 'black',
    outline: 'none',
    fontSize: 18,
    padding: '12px 0px',
  },
};

export default withAuthenticator(App);
