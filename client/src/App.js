import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import NodePage from './Pages/NodePage';
import LogPage from './Pages/LogPage';
import FormPage from './Pages/FormPage';
import AddFormPage from './Pages/AddFormPage';
import RegisterPage from './Pages/RegisterPage';
import CustomToolbar from './Components/CustomToolbar';
import UserPage from './Pages/UserPage';

const App = () => {
  return (
    <Router>
      <div>
        {window.location.pathname !== '/' &&
        window.location.pathname !== '/register' ? (
          <CustomToolbar />
        ) : null}
        <Switch>
          <Route path="/" exact component={LogPage} />
          <Route path="/node" exact component={NodePage} />
          <Route path="/form" exact component={FormPage} />
          <Route path="/addForm" exact component={AddFormPage} />
          <Route path="/register" exact component={RegisterPage} />
          <Route path="/user" exact component={UserPage} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
