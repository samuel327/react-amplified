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
import { DrawerMenu } from './layout/drawer';
import * as budget from './mockData/budgets.json';
import { ToDo } from './components/Todo/ToDo';
Amplify.configure(awsExports);

const initialState = { name: '', description: '' };

const App = () => {
  //control drawer
  const [sideMenuState, setSideMenuState] = useState(false);

  const toggleDrawer = () => setSideMenuState(!sideMenuState);

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
    } catch (err) {
      console.log('error creating todo:', err);
    }
  }

  async function removeToDo(todo) {
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
      <NavBar toggleDrawer={toggleDrawer} />
      <DrawerMenu sideMenuState={sideMenuState} toggleDrawer={toggleDrawer} />
      <ToDo />
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

export default withAuthenticator(App);
