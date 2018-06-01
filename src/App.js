import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import Login from './components/Login';
import Registration from './components/Registration';
// import RegisterWithGoogle from './components/RegisterWithGoogle';
// import VerifyUser from './components/VerifyUser';
import VerifyToken from './components/VerifyToken';
import Hospital from './components/Hospital';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/" exact component={Login} />
          <Route path="/registration" exact component={Registration} />

          {/* <Route path="/registerWithGoogle/:userId" exact render={({ match }) => (
            <RegisterWithGoogle userId={match.params.userId} />
          )} />
          <Route path="/registerWithGoogle" exact component={RegisterWithGoogle} />
          <Route path="/verifyUser/:userId" exact render={({ match }) => (
            <VerifyUser userId={match.params.userId} />
          )} /> */}

          <Route path="/dashboard" exact component={Hospital} />
          <Route path="/verifyToken" exact component={VerifyToken} />
        </div>
      </Router>
    );
  }
}

export default App;















