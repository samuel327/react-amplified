/* src/App.js */
import React, { useEffect, useState } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { createTodo, deleteTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsExports from './aws-exports';
import { NavBar } from './layout/toolBar';
import { DoughnutBudget } from './components/charts/DoughnutBudget';
import { DrawerMenu } from './layout/drawer';
import * as budget from './mockData/budgets.json';
import { ToDo } from './components/Todo/ToDo';
import Home from './pages/Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ExpensesCalculator } from './pages/ExpensesCalculator';
Amplify.configure(awsExports);

const App = () => {
  //control drawer
  const [sideMenuState, setSideMenuState] = useState(false);
  const toggleDrawer = () => setSideMenuState(!sideMenuState);
  let X = (
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
  );

  return (
    <>
      <Router>
        <NavBar toggleDrawer={toggleDrawer} />
        <DrawerMenu sideMenuState={sideMenuState} toggleDrawer={toggleDrawer} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/todo" component={ToDo} />
          <Route path="/budget" render={() => X} />
          <Route path="/calculator" component={ExpensesCalculator} />
        </Switch>
      </Router>
    </>
  );
};

export default withAuthenticator(App);
