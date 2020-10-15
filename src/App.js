/* src/App.js */
import React, { useState } from 'react';
import Amplify from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsExports from './aws-exports';
import { NavBar } from './layout/toolBar';
import { DrawerMenu } from './layout/drawer';
import { ToDo } from './components/Todo/ToDo';
import Home from './pages/Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ExpensesCalculator } from './pages/Expenses/ExpensesCalculator';
Amplify.configure(awsExports);

const App = () => {
  //control drawer
  const [sideMenuState, setSideMenuState] = useState(false);
  const toggleDrawer = () => setSideMenuState(!sideMenuState);

  return (
    <>
      <Router>
        <NavBar toggleDrawer={toggleDrawer} />
        <DrawerMenu sideMenuState={sideMenuState} toggleDrawer={toggleDrawer} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/todo" component={ToDo} />
          <Route path="/budget" render={() => <></>} />
          <Route path="/calculator" component={ExpensesCalculator} />
        </Switch>
      </Router>
    </>
  );
};

export default withAuthenticator(App);
